import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = resetPassword(username);

    if (result.success) {
      setMessage(result.message);
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
            <h2 className="text-center text-3xl font-bold text-gray-900">Forgot your password?</h2>
            <p className="text-center text-sm text-gray-600">Enter your username to reset your password</p>
          </div>
          <form onSubmit={handleSubmit} className="card-content space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="label">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="input"
                placeholder="Enter your username"
              />
            </div>

            {error && (
              <div className="alert alert-destructive">
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="alert alert-success">
                <span>{message}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="card-footer">
            <div className="text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;