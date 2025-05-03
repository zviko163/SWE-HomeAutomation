const asyncHandler = require('express-async-handler');
const Device = require('../models/Device');

/**
 * @desc    Get all devices for admin
 * @route   GET /api/admin/devices
 * @access  Admin only
 */
const getAllDevices = asyncHandler(async (req, res) => {
    console.log('Admin device controller hit - fetching all devices');
    try {
        // Query all devices from MongoDB
        const devices = await Device.find({})
            .sort({ lastUpdated: -1 });

        // Add household information
        // In a real app, you'd link this to user data 
        // For now, we'll assign sample households
        const householdMap = {
            'Living Room': 'Johnson Home',
            'Bedroom': 'Williams Apartment',
            'Kitchen': 'Smith Residence',
            'Bathroom': 'Davis House',
            'Office': 'Chen Office',
            'Entrance': 'Johnson Home'
        };

        const enhancedDevices = devices.map(device => ({
            ...device.toObject(),
            household: householdMap[device.room] || 'Unknown Household'
        }));

        res.json({
            success: true,
            count: enhancedDevices.length,
            data: enhancedDevices
        });
    } catch (error) {
        console.error('Error fetching admin devices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching devices',
            data: []
        });
    }
});

/**
 * @desc    Delete a device
 * @route   DELETE /api/admin/devices/:id
 * @access  Admin only
 */
const deleteDevice = asyncHandler(async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            res.status(404);
            throw new Error('Device not found');
        }

        await device.deleteOne();

        // Emit socket event about device removal if you have sockets set up
        if (req.io) {
            req.io.emit('device:removed', { id: req.params.id });
        }

        res.json({
            success: true,
            message: 'Device removed successfully'
        });
    } catch (error) {
        console.error(`Error deleting device ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting device'
        });
    }
});

module.exports = {
    getAllDevices,
    deleteDevice
};
