// frontend/src/components/admin/GlobalDeviceMonitor.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminDeviceService from '../../services/adminDeviceService';

const GlobalDeviceMonitor = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Add this state for device details modal
    const [selectedDevice, setSelectedDevice] = useState(null);

    // Add this function to view device details
    const viewDeviceDetails = (device) => {
        setSelectedDevice(device);
    };

    // Close device details modal
    const closeDeviceDetails = () => {
        setSelectedDevice(null);
    };

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setLoading(true);
                const response = await adminDeviceService.getAllDevices();

                if (response && response.data) {
                    setDevices(response.data);
                } else {
                    // Fallback to sample data if needed
                    setDevices([
                        {
                            _id: 'd1',
                            name: 'Living Room Thermostat',
                            type: 'thermostat',
                            household: 'Johnson Home',
                            status: 'online',
                            lastUpdated: '2025-04-29T14:30:00'
                        },
                        {
                            _id: 'd2',
                            name: 'Kitchen Smart Plug',
                            type: 'plug',
                            household: 'Smith Residence',
                            status: 'offline',
                            lastUpdated: '2025-04-28T22:15:00'
                        }
                    ]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching devices:', error);
                // Fallback data
                setDevices([
                    {
                        _id: 'd1',
                        name: 'Living Room Thermostat',
                        type: 'thermostat',
                        household: 'Johnson Home',
                        status: 'online',
                        lastUpdated: '2025-04-29T14:30:00'
                    },
                    {
                        _id: 'd2',
                        name: 'Kitchen Smart Plug',
                        type: 'plug',
                        household: 'Smith Residence',
                        status: 'offline',
                        lastUpdated: '2025-04-28T22:15:00'
                    }
                ]);
                setLoading(false);
            }
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
            (device.household && device.household.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesStatus && matchesSearch;
    });

    const handleDeleteDevice = async (id) => {
        // Confirm deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this device?');

        if (confirmDelete) {
            try {
                setLoading(true);
                await adminDeviceService.deleteDevice(id);

                // Remove the device from state
                setDevices(prevDevices => prevDevices.filter(device => device._id !== id));
                setLoading(false);

                // Show success message (you could add a toast notification here)
                alert('Device deleted successfully');
            } catch (error) {
                console.error('Error deleting device:', error);
                setLoading(false);
                alert(`Error deleting device: ${error.message || 'Unknown error'}`);
            }
        }
    };

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
                                    <th>Actions</th> {/* Add this column */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDevices.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="no-users"> {/* Update colspan to 6 */}
                                            No devices found matching your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDevices.map(device => (
                                        <tr key={device._id}>
                                            <td>{device.name}</td>
                                            <td>{device.type}</td>
                                            <td>{device.household}</td>
                                            <td>
                                                <span className={`status-badge ${device.status}`}>
                                                    {device.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(device.lastUpdated)}</td>
                                            <td>
                                                <div className="user-actions">
                                                    <button
                                                        className="action-btn edit-btn"
                                                        onClick={() => viewDeviceDetails(device)}
                                                        title="View Device"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="action-btn delete-btn"
                                                        onClick={() => handleDeleteDevice(device._id)}
                                                        title="Delete Device"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Device Detail Modal */}
                {selectedDevice && (
                    <div className="modal-overlay">
                        <div className="user-modal">
                            <div className="modal-header">
                                <h2>Device Details</h2>
                                <button className="close-modal-btn" onClick={closeDeviceDetails}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="device-detail-container">
                                    <div className="device-icon-large">
                                        <i className={`fas ${selectedDevice.icon || 'fa-microchip'}`}></i>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Basic Information</h4>
                                        <div className="detail-row">
                                            <div className="detail-label">Name:</div>
                                            <div className="detail-value">{selectedDevice.name}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Type:</div>
                                            <div className="detail-value">{selectedDevice.type}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Room:</div>
                                            <div className="detail-value">{selectedDevice.room}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Household:</div>
                                            <div className="detail-value">{selectedDevice.household}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Status:</div>
                                            <div className="detail-value">
                                                <span className={`status-badge ${selectedDevice.status}`}>
                                                    {selectedDevice.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedDevice.state && (
                                        <div className="detail-section">
                                            <h4>Device State</h4>
                                            {Object.entries(selectedDevice.state).map(([key, value]) => (
                                                <div className="detail-row" key={key}>
                                                    <div className="detail-label">{key}:</div>
                                                    <div className="detail-value">
                                                        {typeof value === 'boolean'
                                                            ? value ? 'True' : 'False'
                                                            : value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="detail-section">
                                        <h4>Timestamps</h4>
                                        <div className="detail-row">
                                            <div className="detail-label">Last Updated:</div>
                                            <div className="detail-value">{formatDate(selectedDevice.lastUpdated)}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Created:</div>
                                            <div className="detail-value">
                                                {selectedDevice.createdAt ? formatDate(selectedDevice.createdAt) : 'Unknown'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-actions mt-4">
                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                handleDeleteDevice(selectedDevice._id);
                                                closeDeviceDetails();
                                            }}
                                        >
                                            Delete Device
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="admin-footer">
                <p>&copy; 2025 Home Bot - Super Admin Panel</p>
            </footer>
        </div>
    );
};

export default GlobalDeviceMonitor;
