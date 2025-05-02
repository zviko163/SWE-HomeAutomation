const express = require('express');
const router = express.Router();
const {
    getUserStats,
    getDeviceStats,
    getRecentActivity
} = require('../controllers/adminController');

// Get user statistics
router.get('/stats/users', getUserStats);

// Get device statistics
router.get('/stats/devices', getDeviceStats);

// Get recent activity
router.get('/activity', getRecentActivity);

module.exports = router;
