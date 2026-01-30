import React from 'react';
import { LayoutDashboard, Map, PlusCircle, ClipboardList, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'tours', label: 'All Tours', icon: <Map size={20} /> },
        { id: 'add-tour', label: 'Add New Tour', icon: <PlusCircle size={20} /> },
        { id: 'bookings', label: 'Bookings', icon: <ClipboardList size={20} /> },
        { id: 'users', label: 'Users', icon: <Users size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/signin";
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-brand">
                Admin Panel
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
