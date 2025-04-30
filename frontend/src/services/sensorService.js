// frontend/src/services/sensorService.js
import apiService from './api';

/**
 * Service for sensor-related API calls
 */
class SensorService {
    /**
     * Get sensor data with optional filtering
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Array>} - Array of sensor data
     */
    async getSensorData(params = {}) {
        try {
            const response = await apiService.get('sensors', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            throw error;
        }
    }

    /**
     * Get aggregated sensor data
     * @param {string} period - Aggregation period ('hour', 'day', 'month')
     * @param {Object} options - Additional query options
     * @returns {Promise<Array>} - Aggregated sensor data
     */
    async getAggregatedSensorData(period = 'historical', options = {}) {
        try {
            const response = await apiService.get('sensors/aggregate', {
                period,
                ...options
            });

            // Transform data preserving original timestamps
            return response.data.map(item => ({
                timestamp: item._id.timeRecorded || item._id, // Use timeRecorded directly
                temperature: item.avgTemperature,
                humidity: item.avgHumidity
            }));
        } catch (error) {
            console.error('Error fetching aggregated sensor data:', error);
            throw error;
        }
    }

    /**
     * Get latest sensor reading
     * @returns {Promise<Object>} - Latest sensor reading
     */
    async getLatestSensorData() {
        try {
            const response = await apiService.get('sensors/latest');
            return response;
        } catch (error) {
            console.error('Error fetching latest sensor data:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const sensorService = new SensorService();
export default sensorService;
