import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import FormInput from '../../components/auth/FormInput'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    
    const result = await login(formData.username, formData.password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
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
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        
        {errors.auth && (
          <div className="error-message">
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

          <button type="submit" className="login-button btn">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login