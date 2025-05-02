const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['user_login', 'admin_login', 'new_device', 'device_offline', 'device_online', 'user_registered', 'user_updated', 'device_updated']
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    icon: {
        type: String,
        default: 'fa-info-circle'
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
