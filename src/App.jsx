import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Mentors from './pages/Mentors'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import { logout } from './services/auth'

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const profileRef = useRef(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      setUser(null)
    }
  // I read the persisted theme
    const t = localStorage.getItem('theme') || 'light'
    setTheme(t)
    if (t === 'dark') document.documentElement.classList.add('dark')
  }, [])

  // I sync the user across tabs & update on login (storage events)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'user') {
        try { setUser(JSON.parse(e.newValue)) } catch { setUser(null) }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // I close the profile dropdown when clicking outside
  useEffect(() => {
    function onClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  function handleLogout() {
    logout()
    setUser(null)
    navigate('/')
  }

  function toggleTheme() {
    const t = theme === 'dark' ? 'light' : 'dark'
    setTheme(t)
    localStorage.setItem('theme', t)
    if (t === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }
  function onLogout() {
    handleLogout()
    setProfileOpen(false)
  }
  return (
    <div className="app-wrapper">
      <Navbar user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>&copy; MentorConnect. Connecting mentors and learners.</p>
        </div>
      </footer>
    </div>
  )
}
