const admin = require('firebase-admin');

// This uses the serviceAccountKey.json file for authentication
const serviceAccount = require('../serviceAccountKey.json');

// Initialize the app if it hasn't been already
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;
