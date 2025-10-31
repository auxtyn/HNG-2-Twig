import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = register(formData.username, formData.password, formData.role);

    if (result.success) {
      navigate('/tickets');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-center text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="text-center text-sm text-gray-600">Join the ticket management system</p>
          </div>
          <form onSubmit={handleSubmit} className="card-content space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                className="input"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="input"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="input"
                placeholder="Confirm your password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="label">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="input"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-destructive">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="card-footer">
            <div className="text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;