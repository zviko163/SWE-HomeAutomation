const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['light', 'thermostat', 'door', 'window', 'sensor']
    },
    room: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'offline',
        enum: ['online', 'offline']
    },
    state: {
        type: Object,
        default: {}
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Device', DeviceSchema);
