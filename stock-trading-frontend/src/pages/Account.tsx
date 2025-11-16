import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountManagement from '../components/AccountManagement';
import Navbar from '../components/Navbar';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* User Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Profile Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Username:</span>
                <span className="font-semibold">{user?.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">User ID:</span>
                <span className="font-semibold">#{user?.id}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Account Balance:</span>
                <span className="font-bold text-green-600 text-lg">
                  ${user?.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <AccountManagement />

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition"
              >
                <span className="font-medium">View Dashboard</span>
                <p className="text-sm text-gray-600">See your portfolio and transactions</p>
              </button>
              <button
                onClick={() => navigate('/trading')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition"
              >
                <span className="font-medium">Start Trading</span>
                <p className="text-sm text-gray-600">Buy and sell stocks</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;