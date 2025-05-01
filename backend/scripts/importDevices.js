require('dotenv').config();
const mongoose = require('mongoose');
const Device = require('../models/Device');
const Room = require('../models/Room');
const connectDB = require('../config/db');

// Sample devices data
const deviceData = [
    {
        name: 'Living Room Light',
        type: 'light',
        room: 'Living Room',
        status: 'online',
        state: { on: true, brightness: 80 }
    },
    {
        name: 'Kitchen Light',
        type: 'light',
        room: 'Kitchen',
        status: 'online',
        state: { on: false, brightness: 0 }
    },
    {
        name: 'Bedroom Light',
        type: 'light',
        room: 'Bedroom',
        status: 'online',
        state: { on: false, brightness: 0 }
    },
    {
        name: 'Living Room Thermostat',
        type: 'thermostat',
        room: 'Living Room',
        status: 'online',
        state: { on: true, temperature: 22, mode: 'heat' }
    },
    {
        name: 'Front Door',
        type: 'door',
        room: 'Entrance',
        status: 'online',
        state: { locked: true }
    }
];

// Sample rooms data
const roomData = [
    { name: 'Living Room', icon: 'fa-couch' },
    { name: 'Kitchen', icon: 'fa-utensils' },
    { name: 'Bedroom', icon: 'fa-bed' },
    { name: 'Bathroom', icon: 'fa-bath' },
    { name: 'Entrance', icon: 'fa-door-open' }
];

// Import data function
const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Device.deleteMany();
        await Room.deleteMany();

        console.log('Data cleared from database');

        // Import rooms first
        await Room.insertMany(roomData);
        console.log('Rooms imported');

        // Import devices
        await Device.insertMany(deviceData);
        console.log('Devices imported');

        console.log('Data import complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Delete all data function
const destroyData = async () => {
    try {
        await connectDB();

        await Device.deleteMany();
        await Room.deleteMany();

        console.log('All data destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Based on command line arg, either import or destroy data
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
