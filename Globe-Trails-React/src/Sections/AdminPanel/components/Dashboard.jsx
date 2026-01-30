import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        tours: 0,
        bookings: 0,
        users: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats
                const statsRes = await axios.get("http://localhost:8000/admin/stats");
                if (statsRes.data.success) {
                    setStats(statsRes.data.stats);
                }

                // Fetch Recent Inquiries (Bookings)
                const bookingsRes = await axios.get("http://localhost:8000/bookings");
                if (bookingsRes.data.success) {
                    // Get only first 5 for dashboard
                    setRecentBookings(bookingsRes.data.data.slice(0, 5));
                }
            } catch (error) {
                console.error("Error loading dashboard data", error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className="content-header">
                <h2 className="page-title">Dashboard Overview</h2>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Tours</span>
                    <span className="stat-value">{stats.tours}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Bookings</span>
                    <span className="stat-value">{stats.bookings}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Users</span>
                    <span className="stat-value">{stats.users}</span>
                </div>
            </div>

            <div className="table-container">
                <div className="content-header" style={{ padding: '20px', marginBottom: 0 }}>
                    <h3>Recent Inquiries</h3>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Tour</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentBookings.length > 0 ? (
                            recentBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.user?.username || booking.user?.email || 'Unknown User'}</td>
                                    <td>
                                        {typeof booking.tour === 'object' && booking.tour !== null
                                            ? booking.tour.title
                                            : (booking.tour || 'Deleted Tour')}
                                    </td>
                                    <td>{new Date(booking.preferredStartDate).toLocaleDateString()}</td>
                                    <td>
                                        <span style={{
                                            color: booking.inquiryStatus === 'confirmed' ? 'green' :
                                                booking.inquiryStatus === 'pending' ? 'orange' : 'red'
                                        }}>
                                            {booking.inquiryStatus.charAt(0).toUpperCase() + booking.inquiryStatus.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No recent inquiries found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
