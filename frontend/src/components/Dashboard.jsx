// frontend/src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import WeatherWidget from './dashboard/WeatherWidget';
import EnergyUsage from './dashboard/EnergyUsage';
import QuickRoutines from './dashboard/QuickRoutines';
import DeviceGrid from './dashboard/DeviceGrid';
import RoomFilter from './dashboard/RoomFilter';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('All Rooms');
    const navigate = useNavigate();

    // Get time-based greeting
    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good Morning';
            if (hour < 18) return 'Good Afternoon';
            return 'Good Evening';
        };

        setGreeting(getGreeting());
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleRoomChange = (room) => {
        setSelectedRoom(room);
    };

    // Get user's display name, fallback to email if name isn't set, or 'User' as last resort
    const userName = currentUser?.displayName?.split(' ')[0] ||
        (currentUser?.email ? currentUser.email.split('@')[0] : 'User');

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <header className="dashboard-header">
                <div className="user-greeting">
                    <h1>{greeting}, {userName}</h1>
                    <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="header-actions">
                    <button className="icon-button notification-btn">
                        <i className="fas fa-bell"></i>
                    </button>
                    <button className="icon-button settings-btn">
                        <i className="fas fa-cog"></i>
                    </button>
                    <button className="icon-button profile-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-content">
                {/* Top Widgets Row */}
                <div className="widgets-row">
                    <WeatherWidget />
                    <EnergyUsage />
                </div>

                {/* Quick Routines Section */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Quick Routines</h2>
                    </div>
                    <QuickRoutines />
                </section>

                {/* Devices Section */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Devices</h2>
                        <RoomFilter selectedRoom={selectedRoom} onRoomChange={handleRoomChange} />
                    </div>
                    <DeviceGrid selectedRoom={selectedRoom} />
                </section>
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <button className="nav-item active">
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/insights')}>
                    <i className="fas fa-chart-bar"></i>
                    <span>Insights</span>
                </button>
                <button className="nav-item add-button">
                    <i className="fas fa-plus"></i>
                </button>
                <button className="nav-item">
                    <i className="fas fa-bolt"></i>
                    <span>Automation</span>
                </button>
                <button className="nav-item">
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default Dashboard;
