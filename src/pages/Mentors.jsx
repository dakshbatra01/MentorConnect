import React from 'react'

export default function Mentors() {
  const mentors = [
    {
      id: 1,
      name: 'Dr. Aisha Khan',
      skill: 'Data Science',
      experience: '8 years',
      rating: 4.9,
      sessions: 150,
      bio: 'PhD in Data Science with expertise in machine learning and AI. Helped 50+ professionals transition into tech roles.',
      specialties: ['Machine Learning', 'Python', 'Career Transition']
    },
    {
      id: 2,
      name: 'Ravi Patel',
      skill: 'Frontend Development',
      experience: '6 years',
      rating: 4.8,
      sessions: 120,
      bio: 'Senior Frontend Engineer at FAANG company. Passionate about modern web technologies and user experience design.',
      specialties: ['React', 'JavaScript', 'UI/UX Design']
    },
    {
      id: 3,
      name: 'Lina Gomez',
      skill: 'Product Management',
      experience: '10 years',
      rating: 5.0,
      sessions: 200,
      bio: 'Product Director with experience launching products at scale. Expert in product strategy and team leadership.',
      specialties: ['Product Strategy', 'Agile', 'Leadership']
    },
    {
      id: 4,
      name: 'Marcus Chen',
      skill: 'Backend Development',
      experience: '7 years',
      rating: 4.7,
      sessions: 95,
      bio: 'Full-stack developer specializing in scalable systems. Built high-traffic applications serving millions of users.',
      specialties: ['Node.js', 'Databases', 'System Design']
    },
    {
      id: 5,
      name: 'Sarah Johnson',
      skill: 'UX Design',
      experience: '9 years',
      rating: 4.9,
      sessions: 180,
      bio: 'Senior UX Designer with a background in psychology. Creates intuitive and delightful user experiences.',
      specialties: ['User Research', 'Design Systems', 'Prototyping']
    },
    {
      id: 6,
      name: 'Alex Rodriguez',
      skill: 'DevOps',
      experience: '5 years',
      rating: 4.6,
      sessions: 75,
      bio: 'DevOps Engineer focused on cloud infrastructure and automation. Helps teams scale efficiently and securely.',
      specialties: ['AWS', 'Docker', 'CI/CD']
    }
  ]

  return (
    <div className="mentors-page">
      {/* Header Section */}
      <section className="mentors-header">
        <div className="container">
          <div className="header-content fade-in">
            <h1 className="page-title">Find Your Perfect Mentor</h1>
            <p className="page-subtitle">Connect with experienced professionals across various fields. Get personalized guidance to accelerate your career growth.</p>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="mentors-section">
        <div className="container">
          <div className="mentors-grid">
            {mentors.map((mentor, index) => (
              <div key={mentor.id} className={`mentor-card-wrapper fade-in-up delay-${index % 3}`}>
                <div className="mentor-card">
                  <div className="mentor-header">
                    <div className="mentor-avatar">{mentor.name.charAt(0)}</div>
                    <div className="mentor-info">
                      <h3 className="mentor-name">{mentor.name}</h3>
                      <p className="mentor-skill">{mentor.skill}</p>
                      <div className="mentor-meta">
                        <span className="meta-item">⭐ {mentor.rating}</span>
                        <span className="meta-item">{mentor.experience}</span>
                        <span className="meta-item">{mentor.sessions} sessions</span>
                      </div>
                    </div>
                  </div>

                  <p className="mentor-bio">{mentor.bio}</p>

                  <div className="mentor-specialties">
                    {mentor.specialties.map((specialty, idx) => (
                      <span key={idx} className="specialty-tag">{specialty}</span>
                    ))}
                  </div>

                  <button className="btn-primary mentor-cta">Request Session</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
