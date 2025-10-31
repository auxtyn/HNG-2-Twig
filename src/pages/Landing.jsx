import React from 'react'
import { Link } from 'react-router-dom'

const features = [
  { icon: '🧭', title: 'Organize', description: 'Categorize and filter tickets easily.' },
  { icon: '⚡', title: 'Fast Actions', description: 'Quickly create, assign and resolve issues.' },
  { icon: '📊', title: 'Insights', description: 'Track SLA and team performance.' },
]

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-blue-500/25 to-cyan-400/25 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Hero section with enhanced wave */}
      <div className="relative wave-bg pb-40">
        {/* subtle dark overlay for readable white text */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
        <div className="pt-36 pb-48 px-4 text-center relative z-10">
          <div className="mx-auto max-w-3xl animate-fadeInUp">
            {/* contrast panel so white text is always visible */}
            <div className="inline-block bg-black/45 backdrop-blur-md rounded-2xl p-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-red" style={{ textShadow: '0 6px 18px rgba(0,0,0,0.7)' }}>
                Ticket Management System
              </h1>
              <p className="text-lg md:text-xl text-white-100 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
                Streamline support workflows — create, assign and resolve tickets with clarity.
              </p>

              <div className="flex justify-center gap-6 flex-wrap mt-4 mx-5">
                <Link
                  to="/login"
                  className="btn btn-primary transform hover:scale-105 px-8 py-3 text-lg m-5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline transform hover:scale-105 px-8 py-3 text-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced feature boxes (reduced overlap) */}
      <div className="mx-auto max-w-container px-6 -mt-20 mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#475569' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action section */}
      <div className="px-4 pb-16">
        <div className="card text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" style={{ background: 'linear-gradient(90deg,#2563eb,#7c3aed)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Ready to get started?
          </h2>
          <p className="text-muted mb-6">Join teams who manage support efficiently with our platform.</p>
          <Link to="/register" className="btn btn-primary">Create Your Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Landing