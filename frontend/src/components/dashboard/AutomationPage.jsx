
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { socketEvents } from '../../utils/socketEvents';
import DeviceAddModal from './DeviceAddModal';

const AutomationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('rooms'); // 'rooms', 'groups'
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { socket, isConnected } = useSocket();
    const hasLoadedRef = useRef(false);

    // Sample Devices Data
    const sampleDevices = [
        {
            id: 'light-1',
            name: 'Ceiling Light',
            type: 'light',
            room: 'Living Room',
            status: 'online',
            state: { on: false, brightness: 0 },
            icon: 'fa-lightbulb'
        },
        {
            id: 'thermostat-1',
            name: 'Auto-Door',
            type: 'thermostat',
            room: 'Living Room',
            status: 'online',
            state: { on: false, temperature: 22, mode: 'heat' },
            icon: 'fa-door-closed'
        },
        {
            id: 'speaker-1',
            name: 'Smart Speaker',
            type: 'speaker',
            room: 'Living Room',
            status: 'offline',
            state: { on: false, volume: 0 },
            icon: 'fa-volume-up'
        },
        {
            id: 'light-2',
            name: 'Bedside Lamp',
            type: 'light',
            room: 'Bedroom',
            status: 'online',
            state: { on: false, brightness: 0 },
            icon: 'fa-lightbulb'
        },
        {
            id: 'fan-1',
            name: 'Ceiling Fan',
            type: 'fan',
            room: 'Bedroom',
            status: 'online',
            state: { on: false, speed: 0 },
            icon: 'fa-fan'
        },
        {
            id: 'door-1',
            name: 'Front Door',
            type: 'door',
            room: 'Kitchen',
            status: 'online',
            state: { locked: false },
            icon: 'fa-door-closed'
        },
        {
            id: 'light-3',
            name: 'Kitchen Lights',
            type: 'light',
            room: 'Kitchen',
            status: 'online',
            state: { on: false, brightness: 0 },
            icon: 'fa-lightbulb'
        }
    ];

    // Sample Rooms
    const sampleRooms = [
        {
            id: 'living-room',
            name: 'Living Room',
            deviceCount: 3,
            icon: 'fa-couch'
        },
        {
            id: 'bedroom',
            name: 'Bedroom',
            deviceCount: 2,
            icon: 'fa-bed'
        },
        {
            id: 'kitchen',
            name: 'Kitchen',
            deviceCount: 2,
            icon: 'fa-utensils'
        },
        {
            id: 'bathroom',
            name: 'Bathroom',
            deviceCount: 0,
            icon: 'fa-bath'
        }
    ];

    // Sample Device Groups
    const sampleGroups = [
        {
            id: 'group-1',
            name: 'All Lights',
            deviceIds: ['light-1', 'light-2', 'light-3'],
            icon: 'fa-lightbulb',
            color: '#F2FF66' // Primary color
        },
        {
            id: 'group-2',
            name: 'Climate Control',
            deviceIds: ['thermostat-1', 'fan-1'],
            icon: 'fa-temperature-high',
            color: '#406354' // Dark green color
        },
        {
            id: 'group-3',
            name: 'Security',
            deviceIds: ['door-1'],
            icon: 'fa-shield-alt',
            color: '#C0B395' // Secondary color
        }
    ];

    // Socket.io listeners for groups
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Handle group updates
        const handleGroupAdded = (group) => {
            setDeviceGroups(prev => [...prev, group]);
        };

        const handleGroupUpdated = (updatedGroup) => {
            setDeviceGroups(prev =>
                prev.map(group =>
                    group.id === updatedGroup.id
                        ? updatedGroup
                        : group
                )
            );
        };

        const handleGroupRemoved = (data) => {
            setDeviceGroups(prev => prev.filter(group => group.id !== data.id));
        };

        // Register event listeners
        socket.on(socketEvents.GROUP_ADDED, handleGroupAdded);
        socket.on(socketEvents.GROUP_UPDATED, handleGroupUpdated);
        socket.on(socketEvents.GROUP_REMOVED, handleGroupRemoved);

        // Cleanup listeners on component unmount
        return () => {
            socket.off(socketEvents.GROUP_ADDED, handleGroupAdded);
            socket.off(socketEvents.GROUP_UPDATED, handleGroupUpdated);
            socket.off(socketEvents.GROUP_REMOVED, handleGroupRemoved);
        };
    }, [socket, isConnected]);

    // Fetch sample data
    useEffect(() => {
        // Fetch data
        const fetchData = async () => {
            try {
                setLoading(true);

               
                if (devices.length === 0) setDevices(sampleDevices);
                if (rooms.length === 0) setRooms(sampleRooms);
                if (deviceGroups.length === 0) setDeviceGroups(sampleGroups);

                hasLoadedRef.current = true;
                setLoading(false);
            } catch (err) {
                console.error('Error fetching automation data:', err);
                setError('Failed to load automation data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle adding a new device
    const handleAddDevice = (newDevice) => {
        setDevices(prevDevices => [...prevDevices, newDevice]);
    };

    // Handle room selection
    const handleRoomClick = (room) => {
        if (selectedRoom && selectedRoom.id === room.id) {
            setSelectedRoom(null);
        } else {
            setSelectedRoom(room);
        }
    };

    // Handle group selection
    const handleGroupClick = (group) => {
        if (selectedGroup && selectedGroup.id === group.id) {
            setSelectedGroup(null);
            setEditMode(false);
        } else {
            setSelectedGroup(group);
            setEditMode(false);
        }
    };

    // Get devices by room
    const getDevicesByRoom = (roomName) => {
        return devices.filter(device => device.room === roomName);
    };

    // Get devices by group
    const getDevicesByGroup = (groupId) => {
        const group = deviceGroups.find(g => g.id === groupId);
        if (!group) return [];
        return devices.filter(device => group.deviceIds.includes(device.id));
    };

    // Render tab buttons
    const renderTabButtons = () => {
        return (
            <div className="automation-tabs">
                <button
                    className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('rooms');
                        setSelectedRoom(null);
                        setSelectedGroup(null);
                        setEditMode(false);
                    }}
                >
                    <i className="fas fa-home"></i>
                    <span>Rooms</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('groups');
                        setSelectedRoom(null);
                        setSelectedGroup(null);
                        setEditMode(false);
                    }}
                >
                    <i className="fas fa-object-group"></i>
                    <span>Groups</span>
                </button>
            </div>
        );
    };

    // Render rooms tab
    const renderRoomsTab = () => {
        return (
            <div className="rooms-container">
                <div className="section-header">
                    <h2>Manage Rooms</h2>
                    <button className="add-btn">
                        <i className="fas fa-plus"></i>
                        <span>Add Room</span>
                    </button>
                </div>

                <div className="rooms-grid">
                    {rooms.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-home"></i>
                            <h3>No Rooms Yet</h3>
                            <p>Create rooms to organize your devices</p>
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room.id}
                                className={`room-card glass-card ${selectedRoom && selectedRoom.id === room.id ? 'selected' : ''}`}
                                onClick={() => handleRoomClick(room)}
                            >
                                <div className="room-icon">
                                    <i className={`fas ${room.icon}`}></i>
                                </div>
                                <div className="room-name">{room.name}</div>
                                <div className="room-device-count">
                                    <i className="fas fa-plug"></i> {room.deviceCount} devices
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedRoom && (
                    <div className="room-detail glass-card">
                        <div className="detail-header">
                            <h3>{selectedRoom.name}</h3>
                            <div className="detail-actions">
                                <button className="edit-btn">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="delete-btn">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <div className="detail-content">
                            <div className="detail-section">
                                <h4>Devices in {selectedRoom.name}</h4>
                                <div className="devices-list">
                                    {getDevicesByRoom(selectedRoom.name).map(device => (
                                        <div key={device.id} className="device-item">
                                            <div className="device-icon">
                                                <i className={`fas ${device.icon}`}></i>
                                            </div>
                                            <div className="device-info">
                                                <div className="device-name">{device.name}</div>
                                                <div className="device-status">
                                                    <span className={`status-indicator ${device.status}`}></span>
                                                    {device.status}
                                                </div>
                                            </div>
                                            <div className="device-control">
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={device.state.on || device.state.locked}
                                                        onChange={() => handleDeviceToggle(device.id)}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {getDevicesByRoom(selectedRoom.name).length === 0 && (
                                        <div className="no-devices-message">
                                            No devices in this room yet
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="add-device-to-room-btn">
                                <i className="fas fa-plus"></i>
                                <span>Add Device to Room</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render groups tab
    const renderGroupsTab = () => {
        return (
            <div className="groups-container">
                <div className="section-header">
                    <h2>Device Groups</h2>
                    <button className="add-btn">
                        <i className="fas fa-plus"></i>
                        <span>Create Group</span>
                    </button>
                </div>

                <div className="groups-grid">
                    {deviceGroups.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-object-group"></i>
                            <h3>No Groups Yet</h3>
                            <p>Create groups to control multiple devices at once</p>
                        </div>
                    ) : (
                        deviceGroups.map(group => (
                            <div
                                key={group.id}
                                className={`group-card glass-card ${selectedGroup && selectedGroup.id === group.id ? 'selected' : ''}`}
                                onClick={() => handleGroupClick(group)}
                                style={{ borderColor: group.color }}
                            >
                                <div className="group-icon" style={{ backgroundColor: group.color }}>
                                    <i className={`fas ${group.icon}`}></i>
                                </div>
                                <div className="group-name">{group.name}</div>
                                <div className="group-device-count">
                                    <i className="fas fa-plug"></i> {group.deviceIds.length} devices
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedGroup && (
                    <div className="group-detail glass-card">
                        <div className="detail-header" style={{ borderColor: selectedGroup.color }}>
                            <h3>{selectedGroup.name}</h3>
                            <div className="detail-actions">
                                <button
                                    className={`edit-btn ${editMode ? 'active' : ''}`}
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="delete-btn">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <div className="detail-content">
                            <div className="detail-section">
                                <div className="group-controls">
                                    <button className="control-btn">
                                        <i className="fas fa-power-off"></i>
                                        <span>Turn All On</span>
                                    </button>
                                    <button className="control-btn off">
                                        <i className="fas fa-power-off"></i>
                                        <span>Turn All Off</span>
                                    </button>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Devices in Group</h4>
                                <div className="devices-list">
                                    {getDevicesByGroup(selectedGroup.id).map(device => (
                                        <div key={device.id} className="device-item">
                                            <div className="device-icon">
                                                <i className={`fas ${device.icon}`}></i>
                                            </div>
                                            <div className="device-info">
                                                <div className="device-name">{device.name}</div>
                                                <div className="device-room">{device.room}</div>
                                            </div>
                                            <div className="device-control">
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={device.state.on}
                                                        onChange={() => toggleDevice(device.id)}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                            {editMode && (
                                                <button className="remove-device-btn">
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {editMode && (
                                        <button className="add-device-btn">
                                            <i className="fas fa-plus"></i>
                                            <span>Add Device</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {editMode && (
                                <div className="detail-actions-bottom">
                                    <button className="btn-cancel">Cancel</button>
                                    <button className="btn-save">Save Changes</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'rooms':
                return renderRoomsTab();
            case 'groups':
                return renderGroupsTab();
            default:
                return renderRoomsTab();
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="user-greeting">
                        <h1>Automation</h1>
                        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                </header>

                <main className="dashboard-content">
                    <div className="automation-loading">
                        <div className="loading-pulse"></div>
                        <p>Loading automation data...</p>
                    </div>
                </main>

                {/* Bottom Navigation */}
                <nav className="bottom-nav">
                    <button className="nav-item" onClick={() => navigate('/dashboard')}>
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
                    <button className="nav-item active">
                        <i className="fas fa-bolt"></i>
                        <span>Automation</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/profile')}>
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </button>
                </nav>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="user-greeting">
                        <h1>Automation</h1>
                        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                </header>

                <main className="dashboard-content">
                    <div className="automation-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <h3>Unable to load automation data</h3>
                        <p>{error}</p>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => setLoading(true)}
                        >
                            Try Again
                        </button>
                    </div>
                </main>

                {/* Bottom Navigation */}
                <nav className="bottom-nav">
                    <button className="nav-item" onClick={() => navigate('/dashboard')}>
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
                    <button className="nav-item active">
                        <i className="fas fa-bolt"></i>
                        <span>Automation</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/profile')}>
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </button>
                </nav>
            </div>
        );
    }

    // Main return (normal state)
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-greeting">
                    <h1>Automation</h1>
                    <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="header-actions">
                    <button className="icon-button notification-btn">
                        <i className="fas fa-bell"></i>
                    </button>
                    <button className="icon-button settings-btn">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </header>

            <main className="dashboard-content automation-content">
                {renderTabButtons()}
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => navigate('/dashboard')}>
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
                <button className="nav-item active">
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

export default AutomationPage;


    // Add this function after getDevicesByGroup
    // Add this function to handle HTTP requests to the microcontroller
    const sendDeviceCommand = async (deviceType, command) => {
        try {
            const response = await fetch(`http://192.168.4.1/${deviceType}/${command}`);
            if (!response.ok) {
                throw new Error(`Failed to send command to device: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Error sending device command:', error);
            return false;
        }
    };

    // Update the handleDeviceToggle function
    const handleDeviceToggle = async (deviceId) => {
        try {
            const device = devices.find(d => d.id === deviceId);
            if (!device || device.status === 'offline') return;

            // Determine the new state
            const newState = device.type === 'door'
                ? { ...device.state, locked: !device.state.locked }
                : { ...device.state, on: !device.state.on };

            // Send command to microcontroller based on device type
            let success = false;
            if (device.room === 'Living Room') {
                const command = newState.on ? 'on' : 'off';
                switch (device.type) {
                    case 'light':
                        success = await sendDeviceCommand('light', command);
                        break;
                    case 'thermostat':
                        success = await sendDeviceCommand('door', command);
                        break;
                    default:
                        success = true; // For other device types
                }
            } else {
                success = true; // For devices in other rooms
            }

            if (success) {
                // Update local state
                setDevices(prevDevices =>
                    prevDevices.map(d =>
                        d.id === deviceId
                            ? { ...d, state: newState }
                            : d
                    )
                );

                // Emit socket event if connected
                if (socket && isConnected) {
                    socket.emit(socketEvents.DEVICE_STATE_CHANGE, {
                        deviceId,
                        state: newState,
                        room: device.room
                    });
                }
            }
        } catch (error) {
            console.error('Error toggling device:', error);
        }
    };

    // Use the same function for both rooms and groups
    const toggleDevice = handleDeviceToggle;

    // Update the device rendering in renderRoomsTab
    const renderRoomsTab = () => {
        return (
            <div className="rooms-container">
                <div className="section-header">
                    <h2>Manage Rooms</h2>
                    <button className="add-btn">
                        <i className="fas fa-plus"></i>
                        <span>Add Room</span>
                    </button>
                </div>

                <div className="rooms-grid">
                    {rooms.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-home"></i>
                            <h3>No Rooms Yet</h3>
                            <p>Create rooms to organize your devices</p>
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room.id}
                                className={`room-card glass-card ${selectedRoom && selectedRoom.id === room.id ? 'selected' : ''}`}
                                onClick={() => handleRoomClick(room)}
                            >
                                <div className="room-icon">
                                    <i className={`fas ${room.icon}`}></i>
                                </div>
                                <div className="room-name">{room.name}</div>
                                <div className="room-device-count">
                                    <i className="fas fa-plug"></i> {room.deviceCount} devices
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedRoom && (
                    <div className="room-detail glass-card">
                        <div className="detail-header">
                            <h3>{selectedRoom.name}</h3>
                            <div className="detail-actions">
                                <button className="edit-btn">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="delete-btn">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <div className="detail-content">
                            <div className="detail-section">
                                <h4>Devices in {selectedRoom.name}</h4>
                                <div className="devices-list">
                                    {getDevicesByRoom(selectedRoom.name).map(device => (
                                        <div key={device.id} className="device-item">
                                            <div className="device-icon">
                                                <i className={`fas ${device.icon}`}></i>
                                            </div>
                                            <div className="device-info">
                                                <div className="device-name">{device.name}</div>
                                                <div className="device-status">
                                                    <span className={`status-indicator ${device.status}`}></span>
                                                    {device.status}
                                                </div>
                                            </div>
                                            <div className="device-control">
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={device.state.on}
                                                        onChange={() => toggleDevice(device.id)}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {getDevicesByRoom(selectedRoom.name).length === 0 && (
                                        <div className="no-devices-message">
                                            No devices in this room yet
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="add-device-to-room-btn">
                                <i className="fas fa-plus"></i>
                                <span>Add Device to Room</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Update the device rendering in renderGroupsTab
    const renderGroupsTab = () => {
        return (
            <div className="groups-container">
                <div className="section-header">
                    <h2>Device Groups</h2>
                    <button className="add-btn">
                        <i className="fas fa-plus"></i>
                        <span>Create Group</span>
                    </button>
                </div>

                <div className="groups-grid">
                    {deviceGroups.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-object-group"></i>
                            <h3>No Groups Yet</h3>
                            <p>Create groups to control multiple devices at once</p>
                        </div>
                    ) : (
                        deviceGroups.map(group => (
                            <div
                                key={group.id}
                                className={`group-card glass-card ${selectedGroup && selectedGroup.id === group.id ? 'selected' : ''}`}
                                onClick={() => handleGroupClick(group)}
                                style={{ borderColor: group.color }}
                            >
                                <div className="group-icon" style={{ backgroundColor: group.color }}>
                                    <i className={`fas ${group.icon}`}></i>
                                </div>
                                <div className="group-name">{group.name}</div>
                                <div className="group-device-count">
                                    <i className="fas fa-plug"></i> {group.deviceIds.length} devices
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedGroup && (
                    <div className="group-detail glass-card">
                        <div className="detail-header" style={{ borderColor: selectedGroup.color }}>
                            <h3>{selectedGroup.name}</h3>
                            <div className="detail-actions">
                                <button
                                    className={`edit-btn ${editMode ? 'active' : ''}`}
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="delete-btn">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <div className="detail-content">
                            <div className="detail-section">
                                <div className="group-controls">
                                    <button className="control-btn">
                                        <i className="fas fa-power-off"></i>
                                        <span>Turn All On</span>
                                    </button>
                                    <button className="control-btn off">
                                        <i className="fas fa-power-off"></i>
                                        <span>Turn All Off</span>
                                    </button>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Devices in Group</h4>
                                <div className="devices-list">
                                    {getDevicesByGroup(selectedGroup.id).map(device => (
                                        <div key={device.id} className="device-item">
                                            <div className="device-icon">
                                                <i className={`fas ${device.icon}`}></i>
                                            </div>
                                            <div className="device-info">
                                                <div className="device-name">{device.name}</div>
                                                <div className="device-room">{device.room}</div>
                                            </div>
                                            <div className="device-control">
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={device.state.on}
                                                        onChange={() => toggleDevice(device.id)}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                            {editMode && (
                                                <button className="remove-device-btn">
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {editMode && (
                                        <button className="add-device-btn">
                                            <i className="fas fa-plus"></i>
                                            <span>Add Device</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {editMode && (
                                <div className="detail-actions-bottom">
                                    <button className="btn-cancel">Cancel</button>
                                    <button className="btn-save">Save Changes</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Update the device list rendering to include the toggle function
    const renderDeviceList = (deviceList) => {
        return (
            <div className="devices-list">
                {deviceList.map(device => (
                    <div key={device.id} className="device-item">
                        <div className="device-icon">
                            <i className={`fas ${device.icon}`}></i>
                        </div>
                        <div className="device-info">
                            <div className="device-name">{device.name}</div>
                            <div className="device-room">{device.room}</div>
                            <div className="device-status">
                                <span className={`status-indicator ${device.status}`}></span>
                                {device.status}
                            </div>
                        </div>
                        <div className="device-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={device.state.on}
                                    onChange={() => toggleDevice(device.id)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
