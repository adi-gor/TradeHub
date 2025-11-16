import { type StockQuote } from '../types';
import { watchlistAPI } from '../services/api';
import { useState, useEffect } from 'react';

interface StockQuoteDisplayProps {
  quote: StockQuote | null;
  onBuy: () => void;
  onSell: () => void;
}

const StockQuoteDisplay = ({ quote, onBuy, onSell }: StockQuoteDisplayProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
  const [checkingWatchlist, setCheckingWatchlist] = useState<boolean>(true);

  useEffect(() => {
    if (quote) {
      checkWatchlistStatus();
    }
  }, [quote]);

  const checkWatchlistStatus = async () => {
    if (!quote) return;
    
    try {
      const response = await watchlistAPI.checkWatchlist(quote.symbol);
      setIsInWatchlist(response.data.inWatchlist);
    } catch (error) {
      console.error('Failed to check watchlist status:', error);
    } finally {
      setCheckingWatchlist(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!quote) return;

    try {
      if (isInWatchlist) {
        await watchlistAPI.removeFromWatchlist(quote.symbol);
        setIsInWatchlist(false);
      } else {
        await watchlistAPI.addToWatchlist(quote.symbol);
        setIsInWatchlist(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle watchlist:', error);
      alert(error.response?.data?.error || 'Failed to update watchlist');
    }
  };

  if (!quote) return null;

  const change = quote.change || 0;
  const changePercent = quote.changePercent || 0;
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="card animate-fadeIn">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-3xl font-bold text-gray-900">{quote.symbol}</h3>
            <button
              onClick={handleToggleWatchlist}
              disabled={checkingWatchlist}
              className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${
                isInWatchlist
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {checkingWatchlist ? '...' : isInWatchlist ? '⭐ Watching' : '☆ Watch'}
            </button>
          </div>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            ${quote.currentPrice.toFixed(2)}
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-full mt-3 ${changeBg}`}>
            <span className={`text-sm font-bold ${changeColor}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onBuy} className="btn-success">
            Buy
          </button>
          <button onClick={onSell} className="btn-danger">
            Sell
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Open</p>
          <p className="text-xl font-bold text-gray-900">
            ${quote.openPrice.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">High</p>
          <p className="text-xl font-bold text-gray-900">
            ${quote.highPrice.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Low</p>
          <p className="text-xl font-bold text-gray-900">
            ${quote.lowPrice.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Previous Close</p>
          <p className="text-xl font-bold text-gray-900">
            ${quote.previousClose.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockQuoteDisplay;