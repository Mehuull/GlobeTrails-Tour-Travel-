import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const TourList = ({ setActiveTab, setEditingTour }) => {
    const [tours, setTours] = useState([]);

    const fetchTours = async () => {
        try {
            const res = await axios.get("http://localhost:8000/tours");
            if (res.data.success) {
                setTours(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch tours");
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tour?")) return;
        try {
            // Add auth header if needed later
            await axios.delete(`http://localhost:8000/tours/${id}`);
            toast.success("Tour deleted successfully");
            fetchTours();
        } catch (error) {
            toast.error("Failed to delete tour");
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setActiveTab('add-tour');
    };

    return (
        <div>
            <div className="content-header">
                <h2 className="page-title">All Tours</h2>
                <button className="btn-primary" onClick={() => { setEditingTour(null); setActiveTab('add-tour'); }}>
                    + Add New Tour
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Group Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            <tr key={tour._id}>
                                <td>
                                    <img
                                        src={tour.images?.[0] || "https://via.placeholder.com/50"}
                                        alt="tour"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td>{tour.title}</td>
                                <td>
                                    <span className="tour-badge" style={{ position: 'static', padding: '4px 8px', fontSize: '0.7rem' }}>
                                        {tour.category || 'N/A'}
                                    </span>
                                </td>
                                <td>{tour.duration.days}D / {tour.duration.nights}N</td>
                                <td>₹{tour.pricePerPerson}</td>
                                <td>{tour.maxGroupSize}</td>
                                <td>
                                    <button
                                        className="action-btn btn-view"
                                        onClick={() => window.open(`/tours/${tour._id}`, '_blank')}
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="action-btn btn-edit"
                                        onClick={() => handleEdit(tour)}
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="action-btn btn-delete"
                                        onClick={() => handleDelete(tour._id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tours.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No tours found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TourList;
