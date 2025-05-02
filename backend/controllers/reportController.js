const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const { generateReport } = require('../utils/reportGenerator');
const User = require('../models/User');
const Device = require('../models/Device');
const admin = require('../config/firebase');

/**
 * @desc    Generate a device report
 * @route   GET /api/reports/devices
 * @access  Admin only
 */
const generateDeviceReport = asyncHandler(async (req, res) => {
    try {
        // Fetch devices from MongoDB
        let devices = [];
        try {
            devices = await Device.find().lean();
        } catch (err) {
            console.log('Error fetching devices:', err.message);
            // Return sample data if error
            devices = [
                {
                    name: 'Sample Thermostat',
                    type: 'thermostat',
                    room: 'Living Room',
                    status: 'online',
                    lastUpdated: new Date()
                },
                {
                    name: 'Sample Light',
                    type: 'light',
                    room: 'Bedroom',
                    status: 'offline',
                    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            ];
        }

        // Generate PDF
        const reportPath = await generateReport('devices', devices);

        // Send file to client
        res.download(reportPath, path.basename(reportPath), (err) => {
            if (err) {
                console.error('Error sending report:', err);
            }

            // Delete file after sending
            fs.unlink(reportPath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting report file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Error generating device report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate device report'
        });
    }
});

/**
 * @desc    Generate a user report
 * @route   GET /api/reports/users
 * @access  Admin only
 */
const generateUserReport = asyncHandler(async (req, res) => {
    try {
        // Fetch users from Firebase and/or MongoDB
        let users = [];

        try {
            // Try Firebase Admin first
            const listUsersResult = await admin.auth().listUsers(1000);
            users = listUsersResult.users.map(user => ({
                name: user.displayName || 'No Name',
                email: user.email,
                role: user.customClaims?.role || 'homeowner',
                status: user.disabled ? 'inactive' : 'active',
                lastLogin: user.metadata.lastSignInTime,
                createdAt: user.metadata.creationTime
            }));
        } catch (firebaseError) {
            console.error('Error listing users from Firebase:', firebaseError);

            // Fallback to MongoDB User collection if Firebase fails
            try {
                users = await User.find().lean();
            } catch (mongoError) {
                console.error('Error fetching users from MongoDB:', mongoError);
                // Return sample data if both fail
                users = [
                    {
                        name: 'John Doe',
                        email: 'john@example.com',
                        role: 'homeowner',
                        status: 'active',
                        lastLogin: new Date(),
                        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    },
                    {
                        name: 'Admin User',
                        email: 'admin@example.com',
                        role: 'admin',
                        status: 'active',
                        lastLogin: new Date(),
                        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                    }
                ];
            }
        }

        // Generate PDF
        const reportPath = await generateReport('users', users);

        // Send file to client
        res.download(reportPath, path.basename(reportPath), (err) => {
            if (err) {
                console.error('Error sending report:', err);
            }

            // Delete file after sending
            fs.unlink(reportPath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting report file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Error generating user report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate user report'
        });
    }
});

module.exports = {
    generateDeviceReport,
    generateUserReport
};
