// frontend/src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/signup.css'; // Reuse the signup CSS
import { auth } from '../firebase';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

const LoginPage = () => {
    // Tab state - 'homeowner' or 'admin'
    const [activeTab, setActiveTab] = useState('homeowner');

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Form data state - separate for homeowner and admin
    const [homeownerData, setHomeownerData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [adminData, setAdminData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    // Validation errors state
    const [errors, setErrors] = useState({});

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Navigate for redirection
    const navigate = useNavigate();

    // Handle input changes for homeowner form
    const handleHomeownerChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHomeownerData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle input changes for admin form
    const handleAdminChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAdminData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Validate homeowner form
    const validateHomeownerForm = () => {
        const newErrors = {};

        if (!homeownerData.email.trim()) {
            newErrors.homeownerEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(homeownerData.email)) {
            newErrors.homeownerEmail = 'Email is invalid';
        }

        if (!homeownerData.password) {
            newErrors.homeownerPassword = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate admin form
    const validateAdminForm = () => {
        const newErrors = {};

        if (!adminData.email.trim()) {
            newErrors.adminEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(adminData.email)) {
            newErrors.adminEmail = 'Email is invalid';
        }

        if (!adminData.password) {
            newErrors.adminPassword = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle homeowner login form submission
    const handleHomeownerSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const isValid = validateHomeownerForm();

        if (isValid) {
            try {
                setIsLoading(true);

                // Sign in with email and password using Firebase
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    homeownerData.email,
                    homeownerData.password
                );

                // Check user role (in a real app, you'd likely have a database lookup here)
                // For now, we'll just check email domain as an example
                const user = userCredential.user;

                // For demo purposes - in production you would check against a roles database
                // Redirect to dashboard
                navigate('/dashboard');
            } catch (error) {
                console.error('Login error:', error);
                let errorMessage = 'Failed to login. Please check your credentials.';

                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Invalid email or password.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many login attempts. Please try again later.';
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled.';
                }

                setErrors({
                    ...errors,
                    homeownerForm: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle admin login form submission
    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const isValid = validateAdminForm();

        if (isValid) {
            try {
                setIsLoading(true);

                // Sign in with email and password using Firebase
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    adminData.email,
                    adminData.password
                );

                // Check user role (in a real app, you'd likely have a database lookup here)
                // For now, we'll just check email domain as an example
                const user = userCredential.user;

                // For demo purposes - we'll assume any email with admin is an admin
                // In a real app, you would check against Firebase custom claims or a roles database
                if (user.email.includes('admin')) {
                    // Redirect to admin dashboard
                    navigate('/admin/dashboard');
                } else {
                    throw new Error('Not authorized as admin');
                }
            } catch (error) {
                console.error('Admin login error:', error);
                let errorMessage = 'Failed to login as admin. Please check your credentials.';

                if (error.message === 'Not authorized as admin') {
                    errorMessage = 'This account does not have admin privileges.';
                } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Invalid email or password.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many login attempts. Please try again later.';
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled.';
                }

                setErrors({
                    ...errors,
                    adminForm: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);

            // Create a Google provider instance
            const provider = new GoogleAuthProvider();

            // Sign in with popup
            const result = await signInWithPopup(auth, provider);

            // For demo purposes - we'd normally check admin status in Firestore or similar
            const user = result.user;

            // Assume non-admin for Google login for now
            navigate('/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            setErrors({
                ...errors,
                homeownerForm: 'Failed to sign in with Google. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <span className="fw-bold">Home Bot</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/#features">Features</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/#how-it-works">How it Works</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/#testimonials">Testimonials</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/#dashboard">Dashboard</Link>
                            </li>
                        </ul>
                        <div className="ms-lg-3 mt-3 mt-lg-0">
                            <Link to="/login" className="btn btn-primary rounded-pill px-4">Login</Link>
                            <Link to="/signup" className="btn btn-outline rounded-pill px-4 ms-2">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Login Section */}
            <section id="signup" className="min-vh-100 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="signup-content text-center mb-4">
                                <h1 className="display-5 fw-bold mb-4">Welcome Back</h1>
                                <p className="lead">Login to your Home Bot account to control your smart home.</p>
                            </div>

                            <div className="card glass border-0">
                                {/* Tab navigation */}
                                <div className="login-tabs">
                                    <button
                                        className={`tab-btn ${activeTab === 'homeowner' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('homeowner')}
                                    >
                                        Homeowner Login
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('admin')}
                                    >
                                        Super Admin Login
                                    </button>
                                </div>

                                <div className="card-body p-4 p-md-5">
                                    {/* Homeowner Login Form */}
                                    {activeTab === 'homeowner' && (
                                        <form className="login-form" onSubmit={handleHomeownerSubmit}>
                                            {errors.homeownerForm && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errors.homeownerForm}
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <label htmlFor="homeownerEmail" className="form-label">Email address</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.homeownerEmail ? 'is-invalid' : ''}`}
                                                    id="homeownerEmail"
                                                    name="email"
                                                    value={homeownerData.email}
                                                    onChange={handleHomeownerChange}
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                                {errors.homeownerEmail && <div className="invalid-feedback">{errors.homeownerEmail}</div>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="homeownerPassword" className="form-label">Password</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${errors.homeownerPassword ? 'is-invalid' : ''}`}
                                                        id="homeownerPassword"
                                                        name="password"
                                                        value={homeownerData.password}
                                                        onChange={handleHomeownerChange}
                                                        placeholder="Enter your password"
                                                        required
                                                    />
                                                    <span
                                                        className="input-group-text toggle-password"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                    </span>
                                                </div>
                                                {errors.homeownerPassword && <div className="invalid-feedback">{errors.homeownerPassword}</div>}
                                            </div>

                                            <div className="d-flex justify-content-between mb-4">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="homeownerRememberMe"
                                                        name="rememberMe"
                                                        checked={homeownerData.rememberMe}
                                                        onChange={handleHomeownerChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="homeownerRememberMe">
                                                        Remember me
                                                    </label>
                                                </div>
                                                <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                                            </div>

                                            <div className="d-grid gap-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg rounded-pill"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Logging in...
                                                        </>
                                                    ) : (
                                                        'Login'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-lg rounded-pill google-btn"
                                                    onClick={handleGoogleLogin}
                                                    disabled={isLoading}
                                                >
                                                    <img src="/src/assets/images/google-icon.svg" alt="Google" width="18" height="18" className="me-2" />
                                                    Sign in with Google
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Admin Login Form */}
                                    {activeTab === 'admin' && (
                                        <form className="login-form" onSubmit={handleAdminSubmit}>
                                            {errors.adminForm && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errors.adminForm}
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <label htmlFor="adminEmail" className="form-label">Admin Email</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.adminEmail ? 'is-invalid' : ''}`}
                                                    id="adminEmail"
                                                    name="email"
                                                    value={adminData.email}
                                                    onChange={handleAdminChange}
                                                    placeholder="Enter admin email address"
                                                    required
                                                />
                                                {errors.adminEmail && <div className="invalid-feedback">{errors.adminEmail}</div>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="adminPassword" className="form-label">Password</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${errors.adminPassword ? 'is-invalid' : ''}`}
                                                        id="adminPassword"
                                                        name="password"
                                                        value={adminData.password}
                                                        onChange={handleAdminChange}
                                                        placeholder="Enter admin password"
                                                        required
                                                    />
                                                    <span
                                                        className="input-group-text toggle-password"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                    </span>
                                                </div>
                                                {errors.adminPassword && <div className="invalid-feedback">{errors.adminPassword}</div>}
                                            </div>

                                            <div className="d-flex justify-content-between mb-4">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="adminRememberMe"
                                                        name="rememberMe"
                                                        checked={adminData.rememberMe}
                                                        onChange={handleAdminChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="adminRememberMe">
                                                        Remember me
                                                    </label>
                                                </div>
                                                <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                                            </div>

                                            <div className="d-grid">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg rounded-pill"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Logging in...
                                                        </>
                                                    ) : (
                                                        'Login as Admin'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'homeowner' && (
                                        <div className="text-center mt-4">
                                            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-4 bg-dark-sienna text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <p className="mb-0">&copy; 2025 Home Bot. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item"><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                                <li className="list-inline-item"><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default LoginPage;
