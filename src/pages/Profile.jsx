import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api.get('/api/auth/me').then(r => {
      if (mounted) setUser(r.data.user)
    }).catch(() => {}).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return (
    <div className="profile-page">
      <div className="container">
        <div className="loading-card card">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    </div>
  )

  if (!user) return (
    <div className="profile-page">
      <div className="container">
        <div className="error-card card">
          <h3>Not Signed In</h3>
          <p>Please sign in to view your profile.</p>
          <a href="/login" className="btn-primary">Sign In</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <section className="profile-header-section fade-in">
          <div className="profile-header-card card">
            <div className="profile-header-content">
              <div className="avatar-large">{(user.name || user.email).charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-email">{user.email}</p>
                <div className="role-badge">{user.role}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Sections */}
        <div className="profile-content">
          {/* About Section */}
          <section className="profile-section fade-in-delay">
            <div className="section-card card">
              <div className="section-header">
                <h2>About You</h2>
                <button className="btn-ghost">Edit</button>
              </div>
              <div className="section-content">
                <p className="empty-state">
                  Tell mentors and students who you are. Add your bio, skills, experience, and links to showcase your expertise.
                </p>
                <div className="quick-stats">
                  <div className="stat">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Sessions Completed</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Hours Mentored</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Reviews Received</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Role-specific Section */}
          {user.role === 'admin' ? (
            <section className="profile-section fade-in-up delay-1">
              <div className="section-card card">
                <div className="section-header">
                  <h2>Admin Dashboard</h2>
                </div>
                <div className="section-content">
                  <p className="section-description">
                    Manage mentors, view platform analytics, moderate content, and oversee user activities.
                  </p>
                  <div className="admin-actions">
                    <button className="btn-primary">View Analytics</button>
                    <button className="btn-ghost">Manage Users</button>
                    <button className="btn-ghost">Content Moderation</button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="profile-section fade-in-up delay-1">
              <div className="section-card card">
                <div className="section-header">
                  <h2>Mentoring Dashboard</h2>
                </div>
                <div className="section-content">
                  <p className="section-description">
                    Manage your mentoring sessions, update availability, and track your mentoring journey.
                  </p>
                  <div className="mentoring-actions">
                    <button className="btn-primary">Schedule Session</button>
                    <button className="btn-ghost">View Sessions</button>
                    <button className="btn-ghost">Update Availability</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Settings Section */}
          <section className="profile-section fade-in-up delay-2">
            <div className="section-card card">
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>
              <div className="section-content">
                <div className="settings-grid">
                  <div className="setting-item">
                    <h3>Profile Information</h3>
                    <p>Update your name, bio, and contact details</p>
                    <button className="btn-ghost">Edit Profile</button>
                  </div>
                  <div className="setting-item">
                    <h3>Privacy & Security</h3>
                    <p>Manage privacy settings and account security</p>
                    <button className="btn-ghost">Privacy Settings</button>
                  </div>
                  <div className="setting-item">
                    <h3>Notifications</h3>
                    <p>Configure email and push notifications</p>
                    <button className="btn-ghost">Notification Settings</button>
                  </div>
                  <div className="setting-item">
                    <h3>Payment & Billing</h3>
                    <p>Manage payment methods and billing history</p>
                    <button className="btn-ghost">Billing Settings</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
