import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import FormInput from '../../components/auth/FormInput'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      toast.error('Passwords do not match')
      return
    }

    const result = await register(formData.username, formData.password)
    if (result.success) {
      toast.success('Registration successful! Welcome aboard!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Registration failed')
      setErrors({ auth: result.error })
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        {errors.auth && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.auth}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <button
            type="submit"
            className="btn w-full bg-blue-500 p-3 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register