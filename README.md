I'll update the README to include all the dashboard work we've done in this chat. Here's an enhanced version that includes our recent progress:

```markdown
# Smart Home Automation Web App
A web application for monitoring and controlling smart home devices with data visualization, device control, and AI-based predictions.

## Project Overview
This project involves developing a web application as part of a smart home automation system that integrates IoT and AI. The web app serves as the central platform for remote monitoring, device control, and AI-based temperature predictions.

## Current Status
The project currently includes:

* A modern, responsive landing page with glassmorphism elements
* Interactive features section showcasing the system's capabilities
* Step-by-step explanation of how the system works
* Testimonials from users
* Clear call-to-action sections
* Mobile-friendly layout that works on all devices
* Complete user authentication system
  * Email and password registration with comprehensive validation
  * Email and password login functionality
  * Google sign-in integration (for both signup and login)
  * User profile creation
  * Secure authentication via Firebase
  * Password visibility toggling for better user experience
  * Remember me functionality
  * Form validation with helpful error messages
* Protected routes for authenticated users
* Authentication state management across the app
* User logout functionality in dashboard
* Modern smart home dashboard UI with:
  * Personalized greeting based on time of day
  * Real-time weather widget using Pirate Weather API
  * Energy usage statistics and visualization
  * Quick routines for common automation tasks
  * Room filtering for device management
  * Interactive device cards with toggle controls
  * Support for different device types (lights, thermostats, etc.)
  * Responsive layout that works on mobile and desktop

## Tech Stack
**Frontend:**
* React for component-based UI
* Bootstrap for responsive design
* React Router for navigation and protected routes
* React Context API for global state management
* Recharts for data visualization
* Font Awesome for icons
* Custom CSS with glassmorphism effects
* Space Mono font for consistent typography
* Firebase Authentication for user management
* Environment variables for secure API key management

**Backend:** Node.js, Express, MongoDB, Socket.io (in development)

**Third-Party APIs:**
* Pirate Weather API for real-time weather data

**Deployment:** Vercel (frontend), TBD (backend)

## Features (Implemented & Planned)
✅ Responsive landing page with modern design  
✅ User authentication system  
✅ Email/password registration with validation  
✅ Email/password login with validation  
✅ Google sign-in option for both signup and login  
✅ Secure user profile creation  
✅ Remember me functionality  
✅ Protected routes with authentication  
✅ Global authentication state management  
✅ User logout functionality  
✅ User-friendly dashboard interface  
✅ Real-time weather data integration  
✅ Energy usage visualization  
✅ Quick routine buttons for automation control  
✅ Room-based device filtering  
✅ Interactive device control cards  
⬜ Connect to real smart home devices  
⬜ AI-based temperature predictions  
⬜ Security alerts and notifications  
⬜ User settings and customization options  

## Project Structure
```
SWE-HomeAutomation/
├── frontend/                  # React frontend application
│   ├── public/                # Static assets
│   └── src/                   # Source code
│       ├── assets/            # Images, fonts, CSS
│       │   ├── css/           # Stylesheet files
│       │   │   ├── landing-page.css    # Landing page styles
│       │   │   ├── signup.css          # Authentication page styles
│       │   │   ├── dashboard.css       # Dashboard layout styles
│       │   │   ├── weather-widget.css  # Weather widget styles
│       │   │   ├── energy-widget.css   # Energy usage widget styles
│       │   │   ├── quick-routines.css  # Quick routines styles
│       │   │   ├── room-filter.css     # Room filter styles
│       │   │   └── device-grid.css     # Device grid styles
│       │   └── images/        # Image assets including Google icon
│       ├── components/        # Reusable UI components
│       │   ├── LandingPage.jsx   # Landing page component
│       │   ├── SignupPage.jsx    # Signup page component
│       │   ├── LoginPage.jsx     # Login page component
│       │   ├── ProtectedRoute.jsx # Route protection component
│       │   ├── dashboard/        # Dashboard components
│       │   │   ├── Dashboard.jsx     # Main dashboard layout
│       │   │   ├── WeatherWidget.jsx # Weather widget component
│       │   │   ├── EnergyUsage.jsx   # Energy usage component
│       │   │   ├── QuickRoutines.jsx # Quick routines component
│       │   │   ├── RoomFilter.jsx    # Room filter component
│       │   │   └── DeviceGrid.jsx    # Device grid component
│       ├── context/           # React Context for state management
│       │   └── AuthContext.jsx    # Authentication context provider
│       ├── firebase.js        # Firebase configuration and initialization
│       ├── App.jsx            # Main application with authenticated routes
│       └── main.jsx           # Entry point with bootstrap imports
├── backend/                   # Express backend (in development)
├── .env                       # Environment variables (not in version control)
├── .env.example               # Example environment variables
└── README.md                  # Project documentation
```

## Dashboard Features
**Weather Widget:**
* Real-time weather data from Pirate Weather API
* Current temperature, conditions, and icon
* High/low temperatures for the day
* Humidity and wind speed information
* Automatic location detection via timezone

**Energy Usage:**
* Current electricity usage display
* Today's total consumption
* Week-over-week comparison with trend indicators
* 24-hour usage chart with hourly data points
* Interactive tooltip for detailed information

**Quick Routines:**
* One-click activation of common home automation scenarios
* Visual feedback while routines are running
* Support for morning, working, sleeping, and away modes
* Option to add custom routines

**Device Management:**
* Room-based filtering of devices
* Interactive toggle switches for controlling devices
* Visual indicators for device status (on/off)
* Support for different device types (lights, thermostats, etc.)
* Device-specific controls and information
* Empty state handling when no devices are in a room

**UI/UX Features:**
* Time-based personalized greeting
* Responsive layout that works on all devices
* Consistent glassmorphism styling across components
* Smooth animations and transitions
* Loading and error states for all data-dependent components

## Authentication Features
**Form Validation:**
* Name validation (signup)
* Email format validation
* Password strength requirements (length, uppercase, lowercase, numbers, special characters)
* Password confirmation matching (signup)
* Terms and conditions acceptance (signup)

**User Experience:**
* Password visibility toggle
* Remember me functionality (login)
* Inline error messages for invalid inputs
* Loading indicators during authentication process
* Success redirects to dashboard

**Security:**
* Secure password handling through Firebase
* No plaintext password storage
* Protected routes for authenticated users
* Authentication state management with React Context
* Loading states during authentication checks
* Environment variables for API key security

## Getting Started
### Prerequisites
* Node.js (v16+)
* npm or yarn
* A Firebase account (for authentication)
* A Pirate Weather API key

### Installation
1. Clone the repository:
```
git clone https://github.com/zviko163/SWE-HomeAutomation.git
cd SWE-HomeAutomation
```

2. Install frontend dependencies:
```
cd frontend
npm install
```

3. Set up Firebase:
   * Create a Firebase project at https://console.firebase.google.com/
   * Enable Authentication methods (Email/Password and Google)
   * Copy your Firebase configuration to src/firebase.js

4. Set up environment variables:
   * Copy .env.example to .env
   * Add your Pirate Weather API key to .env:
   ```
   VITE_WEATHER_API_KEY=your_pirate_weather_api_key_here
   ```

5. Start the development server:
```
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:5173
```

## Screenshots
Images of the current landing page, signup form, and dashboard will be added here.

## Roadmap
✅ Create responsive landing page  
✅ Implement user authentication  
✅ Set up protected routes  
✅ Implement authentication state management  
✅ Create dashboard UI components  
✅ Integrate real-time weather data  
✅ Implement energy usage visualization  
✅ Add device management interface  
⬜ Develop backend API endpoints  
⬜ Connect frontend to backend services  
⬜ Implement real device control functionality  
⬜ Integrate AI-based predictions  
⬜ Add user settings and customization  
⬜ Implement notifications system  
⬜ Deploy the full application  

## Contributing
Guidelines for contributing to this project will be added here.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
* All team members and contributors
* Open source libraries and frameworks used in this project
* Firebase for authentication services
* Pirate Weather for weather data API
```
