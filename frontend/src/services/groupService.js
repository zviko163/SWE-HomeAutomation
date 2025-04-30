// frontend/src/services/groupService.js
import apiService from './api';

/**
 * Service for device group-related API calls
 */
class GroupService {
    /**
     * Get all device groups
     * @returns {Promise<Array>} - Array of device groups
     */
    async getGroups() {
        try {
            const response = await apiService.get('groups');
            return response.data;
        } catch (error) {
            console.error('Error fetching device groups:', error);
            throw error;
        }
    }

    /**
     * Get a single device group by ID
     * @param {string} id - Group ID
     * @returns {Promise<Object>} - Group object
     */
    async getGroupById(id) {
        try {
            return await apiService.get(`groups/${id}`);
        } catch (error) {
            console.error(`Error fetching device group ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new device group
     * @param {Object} groupData - Group data
     * @returns {Promise<Object>} - Created group
     */
    async createGroup(groupData) {
        try {
            return await apiService.post('groups', groupData);
        } catch (error) {
            console.error('Error creating device group:', error);
            throw error;
        }
    }

    /**
     * Update a device group
     * @param {string} id - Group ID
     * @param {Object} groupData - Updated group data
     * @returns {Promise<Object>} - Updated group
     */
    async updateGroup(id, groupData) {
        try {
            return await apiService.put(`groups/${id}`, groupData);
        } catch (error) {
            console.error(`Error updating device group ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a device group
     * @param {string} id - Group ID
     * @returns {Promise<Object>} - API response
     */
    async deleteGroup(id) {
        try {
            return await apiService.delete(`groups/${id}`);
        } catch (error) {
            console.error(`Error deleting device group ${id}:`, error);
            throw error;
        }
    }

    /**
     * Control all devices in a group (turn on/off)
     * @param {string} id - Group ID
     * @param {string} action - 'on' or 'off'
     * @returns {Promise<Object>} - API response
     */
    async controlGroup(id, action) {
        try {
            return await apiService.put(`groups/${id}/control`, { action });
        } catch (error) {
            console.error(`Error controlling device group ${id}:`, error);
            throw error;
        }
    }
}

// Create and export singleton instance
const groupService = new GroupService();
export default groupService;
