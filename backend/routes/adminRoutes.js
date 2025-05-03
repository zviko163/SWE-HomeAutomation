// In backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

// Admin dashboard stats
router.get('/stats/users', adminController.getUserStats);
router.get('/stats/devices', adminController.getDeviceStats);
router.get('/activity', adminController.getRecentActivity);

// User management routes
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:uid', userController.updateUser);
router.delete('/users/:uid', userController.deleteUser);

// Add a test route to check Firebase connectivity
router.get('/test-firebase', async (req, res) => {
    const admin = require('../config/firebase');
    try {
        const auth = admin.auth();
        const result = await auth.listUsers(1);
        res.json({
            success: true,
            message: 'Firebase connection successful',
            sampleUser: result.users.length > 0 ? {
                uid: result.users[0].uid,
                email: result.users[0].email,
                displayName: result.users[0].displayName || 'No display name'
            } : 'No users found'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Firebase connection failed',
            error: error.message
        });
    }
});

module.exports = router;
