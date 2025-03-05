const Device = require('../models/Device');

// @desc    Get all devices
// @route   GET /api/devices
// @access  Public
const getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get device by ID
// @route   GET /api/devices/:id
// @access  Public
const getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json(device);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new device
// @route   POST /api/devices
// @access  Public
const createDevice = async (req, res) => {
    try {
        const newDevice = new Device(req.body);
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update device state
// @route   PUT /api/devices/:id/state
// @access  Public
const updateDeviceState = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        device.state = { ...device.state, ...req.body };
        device.lastUpdated = Date.now();

        const updatedDevice = await device.save();
        res.json(updatedDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDevices,
    getDeviceById,
    createDevice,
    updateDeviceState
};
