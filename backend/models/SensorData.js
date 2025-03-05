const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
}, {
    timestamps: true
});

// Create index for faster querying
sensorDataSchema.index({ timeRecorded: 1 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
