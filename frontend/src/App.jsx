import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

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
// CSS for automation page
import './assets/css/automation.css';
// CSS for profile page
import './assets/css/profile.css';
// css for the notifiactions components
import './assets/css/notifications.css';
// css for the notifiactions components
import './assets/css/admin/admin.css';
import './assets/css/admin/user-management.css';

// Import components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import InsightsPage from './components/dashboard/InsightsPage';
import AutomationPage from './components/dashboard/AutomationPage';
import ProfilePage from './components/dashboard/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import GlobalDeviceMonitor from './components/admin/GlobalDeviceMonitor';
import AdminProfilePage from './components/admin/AdminProfilePage';

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
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Homeowner protected routes */}
            <Route element={<ProtectedRoute requiredRole="homeowner" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin protected routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/devices" element={<GlobalDeviceMonitor />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
            </Route>

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
