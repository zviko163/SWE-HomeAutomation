const express = require('express');
const router = express.Router();
const {
    getDevices,
    getDeviceById,
    createDevice,
    updateDeviceState
} = require('../controllers/deviceController');

// @route   GET api/devices
// @desc    Get all devices
router.get('/', getDevices);

// @route   GET api/devices/:id
// @desc    Get device by ID
router.get('/:id', getDeviceById);

// @route   POST api/devices
// @desc    Create new device
router.post('/', createDevice);

// @route   PUT api/devices/:id/state
// @desc    Update device state
router.put('/:id/state', updateDeviceState);

module.exports = router;
