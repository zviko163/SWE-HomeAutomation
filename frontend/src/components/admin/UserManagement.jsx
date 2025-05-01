// frontend/src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Form state for adding/editing users
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'homeowner',
        status: 'active'
    });

    useEffect(() => {
        // In a real app, you would fetch users from your backend/Firebase
        // For demo purposes, we'll use sample data
        const fetchUsers = () => {
            // Simulate API call delay
            setTimeout(() => {
                const sampleUsers = [
                    {
                        id: '1',
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        role: 'homeowner',
                        status: 'active',
                        lastLogin: '2025-04-25T14:30:00',
                        devices: 5,
                        createdAt: '2025-01-15T09:20:00'
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        email: 'jane.smith@example.com',
                        role: 'homeowner',
                        status: 'active',
                        lastLogin: '2025-04-28T16:45:00',
                        devices: 8,
                        createdAt: '2025-02-03T11:15:00'
                    },
                    {
                        id: '3',
                        name: 'Robert Johnson',
                        email: 'robert.johnson@example.com',
                        role: 'homeowner',
                        status: 'inactive',
                        lastLogin: '2025-03-10T08:20:00',
                        devices: 2,
                        createdAt: '2025-02-28T15:40:00'
                    },
                    {
                        id: '4',
                        name: 'Emily Williams',
                        email: 'emily.williams@example.com',
                        role: 'homeowner',
                        status: 'active',
                        lastLogin: '2025-04-29T09:15:00',
                        devices: 4,
                        createdAt: '2025-03-05T10:30:00'
                    },
                    {
                        id: '5',
                        name: 'System Administrator',
                        email: 'admin@homebot.com',
                        role: 'admin',
                        status: 'active',
                        lastLogin: '2025-04-29T10:30:00',
                        devices: 0,
                        createdAt: '2025-01-01T00:00:00'
                    }
                ];
                setUsers(sampleUsers);
                setLoading(false);
            }, 1000);
        };

        fetchUsers();
    }, []);

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'homeowner',
            status: 'active'
        });
        setSelectedUser(null);
    };

    // Handle opening modal for adding a new user
    const handleAddUser = () => {
        resetForm();
        setShowUserModal(true);
    };

    // Handle opening modal for editing a user
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
        setShowUserModal(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // In a real app, you would save to backend/Firebase
        if (selectedUser) {
            // Update existing user
            const updatedUsers = users.map(user =>
                user.id === selectedUser.id ? { ...user, ...formData } : user
            );
            setUsers(updatedUsers);
        } else {
            // Add new user with a generated ID
            const newUser = {
                id: Date.now().toString(),
                ...formData,
                lastLogin: 'Never',
                devices: 0,
                createdAt: new Date().toISOString()
            };
            setUsers([...users, newUser]);
        }

        // Close modal and reset form
        setShowUserModal(false);
        resetForm();
    };

    // Handle user deletion
    const handleDeleteUser = (userId) => {
        // In a real app, you would delete from backend/Firebase
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
        }
    };

    // Filter users based on search term and role filter
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="admin-container">
                <div className="admin-loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>User Management</h1>
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
                <Link to="/admin/dashboard" className="admin-nav-link">
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
                <Link to="/admin/users" className="admin-nav-link active">
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

            {/* Main Content */}
            <main className="admin-content">
                <section className="users-section">
                    <div className="users-header">
                        <div className="users-title-section">
                            <h2>System Users</h2>
                            <p className="user-count">{users.length} total users</p>
                        </div>
                        <button className="add-user-btn" onClick={handleAddUser}>
                            <i className="fas fa-user-plus"></i> Add User
                        </button>
                    </div>

                    <div className="users-filters">
                        <div className="search-container">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search users by name or email"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-container">
                            <label htmlFor="roleFilter">Filter by:</label>
                            <select
                                id="roleFilter"
                                className="role-filter"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Users</option>
                                <option value="admin">Admins</option>
                                <option value="homeowner">Homeowners</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Devices</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="no-users">
                                            No users found matching your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role === 'admin' ? 'Super Admin' : 'Homeowner'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.status}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>{user.lastLogin === 'Never' ? 'Never' : formatDate(user.lastLogin)}</td>
                                            <td>{user.devices}</td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="user-actions">
                                                    <button
                                                        className="action-btn edit-btn"
                                                        onClick={() => handleEditUser(user)}
                                                        title="Edit User"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="action-btn delete-btn"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        title="Delete User"
                                                        disabled={user.role === 'admin'} // Prevent deleting admin users
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
            </main>

            {/* User Form Modal */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="user-modal">
                        <div className="modal-header">
                            <h2>{selectedUser ? 'Edit User' : 'Add New User'}</h2>
                            <button className="close-modal-btn" onClick={() => setShowUserModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">User Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="homeowner">Homeowner</option>
                                    <option value="admin">Super Admin</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowUserModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    {selectedUser ? 'Update User' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="admin-footer">
                <p>&copy; 2025 Home Bot - Super Admin Panel</p>
            </footer>
        </div>
    );
};

export default UserManagement;
