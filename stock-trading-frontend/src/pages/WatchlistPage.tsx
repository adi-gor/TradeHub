import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { watchlistAPI, stockAPI } from '../services/api';
import { type StockQuote } from '../types';

interface WatchlistItem {
  id: number;
  symbol: string;
  addedAt: string;
  currentPrice: number | null;
  change: number | null;
  changePercent: number | null;
}

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newSymbol, setNewSymbol] = useState<string>('');
  const [addError, setAddError] = useState<string>('');
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.data);
    } catch (error: any) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymbol = async () => {
    if (!newSymbol.trim()) return;

    setAddError('');
    setAddLoading(true);

    try {
      await watchlistAPI.addToWatchlist(newSymbol.toUpperCase());
      setNewSymbol('');
      loadWatchlist();
    } catch (error: any) {
      setAddError(error.response?.data?.error || 'Failed to add to watchlist');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveSymbol = async (symbol: string) => {
    try {
      await watchlistAPI.removeFromWatchlist(symbol);
      loadWatchlist();
      if (selectedStock?.symbol === symbol) {
        setSelectedStock(null);
        setShowDetails(false);
      }
    } catch (error: any) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  const handleViewDetails = async (symbol: string) => {
    try {
      const response = await stockAPI.getQuote(symbol);
      setSelectedStock(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Failed to fetch stock details:', error);
    }
  };

  const handleRefresh = () => {
    loadWatchlist();
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      try {
        await watchlistAPI.clearWatchlist();
        loadWatchlist();
        setSelectedStock(null);
        setShowDetails(false);
      } catch (error) {
        console.error('Failed to clear watchlist:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                <span className="inline-block mr-3">⭐</span>
                My Watchlist
              </h1>
              <p className="text-gray-600">Track and monitor your favorite stocks in real-time</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔄 Refresh Prices
              </button>
              {watchlist.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
          <div className="stat-card from-blue-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Stocks</p>
                <p className="text-4xl font-bold">{watchlist.length}</p>
              </div>
              <div className="text-5xl opacity-80">📊</div>
            </div>
          </div>

          <div className="stat-card from-green-500 to-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Gaining</p>
                <p className="text-4xl font-bold">
                  {watchlist.filter(item => (item.change || 0) > 0).length}
                </p>
              </div>
              <div className="text-5xl opacity-80">📈</div>
            </div>
          </div>

          <div className="stat-card from-red-500 to-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Losing</p>
                <p className="text-4xl font-bold">
                  {watchlist.filter(item => (item.change || 0) < 0).length}
                </p>
              </div>
              <div className="text-5xl opacity-80">📉</div>
            </div>
          </div>
        </div>

        {/* Add Stock Form */}
        <div className="card mb-8 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add Stock to Watchlist</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)"
              className="flex-1 input-field"
              disabled={addLoading}
            />
            <button
              onClick={handleAddSymbol}
              disabled={addLoading || !newSymbol.trim()}
              className="btn-primary"
            >
              {addLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                '+ Add to Watchlist'
              )}
            </button>
          </div>
          {addError && (
            <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-800 text-sm font-medium">{addError}</p>
            </div>
          )}
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Popular stocks:</span> AAPL, TSLA, GOOGL, MSFT, AMZN, META, NVDA, NFLX
          </div>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div className="card text-center py-20 animate-fadeIn">
            <div className="text-8xl mb-6">⭐</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Watchlist is Empty</h3>
            <p className="text-gray-600 text-lg mb-8">Start tracking stocks by adding them to your watchlist</p>
            <div className="inline-block">
              <input
                type="text"
                placeholder="Enter symbol..."
                className="px-4 py-2 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setNewSymbol((e.target as HTMLInputElement).value);
                    handleAddSymbol();
                  }
                }}
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 font-medium">
                Add Stock
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            {watchlist.map((item) => {
              const isPositive = (item.change || 0) >= 0;
              const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
              const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';
              const borderColor = isPositive ? 'border-green-200' : 'border-red-200';

              return (
                <div
                  key={item.id}
                  className={`card border-2 ${borderColor} hover:shadow-2xl cursor-pointer transition-all duration-200`}
                  onClick={() => handleViewDetails(item.symbol)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">

                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{item.symbol}</h3>
                        <p className="text-sm text-gray-500">Added {formatDate(item.addedAt)}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSymbol(item.symbol);
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Remove from watchlist"
                    >
                      🗑️
                    </button>
                  </div>

                  {item.currentPrice !== null ? (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Current Price</p>
                          <p className="text-4xl font-bold text-gray-900">
                            ${item.currentPrice.toFixed(2)}
                          </p>
                        </div>
                        {item.change !== null && item.changePercent !== null && (
                          <div className={`px-4 py-3 rounded-xl ${changeBg}`}>
                            <p className={`text-lg font-bold ${changeColor}`}>
                              {isPositive ? '+' : ''}{item.change.toFixed(2)}
                            </p>
                            <p className={`text-sm font-semibold ${changeColor}`}>
                              {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Price data unavailable</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stock Details Modal */}
      {showDetails && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 animate-fadeIn">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedStock.symbol}</h2>
                <p className="text-5xl font-bold text-gray-900 mt-2">
                  ${selectedStock.currentPrice.toFixed(2)}
                </p>
                {selectedStock.change !== undefined && selectedStock.changePercent !== undefined && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-full mt-3 ${
                    selectedStock.change >= 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <span className={`font-bold ${
                      selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} (
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Open</p>
                <p className="text-xl font-bold text-gray-900">
                  ${selectedStock.openPrice.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">High</p>
                <p className="text-xl font-bold text-gray-900">
                  ${selectedStock.highPrice.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Low</p>
                <p className="text-xl font-bold text-gray-900">
                  ${selectedStock.lowPrice.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Previous Close</p>
                <p className="text-xl font-bold text-gray-900">
                  ${selectedStock.previousClose.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDetails(false);
                  window.location.href = '/trading';
                }}
                className="flex-1 btn-success"
              >
                Trade Now
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;