import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/tickets" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Ticket Manager
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {user.username} ({user.role})
                  </span>
                </div>
                <Link
                  to="/tickets"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Tickets
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;