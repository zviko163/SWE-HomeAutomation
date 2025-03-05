const express = require('express');
const router = express.Router();
const {
    getSensorData,
    getSensorDataById,
    createSensorData
} = require('../controllers/sensorController');

// @route   GET api/sensors
// @desc    Get all sensor data
// @access  Public
router.get('/', getSensorData);

// @route   GET api/sensors/:id
// @desc    Get sensor data by ID
// @access  Public
router.get('/:id', getSensorDataById);

// @route   POST api/sensors
// @desc    Create new sensor data entry
// @access  Public
router.post('/', createSensorData);

module.exports = router;
