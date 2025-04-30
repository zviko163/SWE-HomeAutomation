// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Base API service with common HTTP methods
 */
class ApiService {
    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint to call
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} - Response data
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${API_URL}/${endpoint}`.replace("//", "/"));

        // Add query parameters
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error(`API error for ${endpoint}: ${response.status} ${response.statusText}`);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching from ${endpoint}:`, error);
            // Provide more context in the error
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error(`Network error: Could not connect to the server at ${API_URL}. Is the backend running?`);
            }
            throw error;
        }
    }

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint to call
     * @param {Object} data - Data to send
     * @returns {Promise<any>} - Response data
     */
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint to call
     * @param {Object} data - Data to send
     * @returns {Promise<any>} - Response data
     */
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint to call
     * @returns {Promise<any>} - Response data
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error deleting from ${endpoint}:`, error);
            throw error;
        }
    }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
