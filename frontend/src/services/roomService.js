// frontend/src/services/roomService.js
import apiService from './api';

/**
 * Service for room-related API calls
 */
class RoomService {
    /**
     * Get all rooms
     * @returns {Promise<Array>} - Array of rooms
     */
    async getRooms() {
        try {
            const response = await apiService.get('rooms');
            return response;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            // Rethrow to allow component to handle fallback
            throw error;
        }
    }

    /**
     * Create a new room
     * @param {Object} roomData - Room data to create
     * @returns {Promise<Object>} - Created room
     */
    async createRoom(roomData) {
        try {
            return await apiService.post('rooms', roomData);
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }

    /**
     * Update a room
     * @param {string} id - Room ID
     * @param {Object} roomData - Updated room data
     * @returns {Promise<Object>} - Updated room
     */
    async updateRoom(id, roomData) {
        try {
            return await apiService.put(`rooms/${id}`, roomData);
        } catch (error) {
            console.error(`Error updating room ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a room
     * @param {string} id - Room ID
     * @returns {Promise<Object>} - API response
     */
    async deleteRoom(id) {
        try {
            return await apiService.delete(`rooms/${id}`);
        } catch (error) {
            console.error(`Error deleting room ${id}:`, error);
            throw error;
        }
    }
}

// Create and export singleton instance
const roomService = new RoomService();
export default roomService;
