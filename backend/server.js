const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Import routes
const sensorRoutes = require('./routes/sensorRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/devices', deviceRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Smart Home Automation API is running');
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
