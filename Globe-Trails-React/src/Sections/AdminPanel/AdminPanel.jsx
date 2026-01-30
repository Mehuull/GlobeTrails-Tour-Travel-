import React, { useState } from 'react';
import './AdminPanel.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TourList from './components/TourList';
import AddTour from './components/AddTour';
import BookingList from './components/BookingList';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingTour, setEditingTour] = useState(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'tours':
                return <TourList setActiveTab={setActiveTab} setEditingTour={setEditingTour} />;
            case 'add-tour':
                return <AddTour editingTour={editingTour} setEditingTour={setEditingTour} setActiveTab={setActiveTab} />;
            case 'bookings':
                return <BookingList />;
            case 'users':
                return <div className="table-container" style={{ padding: '30px', textAlign: 'center' }}><h3>Users Management Coming Soon</h3></div>;
            case 'settings':
                return <div className="table-container" style={{ padding: '30px', textAlign: 'center' }}><h3>Settings Coming Soon</h3></div>;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="admin-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="admin-content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;