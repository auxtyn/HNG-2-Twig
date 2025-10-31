import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTickets, deleteTicket } from '../utils/localStorage';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const { user, hasPermission } = useAuth();

  const loadTickets = useCallback(() => {
    const allTickets = getTickets();
    // Filter tickets based on user role
    const userTickets = hasPermission('manageAllTickets')
      ? allTickets
      : allTickets.filter(ticket => ticket.createdBy === user.id || !ticket.createdBy);

    setTickets(userTickets);
  }, [user, hasPermission]);

  const applyFilters = useCallback(() => {
    let filtered = [...tickets];

    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, filters]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (ticketId) => {
    if (deleteTicket(ticketId)) {
      loadTickets();
      setShowDeleteConfirm(null);
    }
  };

  const canEditTicket = (ticket) => {
    return hasPermission('manageAllTickets') ||
           (hasPermission('manageOwnTickets') && ticket.createdBy === user.id);
  };

  const canDeleteTicket = (ticket) => {
    return hasPermission('manageAllTickets') ||
           (hasPermission('manageOwnTickets') && ticket.createdBy === user.id);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-1">Manage and track your support tickets</p>
        </div>
        <Link
          to="/tickets/new"
          className="btn btn-primary inline-flex items-center px-4 py-2"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="label text-sm font-medium">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="label text-sm font-medium">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="label text-sm font-medium">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tickets..."
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new ticket.</p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {ticket.title}
                    </h3>
                    <div className="flex gap-2 ml-4">
                      <span className={`badge ${getStatusBadgeVariant(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                      <span className={`badge ${getPriorityBadgeVariant(ticket.priority)}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {ticket.description.length > 200
                      ? `${ticket.description.substring(0, 200)}...`
                      : ticket.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 lg:flex-col lg:w-48">
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="btn btn-outline flex-1 lg:flex-none justify-center"
                  >
                    View Details
                  </Link>
                  {canEditTicket(ticket) && (
                    <Link
                      to={`/tickets/${ticket.id}/edit`}
                      className="btn btn-secondary flex-1 lg:flex-none justify-center"
                    >
                      Edit
                    </Link>
                  )}
                  {canDeleteTicket(ticket) && (
                    <button
                      onClick={() => setShowDeleteConfirm(ticket.id)}
                      className="btn btn-danger flex-1 lg:flex-none justify-center"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Ticket</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this ticket? All associated data will be removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn btn-danger"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;