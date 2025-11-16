import { useState, type FormEvent } from 'react';
import { tradingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currentPrice: number;
  tradeType: 'BUY' | 'SELL';
  onTradeComplete: () => void;
}

const TradeModal = ({
  isOpen,
  onClose,
  symbol,
  currentPrice,
  tradeType,
  onTradeComplete,
}: TradeModalProps) => {
  const [quantity, setQuantity] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { user, refreshUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const qty = parseInt(quantity);
    if (qty <= 0) {
      setError('Quantity must be greater than 0');
      setLoading(false);
      return;
    }

    const totalCost = currentPrice * qty;

    try {
      const tradeData = { symbol, quantity: qty };

      if (tradeType === 'BUY') {
        await tradingAPI.buyStock(tradeData);
        setSuccess(`Successfully bought ${qty} shares of ${symbol}`);
      } else {
        await tradingAPI.sellStock(tradeData);
        setSuccess(`Successfully sold ${qty} shares of ${symbol}`);
      }

      await refreshUser();
      setTimeout(() => {
        onTradeComplete();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity('1');
    setError('');
    setSuccess('');
    onClose();
  };

  const totalAmount = currentPrice * parseInt(quantity || '0');
  const isBuy = tradeType === 'BUY';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {isBuy ? 'Buy' : 'Sell'} {symbol}
          </h3>
          <button
            onClick={handleClose}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Price
            </label>
            <div className="text-2xl font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-lg">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Balance:</span>
              <span className="font-semibold text-green-600">
                ${user?.balance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed ${
                isBuy
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Processing...' : `${isBuy ? 'Buy' : 'Sell'} ${symbol}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;