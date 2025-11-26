import api from './api'

export async function login(credentials) {
  // I expect { email, password }
  const res = await api.post('/api/auth/login', credentials)
  // The backend returns { accessToken, user } and sets a refresh cookie
  const data = res.data || {}
  if (data.user) {
    // I store a minimal user for UI state; tokens remain in HttpOnly cookies
    localStorage.setItem('user', JSON.stringify(data.user || {}))
  }
  return data
}

export async function signup(data) {
  // I expect { name, role, email, password }
  const res = await api.post('/api/auth/signup', data)
  const d = res.data || {}
  if (d.user) {
    // I store the minimal user for UI state after signup
    localStorage.setItem('user', JSON.stringify(d.user || {}))
  }
  return d
}

export function logout() {
  // I attempt server-side logout to clear the refresh cookie
  try { api.post('/api/auth/logout') } catch (e) {}
  localStorage.removeItem('user')
}
