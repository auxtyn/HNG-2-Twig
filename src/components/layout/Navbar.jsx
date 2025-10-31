import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="mx-auto max-w-container px-4">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">Ticket App</Link>

          <nav className="nav-links" role="navigation" aria-label="Primary">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/tickets" className="nav-link">Tickets</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>

          <div className="auth-actions">
            {user ? (
              <>
                <button onClick={handleLogout} className="btn logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </>
            )}

            <button
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              onClick={() => setOpen(v => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {open && (
          <div className="mobile-panel">
            <Link to="/dashboard" onClick={() => setOpen(false)} className="mobile-link">Dashboard</Link>
            <Link to="/tickets" onClick={() => setOpen(false)} className="mobile-link">Tickets</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="mobile-link">About</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar