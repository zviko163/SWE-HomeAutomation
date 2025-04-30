import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext'; // Add this import
import { socketEvents } from '../../utils/socketEvents';
import deviceService from '../../services/deviceService';

const DeviceGrid = ({ selectedRoom, devices = [] }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localDevices, setLocalDevices] = useState([]);

    // Get socket from context
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

    // Hook to fallback and fetch devices
    // useEffect(() => {

    //     const fetchDevices = async () => {
    //         try {
    //             setLoading(true);

    //             // Try to fetch from API first
    //             try {
    //                 let devicesData;
    //                 if (selectedRoom !== 'All Rooms') {
    //                     // If a specific room is selected, fetch devices for that room
    //                     devicesData = await deviceService.getDevicesByRoom(selectedRoom);
    //                 } else {
    //                     // Otherwise fetch all devices
    //                     devicesData = await deviceService.getDevices();
    //                 }
    //                 setLocalDevices(devicesData);
    //                 setLoading(false);
    //                 return; // Exit if API call successful
    //             } catch (err) {
    //                 console.log('API fetch failed, using fallback data');
    //             }

    //             // If API fails or devices prop is empty, use the sample data
    //             if (devices.length > 0) {
    //                 setLocalDevices(devices);
    //             } else {
    //                 // Use sample devices as fallback
    //                 setLocalDevices(sampleDevices);
    //                 console.log('Using sample device data');
    //             }

    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error in device setup:', error);
    //             setError('Failed to load devices');
    //             setLoading(false);
    //         }
    //     };

    //     fetchDevices();
    // }, [devices, selectedRoom]);
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
            // Find the device using either _id or id
            const device = localDevices.find(d => d._id === deviceId || d.id === deviceId);
            if (!device) return;

            // Use the correct identifier for the API call
            const correctId = device._id || device.id;

            // Determine the new state
            const newState = { on: !device.state.on };

            // Optimistically update UI
            setLocalDevices(prevDevices =>
                prevDevices.map(d =>
                    (d._id === deviceId || d.id === deviceId)
                        ? { ...d, state: { ...d.state, on: newState.on } }
                        : d
                )
            );

            // Call API to update device state
            await deviceService.updateDeviceState(correctId, newState);

        } catch (error) {
            console.error('Error toggling device:', error);

            // Revert optimistic update
            setLocalDevices(prevDevices =>
                prevDevices.map(d =>
                    (d._id === deviceId || d.id === deviceId)
                        ? { ...d, state: { ...d.state, on: !newState.on } }
                        : d
                )
            );
        }
    };

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
