const express = require('express');
const router = express.Router();
const {
    getDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    updateDeviceState,
    deleteDevice,
    getDevicesByRoom
} = require('../controllers/deviceController');

// Get all devices with optional filtering
router.get('/', getDevices);

// Get devices by room
router.get('/room/:roomName', getDevicesByRoom);

// Get device by ID
router.get('/:id', getDeviceById);

// Create new device
router.post('/', createDevice);

// Update device
router.put('/:id', updateDevice);

// Update device state
router.put('/:id/state', updateDeviceState);

// Delete device
router.delete('/:id', deleteDevice);

module.exports = router;
