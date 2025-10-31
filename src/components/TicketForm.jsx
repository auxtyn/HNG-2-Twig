import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTicketById, addTicket, updateTicket } from '../utils/localStorage';

const TicketForm = ({ isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      const ticket = getTicketById(id);
      if (ticket) {
        // Check permissions
        if (!hasPermission('manageAllTickets') &&
            (!hasPermission('manageOwnTickets') || ticket.createdBy !== user.id)) {
          setError('You do not have permission to edit this ticket');
          return;
        }

        setFormData({
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority
        });
      } else {
        setError('Ticket not found');
      }
    }
  }, [id, isEdit, user, hasPermission]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        const success = updateTicket(id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });

        if (success) {
          navigate(`/tickets/${id}`);
        } else {
          setError('Failed to update ticket');
        }
      } else {
        const newTicket = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: user.id
        };

        const success = addTicket(newTicket);
        if (success) {
          navigate('/tickets');
        } else {
          setError('Failed to create ticket');
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  if (error && isEdit) {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Ticket' : 'Create New Ticket'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update ticket information' : 'Fill in the details to create a new ticket'}
          </p>
        </div>
        <button
          onClick={() => navigate(isEdit ? `/tickets/${id}` : '/tickets')}
          className="btn btn-outline inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cancel
        </button>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="label text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                maxLength="100"
                className="input"
                placeholder="Enter a descriptive title"
              />
              <p className="text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="label text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows="6"
                maxLength="1000"
                className="input resize-none"
                placeholder="Provide detailed information about the ticket"
              />
              <p className="text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="label text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="input"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="label text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-destructive">
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary inline-flex items-center px-6 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Update Ticket' : 'Create Ticket'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;