const SensorData = require('../models/SensorData');

// @desc    Get all sensor data
// @route   GET /api/sensors
// @access  Public
const getSensorData = async (req, res) => {
    try {
        const sensorData = await SensorData.find().sort({ timeRecorded: -1 });
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sensor data by ID
// @route   GET /api/sensors/:id
// @access  Public
const getSensorDataById = async (req, res) => {
    try {
        const sensorData = await SensorData.findOne({ id: req.params.id });

        if (!sensorData) {
            return res.status(404).json({ message: 'Sensor data not found' });
        }

        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new sensor data
// @route   POST /api/sensors
// @access  Public
const createSensorData = async (req, res) => {
    try {
        const newSensorData = new SensorData(req.body);
        const savedData = await newSensorData.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSensorData,
    getSensorDataById,
    createSensorData
};
