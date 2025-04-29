import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext'; 
import { socketEvents } from '../utils/socketEvents';

import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import WeatherWidget from './dashboard/WeatherWidget';
import EnergyUsage from './dashboard/EnergyUsage';
import QuickRoutines from './dashboard/QuickRoutines';
import DeviceGrid from './dashboard/DeviceGrid';
import RoomFilter from './dashboard/RoomFilter';
import DeviceAddModal from './dashboard/DeviceAddModal';
import ProfilePage from './dashboard/ProfilePage';
import NotificationsPopup from './dashboard/NotificationsPopup';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('All Rooms');
    const navigate = useNavigate();

    // State for managing devices
    const [devices, setDevices] = useState([]);

    // State for controlling modal visibility
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // State variables for notifications
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Sample fallback notifications
    const sampleNotifications = [
        {
            id: 1,
            message: "Temperature in Living Room is above normal",
            time: "5 minutes ago",
            read: false,
            icon: "fa-temperature-high"
        },
        {
            id: 2,
            message: "Front door was opened",
            time: "20 minutes ago",
            read: false,
            icon: "fa-door-open"
        },
        {
            id: 3,
            message: "Energy usage reduced by 10% this week",
            time: "1 hour ago",
            read: true,
            icon: "fa-bolt"
        }
    ];

    const [notifications, setNotifications] = useState([]);
    const { socket, isConnected } = useSocket();

    // Socket.io notification listener
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Handle new notifications
        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
        };

        // Register event listener
        socket.on(socketEvents.NOTIFICATION_NEW, handleNewNotification);

        // Cleanup listener on component unmount
        return () => {
            socket.off(socketEvents.NOTIFICATION_NEW, handleNewNotification);
        };
    }, [socket, isConnected]);

    // Toggle notifications popup
    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    // Fallback sample devices
    const sampleDevices = [
        {
            id: 'light-1',
            name: 'Ceiling Light',
            type: 'light',
            room: 'Living Room',
            status: 'online',
            state: { on: true, brightness: 80 },
            icon: 'fa-lightbulb'
        },
        {
            id: 'thermostat-1',
            name: 'Smart Thermostat',
            type: 'thermostat',
            room: 'Living Room',
            status: 'online',
            state: { on: true, temperature: 22, mode: 'heat' },
            icon: 'fa-temperature-high'
        }
    ];

    useEffect(() => {
        const hour = new Date().getHours();
        const greeting =
            hour < 12 ? 'Good Morning' :
                hour < 18 ? 'Good Afternoon' : 'Good Evening';
        setGreeting(greeting);
    }, []);

    // Set sample devices & notifications as fallback on mount
    useEffect(() => {
        if (devices.length === 0) {
            setDevices(sampleDevices);
        }
    }, [devices]);

    useEffect(() => {
        if (notifications.length === 0) {
            setNotifications(sampleNotifications);
        }
    }, [notifications]);

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

    // Handle adding a new device
    const handleAddDevice = (newDevice) => {
        // In a real app, you would send this to your backend
        // For now, we'll just add it to our local state
        setDevices(prevDevices => [...prevDevices, newDevice]);
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
                    <button className="icon-button notification-btn" onClick={toggleNotifications}>
                        <i className="fas fa-bell"></i>
                        {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
                    </button>
                    <button className="icon-button settings-btn" onClick={() => navigate('/profile')}>
                        <i className="fas fa-cog"></i>
                    </button>
                    <button className="icon-button profile-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>

                    <NotificationsPopup
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                        notifications={notifications}
                    />
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
                    <DeviceGrid selectedRoom={selectedRoom} devices={devices} />
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
                <button
                    className="nav-item add-button"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <i className="fas fa-plus"></i>
                </button>
                <button className="nav-item" onClick={() => navigate('/automation')}>
                    <i className="fas fa-bolt"></i>
                    <span>Automation</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/profile')}>
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </button>
            </nav>

            {/* Device Add Modal */}
            <DeviceAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddDevice={handleAddDevice}
            />
        </div>
    );
};

export default Dashboard;
