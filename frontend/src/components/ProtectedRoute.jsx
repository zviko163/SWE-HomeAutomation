import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Loading spinner component
const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const ProtectedRoute = ({ requiredRole }) => {
    const { isAuthenticated, loading, userRole } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return <LoadingSpinner />;
    }

    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user has the required role
    if (requiredRole && userRole !== requiredRole) {
        // Redirect admin to admin dashboard if trying to access homeowner routes
        if (userRole === 'admin' && requiredRole === 'homeowner') {
            return <Navigate to="/admin/dashboard" replace />;
        }

        // Redirect homeowner to homeowner dashboard if trying to access admin routes
        if (userRole === 'homeowner' && requiredRole === 'admin') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // If authenticated with correct role, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
