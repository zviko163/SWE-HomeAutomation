import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/signup.css';
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';



const SignupPage = () => {
    // Existing password toggle states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Add form data state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    // Add validation error states
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    // Add navigate for redirection after signup
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Form validation function
    const validateForm = () => {
        const newErrors = {};

        // Validate name
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Name is required';
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Enhanced password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must include at least one uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must include at least one lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must include at least one number';
        } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
            newErrors.password = 'Password must include at least one special character';
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate terms
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    // Handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const isValid = validateForm();

        if (isValid) {
            try {
                setIsLoading(true);

                // Create user with email and password using Firebase
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                const user = userCredential.user;

                // Update the user profile with the name
                await updateProfile(user, {
                    displayName: formData.fullName
                });

                console.log('Signup successful!', user);

                // Redirect to dashboard
                navigate('/dashboard');
                // Update your error handling in handleSubmit
            } catch (error) {
                console.error('Signup error:', error);
                let errorMessage = 'Failed to create account. Please try again.';

                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already in use.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Password is too weak. Use at least 6 characters.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'The email address is invalid.';
                } else if (error.code === 'auth/operation-not-allowed') {
                    errorMessage = 'Email/Password sign-up is not enabled. Please contact support.';
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

    const handleGoogleSignup = async () => {
        try {
            setIsLoading(true);

            // Create a Google provider instance
            const provider = new GoogleAuthProvider();

            // Sign in with popup
            const result = await signInWithPopup(auth, provider);

            // The signed-in user info
            const user = result.user;
            console.log('Google signup successful!', user);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Google signup error:', error);
            setErrors({
                ...errors,
                form: 'Failed to sign up with Google. Please try again.'
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
                            <Link to="/login" className="btn btn-outline rounded-pill px-4">Login</Link>
                            <Link to="/signup" className="btn btn-primary rounded-pill px-4 ms-2">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Signup Section */}
            <section id="signup" className="min-vh-100 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="signup-content text-center mb-5">
                                <h1 className="display-5 fw-bold mb-4">Join Home Bot</h1>
                                <p className="lead">Create your account and start transforming your home into a smart living space.</p>
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
                                            <label htmlFor="fullName" className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                        </div>

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
                                                    placeholder="Create a password"
                                                    required
                                                />
                                                <span
                                                    className="input-group-text toggle-password"
                                                    onClick={() => togglePasswordVisibility('password')}
                                                >
                                                    <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                </span>
                                            </div>
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            <div className="form-text">Use 8+ characters with a mix of letters, numbers & symbols</div>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm your password"
                                                    required
                                                />
                                                <span
                                                    className="input-group-text toggle-password"
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                >
                                                    <i className={`fa ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                </span>
                                            </div>
                                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                        </div>

                                        <div className="mb-4 form-check">
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                                                id="terms"
                                                name="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="terms">
                                                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                            </label>
                                            {errors.agreeToTerms && <div className="invalid-feedback">{errors.agreeToTerms}</div>}
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
                                                        Creating Account...
                                                    </>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-dark btn-lg rounded-pill google-btn"
                                                onClick={handleGoogleSignup}
                                                disabled={isLoading}
                                            >
                                                <img src="/src/assets/images/google-icon.svg" alt="Google" width="18" height="18" className="me-2" />
                                                Sign up with Google
                                            </button>
                                        </div>
                                    </form>

                                    <div className="text-center mt-4">
                                        <p>Already have an account? <Link to="/login">Login</Link></p>
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

export default SignupPage;
