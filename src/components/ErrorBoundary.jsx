import React from 'react'
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:text-blue-700"
            >
              Refresh page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary