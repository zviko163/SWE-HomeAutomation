
import React, { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import deviceService from '../../services/deviceService';

const RoomManageModal = ({ isOpen, onClose, roomToEdit, onRoomChange }) => {
    const initialFormState = {
        name: '',
        icon: 'fa-home'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Available room icons
    const roomIcons = [
        { id: 'fa-home', name: 'Home' },
        { id: 'fa-couch', name: 'Living Room' },
        { id: 'fa-bed', name: 'Bedroom' },
        { id: 'fa-utensils', name: 'Kitchen' },
        { id: 'fa-bath', name: 'Bathroom' },
        { id: 'fa-briefcase', name: 'Office' },
        { id: 'fa-chair', name: 'Dining' },
        { id: 'fa-door-open', name: 'Entrance' },
        { id: 'fa-car', name: 'Garage' }
    ];

    // Load room data if editing
    useEffect(() => {
        if (roomToEdit) {
            setFormData({
                name: roomToEdit.name || '',
                icon: roomToEdit.icon || 'fa-home'
            });
        } else {
            setFormData(initialFormState);
        }

        // Clear any errors or success messages when modal opens/closes
        setErrors({});
        setSuccessMessage('');
    }, [roomToEdit, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleIconSelect = (icon) => {
        setFormData(prev => ({
            ...prev,
            icon
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Room name is required';
        } else if (formData.name.length > 30) {
            newErrors.name = 'Name must be 30 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let result;

            if (roomToEdit && roomToEdit._id) {
                // Update existing room
                result = await roomService.updateRoom(roomToEdit._id, formData);
                setSuccessMessage(`Room "${result.name}" updated successfully!`);
            } else {
                // Create new room
                result = await roomService.createRoom(formData);
                setSuccessMessage(`Room "${result.name}" created successfully!`);
            }

            // Notify parent component about the change
            if (onRoomChange) {
                onRoomChange(result);
            }

            // Close after a brief delay to show success message
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error saving room:', error);
            setErrors({
                ...errors,
                submit: error.message || 'Failed to save room. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!roomToEdit) return;

        // Check if this is a fallback room without a server-side ID
        const isFallbackRoom = !roomToEdit._id;

        if (isFallbackRoom) {
            // Show a message that fallback rooms can't be deleted
            setErrors({
                ...errors,
                submit: 'Fallback rooms cannot be deleted. Please add a new room through the application first.'
            });
            return;
        }

        const confirm = window.confirm(`Are you sure you want to delete "${roomToEdit.name}"? This will also remove all associated devices.`);
        if (!confirm) return;

        setIsSubmitting(true);

        try {
            // First, check if the room has any devices
            const devicesInRoom = await deviceService.getDevicesByRoom(roomToEdit.name);

            if (devicesInRoom.length > 0) {
                // If devices exist, provide a detailed error
                setErrors({
                    ...errors,
                    submit: `Cannot delete room "${roomToEdit.name}". 
                    ${devicesInRoom.length} device(s) are currently in this room. 
                    Please move or delete these devices first.`
                });
                setIsSubmitting(false);
                return;
            }

            // If no devices, proceed with deletion
            await roomService.deleteRoom(roomToEdit._id);
            setSuccessMessage(`Room "${roomToEdit.name}" deleted successfully!`);

            // Notify parent component
            if (onRoomChange) {
                onRoomChange(null, true);
            }

            // Close after a brief delay
            setTimeout(() => {
                onClose();
            }, 1500);
        
        }  catch (error) {
            console.error('Error deleting room:', error);
            let errorMessage = 'Failed to delete room.';

            if (error.response && error.response.status === 400) {
                errorMessage = 'Cannot delete room with associated devices. Please move or delete devices first.';
            } else if (error.response && error.response.status === 404) {
                errorMessage = 'Room not found. It may have been already deleted.';
            }

            setErrors({
                ...errors,
                submit: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="room-modal-overlay">
            <div className="room-modal glass-card">
                <div className="room-modal-header">
                    <h2>{roomToEdit ? 'Edit Room' : 'Add New Room'}</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="room-form">
                    {errors.submit && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {errors.submit}
                        </div>
                    )}

                    {successMessage && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            {successMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Room Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter room name"
                            className={errors.name ? 'error' : ''}
                            disabled={isSubmitting}
                            required
                        />
                        {errors.name && <div className="field-error">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label>Room Icon</label>
                        <div className="room-icon-selector">
                            {roomIcons.map(icon => (
                                <div
                                    key={icon.id}
                                    className={`room-icon-option ${formData.icon === icon.id ? 'selected' : ''}`}
                                    onClick={() => !isSubmitting && handleIconSelect(icon.id)}
                                >
                                    <i className={`fas ${icon.id}`}></i>
                                    <span>{icon.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        {roomToEdit && (
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="spinner"></span>
                                ) : (
                                    <i className="fas fa-trash"></i>
                                )}
                                Delete
                            </button>
                        )}
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
                                    Saving...
                                </>
                            ) : (
                                'Save Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomManageModal;
