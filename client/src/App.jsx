import { useState } from 'react'
// My component imports for the authentication flow
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Dashboard from './components/Dashboard.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

import './App.css'

function AuthenticatedApp() {
  const { user, logout, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // I show a loading spinner while authentication is processing
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

  // I show the dashboard if user is authenticated
  if (user) {
    return <Dashboard />;
  }

  // I toggle between login and signup forms based on user choice
  return (
    <>
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Signup setIsLogin={setIsLogin} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App
