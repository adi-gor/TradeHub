import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">$</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TradeHub
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-2">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Dashboard</span>
                </span>
              </button>

              <button
                onClick={() => navigate('/trading')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/trading')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>💹</span>
                  <span>Trading</span>
                </span>
              </button>

              <button
                onClick={() => navigate('/watchlist')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/watchlist')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>Watchlist</span>
                </span>
              </button>

              <button
                onClick={() => navigate('/analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/analytics')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Analytics</span>
                </span>
              </button>

              <button
                onClick={() => navigate('/account')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/account')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>👤</span>
                  <span>Account</span>
                </span>
              </button>
            </div>
  </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-6">
            {/* Balance Display */}
            <div className="hidden sm:block bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-2 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 font-medium">Balance</p>
              <p className="text-lg font-bold text-green-700">
                ${user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;