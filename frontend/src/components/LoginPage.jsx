// frontend/src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/signup.css'; // We'll reuse the signup CSS
import { auth } from '../firebase';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

const LoginPage = () => {
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const isValid = validateForm();

        if (isValid) {
            try {
                setIsLoading(true);

                // Sign in with email and password using Firebase
                await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

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
                    form: errorMessage
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
            await signInWithPopup(auth, provider);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            setErrors({
                ...errors,
                form: 'Failed to sign in with Google. Please try again.'
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
                            <div className="signup-content text-center mb-5">
                                <h1 className="display-5 fw-bold mb-4">Welcome Back</h1>
                                <p className="lead">Login to your Home Bot account to control your smart home.</p>
                            </div>

                            <div className="card glass border-0">
                                <div className="card-body p-4 p-md-5">
                                    <form className="signup-form" onSubmit={handleSubmit}>
                                        {errors.form && (
                                            <div className="alert alert-danger" role="alert">
                                                {errors.form}
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <label htmlFor="email" className="form-label">Email address</label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email address"
                                                required
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
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
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>

                                        <div className="d-flex justify-content-between mb-4">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    checked={formData.rememberMe}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="rememberMe">
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

                                    <div className="text-center mt-4">
                                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                                    </div>
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
