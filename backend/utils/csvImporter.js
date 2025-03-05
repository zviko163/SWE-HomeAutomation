const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const SensorData = require('../models/SensorData');

/**
 * Import sensor data from a CSV file into MongoDB
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<number>} - Number of records imported
 */
const importSensorData = async (filePath) => {
    try {
        // Validate file path
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        console.log(`Starting import from: ${filePath}`);

        // Counter for imported records
        let importedCount = 0;
        let errorCount = 0;

        // Create a promise to handle the CSV parsing
        return new Promise((resolve, reject) => {
            const results = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    // Transform CSV row to match schema
                    const transformedData = {
                        id: data.id,
                        temperature: parseFloat(data.temperature),
                        humidity: parseFloat(data.humidity),
                        timeRecorded: new Date(data.timeRecorded),
                        ldrValue: parseFloat(data.ldrValue)
                    };

                    results.push(transformedData);
                })
                .on('end', async () => {
                    console.log(`Parsed ${results.length} records from CSV`);

                    // Process in batches to avoid overwhelming the database
                    const batchSize = 100;
                    for (let i = 0; i < results.length; i += batchSize) {
                        const batch = results.slice(i, i + batchSize);

                        try {
                            // Use insertMany with ordered: false to continue on error
                            const result = await SensorData.insertMany(batch, { ordered: false });
                            importedCount += result.length;
                            console.log(`Imported batch ${i / batchSize + 1}: ${result.length} records`);
                        } catch (error) {
                            // Count successful inserts even when some fail due to duplicates
                            if (error.insertedDocs && error.insertedDocs.length > 0) {
                                importedCount += error.insertedDocs.length;
                            }
                            errorCount += 1;
                            console.error(`Error in batch ${i / batchSize + 1}:`, error.message);
                        }
                    }

                    console.log(`Import completed. Successfully imported ${importedCount} records with ${errorCount} errors.`);
                    resolve(importedCount);
                })
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('Import failed:', error);
        throw error;
    }
};

module.exports = {
    importSensorData
};
