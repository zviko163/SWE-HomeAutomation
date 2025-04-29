const Device = require('../models/Device');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all devices with optional filtering
 * @route   GET /api/devices
 * @access  Public
 */
const getDevices = asyncHandler(async (req, res) => {
    // Set up filtering options
    const filter = {};

    // Filter by room if provided
    if (req.query.room) {
        filter.room = req.query.room;
    }

    // Filter by type if provided
    if (req.query.type) {
        filter.type = req.query.type;
    }

    // Filter by status if provided
    if (req.query.status) {
        filter.status = req.query.status;
    }

    // Get devices with filters
    const devices = await Device.find(filter);

    res.json({
        success: true,
        count: devices.length,
        data: devices
    });
});

/**
 * @desc    Get device by ID
 * @route   GET /api/devices/:id
 * @access  Public
 */
const getDeviceById = asyncHandler(async (req, res) => {
    const device = await Device.findById(req.params.id);

    if (device) {
        res.json(device);
    } else {
        res.status(404);
        throw new Error('Device not found');
    }
});

/**
 * @desc    Create new device
 * @route   POST /api/devices
 * @access  Public
 */
const createDevice = asyncHandler(async (req, res) => {
    const { name, type, room, state } = req.body;

    // Validate required fields
    if (!name || !type || !room) {
        res.status(400);
        throw new Error('Please provide name, type, and room');
    }

    // Create device
    const device = await Device.create({
        name,
        type,
        room,
        status: 'online',
        state: state || {},
        lastUpdated: Date.now()
    });

    res.status(201).json(device);
});

/**
 * @desc    Update device
 * @route   PUT /api/devices/:id
 * @access  Public
 */
const updateDevice = asyncHandler(async (req, res) => {
    const device = await Device.findById(req.params.id);

    if (!device) {
        res.status(404);
        throw new Error('Device not found');
    }

    // Update device
    const updatedDevice = await Device.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body,
            lastUpdated: Date.now()
        },
        { new: true }
    );

    res.json(updatedDevice);
});

/**
 * @desc    Update device state
 * @route   PUT /api/devices/:id/state
 * @access  Public
 */
const updateDeviceState = asyncHandler(async (req, res) => {
    const device = await Device.findById(req.params.id);

    if (!device) {
        res.status(404);
        throw new Error('Device not found');
    }

    // Update state and lastUpdated
    device.state = { ...device.state, ...req.body };
    device.lastUpdated = Date.now();

    const updatedDevice = await device.save();

    res.json(updatedDevice);
});

/**
 * @desc    Delete device
 * @route   DELETE /api/devices/:id
 * @access  Public
 */
const deleteDevice = asyncHandler(async (req, res) => {
    const device = await Device.findById(req.params.id);

    if (!device) {
        res.status(404);
        throw new Error('Device not found');
    }

    await device.deleteOne();

    res.json({ message: 'Device removed' });
});

/**
 * @desc    Get devices by room
 * @route   GET /api/devices/room/:roomName
 * @access  Public
 */
const getDevicesByRoom = asyncHandler(async (req, res) => {
    const devices = await Device.find({ room: req.params.roomName });

    res.json({
        success: true,
        count: devices.length,
        data: devices
    });
});

module.exports = {
    getDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    updateDeviceState,
    deleteDevice,
    getDevicesByRoom
};
