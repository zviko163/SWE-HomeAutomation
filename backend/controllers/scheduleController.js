const Schedule = require('../models/Schedule');
const Device = require('../models/Device');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all schedules
 * @route   GET /api/schedules
 * @access  Public
 */
const getSchedules = asyncHandler(async (req, res) => {
    const schedules = await Schedule.find({}).populate('devices', 'name type status');

    res.json({
        success: true,
        count: schedules.length,
        data: schedules
    });
});

/**
 * @desc    Get schedule by ID
 * @route   GET /api/schedules/:id
 * @access  Public
 */
const getScheduleById = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id).populate('devices', 'name type room status state');

    if (schedule) {
        res.json(schedule);
    } else {
        res.status(404);
        throw new Error('Schedule not found');
    }
});

/**
 * @desc    Create new schedule
 * @route   POST /api/schedules
 * @access  Public
 */
const createSchedule = asyncHandler(async (req, res) => {
    const { name, devices, timeOn, timeOff, days, color } = req.body;

    // Validate required fields
    if (!name || !devices || !Array.isArray(devices) || !timeOn || !timeOff || !days || !Array.isArray(days)) {
        res.status(400);
        throw new Error('Please provide name, devices array, timeOn, timeOff, and days array');
    }

    // Check if all devices exist
    const deviceCount = await Device.countDocuments({
        _id: { $in: devices }
    });

    if (deviceCount !== devices.length) {
        res.status(400);
        throw new Error('One or more devices do not exist');
    }

    // Validate days of week
    const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const allDaysValid = days.every(day => validDays.includes(day));

    if (!allDaysValid) {
        res.status(400);
        throw new Error('Invalid day(s) provided. Must be one of: mon, tue, wed, thu, fri, sat, sun');
    }

    // Create schedule
    const schedule = await Schedule.create({
        name,
        devices,
        timeOn,
        timeOff,
        days,
        color: color || '#F2FF66',
        active: true
    });

    const populatedSchedule = await Schedule.findById(schedule._id).populate('devices', 'name type status');

    res.status(201).json(populatedSchedule);
});

/**
 * @desc    Update schedule
 * @route   PUT /api/schedules/:id
 * @access  Public
 */
const updateSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
        res.status(404);
        throw new Error('Schedule not found');
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

    // If days are being updated, validate them
    if (req.body.days && Array.isArray(req.body.days)) {
        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const allDaysValid = req.body.days.every(day => validDays.includes(day));

        if (!allDaysValid) {
            res.status(400);
            throw new Error('Invalid day(s) provided. Must be one of: mon, tue, wed, thu, fri, sat, sun');
        }
    }

    // Update schedule
    const updatedSchedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('devices', 'name type status');

    res.json(updatedSchedule);
});

/**
 * @desc    Toggle schedule active status
 * @route   PUT /api/schedules/:id/toggle
 * @access  Public
 */
const toggleSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
        res.status(404);
        throw new Error('Schedule not found');
    }

    // Toggle active status
    schedule.active = !schedule.active;
    await schedule.save();

    res.json({
        success: true,
        active: schedule.active,
        message: `Schedule ${schedule.active ? 'activated' : 'deactivated'}`
    });
});

/**
 * @desc    Delete schedule
 * @route   DELETE /api/schedules/:id
 * @access  Public
 */
const deleteSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
        res.status(404);
        throw new Error('Schedule not found');
    }

    await schedule.deleteOne();

    res.json({ message: 'Schedule removed' });
});

module.exports = {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    toggleSchedule,
    deleteSchedule
};
