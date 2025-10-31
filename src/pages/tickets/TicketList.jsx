import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ErrorBoundary from '../../components/ErrorBoundary'
import LoadingSpinner from '../../components/LoadingSpinner'

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800'
}

const TicketList = () => {
  const [tickets, setTickets] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'newest'
  })

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]')
        setTickets(savedTickets)
        setFiltered(savedTickets)
      } catch (err) {
        setError('Failed to load tickets')
        toast.error('Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  useEffect(() => {
    let res = [...tickets]

    // Apply status filter
    if (filters.status !== 'all') {
      res = res.filter(t => t.status === filters.status)
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      res = res.filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    res.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return new Date(a.createdAt) - new Date(b.createdAt)
    })

    setFiltered(res)
  }, [tickets, filters])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const updatedTickets = tickets.filter(ticket => ticket.id !== id)
        localStorage.setItem('tickets', JSON.stringify(updatedTickets))
        setTickets(updatedTickets)
        setFiltered(updatedTickets)
        toast.success('Ticket deleted successfully')
      } catch (error) {
        toast.error('Failed to delete ticket')
      }
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>

  return (
    <ErrorBoundary>
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Tickets</h1>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="border rounded px-3 py-2 flex-1"
            />

            <Link
              to="/tickets/new"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create New Ticket
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-lg shadow p-6 card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Link to={`/tickets/${t.id}`} className="no-underline" style={{ color: '#0f172a', fontWeight: 600 }}>{t.title}</Link>
                  <div className="text-muted">{t.description}</div>
                </div>
                <div>
                  <span className={`badge ${t.status === 'open' ? 'badge-open' : t.status === 'in_progress' ? 'badge-in-progress' : 'badge-closed'}`}>{t.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && <div className="text-muted center card">No tickets found</div>}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default TicketList