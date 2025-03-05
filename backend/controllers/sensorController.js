const SensorData = require('../models/SensorData');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all sensor data with pagination
 * @route   GET /api/sensors
 * @access  Public
 */
const getSensorData = asyncHandler(async (req, res) => {
    // Set up pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;

    // Set up filtering options
    const filter = {};

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
        filter.timeRecorded = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    } else if (req.query.startDate) {
        filter.timeRecorded = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
        filter.timeRecorded = { $lte: new Date(req.query.endDate) };
    }

    // Get total count
    const total = await SensorData.countDocuments(filter);

    // Get data
    const sensorData = await SensorData.find(filter)
        .sort({ timeRecorded: -1 })
        .limit(limit)
        .skip(startIndex);

    // Send response
    res.json({
        success: true,
        count: sensorData.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: sensorData
    });
});

/**
 * @desc    Get sensor data by ID
 * @route   GET /api/sensors/:id
 * @access  Public
 */
const getSensorDataById = asyncHandler(async (req, res) => {
    const sensorData = await SensorData.findOne({ id: req.params.id });

    if (sensorData) {
        res.json(sensorData);
    } else {
        res.status(404);
        throw new Error('Sensor data not found');
    }
});

/**
 * @desc    Get latest sensor data
 * @route   GET /api/sensors/latest
 * @access  Public
 */
const getLatestSensorData = asyncHandler(async (req, res) => {
    const sensorData = await SensorData.findOne()
        .sort({ timeRecorded: -1 });

    if (sensorData) {
        res.json(sensorData);
    } else {
        res.status(404);
        throw new Error('No sensor data found');
    }
});

/**
 * @desc    Get sensor data aggregated by time period
 * @route   GET /api/sensors/aggregate
 * @access  Public
 */
const getAggregatedSensorData = asyncHandler(async (req, res) => {
    const { period } = req.query;
    let timeGroup;

    // Set up time grouping based on period parameter
    switch (period) {
        case 'hour':
            timeGroup = {
                year: { $year: "$timeRecorded" },
                month: { $month: "$timeRecorded" },
                day: { $dayOfMonth: "$timeRecorded" },
                hour: { $hour: "$timeRecorded" }
            };
            break;
        case 'day':
            timeGroup = {
                year: { $year: "$timeRecorded" },
                month: { $month: "$timeRecorded" },
                day: { $dayOfMonth: "$timeRecorded" }
            };
            break;
        case 'month':
            timeGroup = {
                year: { $year: "$timeRecorded" },
                month: { $month: "$timeRecorded" }
            };
            break;
        default:
            timeGroup = {
                year: { $year: "$timeRecorded" },
                month: { $month: "$timeRecorded" },
                day: { $dayOfMonth: "$timeRecorded" }
            };
    }

    // Set up date range filter
    const filter = {};
    if (req.query.startDate && req.query.endDate) {
        filter.timeRecorded = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    // Perform aggregation
    const aggregatedData = await SensorData.aggregate([
        { $match: filter },
        {
            $group: {
                _id: timeGroup,
                avgTemperature: { $avg: "$temperature" },
                avgHumidity: { $avg: "$humidity" },
                avgLdrValue: { $avg: "$ldrValue" },
                count: { $sum: 1 },
                minTemperature: { $min: "$temperature" },
                maxTemperature: { $max: "$temperature" },
                minHumidity: { $min: "$humidity" },
                maxHumidity: { $max: "$humidity" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
    ]);

    res.json({
        success: true,
        count: aggregatedData.length,
        period,
        data: aggregatedData
    });
});

/**
 * @desc    Create new sensor data
 * @route   POST /api/sensors
 * @access  Public
 */
const createSensorData = asyncHandler(async (req, res) => {
    const {
        id,
        temperature,
        humidity,
        timeRecorded,
        ldrValue
    } = req.body;

    // Simple validation
    if (!temperature || !humidity || !timeRecorded) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Check for duplicate
    const exists = await SensorData.findOne({ id });
    if (exists) {
        res.status(400);
        throw new Error('Sensor data with this ID already exists');
    }

    // Create new sensor data
    const sensorData = await SensorData.create({
        id: id || Date.now().toString(),
        temperature,
        humidity,
        timeRecorded: new Date(timeRecorded),
        ldrValue: ldrValue || 0
    });

    res.status(201).json(sensorData);
});

module.exports = {
    getSensorData,
    getSensorDataById,
    getLatestSensorData,
    getAggregatedSensorData,
    createSensorData,
};
