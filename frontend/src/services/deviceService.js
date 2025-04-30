// frontend/src/services/deviceService.js
import apiService from './api';

/**
 * Service for device-related API calls
 */
class DeviceService {
    /**
     * Get all devices with optional filtering
     * @param {Object} filters - Optional filters (room, type, status)
     * @returns {Promise<Array>} - Array of devices
     */
    async getDevices(filters = {}) {
        try {
            const response = await apiService.get('devices', filters);
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    }

    /**
     * Get a single device by ID
     * @param {string} id - Device ID
     * @returns {Promise<Object>} - Device object
     */
    async getDeviceById(id) {
        try {
            return await apiService.get(`devices/${id}`);
        } catch (error) {
            console.error(`Error fetching device ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get devices for a specific room
     * @param {string} roomName - Name of the room
     * @returns {Promise<Array>} - Array of devices in the room
     */
    async getDevicesByRoom(roomName) {
        try {
            const response = await apiService.get(`devices/room/${roomName}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching devices for room ${roomName}:`, error);
            throw error;
        }
    }

    /**
     * Create a new device
     * @param {Object} deviceData - Device data
     * @returns {Promise<Object>} - Created device
     */
    async createDevice(deviceData) {
        try {
            return await apiService.post('devices', deviceData);
        } catch (error) {
            console.error('Error creating device:', error);
            // Add better error handling
            if (error.message.includes('Network error')) {
                throw new Error('Unable to connect to server. Please check your connection and try again.');
            }
            throw error;
        }
    }

    /**
     * Update a device
     * @param {string} id - Device ID
     * @param {Object} deviceData - Updated device data
     * @returns {Promise<Object>} - Updated device
     */
    async updateDevice(id, deviceData) {
        try {
            return await apiService.put(`devices/${id}`, deviceData);
        } catch (error) {
            console.error(`Error updating device ${id}:`, error);
            throw error;
        }
    }

    /**
     * Update device state (on/off, brightness, etc.)
     * @param {string} id - Device ID
     * @param {Object} stateData - State data to update
     * @returns {Promise<Object>} - Updated device
     */
    async updateDeviceState(id, stateData) {
        try {
            return await apiService.put(`devices/${id}/state`, stateData);
        } catch (error) {
            console.error(`Error updating device ${id} state:`, error);
            throw error;
        }
    }

    /**
     * Delete a device
     * @param {string} id - Device ID
     * @returns {Promise<Object>} - API response
     */
    async deleteDevice(id) {
        try {
            return await apiService.delete(`devices/${id}`);
        } catch (error) {
            console.error(`Error deleting device ${id}:`, error);
            throw error;
        }
    }
}

// Create and export singleton instance
const deviceService = new DeviceService();
export default deviceService;
