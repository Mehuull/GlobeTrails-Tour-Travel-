import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            // Although we made the route public/unprotected in routes for now, good practice to send it
            // checking backend routes again... router.get("/", getAllBookings) is there.
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setBookings(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch bookings");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`${import.meta.env.VITE_API_URL}/bookings/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#27ae60';
            case 'rejected': return '#e74c3c';
            default: return '#f39c12';
        }
    };

    return (
        <div>
            <div className="content-header">
                <h2 className="page-title">Booking Inquiries</h2>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Tour</th>
                            <th>Preferred Date</th>
                            <th>Guests</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundColor: 'var(--orange-color)', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase'
                                        }}>
                                            {(booking.user?.username || booking.user?.email || 'U').charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{booking.user?.username || "Unknown"}</div>
                                            <div style={{ fontSize: '12px', color: '#777' }}>{booking.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{booking.tour?.title || "Deleted Tour"}</td>
                                <td>{new Date(booking.preferredStartDate).toLocaleDateString()}</td>
                                <td>{booking.guests}</td>
                                <td>
                                    <div>{booking.contactDetails?.phone}</div>
                                    <div>{booking.contactDetails?.email}</div>
                                </td>
                                <td>
                                    <span style={{
                                        backgroundColor: getStatusColor(booking.inquiryStatus) + '20',
                                        color: getStatusColor(booking.inquiryStatus),
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        textTransform: 'capitalize',
                                        fontWeight: 600
                                    }}>
                                        {booking.inquiryStatus}
                                    </span>
                                </td>
                                <td>
                                    {booking.inquiryStatus === 'pending' && (
                                        <>
                                            <button
                                                className="action-btn"
                                                style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                title="Confirm"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                className="action-btn"
                                                style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingList;
