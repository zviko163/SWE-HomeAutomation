const express = require('express');
const router = express.Router();
const {
    generateDeviceReport,
    generateUserReport
} = require('../controllers/reportController');

// Generate device report
router.get('/devices', generateDeviceReport);

// Generate user report
router.get('/users', generateUserReport);

module.exports = router;
