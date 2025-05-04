import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const UserManagement = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [error, setError] = useState(null);

    // Form state for adding/editing users
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        role: 'homeowner',
        status: 'active'
    });

    // Function to fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Starting to fetch users...');

            try {
                const response = await userService.getUsers();
                console.log('Response received:', response);

                if (response && response.data) {
                    console.log(`Found ${response.data.length} users`);
                    setUsers(response.data);
                    setFilteredUsers(response.data);
                } else {
                    console.warn('No users found in response:', response);
                    setUsers([]);
                    setFilteredUsers([]);
                }
            } catch (apiError) {
                console.error('API error:', apiError);
                throw new Error('API connection failed');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching users with details:', error);
            setError('Failed to load users. Please try again.');

            // Fallback to sample data in case of error
            const sampleUsers = [
                {
                    uid: '1',
                    displayName: 'John Doe',
                    email: 'john.doe@example.com',
                    role: 'homeowner',
                    status: 'active',
                    lastLogin: new Date().toISOString(),
                    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    uid: '2',
                    displayName: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin',
                    status: 'active',
                    lastLogin: new Date().toISOString(),
                    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];

            console.log('Using fallback sample data');
            setUsers(sampleUsers);
            setFilteredUsers(sampleUsers);
            setLoading(false);
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users when search term or role filter changes
    useEffect(() => {
        // Filter by name search
        let results = users;

        if (searchTerm) {
            results = users.filter(user =>
                user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Then filter by role
        if (filterRole !== 'all') {
            results = results.filter(user => user.role === filterRole);
        }

        console.log(`Filtered to ${results.length} users based on search: "${searchTerm}" and role: "${filterRole}"`);
        setFilteredUsers(results);
    }, [searchTerm, filterRole, users]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            displayName: '',
            email: '',
            password: '',
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
            displayName: user.displayName || '',
            email: user.email || '',
            password: '', // Don't set password when editing
            role: user.role || 'homeowner',
            status: user.status || 'active'
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedUser) {
                // Update existing user
                // Only include password if it was changed
                const userData = { ...formData };
                if (!userData.password) delete userData.password;

                console.log(`Updating user ${selectedUser.uid}`, userData);
                await userService.updateUser(selectedUser.uid, userData);
                console.log(`User ${selectedUser.uid} updated successfully`);
            } else {
                // Add new user
                if (!formData.password) {
                    alert('Password is required when creating a new user');
                    return;
                }

                console.log('Creating new user', formData);
                await userService.createUser(formData);
                console.log('New user created successfully');
            }

            // Close modal and refresh users
            setShowUserModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(`Error ${selectedUser ? 'updating' : 'creating'} user: ${error.message}`);
        }
    };

    // Handle user deletion
    const handleDeleteUser = async (uid) => {
        // Don't allow deleting the current admin user
        if (uid === currentUser?.uid) {
            alert("You cannot delete your own account");
            return;
        }

        // Confirm deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            try {
                console.log(`Deleting user ${uid}`);
                await userService.deleteUser(uid);
                console.log(`User ${uid} deleted successfully`);
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(`Error deleting user: ${error.message}`);
            }
        }
    };

    return (
        <div className="admin-container">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>User Management</h1>
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
                                placeholder="Search users by name"
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
                        {loading ? (
                            <div className="text-center p-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Loading users...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        ) : (
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Last Login</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="no-users">
                                                No users found matching your search criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.uid}>
                                                <td>{user.displayName || 'No Name'}</td>
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
                                                <td>{formatDate(user.lastLogin)}</td>
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
                                                            onClick={() => handleDeleteUser(user.uid)}
                                                            title="Delete User"
                                                            disabled={user.uid === currentUser?.uid} // Prevent deleting current user
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
                        )}
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
                                <label htmlFor="displayName">Full Name</label>
                                <input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
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
                                <label htmlFor="password">
                                    {selectedUser ? 'New Password (leave blank to keep current)' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={selectedUser ? 'Enter new password' : 'Enter password'}
                                    required={!selectedUser} // Only required for new users
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
