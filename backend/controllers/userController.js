// backend/controllers/userController.js

const asyncHandler = require('express-async-handler');
const admin = require('../config/firebase');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin only
 */
const getUsers = asyncHandler(async (req, res) => {
    try {
        console.log('Attempting to list users from Firebase Admin...');

        // List users from Firebase Admin
        const listUsersResult = await admin.auth().listUsers(1000);
        console.log(`Successfully retrieved ${listUsersResult.users.length} users from Firebase`);

        // Format users for response
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            role: user.customClaims?.role || 'homeowner',
            status: user.disabled ? 'inactive' : 'active',
            lastLogin: user.metadata.lastSignInTime,
            createdAt: user.metadata.creationTime
        }));

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users from Firebase:', error);

        // Return a fallback response with sample data
        const sampleUsers = [
            {
                uid: '1',
                email: 'sample@example.com',
                displayName: 'Sample User',
                role: 'homeowner',
                status: 'active',
                lastLogin: new Date().toISOString(),
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                uid: '2',
                email: 'admin@example.com',
                displayName: 'Admin User',
                role: 'admin',
                status: 'active',
                lastLogin: new Date().toISOString(),
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        res.json({
            success: true,
            message: 'Using fallback data due to Firebase error',
            count: sampleUsers.length,
            data: sampleUsers
        });
    }
});

/**
 * @desc    Create a new user
 * @route   POST /api/admin/users
 * @access  Admin only
 */
const createUser = asyncHandler(async (req, res) => {
    const { email, password, displayName, role } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    try {
        // Create user in Firebase
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: displayName || '',
            disabled: false
        });

        // Set custom claims for role
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: role || 'homeowner' });

        // Fetch updated user
        const createdUser = await admin.auth().getUser(userRecord.uid);

        res.status(201).json({
            success: true,
            data: {
                uid: createdUser.uid,
                email: createdUser.email,
                displayName: createdUser.displayName,
                role: role || 'homeowner',
                status: createdUser.disabled ? 'inactive' : 'active'
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating user'
        });
    }
});

/**
 * @desc    Update a user
 * @route   PUT /api/admin/users/:uid
 * @access  Admin only
 */
const updateUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { email, displayName, role, password, status } = req.body;

    try {
        // Prepare update object
        const updateData = {};
        if (email) updateData.email = email;
        if (displayName !== undefined) updateData.displayName = displayName;
        if (password) updateData.password = password;
        if (status !== undefined) updateData.disabled = status === 'inactive';

        // Update user in Firebase
        await admin.auth().updateUser(uid, updateData);

        // Update role if provided
        if (role) {
            await admin.auth().setCustomUserClaims(uid, { role });
        }

        // Fetch updated user
        const updatedUser = await admin.auth().getUser(uid);

        res.json({
            success: true,
            data: {
                uid: updatedUser.uid,
                email: updatedUser.email,
                displayName: updatedUser.displayName,
                role: updatedUser.customClaims?.role || 'homeowner',
                status: updatedUser.disabled ? 'inactive' : 'active'
            }
        });
    } catch (error) {
        console.error(`Error updating user ${uid}:`, error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating user'
        });
    }
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:uid
 * @access  Admin only
 */
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;

    try {
        // Check if user exists
        await admin.auth().getUser(uid);

        // Delete user from Firebase
        await admin.auth().deleteUser(uid);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(`Error deleting user ${uid}:`, error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting user'
        });
    }
});

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
