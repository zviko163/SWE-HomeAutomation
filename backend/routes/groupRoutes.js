const express = require('express');
const router = express.Router();
const {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    controlGroup
} = require('../controllers/groupController');

// Get all groups
router.get('/', getGroups);

// Get group by ID
router.get('/:id', getGroupById);

// Create new group
router.post('/', createGroup);

// Update group
router.put('/:id', updateGroup);

// Delete group
router.delete('/:id', deleteGroup);

// Control all devices in a group
router.put('/:id/control', controlGroup);

module.exports = router;
