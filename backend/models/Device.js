const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['light', 'thermostat', 'motion_sensor', 'door', 'window', 'alarm'],
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    state: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for faster querying
deviceSchema.index({ room: 1 });
deviceSchema.index({ type: 1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
