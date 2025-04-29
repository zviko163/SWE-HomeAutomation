const express = require('express');
const router = express.Router();
const {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

// Get all rooms
router.get('/', getRooms);

// Create new room
router.post('/', createRoom);

// Update room
router.put('/:id', updateRoom);

// Delete room
router.delete('/:id', deleteRoom);

module.exports = router;
