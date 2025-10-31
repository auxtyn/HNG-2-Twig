import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import FormInput from '../../components/auth/FormInput'

const TicketForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open'
  })

  useEffect(() => {
    if (id) {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
      const ticket = tickets.find(t => t.id === id)
      if (ticket) {
        setFormData(ticket)
      }
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validation
    if (!formData.title.trim()) {
      setErrors(prev => ({ ...prev, title: 'Title is required' }))
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
      
      if (id) {
        const updatedTickets = tickets.map(ticket => 
          ticket.id === id ? { ...formData, id } : ticket
        )
        localStorage.setItem('tickets', JSON.stringify(updatedTickets))
        toast.success('Ticket updated successfully')
      } else {
        const newTicket = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }
        localStorage.setItem('tickets', JSON.stringify([...tickets, newTicket]))
        toast.success('Ticket created successfully')
      }

      navigate('/tickets')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Edit Ticket' : 'Create New Ticket'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? 'Update Ticket' : 'Create Ticket'}
        </button>
      </form>
    </div>
  )
}

export default TicketForm