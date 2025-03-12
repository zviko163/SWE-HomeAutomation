# Smart Home Automation Web App
A web application for monitoring and controlling smart home devices with data visualization, device control, and AI-based predictions.

## Project Overview
This project involves developing a web application as part of a smart home automation system that integrates IoT and AI. The web app serves as the central platform for remote monitoring, device control, and AI-based temperature predictions.

## Current Status
The project currently includes:
- A modern, responsive landing page with glassmorphism elements
- Interactive features section showcasing the system's capabilities
- Step-by-step explanation of how the system works
- Testimonials from users
- Clear call-to-action sections
- Mobile-friendly layout that works on all devices
- **Complete user authentication system**
  - Email and password registration with comprehensive validation
  - Email and password login functionality 
  - Google sign-in integration (for both signup and login)
  - User profile creation
  - Secure authentication via Firebase
  - Password visibility toggling for better user experience
  - Remember me functionality
  - Form validation with helpful error messages

## Tech Stack
- **Frontend**: 
  - React for component-based UI
  - Bootstrap for responsive design
  - React Router for navigation
  - Font Awesome for icons
  - Custom CSS with glassmorphism effects
  - Space Mono font for consistent typography
  - **NEW: Firebase Authentication** for user management
- **Backend**: Node.js, Express, MongoDB, Socket.io (in development)
- **Deployment**: Vercel (frontend), TBD (backend)

## Features (Implemented & Planned)
- ✅ Responsive landing page with modern design
- ✅ User authentication system
  - ✅ Email/password registration with validation
  - ✅ Email/password login with validation
  - ✅ Google sign-in option for both signup and login
  - ✅ Secure user profile creation
  - ✅ Remember me functionality
- ⬜ User-friendly dashboard interface
- ⬜ Real-time and historical sensor data visualization
- ⬜ Device control capabilities
- ⬜ AI-based temperature predictions
- ⬜ Security alerts and notifications

## Project Structure
```
SWE-HomeAutomation/
├── frontend/                  # React frontend application
│   ├── public/                # Static assets
│   └── src/                   # Source code
│       ├── assets/            # Images, fonts, CSS
│       │   ├── css/           # Stylesheet files
│       │   │   ├── landing-page.css  # Landing page styles
│       │   │   └── signup.css        # Authentication page styles
│       │   └── images/        # Image assets including Google icon
│       ├── components/        # Reusable UI components
│       │   ├── LandingPage.jsx # Landing page component
│       │   ├── SignupPage.jsx  # Signup page component
│       │   ├── LoginPage.jsx   # Login page component
│       │   └── Dashboard.jsx   # Dashboard component (placeholder)
│       ├── firebase.js        # Firebase configuration and initialization
│       ├── App.jsx            # Main application component with routes
│       └── main.jsx           # Entry point with bootstrap imports
├── backend/                   # Express backend (in development)
└── README.md                  # Project documentation
```

## Authentication Features
- **Form Validation**:
  - Name validation (signup)
  - Email format validation
  - Password strength requirements (length, uppercase, lowercase, numbers, special characters)
  - Password confirmation matching (signup)
  - Terms and conditions acceptance (signup)
- **User Experience**:
  - Password visibility toggle
  - Remember me functionality (login)
  - Inline error messages for invalid inputs
  - Loading indicators during authentication process
  - Success redirects to dashboard
- **Security**:
  - Secure password handling through Firebase
  - No plaintext password storage
  - Protected routes (in progress)

## Getting Started
### Prerequisites
- Node.js (v16+)
- npm or yarn
- A Firebase account (for authentication)

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
3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication methods (Email/Password and Google)
   - Copy your Firebase configuration to src/firebase.js
   
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Screenshots
Images of the current landing page and signup form will be added here.

## Roadmap
- ✅ Create responsive landing page
- ✅ Implement user authentication
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
- Firebase for authentication services
