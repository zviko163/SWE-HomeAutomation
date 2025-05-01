// frontend/src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalDevices: 0,
        onlineDevices: 0,
        totalHouseholds: 0,
        alertsToday: 0
    });

    useEffect(() => {
        // In a real app, you would fetch these stats from your backend
        // For demo purposes, we'll use sample data
        const fetchStats = () => {
            // Simulate API call delay
            setTimeout(() => {
                setStats({
                    totalUsers: 48,
                    activeUsers: 32,
                    totalDevices: 156,
                    onlineDevices: 143,
                    totalHouseholds: 15,
                    alertsToday: 4
                });
                setLoading(false);
            }, 1000);
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
                        <span>Welcome, <strong>Admin</strong></span>
                        <img
                            src={currentUser?.photoURL || '/src/assets/images/default-avatar.png'}
                            alt="Admin"
                            className="admin-avatar"
                        />
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
                                <p className="stat-subtext">{stats.activeUsers} active in last 24h</p>
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
                                <p className="stat-subtext">{stats.onlineDevices} currently online</p>
                            </div>
                        </div>

                        {/* Households Stat Card */}
                        <div className="admin-stat-card">
                            <div className="stat-icon households-icon">
                                <i className="fas fa-home"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-value">{stats.totalHouseholds}</h3>
                                <p className="stat-label">Households</p>
                                <p className="stat-subtext">Across 8 cities</p>
                            </div>
                        </div>

                        {/* Alerts Stat Card */}
                        <div className="admin-stat-card">
                            <div className="stat-icon alerts-icon">
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-value">{stats.alertsToday}</h3>
                                <p className="stat-label">Alerts Today</p>
                                <p className="stat-subtext">2 require attention</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Activity Section */}
                <section className="admin-activity-section">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <button className="view-all-btn">View All</button>
                    </div>

                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="activity-details">
                                <p className="activity-text">New user registered: <strong>Michael Chen</strong></p>
                                <p className="activity-time">10 minutes ago</p>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                            <div className="activity-details">
                                <p className="activity-text">Alert: <strong>Temperature sensor offline</strong> in Johnson household</p>
                                <p className="activity-time">25 minutes ago</p>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-plus-circle"></i>
                            </div>
                            <div className="activity-details">
                                <p className="activity-text">New device added: <strong>Smart Thermostat</strong> by Sarah Wilson</p>
                                <p className="activity-time">1 hour ago</p>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-sign-in-alt"></i>
                            </div>
                            <div className="activity-details">
                                <p className="activity-text">Admin login: <strong>System Administrator</strong></p>
                                <p className="activity-time">2 hours ago</p>
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

                        <Link to="/admin/devices" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h3>Check Device Status</h3>
                        </Link>

                        <Link to="/admin/users" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <h3>Send Notification</h3>
                        </Link>

                        <Link to="/admin/users" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-download"></i>
                            </div>
                            <h3>Export Reports</h3>
                        </Link>
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
