import React from 'react'

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="bg-blob b1"></div>
          <div className="bg-blob b2"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">Find Your Mentor, Shape Your Future</h1>
            <p className="hero-subtitle">Connect with experienced professionals across industries. Get personalized guidance and accelerate your career growth.</p>
            <div className="hero-actions">
              <a href="/signup" className="btn-primary">Get Started</a>
              <a href="/mentors" className="btn-ghost">Browse Mentors</a>
            </div>
          </div>
          <div className="hero-visual fade-in-delay">
            <div className="hero-card">
              <div className="card-icon">🎯</div>
              <h3>Personalized Matching</h3>
              <p>AI-powered recommendations based on your goals and interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Why Choose MentorConnect?</h2>
            <p>Everything you need to find the perfect mentor and grow.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in-up">
              <div className="feature-icon">👥</div>
              <h3>Expert Mentors</h3>
              <p>Connect with verified professionals from top companies and industries.</p>
            </div>
            <div className="feature-card fade-in-up delay-1">
              <div className="feature-icon">📅</div>
              <h3>Flexible Scheduling</h3>
              <p>Book sessions at your convenience with our easy-to-use platform.</p>
            </div>
            <div className="feature-card fade-in-up delay-2">
              <div className="feature-icon">📈</div>
              <h3>Track Progress</h3>
              <p>Set goals, track milestones, and measure your growth over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-in">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Mentors</div>
            </div>
            <div className="stat-item fade-in delay-1">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Successful Sessions</div>
            </div>
            <div className="stat-item fade-in delay-2">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-in">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of learners who have found their perfect mentor.</p>
            <a href="/signup" className="btn-primary">Join MentorConnect</a>
          </div>
        </div>
      </section>
    </div>
  )
}
