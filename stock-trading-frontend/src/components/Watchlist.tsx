import { useEffect, useState } from 'react';
import { watchlistAPI } from '../services/api';

interface WatchlistItem {
  id: number;
  symbol: string;
  addedAt: string;
  currentPrice: number | null;
  change: number | null;
  changePercent: number | null;
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newSymbol, setNewSymbol] = useState<string>('');
  const [addError, setAddError] = useState<string>('');
  const [addLoading, setAddLoading] = useState<boolean>(false);

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
    } catch (error: any) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  const handleRefresh = () => {
    loadWatchlist();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Watchlist</h3>
          <p className="text-gray-600 text-sm mt-1">Track your favorite stocks</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Add Symbol Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={addLoading}
          />
          <button
            onClick={handleAddSymbol}
            disabled={addLoading || !newSymbol.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addLoading ? 'Adding...' : 'Add to Watchlist'}
          </button>
        </div>
        {addError && (
          <p className="text-red-600 text-sm mt-2">{addError}</p>
        )}
      </div>

      {/* Watchlist Items */}
      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Your Watchlist is Empty</h4>
          <p className="text-gray-600">Add stocks to track their performance</p>
        </div>
      ) : (
        <div className="space-y-3">
          {watchlist.map((item) => {
            const isPositive = (item.change || 0) >= 0;
            const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
            const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-lg hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-4 flex-1">
                  
                  {/* Symbol Name */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{item.symbol}</h4>
                    {item.currentPrice === null && (
                      <p className="text-sm text-gray-500">Price unavailable</p>
                    )}
                  </div>

                  {/* Price Info */}
                  {item.currentPrice !== null && (
                    <>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${item.currentPrice.toFixed(2)}
                        </p>
                      </div>

                      {item.change !== null && item.changePercent !== null && (
                        <div className={`px-3 py-2 rounded-lg ${changeBg} min-w-[120px] text-right`}>
                          <p className={`text-sm font-bold ${changeColor}`}>
                            {isPositive ? '+' : ''}{item.change.toFixed(2)}
                          </p>
                          <p className={`text-xs font-semibold ${changeColor}`}>
                            {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveSymbol(item.symbol)}
                  className="ml-4 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Remove from watchlist"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;