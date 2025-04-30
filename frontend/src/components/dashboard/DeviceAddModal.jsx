// frontend/src/components/dashboard/DeviceAddModal.jsx
import React, { useState, useEffect } from 'react';
import deviceService from '../../services/deviceService';

const DeviceAddModal = ({ isOpen, onClose, onAddDevice }) => {
    // Initial form state
    const initialFormState = {
        name: '',
        type: 'light',
        room: 'Living Room',
        status: 'online', // Default status
    };

    // Form state
    const [formData, setFormData] = useState(initialFormState);

    // Validation errors state
    const [errors, setErrors] = useState({});

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Available device types
    const deviceTypes = [
        { id: 'light', name: 'Light', icon: 'fa-lightbulb' },
        { id: 'thermostat', name: 'Thermostat', icon: 'fa-temperature-high' },
        { id: 'fan', name: 'Fan', icon: 'fa-fan' },
        { id: 'speaker', name: 'Speaker', icon: 'fa-volume-up' },
        { id: 'door', name: 'Door', icon: 'fa-door-closed' },
        { id: 'camera', name: 'Camera', icon: 'fa-video' },
        { id: 'motion_sensor', name: 'Motion Sensor', icon: 'fa-walking' },
        { id: 'window', name: 'Window', icon: 'fa-window-maximize' },
    ];

    // Available rooms
    const rooms = [
        'Living Room',
        'Bedroom',
        'Kitchen',
        'Bathroom',
        'Office',
        'Dining Room',
        'Hallway',
        'Garage',
    ];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error for this field when it's changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Validate name (required)
        if (!formData.name.trim()) {
            newErrors.name = 'Device name is required';
        } else if (formData.name.length > 30) {
            newErrors.name = 'Name must be 30 characters or less';
        }

        // Set errors and return validation result
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare device data
            const deviceData = {
                ...formData,
                id: `${formData.type}-${Date.now()}`, // Generate a unique ID
                state: getDefaultStateForDeviceType(formData.type),
                icon: deviceTypes.find(type => type.id === formData.type)?.icon || 'fa-plug',
            };

            // Instead of simulating a delay, make a real API call using deviceService
            const newDevice = await deviceService.createDevice(deviceData);

            // Call the onAddDevice function with the response from the server
            onAddDevice(newDevice);

            // Reset form and close modal
            setFormData(initialFormState);
            onClose();
        } catch (error) {
            console.error('Error adding device:', error);
            setErrors({
                ...errors,
                submit: 'Failed to add device. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get default state for device type
    const getDefaultStateForDeviceType = (type) => {
        switch (type) {
            case 'light':
                return { on: false, brightness: 100 };
            case 'thermostat':
                return { on: false, temperature: 22, mode: 'heat' };
            case 'fan':
                return { on: false, speed: 0 };
            case 'speaker':
                return { on: false, volume: 50 };
            case 'door':
                return { locked: true };
            case 'camera':
                return { on: false, recording: false };
            case 'motion_sensor':
                return { detected: false, sensitivity: 'medium' };
            case 'window':
                return { open: false };
            default:
                return { on: false };
        }
    };

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormState);
            setErrors({});
        }
    }, [isOpen]);

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="device-modal-overlay">
            <div className="device-modal glass-card">
                <div className="device-modal-header">
                    <h2>Add New Device</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="device-form">
                    {errors.submit && (
                        <div className="error-message">{errors.submit}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Device Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter device name"
                            className={errors.name ? 'error' : ''}
                            disabled={isSubmitting}
                            required
                        />
                        {errors.name && <div className="field-error">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Device Type</label>
                        <div className="device-type-selector">
                            {deviceTypes.map(type => (
                                <div
                                    key={type.id}
                                    className={`device-type-option ${formData.type === type.id ? 'selected' : ''}`}
                                    onClick={() => !isSubmitting && handleInputChange({
                                        target: { name: 'type', value: type.id }
                                    })}
                                >
                                    <i className={`fas ${type.icon}`}></i>
                                    <span>{type.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="room">Room</label>
                        <select
                            id="room"
                            name="room"
                            value={formData.room}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            {rooms.map(room => (
                                <option key={room} value={room}>{room}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Adding...
                                </>
                            ) : (
                                'Add Device'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeviceAddModal;
