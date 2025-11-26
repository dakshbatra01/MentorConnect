import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../services/auth'

export default function Signup() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('Please fill all fields')
      return
    }
    // client-side validation (mirror server rules)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    const pwdRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/\?]).{8,}$/
    if (!pwdRegex.test(password)) {
      setError('Password must be at least 8 characters long and include at least one number and one special character')
      return
    }
    try {
      setLoading(true)
      const res = await signup({ name, role, email, password })
      if (res?.accessToken || res?.user) {
        // The server sets HttpOnly cookies for tokens; I store the user for the UI
        localStorage.setItem('user', JSON.stringify(res.user || {}))
        // I reload to pick up the header state
        window.location.href = '/'
      } else {
        setError('Signup failed')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Signup error')
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
              <h1 className="branding-title">Join MentorConnect</h1>
              <p className="branding-subtitle">Start your journey today. Whether you're seeking guidance or ready to mentor others, we're here to help you grow.</p>
              <div className="branding-features">
                <div className="feature-item">
                  <div className="feature-icon">🚀</div>
                  <span>Accelerate your career</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🤝</div>
                  <span>Build meaningful connections</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💡</div>
                  <span>Learn from experts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="auth-form-container fade-in-delay">
            <div className="auth-form-card card">
              <div className="form-header">
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">Fill in your details to get started</p>
              </div>

              {error && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">I am a</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>

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
                  <div className="form-help">We'll use this to create your account</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Create a strong password"
                    required
                  />
                  <div className="form-help">Minimum 8 characters with at least one number and special character</div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox" required />
                    <span>I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a></span>
                  </label>
                </div>

                <button type="submit" className="btn-primary form-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner small"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="form-footer">
                <p>Already have an account? <a href="/login" className="link">Sign in</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
