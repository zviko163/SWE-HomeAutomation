// frontend/src/services/userService.js

import { getAuth } from 'firebase/auth';
import apiService from './api';

/**
 * Service for user management operations
 */
class UserService {
    /**
     * Get all users (requires admin access)
     * @returns {Promise<Array>} - Array of users
     */
    async getUsers() {
        try {
            console.log('Fetching users from API...');
            const response = await apiService.get('admin/users');
            console.log('User data received:', response);
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);

            // Return a structured error so we can handle it in the component
            throw {
                message: error.message || 'Failed to fetch users',
                isApiError: true,
                originalError: error
            };
        }
    }

    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} - Created user
     */
    async createUser(userData) {
        try {
            return await apiService.post('admin/users', userData);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Update a user
     * @param {string} uid - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object>} - Updated user
     */
    async updateUser(uid, userData) {
        try {
            return await apiService.put(`admin/users/${uid}`, userData);
        } catch (error) {
            console.error(`Error updating user ${uid}:`, error);
            throw error;
        }
    }

    /**
     * Delete a user
     * @param {string} uid - User ID
     * @returns {Promise<Object>} - API response
     */
    async deleteUser(uid) {
        try {
            return await apiService.delete(`admin/users/${uid}`);
        } catch (error) {
            console.error(`Error deleting user ${uid}:`, error);
            throw error;
        }
    }
}

// Create and export singleton instance
const userService = new UserService();
export default userService;
