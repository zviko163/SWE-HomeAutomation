const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Import Routes
const sensorRoutes = require('./routes/sensorRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const roomRoutes = require('./routes/roomRoutes');
const groupRoutes = require('./routes/groupRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow your frontend URL
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Create socket.io middleware to make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedules', scheduleRoutes);

// Socket.io connection handlers
io.on('connection', (socket) => {
    console.log('A client connected', socket.id);

    // Join a room based on client request
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected', socket.id);
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5001;

// Start server
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
