import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <h1 className="mb-4">Welcome to Your Dashboard</h1>
                    <p className="lead mb-4">Hello, {currentUser?.displayName || currentUser?.email || 'User'}!</p>
                    <p className="mb-4">We're currently building an amazing dashboard experience for you!</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                        <button onClick={handleLogout} className="btn btn-outline-danger">Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
