// frontend/src/components/dashboard/AutomationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceAddModal from './DeviceAddModal';

const AutomationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('schedules'); // 'schedules', 'rooms', 'groups'
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Sample days for scheduling
    const days = [
        { id: 'mon', name: 'Mon', selected: false },
        { id: 'tue', name: 'Tue', selected: false },
        { id: 'wed', name: 'Wed', selected: false },
        { id: 'thu', name: 'Thu', selected: false },
        { id: 'fri', name: 'Fri', selected: false },
        { id: 'sat', name: 'Sat', selected: false },
        { id: 'sun', name: 'Sun', selected: false }
    ];

    // Fetch sample data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Sample Devices Data
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
                    },
                    {
                        id: 'speaker-1',
                        name: 'Smart Speaker',
                        type: 'speaker',
                        room: 'Living Room',
                        status: 'online',
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
                        state: { locked: true },
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

                // Sample Schedules
                const sampleSchedules = [
                    {
                        id: 'schedule-1',
                        name: 'Morning Lights',
                        deviceIds: ['light-1', 'light-3'],
                        timeOn: '07:00',
                        timeOff: '08:30',
                        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
                        active: true,
                        color: '#F2FF66' // Primary color
                    },
                    {
                        id: 'schedule-2',
                        name: 'Evening Mode',
                        deviceIds: ['light-1', 'light-2', 'thermostat-1'],
                        timeOn: '18:00',
                        timeOff: '22:30',
                        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                        active: true,
                        color: '#C0B395' // Secondary color
                    },
                    {
                        id: 'schedule-3',
                        name: 'Weekend Comfort',
                        deviceIds: ['thermostat-1', 'speaker-1'],
                        timeOn: '09:30',
                        timeOff: '23:00',
                        days: ['sat', 'sun'],
                        active: false,
                        color: '#406354' // Dark green color
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
                    },
                    {
                        id: 'office',
                        name: 'Office',
                        deviceCount: 0,
                        icon: 'fa-briefcase'
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

                setDevices(sampleDevices);
                setSchedules(sampleSchedules);
                setRooms(sampleRooms);
                setDeviceGroups(sampleGroups);
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

    // Toggle schedule active state
    const toggleScheduleActive = (scheduleId) => {
        setSchedules(prevSchedules =>
            prevSchedules.map(schedule =>
                schedule.id === scheduleId
                    ? { ...schedule, active: !schedule.active }
                    : schedule
            )
        );
    };

    // Handle schedule selection
    const handleScheduleClick = (schedule) => {
        if (selectedSchedule && selectedSchedule.id === schedule.id) {
            setSelectedSchedule(null);
            setEditMode(false);
        } else {
            setSelectedSchedule(schedule);
            setEditMode(false);
        }
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
                    className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('schedules');
                        setSelectedSchedule(null);
                        setSelectedRoom(null);
                        setSelectedGroup(null);
                        setEditMode(false);
                    }}
                >
                    <i className="fas fa-clock"></i>
                    <span>Schedules</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('rooms');
                        setSelectedSchedule(null);
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
                        setSelectedSchedule(null);
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

    // Render schedules tab
    const renderSchedulesTab = () => {
        return (
            <div className="schedules-container">
                <div className="section-header">
                    <h2>Your Schedules</h2>
                    <button className="add-btn">
                        <i className="fas fa-plus"></i>
                        <span>Add Schedule</span>
                    </button>
                </div>

                <div className="schedules-grid">
                    {schedules.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-calendar-alt"></i>
                            <h3>No Schedules Yet</h3>
                            <p>Create a schedule to automate your devices</p>
                        </div>
                    ) : (
                        schedules.map(schedule => (
                            <div
                                key={schedule.id}
                                className={`schedule-card glass-card ${selectedSchedule && selectedSchedule.id === schedule.id ? 'selected' : ''} ${schedule.active ? 'active' : 'inactive'}`}
                                onClick={() => handleScheduleClick(schedule)}
                            >
                                <div className="schedule-header" style={{ borderColor: schedule.color }}>
                                    <div className="schedule-name">{schedule.name}</div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={schedule.active}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleScheduleActive(schedule.id);
                                            }}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="schedule-times">
                                    <div className="time-block">
                                        <span className="time-label">ON</span>
                                        <span className="time-value">{schedule.timeOn}</span>
                                    </div>
                                    <div className="time-divider">
                                        <i className="fas fa-long-arrow-alt-right"></i>
                                    </div>
                                    <div className="time-block">
                                        <span className="time-label">OFF</span>
                                        <span className="time-value">{schedule.timeOff}</span>
                                    </div>
                                </div>

                                <div className="schedule-days">
                                    {days.map(day => (
                                        <div
                                            key={day.id}
                                            className={`day-circle ${schedule.days.includes(day.id) ? 'active' : ''}`}
                                        >
                                            {day.name[0]}
                                        </div>
                                    ))}
                                </div>

                                <div className="schedule-devices">
                                    <span className="devices-count">
                                        <i className="fas fa-plug"></i> {schedule.deviceIds.length} devices
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedSchedule && (
                    <div className="schedule-detail glass-card">
                        <div className="detail-header">
                            <h3>{selectedSchedule.name}</h3>
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
                                <h4>Time Settings</h4>
                                <div className="time-settings">
                                    <div className="time-field">
                                        <label>On Time</label>
                                        {editMode ? (
                                            <input type="time" value={selectedSchedule.timeOn} />
                                        ) : (
                                            <div className="time-display">{selectedSchedule.timeOn}</div>
                                        )}
                                    </div>
                                    <div className="time-field">
                                        <label>Off Time</label>
                                        {editMode ? (
                                            <input type="time" value={selectedSchedule.timeOff} />
                                        ) : (
                                            <div className="time-display">{selectedSchedule.timeOff}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Active Days</h4>
                                <div className="days-selection">
                                    {days.map(day => (
                                        <div
                                            key={day.id}
                                            className={`day-btn ${selectedSchedule.days.includes(day.id) ? 'active' : ''}`}
                                        >
                                            {day.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Devices ({selectedSchedule.deviceIds.length})</h4>
                                <div className="devices-list">
                                    {devices
                                        .filter(device => selectedSchedule.deviceIds.includes(device.id))
                                        .map(device => (
                                            <div key={device.id} className="device-item">
                                                <div className="device-icon">
                                                    <i className={`fas ${device.icon}`}></i>
                                                </div>
                                                <div className="device-info">
                                                    <div className="device-name">{device.name}</div>
                                                    <div className="device-room">{device.room}</div>
                                                </div>
                                                {editMode && (
                                                    <button className="remove-device-btn">
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    }
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
                                                        checked={device.state.on}
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
            case 'schedules':
                return renderSchedulesTab();
            case 'rooms':
                return renderRoomsTab();
            case 'groups':
                return renderGroupsTab();
            default:
                return renderSchedulesTab();
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
                    <button className="nav-item">
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
                    <button className="nav-item">
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
                <button className="nav-item">
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
