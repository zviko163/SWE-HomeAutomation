const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF report
 * @param {string} reportType - Type of report to generate ('users' or 'devices')
 * @param {Array} data - Data to include in the report
 * @param {Object} options - Report options
 * @returns {string} - Path to the generated PDF file
 */
const generateReport = async (reportType, data, options = {}) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

    // Create directory if it doesn't exist
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filename = `${reportType}_report_${timestamp}.pdf`;
    const filepath = path.join(reportsDir, filename);

    // Create PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Add report title
    doc.fontSize(20).text(`Home Bot ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, {
        align: 'center'
    });

    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${now.toLocaleString()}`, {
        align: 'center'
    });

    doc.moveDown(2);

    // Add report summary
    doc.fontSize(14).text(`Total ${reportType}: ${data.length}`, {
        underline: true
    });

    doc.moveDown();

    // Add report data
    if (reportType === 'users') {
        // User report format
        data.forEach((user, index) => {
            doc.fontSize(12).text(`${index + 1}. ${user.name || 'Unnamed User'}`, {
                continued: true
            });

            doc.fontSize(10).text(` (${user.email})`, {
                continued: false
            });

            doc.fontSize(10).text(`   Role: ${user.role || 'N/A'}`);
            doc.fontSize(10).text(`   Status: ${user.status || 'N/A'}`);
            doc.fontSize(10).text(`   Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}`);
            doc.fontSize(10).text(`   Joined: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}`);

            doc.moveDown();
        });
    } else if (reportType === 'devices') {
        // Device report format
        data.forEach((device, index) => {
            doc.fontSize(12).text(`${index + 1}. ${device.name || 'Unnamed Device'}`, {
                continued: true
            });

            doc.fontSize(10).text(` (${device.type || 'Unknown Type'})`, {
                continued: false
            });

            doc.fontSize(10).text(`   Room: ${device.room || 'Unassigned'}`);
            doc.fontSize(10).text(`   Status: ${device.status || 'N/A'}`);
            doc.fontSize(10).text(`   Last Updated: ${device.lastUpdated ? new Date(device.lastUpdated).toLocaleString() : 'Never'}`);

            doc.moveDown();
        });
    }

    // Add report footer
    doc.moveDown(2);
    doc.fontSize(10).text('Home Bot Admin Panel', {
        align: 'center',
        color: 'grey'
    });

    // Finalize PDF
    doc.end();

    // Return filepath for the controller to use
    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            resolve(filepath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = {
    generateReport
};
