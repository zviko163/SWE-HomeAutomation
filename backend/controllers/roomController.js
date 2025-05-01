const Room = require('../models/Room');
const Device = require('../models/Device');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public
 */
const getRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find({});

    // Get device count for each room
    const roomsWithDeviceCounts = await Promise.all(
        rooms.map(async (room) => {
            const deviceCount = await Device.countDocuments({ room: room.name });
            return {
                _id: room._id,
                name: room.name,
                icon: room.icon,
                deviceCount,
                createdAt: room.createdAt
            };
        })
    );

    res.json({
        success: true,
        count: rooms.length,
        data: roomsWithDeviceCounts
    });
});

/**
 * @desc    Create new room
 * @route   POST /api/rooms
 * @access  Public
 */
const createRoom = asyncHandler(async (req, res) => {
    const { name, icon } = req.body;

    // Check if room already exists
    const roomExists = await Room.findOne({ name });

    if (roomExists) {
        res.status(400);
        throw new Error('Room already exists');
    }

    // Create room
    const room = await Room.create({
        name,
        icon: icon || 'fa-home'
    });

    res.status(201).json(room);
});

/**
 * @desc    Update room
 * @route   PUT /api/rooms/:id
 * @access  Public
 */
const updateRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }

    // If name is being updated, update device references
    if (req.body.name && req.body.name !== room.name) {
        await Device.updateMany(
            { room: room.name },
            { room: req.body.name }
        );
    }

    // Update room
    const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedRoom);
});

/**
 * @desc    Delete room
 * @route   DELETE /api/rooms/:id
 * @access  Public
 */
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }

    // Check if room has devices
    const deviceCount = await Device.countDocuments({ room: room.name });

    if (deviceCount > 0) {
        res.status(400);
        throw new Error('Cannot delete room with devices. Please move or delete devices first.');
    }

    await room.deleteOne();

    res.json({ message: 'Room removed' });
});

module.exports = {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
};
