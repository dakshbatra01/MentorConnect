import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // I send cookies for refresh token flows
})

// I rely on HttpOnly cookies for access/refresh tokens. I don't use an Authorization header from localStorage.
// I send requests with credentials (cookies) enabled via withCredentials: true.

export default api

// My response interceptor: on 401 I attempt a refresh once
api.interceptors.response.use(
  r => r,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // I try to refresh the access token using the refresh cookie. The server sets a new access cookie.
        await api.post('/api/auth/refresh')
        // I retry the original request (cookies will be sent automatically)
        return api(originalRequest)
      } catch (e) {
        // My refresh attempt failed
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
