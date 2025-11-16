import { useEffect, useState } from 'react';
import { portfolioAPI } from '../services/api';
import { type PortfolioSummary as PortfolioSummaryType } from '../types';

const PortfolioSummary = () => {
  const [summary, setSummary] = useState<PortfolioSummaryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPortfolioSummary();
  }, []);

  const fetchPortfolioSummary = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolioSummary();
      setSummary(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch portfolio summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-l-4 border-red-500">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-900">Error Loading Portfolio</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const profitLossColor = summary.totalProfitLoss >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
  const profitLossSign = summary.totalProfitLoss >= 0 ? '+' : '';
  const profitLossIcon = summary.totalProfitLoss >= 0 ? '📈' : '📉';

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Overview</h2>
        <p className="text-gray-600">Track your investments and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cash Balance */}
        <div className="stat-card from-blue-500 to-blue-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">💰</span>
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Cash Balance</p>
          <p className="text-3xl font-bold">
            ${summary.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Portfolio Value */}
        <div className="stat-card from-purple-500 to-purple-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">📊</span>
            <div className="w-5 h-5 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Portfolio Value</p>
          <p className="text-3xl font-bold">
            ${summary.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Value */}
        <div className="stat-card from-indigo-500 to-indigo-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">💎</span>
          </div>
          <p className="text-indigo-100 text-sm font-medium mb-1">Total Value</p>
          <p className="text-3xl font-bold">
            ${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total P/L */}
        <div className={`stat-card ${profitLossColor}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">{profitLossIcon}</span>
          </div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">Total P/L</p>
          <p className="text-3xl font-bold">
            {profitLossSign}${Math.abs(summary.totalProfitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;