const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    timeRecorded: {
        type: Date,
        required: true
    },
    ldrValue: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
