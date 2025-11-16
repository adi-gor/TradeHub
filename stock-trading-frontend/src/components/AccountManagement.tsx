import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AccountManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { user, refreshUser } = useAuth();

  const handleAddFunds = async () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.addFunds(amountNum);
      await refreshUser();
      setSuccess(`Successfully added $${amountNum.toFixed(2)}`);
      setAmount('');
      
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFunds = async () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum > (user?.balance || 0)) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.withdrawFunds(amountNum);
      await refreshUser();
      setSuccess(`Successfully withdrew $${amountNum.toFixed(2)}`);
      setAmount('');
      
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to withdraw funds');
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsWithdrawModalOpen(false);
    setAmount('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Account Management</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              ${user?.balance.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Add Funds
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Funds</h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="addAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Add
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="addAmount"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-semibold">${user?.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">New Balance:</span>
                  <span className="font-bold text-green-600">
                    ${((user?.balance || 0) + parseFloat(amount || '0')).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  disabled={loading || !amount}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Withdraw Funds</h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="withdrawAmount"
                    min="0.01"
                    step="0.01"
                    max={user?.balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-semibold">${user?.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Remaining Balance:</span>
                  <span className="font-bold text-blue-600">
                    ${Math.max((user?.balance || 0) - parseFloat(amount || '0'), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawFunds}
                  disabled={loading || !amount}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;