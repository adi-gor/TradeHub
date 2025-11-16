import { useState, type FormEvent } from 'react';
import { stockAPI } from '../services/api';
import { type StockQuote } from '../types';

interface StockSearchProps {
  onSelectStock: (quote: StockQuote) => void;
}

const StockSearch = ({ onSelectStock }: StockSearchProps) => {
  const [symbol, setSymbol] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await stockAPI.getQuote(symbol.toUpperCase());
      onSelectStock(response.data);
      setSymbol('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Stock not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Search Stock</h3>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
            Stock Symbol
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL, TSLA, GOOGL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !symbol.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="text-xs text-gray-500">
          Popular stocks: AAPL, TSLA, GOOGL, MSFT, AMZN, META, NVDA
        </div>
      </form>
    </div>
  );
};

export default StockSearch;