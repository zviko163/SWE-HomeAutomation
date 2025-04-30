const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
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
// const io = new Server(server, {
//     path: '/socket.io', // Explicitly set the path
//     cors: {
//         origin: process.env.CLIENT_URL || 'http://localhost:5173', // Your frontend URL
//         methods: ['GET', 'POST'],
//         credentials: true,
//         allowedHeaders: ["my-custom-header"],
//         transports: ['polling', 'websocket']
//     },
//     connectTimeout: 5000,
// });
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173', // Your frontend URL
        methods: ['GET', 'POST'],
        credentials: true
    },
    path: '/socket.io', // Note: No trailing slash
    transports: ['polling', 'websocket']
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

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

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is working' });
});

// Mount routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedules', scheduleRoutes);

// Socket.io connection handlers
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    console.log('Socket handshake:', socket.handshake);

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

io.on('connect_error', (error) => {
    console.error('Server-side Socket Connection Error:', error);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
