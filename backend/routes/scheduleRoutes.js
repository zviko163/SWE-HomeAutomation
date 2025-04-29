const express = require('express');
const router = express.Router();
const {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    toggleSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');

// Get all schedules
router.get('/', getSchedules);

// Get schedule by ID
router.get('/:id', getScheduleById);

// Create new schedule
router.post('/', createSchedule);

// Update schedule
router.put('/:id', updateSchedule);

// Toggle schedule active status
router.put('/:id/toggle', toggleSchedule);

// Delete schedule
router.delete('/:id', deleteSchedule);

module.exports = router;
