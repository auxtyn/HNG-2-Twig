import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800'
}

const RecentActivity = ({ tickets }) => {
  const sortedTickets = [...tickets].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      {sortedTickets.map(ticket => (
        <div key={ticket.id} className="mb-4 last:mb-0 border-b last:border-0 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <Link 
                to={`/tickets/${ticket.id}`}
                className="font-medium hover:text-blue-600"
              >
                {ticket.title}
              </Link>
              <p className="text-sm text-gray-500">
                {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[ticket.status]}`}>
              {ticket.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const StatCard = ({ title, value, bgColor = 'bg-blue-100' }) => (
  <div className={`${bgColor} rounded-lg shadow p-6`}>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0
  })
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]')
      setTickets(savedTickets)
      
      // Update stats
      const newStats = {
        total: savedTickets.length,
        open: savedTickets.filter(t => t.status === 'open').length,
        inProgress: savedTickets.filter(t => t.status === 'in_progress').length,
        closed: savedTickets.filter(t => t.status === 'closed').length
      }
      setStats(newStats)
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div className="py-8">Loading...</div>
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          to="/tickets/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Ticket
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tickets" 
          value={stats.total} 
          bgColor="bg-blue-100"
        />
        <StatCard 
          title="Open Tickets" 
          value={stats.open} 
          bgColor="bg-green-100"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          bgColor="bg-yellow-100"
        />
        <StatCard 
          title="Closed Tickets" 
          value={stats.closed} 
          bgColor="bg-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentActivity tickets={tickets} />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Response Rate</span>
              <span className="font-medium">
                {tickets.length > 0 ? 
                  `${Math.round((stats.closed / stats.total) * 100)}%` : 
                  'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Resolution Time</span>
              <span className="font-medium">2.5 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard