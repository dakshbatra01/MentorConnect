import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please provide email and password')
      return
    }
    try {
      setLoading(true)
      const res = await login({ email, password })
      if (res?.accessToken || res?.user) {
  // The server sets HttpOnly cookies for tokens; I store the user for the UI
  localStorage.setItem('user', JSON.stringify(res.user || {}))
  // I reload to ensure the header picks up the user (or use auth context later)
        window.location.href = '/'
      } else {
        setError('Login failed')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-layout">
          {/* Left Side - Branding */}
          <div className="auth-branding fade-in">
            <div className="branding-content">
              <h1 className="branding-title">Welcome Back</h1>
              <p className="branding-subtitle">Continue your journey to find the perfect mentor and accelerate your career growth.</p>
              <div className="branding-features">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <span>Personalized matching</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📈</div>
                  <span>Track your progress</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👥</div>
                  <span>Expert mentors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="auth-form-container fade-in-delay">
            <div className="auth-form-card card">
              <div className="form-header">
                <h2 className="form-title">Sign In</h2>
                <p className="form-subtitle">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>

                <button type="submit" className="btn-primary form-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner small"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="form-footer">
                <p>Don't have an account? <a href="/signup" className="link">Sign up</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
