# Home Bot: Smart Home Automation Platform

![Home Bot](https://swe-homebot.vercel.app)

## Overview

Home Bot is a comprehensive smart home automation platform that provides an intuitive dashboard for monitoring and controlling IoT devices. Built with a modern tech stack, it enables users to manage their smart home ecosystem, visualize sensor data, create automation rules, and receive intelligent insights through an elegant, responsive interface.

**Live Demo:** [https://swe-homebot.vercel.app](https://swe-homebot.vercel.app)

## Features

- **Real-time Monitoring:** Track temperature, humidity, and other environmental conditions
- **Device Control:** Manage lights, thermostats, doors, and other smart devices
- **User Dashboard:** Intuitive interface with real-time updates and data visualization
- **Room Management:** Organize devices by room for easier control
- **Device Groups:** Create custom device groups for synchronized actions
- **Quick Routines:** One-touch automation for common scenarios (Morning, Away, Night)
- **Admin Panel:** Comprehensive admin controls for user and device management
- **Mobile Responsive:** Fully functional on smartphones and tablets
- **Secure Authentication:** Email/password and Google authentication options

## Tech Stack

### Frontend
- **React**: Core UI library with functional components and hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Navigation between views
- **Recharts**: Data visualization components
- **Socket.io Client**: Real-time communication
- **Firebase Auth**: User authentication
- **Context API**: State management

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB**: NoSQL database for storing device and sensor data
- **Socket.io**: Real-time bi-directional communication
- **Mongoose**: MongoDB object modeling
- **Express Async Handler**: Exception handling for async routes

## Architecture

```
├── Frontend (React)
│   ├── Public Interface
│   │   └── Landing Page
│   ├── User Dashboard
│   │   ├── Device Control
│   │   ├── Data Visualization
│   │   ├── Room Management
│   │   └── Automation Settings
│   └── Admin Panel
│       ├── User Management
│       └── Global Device Control
│
└── Backend (Node.js/Express)
    ├── API Layer
    │   ├── Device Routes
    │   ├── Sensor Routes
    │   ├── Room Routes
    │   ├── Group Routes
    │   └── Admin Routes
    ├── Socket.io Server
    │   └── Real-time Event Handling
    └── Database Layer
        └── MongoDB Models
```

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Firebase account (for authentication)

### Frontend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/home-bot.git
   cd home-bot/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file
   ```
   VITE_WEATHER_API_KEY=your_weather_api_key
   VITE_API_URL=http://localhost:5001/api
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory
   ```bash
   cd ../backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file
   ```
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server
   ```bash
   npm run dev
   ```

## Deployment

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the build settings:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist

### Backend Deployment (Vercel)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the build settings:
   - Framework Preset: Other
   - Root Directory: backend
   - Build Command: npm install
   - Install Command: npm install
4. Add the environment variables in Vercel dashboard

## User Types

1. **Super Admin:** Full system access, manages users and all devices
2. **Homeowner:** Manages their own home devices, rooms, and automation

## API Documentation

The API provides the following endpoints:

- `/api/devices`: CRUD operations for devices
- `/api/rooms`: Room management
- `/api/groups`: Device grouping
- `/api/schedules`: Automation scheduling
- `/api/sensors`: Sensor data access
- `/api/admin/*`: Admin-specific operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All contributors and team members
- Open source libraries used in this project
- Firebase for authentication
- Pirate Weather API for weather data

---
Built with ❤️ 
