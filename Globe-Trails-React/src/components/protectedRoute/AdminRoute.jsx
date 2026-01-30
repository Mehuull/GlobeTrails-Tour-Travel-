import React from "react";
import { Navigate } from "react-router-dom";
import { getData } from "../../context/userContext";

const AdminRoute = ({ children }) => {
    const { user, isLoading } = getData();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // Not authenticated → redirect to login
        return <Navigate to="/signin" replace />;
    }

    if (user.username !== "Admin") {
        // Not an admin → redirect to home
        return <Navigate to="/" replace />;
    }

    // Authenticated and is Admin → allow access
    return children;
};

export default AdminRoute;
