# Smart Home Automation Web App

A web application for monitoring and controlling smart home devices with data visualization, device control, and AI-based predictions.

## Project Overview

This project involves developing a web application as part of a smart home automation system that integrates IoT and AI. The web app serves as the central platform for remote monitoring, device control, and AI-based temperature predictions.

## Current Status

The project currently has a fully functional landing page with:
- Modern, responsive design with glassmorphism elements
- Interactive features section showcasing the system's capabilities
- Step-by-step explanation of how the system works
- Testimonials from users
- Clear call-to-action sections
- Mobile-friendly layout that works on all devices

## Tech Stack

- **Frontend**: 
  - React for component-based UI
  - Bootstrap for responsive design
  - React Router for navigation
  - Font Awesome for icons
  - Custom CSS with glassmorphism effects
  - Space Mono font for consistent typography

- **Backend**: Node.js, Express, MongoDB, Socket.io (in development)
- **Deployment**: Vercel (frontend), TBD (backend)

## Features (Planned)

- User-friendly dashboard interface
- Real-time and historical sensor data visualization
- Device control capabilities
- AI-based temperature predictions
- Security alerts and notifications
- Mobile-responsive design

## Project Structure

```
SWE-HomeAutomation/
├── frontend/                  # React frontend application
│   ├── public/                # Static assets
│   └── src/                   # Source code
│       ├── assets/            # Images, fonts, CSS
│       ├── components/        # Reusable UI components
│       │   ├── LandingPage.jsx # Landing page component
│       │   └── Dashboard.jsx   # Dashboard component (placeholder)
│       ├── App.jsx            # Main application component
│       └── main.jsx           # Entry point
├── backend/                   # Express backend (in development)
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zviko163/SWE-HomeAutomation.git
   cd SWE-HomeAutomation
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Screenshots

Images of the current landing page will be added here.

## Roadmap

- ✅ Create responsive landing page
- ⬜ Implement dashboard UI components
- ⬜ Develop backend API endpoints
- ⬜ Connect frontend to backend services
- ⬜ Implement data visualization components
- ⬜ Add device control functionality
- ⬜ Integrate AI-based predictions
- ⬜ Deploy the full application

## Contributing

Guidelines for contributing to this project will be added here.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All team members and contributors
- Open source libraries and frameworks used in this project
