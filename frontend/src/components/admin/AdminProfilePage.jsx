// frontend/src/components/admin/AdminProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    EmailAuthProvider,
    GoogleAuthProvider,
    signOut
} from 'firebase/auth';

const AdminProfilePage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // User profile information states
    const [profileData, setProfileData] = useState({
        displayName: currentUser?.displayName || '',
        email: currentUser?.email || '',
        photoURL: currentUser?.photoURL || '',
    });

    // Form state handling
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

    // Password form data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Add near the top of the AdminProfilePage component
    const isGoogleUser = () => {
        if (!currentUser) return false;

        // Check if the user's providerData includes Google
        return currentUser.providerData.some(
            provider => provider.providerId === 'google.com'
        );
    };

    // Validation errors
    const [errors, setErrors] = useState({});

    // Initialize form data when user data is available
    useEffect(() => {
        if (currentUser) {
            setProfileData({
                displayName: currentUser.displayName || '',
                email: currentUser.email || '',
                photoURL: currentUser.photoURL || '',
            });
        }
    }, [currentUser]);

    // Handle input changes for profile form
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle input changes for password form
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirmation(true);
    };

    // Add the confirmDeleteAccount function
    const confirmDeleteAccount = async () => {
        try {
            setDeleteLoading(true);

            // Re-authenticate based on provider
            if (isGoogleUser()) {
                // For Google users, create Google auth provider
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(currentUser, provider);
            } else {
                // For email/password users, reauthenticate with password
                if (!deleteConfirmPassword) {
                    setErrorMessage('Please enter your password to confirm deletion');
                    setDeleteLoading(false);
                    return;
                }

                const credential = EmailAuthProvider.credential(
                    currentUser.email,
                    deleteConfirmPassword
                );

                await reauthenticateWithCredential(currentUser, credential);
            }

            // Now that user is re-authenticated, delete the account
            await currentUser.delete();

            // Navigate to the login page
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);

            if (error.code === 'auth/wrong-password') {
                setErrorMessage('Incorrect password. Please try again.');
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMessage('Too many unsuccessful attempts. Please try again later.');
            } else if (error.code === 'auth/network-request-failed') {
                setErrorMessage('Network error. Please check your connection and try again.');
            } else {
                setErrorMessage(error.message || 'Failed to delete account. Please try again.');
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    // Validate profile form
    const validateProfileForm = () => {
        const newErrors = {};

        if (!profileData.displayName.trim()) {
            newErrors.displayName = 'Name is required';
        }

        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate password form
    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must include an uppercase letter';
        } else if (!/[a-z]/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must include a lowercase letter';
        } else if (!/[0-9]/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must include a number';
        } else if (!/[^A-Za-z0-9]/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must include a special character';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update profile information
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        // Reset messages
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form
        const isValid = validateProfileForm();

        if (isValid) {
            setProcessing(true);

            try {
                // Update display name
                if (currentUser.displayName !== profileData.displayName) {
                    await updateProfile(currentUser, {
                        displayName: profileData.displayName
                    });
                }

                // Update email if changed
                if (currentUser.email !== profileData.email) {
                    await updateEmail(currentUser, profileData.email);
                }

                setSuccessMessage('Profile updated successfully!');
                setIsEditingProfile(false);
            } catch (error) {
                console.error('Error updating profile:', error);
                setErrorMessage(error.message || 'Failed to update profile. Please try again.');
            } finally {
                setProcessing(false);
            }
        }
    };

    // Update password
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        // Reset messages
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form
        const isValid = validatePasswordForm();

        if (isValid) {
            setProcessing(true);

            try {
                // Re-authenticate user before changing password
                const credential = EmailAuthProvider.credential(
                    currentUser.email,
                    passwordData.currentPassword
                );

                await reauthenticateWithCredential(currentUser, credential);

                // Update password
                await updatePassword(currentUser, passwordData.newPassword);

                // Reset form and show success message
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                setSuccessMessage('Password updated successfully!');
                setIsChangingPassword(false);
            } catch (error) {
                console.error('Error updating password:', error);

                if (error.code === 'auth/wrong-password') {
                    setErrors(prev => ({ ...prev, currentPassword: 'Current password is incorrect' }));
                } else {
                    setErrorMessage(error.message || 'Failed to update password. Please try again.');
                }
            } finally {
                setProcessing(false);
            }
        }
    };

    // Handle profile picture upload
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real application, you would upload this to Firebase Storage
            // For now, we'll just create a local URL for preview
            const imageUrl = URL.createObjectURL(file);
            setProfileData(prev => ({
                ...prev,
                photoURL: imageUrl
            }));
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        setProfileData({
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
        });
        setErrors({});
    };

    // Cancel password change
    const handleCancelPasswordChange = () => {
        setIsChangingPassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            setErrorMessage('Failed to sign out. Please try again.');
        }
    };

    return (
        <div className="admin-container">
            {/* Header Section */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>Admin Profile</h1>
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
                <Link to="/admin/devices" className="admin-nav-link">
                    <i className="fas fa-microchip"></i> Global Devices
                </Link>
                <Link to="/login" className="admin-nav-link active">
                    <i className="fas fa-user"></i> Profile
                </Link>
            </nav>

            {/* Main Content */}
            <main className="admin-content profile-content">
                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="alert-message success-message">
                        <i className="fas fa-check-circle"></i>
                        <span>{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="alert-message error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Profile Information Section */}
                <section className="profile-section glass-card">
                    <div className="section-header">
                        <h2>Account Information</h2>
                        {!isEditingProfile && (
                            <button
                                className="edit-button"
                                onClick={() => setIsEditingProfile(true)}
                            >
                                <i className="fas fa-pencil-alt"></i> Edit
                            </button>
                        )}
                    </div>

                    <div className="account-info-content">
                        <div className="profile-picture-container">
                            <div className="profile-picture">
                                {profileData.photoURL ? (
                                    <img src={profileData.photoURL} alt="Profile" />
                                ) : (
                                    <div className="profile-initials">
                                        {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                {isEditingProfile && (
                                    <button
                                        className="change-picture-button"
                                        onClick={triggerFileInput}
                                    >
                                        <i className="fas fa-camera"></i>
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                />
                            </div>
                        </div>

                        {isEditingProfile ? (
                            <form className="profile-form" onSubmit={handleProfileUpdate}>
                                <div className="form-group">
                                    <label htmlFor="displayName">Full Name</label>
                                    <input
                                        type="text"
                                        id="displayName"
                                        name="displayName"
                                        value={profileData.displayName}
                                        onChange={handleProfileChange}
                                        className={errors.displayName ? 'error' : ''}
                                    />
                                    {errors.displayName && <div className="error-message">{errors.displayName}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <div className="error-message">{errors.email}</div>}
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={handleCancelEdit}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="save-button"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="detail-row">
                                    <div className="detail-label">Name:</div>
                                    <div className="detail-value">{profileData.displayName || 'Not set'}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Email:</div>
                                    <div className="detail-value">{profileData.email}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Member Since:</div>
                                    <div className="detail-value">
                                        {currentUser?.metadata?.creationTime
                                            ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })
                                            : 'Unknown'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Security Section */}
                <section className="profile-section glass-card">
                    <div className="section-header">
                        <h2>Security</h2>
                        {!isGoogleUser() && !isChangingPassword && (
                            <button
                                className="edit-button"
                                onClick={() => setIsChangingPassword(true)}
                            >
                                <i className="fas fa-key"></i> Change Password
                            </button>
                        )}
                    </div>

                    <div className="security-content">
                        {isChangingPassword ? (
                            <form className="password-form" onSubmit={handlePasswordUpdate}>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className={errors.currentPassword ? 'error' : ''}
                                    />
                                    {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={errors.newPassword ? 'error' : ''}
                                    />
                                    {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={errors.confirmPassword ? 'error' : ''}
                                    />
                                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                                </div>

                                <div className="password-requirements">
                                    <p>Password requirements:</p>
                                    <ul>
                                        <li>At least 8 characters long</li>
                                        <li>Includes at least one uppercase letter</li>
                                        <li>Includes at least one lowercase letter</li>
                                        <li>Includes at least one number</li>
                                        <li>Includes at least one special character</li>
                                    </ul>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={handleCancelPasswordChange}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="save-button"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : isGoogleUser() ? (
                            <div className="security-summary">
                                <div className="security-info">
                                    <div className="security-icon">
                                        <i className="fab fa-google"></i>
                                    </div>
                                    <div className="security-text">
                                        <p>You signed in with Google. Password management is handled through Google.</p>
                                        <p className="security-tip">To change your password, visit your Google Account settings.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="security-summary">
                                <div className="security-info">
                                    <div className="security-icon">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="security-text">
                                        <p>Your password was last changed on {currentUser?.metadata?.passwordUpdatedAt ? new Date(currentUser.metadata.passwordUpdatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'unknown date'}</p>
                                        <p className="security-tip">For your security, we recommend changing your password regularly.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Account Actions */}
                <section className="profile-section glass-card account-actions">
                    <div className="section-header">
                        <h2>Account Actions</h2>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="action-button logout-button"
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            Log Out
                        </button>
                        <button
                            className="action-button delete-account-button"
                            onClick={handleDeleteAccount}
                        >
                            <i className="fas fa-user-times"></i>
                            Delete Account
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="admin-footer">
                <p>&copy; 2025 Home Bot - Super Admin Panel</p>
            </footer>

            {/* Delete Account Confirmation Dialog */}
            {showDeleteConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog glass-card">
                        <h3>Delete Your Account?</h3>
                        <p>This action cannot be undone. All your data will be permanently deleted.</p>

                        {!isGoogleUser() && (
                            <div className="form-group mb-4">
                                <label htmlFor="deleteConfirmPassword">Enter your password to confirm:</label>
                                <input
                                    type="password"
                                    id="deleteConfirmPassword"
                                    value={deleteConfirmPassword}
                                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                                    className={errorMessage ? 'error' : ''}
                                    placeholder="Your current password"
                                />
                                {errorMessage && <div className="error-message">{errorMessage}</div>}
                            </div>
                        )}

                        {isGoogleUser() && (
                            <p className="auth-note">You'll be prompted to sign in with Google to confirm.</p>
                        )}

                        <div className="confirmation-actions">
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setShowDeleteConfirmation(false);
                                    setDeleteConfirmPassword('');
                                    setErrorMessage('');
                                }}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-button"
                                onClick={confirmDeleteAccount}
                                disabled={deleteLoading || (!isGoogleUser() && !deleteConfirmPassword)}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    'Delete Account'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfilePage;
