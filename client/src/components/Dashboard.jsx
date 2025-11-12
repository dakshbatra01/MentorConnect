import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // I update the current time every second for live display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:h-16">
            {/* My responsive navbar layout - Logo and title on top */}
            <div className="flex items-center justify-between h-16 sm:h-auto">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-xl sm:text-2xl">🎯</div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  <span className="hidden sm:inline">MentorConnect Dashboard</span>
                  <span className="sm:hidden">MentorConnect</span>
                </h1>
              </div>
              
              {/* My mobile logout button for better UX */}
              <button
                onClick={logout}
                className="sm:hidden bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                Logout
              </button>
            </div>

            {/* My user info and desktop controls */}
            <div className="flex items-center justify-between pb-3 sm:pb-0 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
                
                <div className="text-left sm:text-right">
                  <div className="text-sm text-gray-700">
                    Welcome, <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="sm:hidden">
                      {currentTime.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className="hidden sm:inline">
                      {currentTime.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                  {user?.role === 'student' && 'Learner'}
                  {user?.role === 'mentor' && 'Mentor'}
                  {user?.role === 'admin' && 'Admin'}
                </span>
                
                {/* My desktop logout button */}
                <button
                  onClick={logout}
                  className="hidden sm:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* My Welcome Section with personalized message */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to MentorConnect, {user?.name}! 🎯</h2>
            <p className="text-indigo-100">
              {user?.role === 'student' && 'Connect with mentors and accelerate your learning journey.'}
              {user?.role === 'mentor' && 'Share your knowledge and guide the next generation.'}
              {user?.role === 'admin' && 'Manage the platform and foster meaningful connections.'}
            </p>
          </div>
        </div>

        {/* My Profile Information Display */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">👤 Profile Information</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              • Verified Member
            </span>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{user?.name}</dd>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Email Address</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{user?.email}</dd>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 capitalize flex items-center">
                {user?.role === 'admin' && 'Platform Admin'}
                {user?.role === 'mentor' && 'Mentor'}
                {user?.role === 'student' && 'Learner'}
              </dd>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900 break-all">{user?._id}</dd>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Account Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </dd>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>



        {/* My Quick Actions Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">🚀 Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {user?.role === 'student' && (
              <>
                <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">�</span>
                  Find Mentors
                </button>
                <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">💬</span>
                  My Sessions
                </button>
                <button className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">📚</span>
                  Learning Path
                </button>
              </>
            )}
            
            {user?.role === 'mentor' && (
              <>
                <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">👥</span>
                  My Students
                </button>
                <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">📅</span>
                  Schedule Session
                </button>
                <button className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">📊</span>
                  Analytics
                </button>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">👥</span>
                  Manage Users
                </button>
                <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">📈</span>
                  Platform Stats
                </button>
                <button className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                  <span className="mr-2">⚙️</span>
                  Settings
                </button>
              </>
            )}
            
            <button 
              onClick={logout}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Welcome to MentorConnect - Where Knowledge Meets Opportunity
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === 'student' && 'Connect with experienced mentors and unlock your potential.'}
                {user?.role === 'mentor' && 'Share your expertise and make a lasting impact on learners.'}
                {user?.role === 'admin' && 'Manage the platform to create meaningful mentor-learner connections.'}
              </p>
            </div>
          </div>
        </div>

        {/* My MentorConnect Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-6">
          {user?.role === 'student' && (
            <>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Active Mentors</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Completed Sessions</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Learning Hours</div>
              </div>
            </>
          )}
          
          {user?.role === 'mentor' && (
            <>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Students Mentored</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Sessions Conducted</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Mentoring Hours</div>
              </div>
            </>
          )}
          
          {user?.role === 'admin' && (
            <>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Active Connections</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Platform Growth</div>
              </div>
            </>
          )}
        </div>


      </main>
    </div>
  );
}