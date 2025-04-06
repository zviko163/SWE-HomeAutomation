// Updated DeviceGrid.jsx to accept devices from props

import React, { useState, useEffect } from 'react';

const DeviceGrid = ({ selectedRoom, devices = [] }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localDevices, setLocalDevices] = useState([]);

    useEffect(() => {
        // If devices are provided via props, use them
        if (devices.length > 0) {
            setLocalDevices(devices);
            setLoading(false);
        } else {
            // Otherwise, fetch sample data (for backward compatibility)
            const fetchDevices = async () => {
                try {
                    setLoading(true);

                    // Simulate API loading time
                    await new Promise(resolve => setTimeout(resolve, 1000));

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
                        },
                        {
                            id: 'camera-1',
                            name: 'Security Camera',
                            type: 'camera',
                            room: 'Office',
                            status: 'online',
                            state: { on: true, recording: false },
                            icon: 'fa-video'
                        }
                    ];

                    setLocalDevices(sampleDevices);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching devices:', error);
                    setError('Failed to load devices');
                    setLoading(false);
                }
            };

            fetchDevices();
        }
    }, [devices]);

    // Toggle device state
    const toggleDevice = (id) => {
        setLocalDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id
                    ? { ...device, state: { ...device.state, on: !device.state.on } }
                    : device
            )
        );
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
                    key={device.id}
                    className={`device-card ${device.state.on ? 'device-on' : 'device-off'}`}
                >
                    <div className="device-header">
                        <div className="device-icon">
                            <i className={`fas ${device.icon}`}></i>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={device.state.on}
                                onChange={() => toggleDevice(device.id)}
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
