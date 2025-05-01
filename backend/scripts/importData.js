require('dotenv').config();
const path = require('path');
const connectDB = require('../config/db');
const { importSensorData } = require('../utils/csvImporter');
const SensorData = require('../models/SensorData');

/**
 * Script to import sensor data from CSV files
 */
const importAllData = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Path to CSV file (relative to this script)
        const csvFilePath = path.join(__dirname, '../data/sensor_data.csv');

        console.log('Clearing existing sensor data...'); // <-- Add this log
        await SensorData.deleteMany({}); // <-- Add this line to clear the collection
        console.log('Existing data cleared.'); // <-- Add this log
        
        console.log('Starting data import process...');

        // Import sensor data
        const importedCount = await importSensorData(csvFilePath);

        console.log(`Import complete! Imported ${importedCount} sensor readings.`);
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
};

// Run the import
importAllData();
