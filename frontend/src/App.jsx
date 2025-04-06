import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/landing-page.css';
// Import signup CSS explicitly
import './assets/css/signup.css';
// Import dashboard CSS
import './assets/css/dashboard.css';
// Import weather widget CSS
import './assets/css/weather-widget.css';
// Import energy widget CSS
import './assets/css/energy-widget.css';
// Import quick routines widget CSS
import './assets/css/quick-routines.css';
// Import room filter widget CSS
import './assets/css/room-filter.css';
// Import device grid CSS
import './assets/css/device-grid.css';
// Import insights page css
import './assets/css/insights.css';
// Import device add modal CSS
import './assets/css/device-add-modal.css';

// Import components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import InsightsPage from './components/dashboard/InsightsPage';

// Import auth context
import { AuthProvider } from './context/AuthContext';

function App() {
  // Add animation classes on scroll
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');

      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add('animate-fadeInUp');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    // Trigger once on load
    animateOnScroll();

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<InsightsPage />} />
            {/* Add more protected routes here as needed */}
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
