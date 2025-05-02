// frontend/src/services/sensorService.js
import apiService from './api';

class SensorService {
    /**
     * Get sensor data with optional filtering
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Array>} - Array of sensor data
     */
    async getSensorData(params = {}) {
        try {
            const response = await apiService.get('sensors_data', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            throw error;
        }
    }

    /**
     * Get aggregated sensor data for a specific time range
     * @param {string} timeRange - Time range for data aggregation ('24h', '7days', 'historical')
     * @returns {Promise<Array>} - Aggregated sensor data
     */
    async getAggregatedSensorData(timeRange = 'historical') {
        try {
            const response = await apiService.get('sensors_data', { timeRange });
            
            // Transform the data to match the expected format for graphs
            if (response.data && Array.isArray(response.data)) {
                return response.data.map(item => ({
                    timestamp: new Date(item.timestamp),
                    temperature: item.temperature,
                    humidity: item.humidity
                }));
            }
            return [];
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
            const response = await apiService.get('sensors_data');
            // Return the first item from the data array if it exists
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0]; // Most recent reading
            }
            return null;
        } catch (error) {
            console.error('Error fetching latest sensor data:', error);
            throw error;
        }
    }
}

const sensorService = new SensorService();
export default sensorService;
