// frontend/src/services/adminDeviceService.js
import apiService from './api';

class AdminDeviceService {
    async getAllDevices() {
        try {
            // This should match the endpoint we created in the backend
            const response = await apiService.get('admin/devices');
            return response;
        } catch (error) {
            console.error('Error fetching admin devices:', error);
            throw error;
        }
    }

    async deleteDevice(id) {
        try {
            return await apiService.delete(`admin/devices/${id}`);
        } catch (error) {
            console.error(`Error deleting device ${id}:`, error);
            throw error;
        }
    }
}

const adminDeviceService = new AdminDeviceService();
export default adminDeviceService;
