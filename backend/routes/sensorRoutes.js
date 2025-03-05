const express = require('express');
const router = express.Router();
const {
    getSensorData,
    getSensorDataById,
    getLatestSensorData,
    getAggregatedSensorData,
    createSensorData,
} = require('../controllers/sensorController');

// Get latest sensor data
router.get('/latest', getLatestSensorData);

// Get aggregated sensor data
router.get('/aggregate', getAggregatedSensorData);

// Get all sensor data with pagination and filtering
router.get('/', getSensorData);

// Get sensor data by ID
router.get('/:id', getSensorDataById);

// Create new sensor data
router.post('/', createSensorData);

module.exports = router;
