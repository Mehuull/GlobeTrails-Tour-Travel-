import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { getData } from '@/context/userContext';
import { toast } from 'sonner';
import { User, Calendar, MapPin, Users, IndianRupee, Trash2, Clock, CreditCard, ShieldAlert } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user } = getData();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            return;
        }

        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/my-bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    setBookings(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
                toast.error("Failed to load your bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, [user, navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking inquiry?")) return;

        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                toast.success(res.data.message || "Booking cancelled successfully");
                // Refresh bookings instead of just filtering to show the "cancelled" status and refund details
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, inquiryStatus: "cancelled" } : b));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel booking");
        }
    };

    const handlePayRemaining = async (bookingId) => {
        const resScript = await loadRazorpayScript();
        if (!resScript) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/bookings/create-full-payment`, { bookingId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const { razorpayOrder } = res.data;
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummy",
                    amount: razorpayOrder.amount,
                    currency: "INR",
                    name: "GlobeTrails - Remaining Payment",
                    description: "Full Payment for Tour Booking",
                    order_id: razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/bookings/verify-full-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: bookingId
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            
                            if (verifyRes.data.success) {
                                toast.success("Full payment successful!");
                                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, paymentStatus: "full_paid" } : b));
                            }
                        } catch (err) {
                            toast.error("Payment verification failed.");
                            console.error(err);
                        }
                    },
                    prefill: {
                        name: user.username,
                        email: user.email
                    },
                    theme: { color: "#2ecc71" }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            }
        } catch (error) {
             toast.error(error.response?.data?.message || "Failed to initiate payment");
        }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="profile-page">
            <div className="profile-wrapper">

                {/* User Header Section */}
                <div className="profile-header-card">
                    <div className="user-info-flex">
                        <div className="profile-avatar-large">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.username} />
                            ) : (
                                <User size={60} />
                            )}
                        </div>
                        <div className="user-meta-info">
                            <h1>{user?.username}</h1>
                            <p className="user-email">{user?.email}</p>
                            <span className="user-badge">{user?.role || 'Traveler'}</span>
                            <div className="policy-link-highlight">
                                <Link to="/policy" className="btn-policy"><ShieldAlert size={16} /> View Policies & Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="my-bookings-section">
                    <h2 className="section-title">My Bookings</h2>

                    {bookings.length === 0 ? (
                        <div className="no-bookings">
                            <Clock size={48} />
                            <p>You haven't booked any tours yet.</p>
                            <button onClick={() => navigate('/tours')} className="btn-explore">Explore Tours</button>
                        </div>
                    ) : (
                        <div className="booking-grid">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="booking-card">
                                    <div className="booking-image">
                                        <img src={booking.tour?.images?.[0]} alt={booking.tour?.title} />
                                        <div className={`status-badge ${booking.inquiryStatus}`}>
                                            {booking.inquiryStatus}
                                        </div>
                                    </div>

                                    <div className="booking-details">
                                        <h3>{booking.tour?.title}</h3>

                                        <div className="booking-info-row">
                                            <Calendar size={16} />
                                            <span>{new Date(booking.preferredStartDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="booking-info-row">
                                            <Users size={16} />
                                            <span>{booking.guests} Guests</span>
                                        </div>

                                        <div className="booking-info-row">
                                            <IndianRupee size={16} />
                                            <span className="total-price">₹{booking.finalPrice}</span>
                                        </div>

                                        <div className="booking-actions">
                                            <button
                                                className="btn-view-tour"
                                                onClick={() => navigate(`/tours/${booking.tour?._id}`)}
                                            >
                                                View Tour
                                            </button>
                                            
                                            {booking.inquiryStatus !== "cancelled" && booking.paymentStatus === "deposit_paid" && (
                                                <button
                                                    className="btn-pay-remaining"
                                                    onClick={() => handlePayRemaining(booking._id)}
                                                >
                                                    <CreditCard size={16} /> Pay {booking.balanceAmount ? `₹${booking.balanceAmount}` : 'Balance'}
                                                </button>
                                            )}

                                            {booking.inquiryStatus !== "cancelled" && (
                                                <button
                                                    className="btn-cancel-booking"
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                >
                                                    <Trash2 size={16} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;
