import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/context/userContext';
import { toast } from 'sonner';
import { User, Calendar, MapPin, Users, IndianRupee, Trash2, Clock } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user } = getData();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isCancellable = (startDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tourDate = new Date(startDate);
        tourDate.setHours(0, 0, 0, 0);

        const diffInTime = tourDate.getTime() - today.getTime();
        const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
        return diffInDays >= 20;
    };

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            return;
        }

        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await axios.get("http://localhost:8000/bookings/my-bookings", {
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
            const res = await axios.delete(`http://localhost:8000/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                toast.success("Booking cancelled successfully");
                setBookings(prev => prev.filter(b => b._id !== bookingId));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel booking");
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
                                            {isCancellable(booking.preferredStartDate) && (
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
