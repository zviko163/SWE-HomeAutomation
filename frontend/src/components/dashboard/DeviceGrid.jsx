import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext'; 
import { socketEvents } from '../../utils/socketEvents';
import deviceService from '../../services/deviceService';

const DeviceGrid = ({ selectedRoom, devices = [] }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localDevices, setLocalDevices] = useState([]);

   
    const { socket, isConnected } = useSocket();

    // Sample device data
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
            id: 'light-2',
            name: 'Bedside Lamp',
            type: 'light',
            room: 'Bedroom',
            status: 'online',
            state: { on: false, brightness: 0 },
            icon: 'fa-lightbulb'
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


    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setLoading(true);
                let devicesData;

                // Fetch devices based on room selection
                if (selectedRoom !== 'All Rooms') {
                    devicesData = await deviceService.getDevicesByRoom(selectedRoom);
                } else {
                    devicesData = await deviceService.getDevices();
                }

                setLocalDevices(devicesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching devices:', error);
                // Fallback to sample devices if API call fails
                setLocalDevices(sampleDevices);
                setLoading(false);
                setError('Failed to load devices');
            }
        };

        fetchDevices();
    }, [selectedRoom]);

    // Set up socket listeners when socket is available
    useEffect(() => {

        if (!socket || !isConnected) return;

        // Listen for device state changes
        const handleDeviceStateChange = (data) => {
            setLocalDevices(prevDevices =>
                prevDevices.map(device =>
                    device.id === data.id
                        ? { ...device, state: { ...device.state, ...data.state } }
                        : device
                )
            );
        };

        // Listen for new devices
        const handleDeviceAdded = (device) => {
            // Add the new device if it belongs to the selected room or if 'All Rooms' is selected
            if (selectedRoom === 'All Rooms' || device.room === selectedRoom) {
                setLocalDevices(prevDevices => [...prevDevices, device]);
            }
        };

        // Listen for device updates
        const handleDeviceUpdated = (updatedDevice) => {
            setLocalDevices(prevDevices =>
                prevDevices.map(device =>
                    device.id === updatedDevice.id
                        ? updatedDevice
                        : device
                )
            );
        };

        // Listen for device removals
        const handleDeviceRemoved = (data) => {
            setLocalDevices(prevDevices =>
                prevDevices.filter(device => device.id !== data.id)
            );
        };

        // Register event listeners
        socket.on(socketEvents.DEVICE_STATE_CHANGED, handleDeviceStateChange);
        socket.on(socketEvents.DEVICE_ADDED, handleDeviceAdded);
        socket.on(socketEvents.DEVICE_UPDATED, handleDeviceUpdated);
        socket.on(socketEvents.DEVICE_REMOVED, handleDeviceRemoved);

        // Join room-specific channel if a specific room is selected
        if (selectedRoom !== 'All Rooms') {
            // Convert room name to lowercase with dashes for channel name
            const roomChannel = selectedRoom.replace(/\s+/g, '-').toLowerCase();
            socket.emit('join-room', roomChannel);
        }

        // Cleanup listeners on component unmount
        return () => {
            socket.off(socketEvents.DEVICE_STATE_CHANGED, handleDeviceStateChange);
            socket.off(socketEvents.DEVICE_ADDED, handleDeviceAdded);
            socket.off(socketEvents.DEVICE_UPDATED, handleDeviceUpdated);
            socket.off(socketEvents.DEVICE_REMOVED, handleDeviceRemoved);
        };
    }, [socket, isConnected, selectedRoom]);

    // Toggle device state (this function should now emit an event through the API)
    const toggleDevice = async (deviceId) => {
        try {
            // Find the device
            const device = localDevices.find(d => d.id === deviceId || d._id === deviceId);
            if (!device) return;

            // Create new state based on device type
            let newState;
            switch (device.type) {
                case 'light':
                    newState = { ...device.state, on: !device.state.on };
                    break;
                case 'thermostat':
                    newState = { ...device.state, on: !device.state.on };
                    break;
                case 'fan':
                    newState = { ...device.state, on: !device.state.on };
                    break;
                case 'door':
                    newState = { ...device.state, locked: !device.state.locked };
                    break;
                case 'speaker':
                    newState = { ...device.state, on: !device.state.on };
                    break;
                default:
                    newState = { ...device.state, on: !device.state.on };
            }

            // Update local state
            setLocalDevices(prevDevices =>
                prevDevices.map(d =>
                    (d.id === deviceId || d._id === deviceId)
                        ? { ...d, state: newState }
                        : d
                )
            );

            // Send update to backend
            await deviceService.updateDeviceState(deviceId, newState);

            // If socket is connected, emit the state change
            if (socket && isConnected) {
                socket.emit(socketEvents.DEVICE_STATE_CHANGE, {
                    id: deviceId,
                    state: newState,
                    room: device.room
                });
            }
        } catch (error) {
            console.error('Error toggling device:', error);
            // Revert the state change if there was an error
            setLocalDevices(prevDevices =>
                prevDevices.map(d =>
                    (d.id === deviceId || d._id === deviceId)
                        ? { ...d, state: device.state }
                        : d
                )
            );
        }
    };

    // Render the device grid
    return (
        <div className="device-grid">
            {loading ? (
                <div className="loading-state">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="error-state">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            ) : localDevices.length === 0 ? (
                <div className="no-devices-state">
                    <i className="fas fa-plug"></i>
                    <p>No devices found in this room</p>
                </div>
            ) : (
                <div className="devices-grid">
                    {localDevices.map(device => (
                        <div key={device.id || device._id} className="device-card glass-card">
                            <div className="device-icon">
                                <i className={`fas ${device.icon}`}></i>
                            </div>
                            <div className="device-info">
                                <h3>{device.name}</h3>
                                <p className="device-room">{device.room}</p>
                                <p className="device-status">
                                    <span className={`status-indicator ${device.status}`}></span>
                                    {device.status}
                                </p>
                            </div>
                            <div className="device-controls">
                                <button
                                    className={`toggle-btn ${device.state.on || device.state.locked ? 'active' : ''}`}
                                    onClick={() => toggleDevice(device.id || device._id)}
                                >
                                    <i className={`fas ${device.state.on || device.state.locked ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Filter devices by room
    const filteredDevices = selectedRoom === 'All Rooms'
        ? localDevices
        : localDevices.filter(device => device.room === selectedRoom);

    // Loading state
    if (loading) {
        return (
            <div className="devices-loading">
                <div className="loading-pulse"></div>
                <p>Loading devices...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="devices-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{error}</p>
            </div>
        );
    }

    // Empty state
    if (filteredDevices.length === 0) {
        return (
            <div className="devices-empty">
                <i className="fas fa-plug"></i>
                <h3>No devices in {selectedRoom}</h3>
                <p>Add devices to this room or select a different room.</p>
            </div>
        );
    }

    return (
        <div className="device-grid">
            {filteredDevices.map(device => (
                <div
                    key={device._id || device.id || `device-${Math.random()}`}
                    className={`device-card ${device.state.on ? 'device-on' : 'device-off'}`}
                >
                    <div className="device-header">
                        <div className="device-icon">
                            <i className={`fas ${device.icon}`}></i>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={device.state.on || false}
                                onChange={() => toggleDevice(device._id || device.id)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="device-info">
                        <h3 className="device-name">{device.name}</h3>
                        <p className="device-room">{device.room}</p>
                    </div>

                    <div className="device-details">
                        {device.type === 'light' && device.state.on && (
                            <div className="device-brightness">
                                <span>{device.state.brightness}%</span>
                                <div className="brightness-bar">
                                    <div
                                        className="brightness-level"
                                        style={{ width: `${device.state.brightness}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {device.type === 'thermostat' && (
                            <div className="device-temperature">
                                <span>{device.state.temperature}°C</span>
                                <span className="device-mode">{device.state.mode}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeviceGrid;
