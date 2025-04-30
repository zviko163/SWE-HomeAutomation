// frontend/src/services/scheduleService.js
import apiService from './api';

/**
 * Service for schedule-related API calls
 */
class ScheduleService {
    /**
     * Get all schedules
     * @returns {Promise<Array>} - Array of schedules
     */
    async getSchedules() {
        try {
            const response = await apiService.get('schedules');
            return response.data;
        } catch (error) {
            console.error('Error fetching schedules:', error);
            throw error;
        }
    }

    /**
     * Get a single schedule by ID
     * @param {string} id - Schedule ID
     * @returns {Promise<Object>} - Schedule object
     */
    async getScheduleById(id) {
        try {
            return await apiService.get(`schedules/${id}`);
        } catch (error) {
            console.error(`Error fetching schedule ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new schedule
     * @param {Object} scheduleData - Schedule data
     * @returns {Promise<Object>} - Created schedule
     */
    async createSchedule(scheduleData) {
        try {
            return await apiService.post('schedules', scheduleData);
        } catch (error) {
            console.error('Error creating schedule:', error);
            throw error;
        }
    }

    /**
     * Update a schedule
     * @param {string} id - Schedule ID
     * @param {Object} scheduleData - Updated schedule data
     * @returns {Promise<Object>} - Updated schedule
     */
    async updateSchedule(id, scheduleData) {
        try {
            return await apiService.put(`schedules/${id}`, scheduleData);
        } catch (error) {
            console.error(`Error updating schedule ${id}:`, error);
            throw error;
        }
    }

    /**
     * Toggle schedule active status
     * @param {string} id - Schedule ID
     * @returns {Promise<Object>} - API response
     */
    async toggleSchedule(id) {
        try {
            return await apiService.put(`schedules/${id}/toggle`);
        } catch (error) {
            console.error(`Error toggling schedule ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a schedule
     * @param {string} id - Schedule ID
     * @returns {Promise<Object>} - API response
     */
    async deleteSchedule(id) {
        try {
            return await apiService.delete(`schedules/${id}`);
        } catch (error) {
            console.error(`Error deleting schedule ${id}:`, error);
            throw error;
        }
    }
}

// Create and export singleton instance
const scheduleService = new ScheduleService();
export default scheduleService;
