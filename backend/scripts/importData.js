require('dotenv').config({ path: '../.env' });
const path = require('path');
const connectDB = require('../config/db');
const { importSensorDataFromCSV } = require('../utils/csvImporter');

// Connect to MongoDB
connectDB();

// Path to your CSV file - update this to your actual CSV file path
const csvFilePath = path.resolve(__dirname, '../data/sensor_data.csv');

// Import the data
console.log('Starting data import...');
importSensorDataFromCSV(csvFilePath);
