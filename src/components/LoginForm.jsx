import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const { login } = useAuth();
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
    setLoading(true);

    const result = login(formData.username, formData.password);

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
            <h2 className="text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-center text-sm text-gray-600">Access the ticket management system</p>
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
              />
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="card-footer space-y-2">
            <div className="text-center space-x-4">
              <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500">
                Create an account
              </Link>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>User:</strong> user / user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;