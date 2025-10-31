import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import TicketList from './pages/tickets/TicketList'
import TicketForm from './pages/tickets/TicketForm'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/ui/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />
  
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="tickets" element={
            <ProtectedRoute>
              <TicketList />
            </ProtectedRoute>
          } />
          <Route path="tickets/new" element={
            <ProtectedRoute>
              <TicketForm />
            </ProtectedRoute>
          } />
          <Route path="tickets/:id/edit" element={
            <ProtectedRoute>
              <TicketForm />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
        }}
      />
    </ErrorBoundary>
  )
}

export default App
