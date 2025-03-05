const fs = require('fs');
const csv = require('csv-parser');
const SensorData = require('../models/SensorData');

/**
 * Import sensor data from a CSV file to MongoDB
 * @param {string} filePath - Path to the CSV file
 */
const importSensorDataFromCSV = async (filePath) => {
    try {
        const results = [];

        // Read and parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`CSV file successfully processed. Found ${results.length} records.`);

                try {
                    // Convert string values to appropriate types
                    const formattedData = results.map(item => ({
                        id: item.id,
                        temperature: parseFloat(item.temperature),
                        humidity: parseFloat(item.humidity),
                        timeRecorded: new Date(item.timeRecorded),
                        ldrValue: parseFloat(item.ldrValue)
                    }));

                    // Insert data into MongoDB
                    await SensorData.insertMany(formattedData);
                    console.log('Data successfully imported to MongoDB');
                } catch (error) {
                    console.error('Error importing data to MongoDB:', error);
                }
            });
    } catch (error) {
        console.error('Error processing CSV file:', error);
    }
};

module.exports = {
    importSensorDataFromCSV
};
