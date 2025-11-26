import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'

export default function Navbar({ user, setUser, theme, toggleTheme }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setUser(null)
    navigate('/')
  }

  return (
    <header className="site-header" style={{borderBottom: '1px solid rgba(255,255,255,0.02)'}}>
      <div className="nav-inner container">
        <Link to="/" className="brand" aria-label="MentorConnect home">
          <div className="logo-mark" aria-hidden>MC</div>
          <div className="brand-text">
            <div className="brand-title accent-gradient">MentorConnect</div>
            <div className="brand-sub">Find the right mentor</div>
          </div>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/mentors" className="nav-link">Mentors</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </nav>

        <div className="nav-actions">
          <div className="theme-toggle" onClick={toggleTheme} title="Toggle theme">{theme === 'dark' ? '🌙' : '☀️'}</div>
          {!user ? (
            <div className="auth-links">
              <Link to="/login" className="btn-link">Login</Link>
              <Link to="/signup" className="nav-cta">Sign up</Link>
            </div>
          ) : (
            <div className="profile-area">
              <Link to="/profile" className="profile-link">{user.name || user.email}</Link>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
