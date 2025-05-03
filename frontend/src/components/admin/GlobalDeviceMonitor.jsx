// frontend/src/components/admin/GlobalDeviceMonitor.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GlobalDeviceMonitor = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulate fetching devices from backend
        const fetchDevices = () => {
            setTimeout(() => {
                const sampleDevices = [
                    {
                        id: 'd1',
                        name: 'Living Room Thermostat',
                        type: 'thermostat',
                        household: 'Johnson Home',
                        status: 'online',
                        lastUpdated: '2025-04-29T14:30:00'
                    },
                    {
                        id: 'd2',
                        name: 'Kitchen Smart Plug',
                        type: 'plug',
                        household: 'Smith Residence',
                        status: 'offline',
                        lastUpdated: '2025-04-28T22:15:00'
                    },
                    {
                        id: 'd3',
                        name: 'Bedroom Motion Sensor',
                        type: 'sensor',
                        household: 'Williams Apartment',
                        status: 'online',
                        lastUpdated: '2025-04-29T15:45:00'
                    },
                    {
                        id: 'd4',
                        name: 'Front Door Lock',
                        type: 'lock',
                        household: 'Davis House',
                        status: 'online',
                        lastUpdated: '2025-04-29T16:20:00'
                    }
                ];
                setDevices(sampleDevices);
                setLoading(false);
            }, 1000);
        };

        fetchDevices();
    }, []);

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter devices based on status and search term
    const filteredDevices = devices.filter(device => {
        const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
        const matchesSearch =
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.household.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="admin-container">
                <div className="admin-loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading device data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>Device Management</h1>
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
                <Link to="/admin/dashboard" className="admin-nav-link">
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
                <Link to="/admin/users" className="admin-nav-link">
                    <i className="fas fa-users"></i> User Management
                </Link>
                <Link to="/admin/devices" className="admin-nav-link active">
                    <i className="fas fa-microchip"></i> Global Devices
                </Link>
                <Link to="/admin/profile" className="admin-nav-link">
                    <i className="fas fa-user"></i> Profile
                </Link>
                <Link to="/login" className="admin-nav-link">
                    <i className="fas fa-sign-out-alt"></i> Logout
                </Link>
            </nav>

            {/* Main Content */}
            <main className="admin-content">
                <section className="users-section">
                    <div className="users-header">
                        <div className="users-title-section">
                            <h2>All Devices</h2>
                            <p className="user-count">{devices.length} total devices</p>
                        </div>
                    </div>

                    <div className="users-filters">
                        <div className="search-container">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search devices by name or household"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-container">
                            <label htmlFor="statusFilter">Filter by:</label>
                            <select
                                id="statusFilter"
                                className="role-filter"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Devices</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    {/* Devices Table */}
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Device Name</th>
                                    <th>Type</th>
                                    <th>Household</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDevices.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="no-users">
                                            No devices found matching your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDevices.map(device => (
                                        <tr key={device.id}>
                                            <td>{device.name}</td>
                                            <td>{device.type}</td>
                                            <td>{device.household}</td>
                                            <td>
                                                <span className={`status-badge ${device.status}`}>
                                                    {device.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(device.lastUpdated)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="admin-footer">
                <p>&copy; 2025 Home Bot - Super Admin Panel</p>
            </footer>
        </div>
    );
};

export default GlobalDeviceMonitor;
