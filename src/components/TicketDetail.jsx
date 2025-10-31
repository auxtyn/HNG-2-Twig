import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTicketById, deleteTicket } from '../utils/localStorage';

const TicketDetail = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { user, hasPermission } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const loadTicket = useCallback(() => {
    const foundTicket = getTicketById(id);
    if (foundTicket) {
      // Check permissions
      if (!hasPermission('manageAllTickets') &&
          (!hasPermission('manageOwnTickets') || foundTicket.createdBy !== user.id)) {
        setError('You do not have permission to view this ticket');
      } else {
        setTicket(foundTicket);
      }
    } else {
      setError('Ticket not found');
    }
    setLoading(false);
  }, [id, user, hasPermission]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleDelete = () => {
    if (deleteTicket(id)) {
      navigate('/tickets');
    } else {
      setError('Failed to delete ticket');
    }
  };

  const canEditTicket = () => {
    return hasPermission('manageAllTickets') ||
           (hasPermission('manageOwnTickets') && ticket.createdBy === user.id);
  };

  const canDeleteTicket = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading ticket...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="alert alert-destructive mb-4">
          <span>{error}</span>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="btn btn-primary"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tickets')}
            className="btn btn-outline p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
            <p className="text-gray-600 mt-1">Ticket #{ticket.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className={`badge ${getStatusBadgeVariant(ticket.status)}`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
            <span className={`badge ${getPriorityBadgeVariant(ticket.priority)}`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>

          <div className="flex gap-2">
            {canEditTicket() && (
              <Link
                to={`/tickets/${id}/edit`}
                className="btn btn-primary inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            )}
            {canDeleteTicket() && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-danger inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">ID</span>
                <span className="text-sm text-gray-900 font-mono">#{ticket.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <span className={`badge ${getStatusBadgeVariant(ticket.status)} text-xs`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Priority</span>
                <span className={`badge ${getPriorityBadgeVariant(ticket.priority)} text-xs`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(ticket.updatedAt).toLocaleString()}
                </span>
              </div>
              {ticket.createdBy && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">Created By</span>
                  <span className="text-sm text-gray-900">User #{ticket.createdBy}</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Ticket created</p>
                  <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {ticket.createdAt !== ticket.updatedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">Ticket updated</p>
                    <p className="text-xs text-gray-500">{new Date(ticket.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
                onClick={() => setShowDeleteConfirm(false)}
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

export default TicketDetail;