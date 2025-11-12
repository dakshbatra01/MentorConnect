import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const API_BASE_URL = 'http://localhost:4000/api/auth';

  // My auto refresh token system when access token expires
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh token');
      }

      const newToken = data.authToken;
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // My enhanced API call system with automatic token refresh
  const apiCall = async (endpoint, options = {}, retryCount = 0) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'auth-token': token }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    // I handle token expiration and retry with refresh token
    if (response.status === 401 && refreshToken && retryCount === 0) {
      try {
        const newToken = await refreshAccessToken();
        // I retry the original request with my new token
        return apiCall(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            'auth-token': newToken,
          },
        }, 1);
      } catch (refreshError) {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      throw new Error(data.error || data.errors?.[0]?.msg || 'Something went wrong');
    }

    return data;
  };

  // My login function to authenticate users
  const login = async (email, password) => {
    try {
      // I don't set loading to true here to prevent form reset on error
      const data = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const authToken = data.authToken;
      const refreshTokenData = data.refreshToken;
      const userData = data.user;

      console.log('My login response data:', data);
      console.log('Setting my user:', userData);

      // I set all authentication state synchronously
      setUser(userData);
      setToken(authToken);
      setRefreshToken(refreshTokenData);
      setLoading(false);
      
      // I store tokens in localStorage for persistence
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshTokenData);
      
      console.log('My login successful, user state set to:', userData);
      
      return { success: true };
    } catch (error) {
      console.error('My login error:', error);
      // I don't modify loading state on error to keep form visible
      return { success: false, error: error.message };
    }
  };

  // My signup function to register new users
  const signup = async (name, email, password, role = 'student') => {
    try {
      // I don't set loading to true here to prevent form reset on error
      const data = await apiCall('/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });

      const authToken = data.authToken;
      const refreshTokenData = data.refreshToken;
      const userData = data.user;

      // I set all state synchronously after successful signup
      setUser(userData);
      setToken(authToken);
      setRefreshToken(refreshTokenData);
      setLoading(false);
      
      // I store tokens in localStorage for session persistence
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshTokenData);
      return { success: true };
    } catch (error) {
      console.error('My signup error:', error);
      // I don't modify loading state on error to keep form visible
      return { success: false, error: error.message };
    }
  };

  // My function to fetch authenticated user data
  const fetchUser = async () => {
    if (!token) {
      console.log('No token available for fetchUser');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data with token:', token ? 'exists' : 'missing');
      const userData = await apiCall('/getuser', {
        method: 'POST',
      });
      console.log('Successfully fetched user data:', userData);
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Fetch user error:', error.message);
      // If token is invalid or expired, try to refresh or logout
      if (refreshToken) {
        console.log('Attempting to refresh token...');
        try {
          await refreshAccessToken();
          // Retry fetching user after token refresh
          const userData = await apiCall('/getuser', {
            method: 'POST',
          });
          setUser(userData);
          setLoading(false);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError.message);
          setLoading(false);
          logout();
        }
      } else {
        console.log('No refresh token available, logging out');
        setLoading(false);
        logout();
      }
    }
  };

  // My logout function to clear authentication
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  // I initialize tokens from localStorage when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    console.log('I am initializing from localStorage - token:', !!storedToken, 'refreshToken:', !!storedRefreshToken);
    
    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
    }
    setInitialized(true);
  }, []);

  // I restore session when tokens are initialized
  useEffect(() => {
    if (!initialized) return;
    
    console.log('My session restoration check - token:', !!token, 'refreshToken:', !!refreshToken, 'user:', !!user);
    
    if (token && refreshToken && !user) {
      console.log('I am restoring session...');
      fetchUser();
    } else if (initialized && !token) {
      console.log('I have no tokens available, not loading');
      setLoading(false);
    }
    // I don't set loading to false if I have tokens but am still processing user data
  }, [initialized, token, refreshToken]);

  const value = {
    user,
    token,
    refreshToken,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};