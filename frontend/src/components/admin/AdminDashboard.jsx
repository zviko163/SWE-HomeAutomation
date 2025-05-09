// frontend/src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuth } from 'firebase/auth';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDevices: 0
    });

    useEffect(() => {
        // In a real app, you would fetch these stats from your backend
        // For demo purposes, we'll use sample data
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Get user count from Firebase
                let totalUsers = 0;
                const auth = getAuth();

                // Since client-side Firebase doesn't let you list all users (security constraint),
                // we have two options:
                // 1. Make an API call to your backend that uses Firebase Admin SDK
                // 2. Use a collection in your database to store user info when they register

                try {
                    // Option 1: Call backend API that uses Firebase Admin
                    const userResponse = await fetch('http://localhost:5001/api/admin/stats/users');
                    const userData = await userResponse.json();
                    totalUsers = userData.count;
                } catch (error) {
                    console.error('Error fetching user count:', error);
                    totalUsers = 48; // Fallback
                }

                // Get device count from MongoDB via your backend API
                let totalDevices = 0;
                try {
                    const deviceResponse = await fetch('http://localhost:5001/api/admin/stats/devices');
                    const deviceData = await deviceResponse.json();
                    totalDevices = deviceData.count;
                } catch (error) {
                    console.error('Error fetching device count:', error);
                    totalDevices = 156; // Fallback
                }

                setStats({
                    totalUsers,
                    totalDevices
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setStats({
                    totalUsers: 48, // Fallback
                    totalDevices: 156 // Fallback
                });
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-container">
                <div className="admin-loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>System Overview</h1>
                    <div className="admin-user-info">
                        <span>Welcome, <strong>{currentUser?.displayName || 'Admin'}</strong></span>
                        {currentUser?.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Admin"
                                className="admin-avatar"
                            />
                        ) : (
                            <div className="admin-avatar admin-initials">
                                {currentUser?.displayName
                                    ? currentUser.displayName.charAt(0).toUpperCase()
                                    : 'A'}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Admin Navigation */}
            <nav className="admin-nav">
                <Link to="/admin/dashboard" className="admin-nav-link active">
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
                <Link to="/admin/users" className="admin-nav-link">
                    <i className="fas fa-users"></i> User Management
                </Link>
                <Link to="/admin/devices" className="admin-nav-link">
                    <i className="fas fa-microchip"></i> Global Devices
                </Link>
                <Link to="/admin/profile" className="admin-nav-link">
                    <i className="fas fa-user"></i> Profile
                </Link>
                <Link to="/login" className="admin-nav-link">
                    <i className="fas fa-sign-out-alt"></i> Logout
                </Link>
            </nav>

            {/* Main Dashboard Content */}
            <main className="admin-content">
                {/* Stats Overview */}
                <section className="admin-stats-section">
                    <h2>System Statistics</h2>
                    <div className="admin-stats-grid">
                        {/* Users Stat Card */}
                        <div className="admin-stat-card">
                            <div className="stat-icon users-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-value">{stats.totalUsers}</h3>
                                <p className="stat-label">Total Users</p>
                                <p className="stat-subtext">System administrators and homeowners</p>
                            </div>
                        </div>

                        {/* Devices Stat Card */}
                        <div className="admin-stat-card">
                            <div className="stat-icon devices-icon">
                                <i className="fas fa-microchip"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-value">{stats.totalDevices}</h3>
                                <p className="stat-label">Total Devices</p>
                                <p className="stat-subtext">Connected smart home devices</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="admin-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/admin/users" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <h3>Add New User</h3>
                        </Link>

                        <div className="action-card" onClick={() => window.open('http://localhost:5001/api/reports/devices', '_blank')}>
                            <div className="action-icon">
                                <i className="fas fa-download"></i>
                            </div>
                            <h3>Export Devices Report</h3>
                        </div>

                        <div className="action-card" onClick={() => window.open('http://localhost:5001/api/reports/users', '_blank')}>
                            <div className="action-icon">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <h3>Export Users Report</h3>
                        </div>
                    </div>
                </section>
            </main>

            {/* Admin Footer */}
            <footer className="admin-footer">
                <p>&copy; 2025 Home Bot - Super Admin Panel</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
