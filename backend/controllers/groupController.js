const DeviceGroup = require('../models/DeviceGroup');
const Device = require('../models/Device');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all device groups
 * @route   GET /api/groups
 * @access  Public
 */
const getGroups = asyncHandler(async (req, res) => {
    const groups = await DeviceGroup.find({}).populate('devices', 'name type status');

    res.json({
        success: true,
        count: groups.length,
        data: groups
    });
});

/**
 * @desc    Get device group by ID
 * @route   GET /api/groups/:id
 * @access  Public
 */
const getGroupById = asyncHandler(async (req, res) => {
    const group = await DeviceGroup.findById(req.params.id).populate('devices', 'name type room status state');

    if (group) {
        res.json(group);
    } else {
        res.status(404);
        throw new Error('Group not found');
    }
});

/**
 * @desc    Create new device group
 * @route   POST /api/groups
 * @access  Public
 */
const createGroup = asyncHandler(async (req, res) => {
    const { name, devices, icon, color } = req.body;

    // Validate required fields
    if (!name || !devices || !Array.isArray(devices)) {
        res.status(400);
        throw new Error('Please provide name and devices array');
    }

    // Check if all devices exist
    const deviceCount = await Device.countDocuments({
        _id: { $in: devices }
    });

    if (deviceCount !== devices.length) {
        res.status(400);
        throw new Error('One or more devices do not exist');
    }

    // Create group
    const group = await DeviceGroup.create({
        name,
        devices,
        icon: icon || 'fa-object-group',
        color: color || '#F2FF66'
    });

    const populatedGroup = await DeviceGroup.findById(group._id).populate('devices', 'name type status');

    res.status(201).json(populatedGroup);
});

/**
 * @desc    Update device group
 * @route   PUT /api/groups/:id
 * @access  Public
 */
const updateGroup = asyncHandler(async (req, res) => {
    const group = await DeviceGroup.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // If devices are being updated, check if all devices exist
    if (req.body.devices && Array.isArray(req.body.devices)) {
        const deviceCount = await Device.countDocuments({
            _id: { $in: req.body.devices }
        });

        if (deviceCount !== req.body.devices.length) {
            res.status(400);
            throw new Error('One or more devices do not exist');
        }
    }

    // Update group
    const updatedGroup = await DeviceGroup.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('devices', 'name type status');

    res.json(updatedGroup);
});

/**
 * @desc    Delete device group
 * @route   DELETE /api/groups/:id
 * @access  Public
 */
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await DeviceGroup.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    await group.deleteOne();

    res.json({ message: 'Group removed' });
});

/**
 * @desc    Control all devices in a group (turn on/off)
 * @route   PUT /api/groups/:id/control
 * @access  Public
 */
const controlGroup = asyncHandler(async (req, res) => {
    const { action } = req.body;

    if (!action || (action !== 'on' && action !== 'off')) {
        res.status(400);
        throw new Error('Please provide valid action (on/off)');
    }

    const group = await DeviceGroup.findById(req.params.id).populate('devices');

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Update all devices in the group
    const updatePromises = group.devices.map(device => {
        // Skip devices that don't have an on/off state
        if (!device.state || typeof device.state.on === 'undefined') {
            return null;
        }

        // Update device state
        device.state.on = action === 'on';
        device.lastUpdated = Date.now();

        return device.save();
    });

    // Filter out null promises and execute all updates
    await Promise.all(updatePromises.filter(promise => promise !== null));

    res.json({
        message: `All devices in group ${action === 'on' ? 'turned on' : 'turned off'}`
    });
});

module.exports = {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    controlGroup
};
