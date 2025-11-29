import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import LandingPage from './components/LandingPage.jsx';
import BrowseMentors from './components/BrowseMentors.jsx';
import MentorProfile from './components/MentorProfile.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import './App.css';

import DashboardHome from './components/DashboardHome.jsx';
import SessionsContent from './components/SessionsContent.jsx';

import ProfileContent from './components/ProfileContent.jsx';

// Admin components
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import SessionManagement from './components/admin/SessionManagement.jsx';
import MentorManagement from './components/admin/MentorManagement.jsx';
import FeedbackModeration from './components/admin/FeedbackModeration.jsx';
import AdvancedAnalytics from './components/admin/AdvancedAnalytics.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Admin Route Component (only for admin role)
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />

      {/* Protected Routes nested under Dashboard Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="mentors" element={<BrowseMentors />} />
        <Route path="mentor/:id" element={<MentorProfile />} />
        <Route path="sessions" element={<SessionsContent />} />

        <Route path="profile" element={<ProfileContent />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="sessions" element={<SessionManagement />} />
        <Route path="mentors" element={<MentorManagement />} />
        <Route path="feedback" element={<FeedbackModeration />} />
        <Route path="analytics" element={<AdvancedAnalytics />} />
      </Route>

      {/* Catch all - redirect to dashboard or home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}



function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
