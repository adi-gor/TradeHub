import { useEffect, useState } from 'react';
import { portfolioAPI } from '../services/api';
import { type Portfolio } from '../types';
import TradeModal from './TradeModal';

interface HoldingsTableProps {
  onRefresh?: () => void;
}

const HoldingsTable = ({ onRefresh }: HoldingsTableProps) => {
  const [holdings, setHoldings] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Trade Modal State
  const [isTradeModalOpen, setIsTradeModalOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    currentPrice: number;
  } | null>(null);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolio();
      setHoldings(response.data);
      setError('');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch holdings');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (symbol: string, currentPrice: number) => {
    setSelectedStock({ symbol, currentPrice });
    setTradeType('BUY');
    setIsTradeModalOpen(true);
  };

  const handleSell = (symbol: string, currentPrice: number) => {
    setSelectedStock({ symbol, currentPrice });
    setTradeType('SELL');
    setIsTradeModalOpen(true);
  };

  const handleTradeComplete = () => {
    fetchHoldings();
    setIsTradeModalOpen(false);
    setSelectedStock(null);
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
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Holdings Yet</h3>
        <p className="text-gray-600 mb-6">Start trading to build your portfolio!</p>
        <button 
          onClick={() => window.location.href = '/trading'}
          className="btn-primary"
        >
          Start Trading
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Your Holdings</h3>
            <p className="text-gray-600 text-sm mt-1">{holdings.length} active position{holdings.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={fetchHoldings}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tl-lg">
                  Symbol
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  P/L
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {holdings.map((holding) => {
                const profitLossColor = holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600';
                const profitLossSign = holding.profitLoss >= 0 ? '+' : '';
                const profitLossBg = holding.profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50';
                const profitLossPercent = ((holding.profitLoss / (holding.averagePrice * holding.quantity)) * 100).toFixed(2);

                return (
                  <tr key={holding.id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-bold text-gray-900">
                          {holding.symbol}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{holding.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${holding.averagePrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${holding.currentPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${holding.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full ${profitLossBg}`}>
                        <span className={`text-sm font-bold ${profitLossColor}`}>
                          {profitLossSign}${Math.abs(holding.profitLoss).toFixed(2)}
                        </span>
                        <span className={`text-xs ml-2 ${profitLossColor}`}>
                          ({profitLossSign}{profitLossPercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBuy(holding.symbol, holding.currentPrice)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Buy More
                        </button>
                        <button
                          onClick={() => handleSell(holding.symbol, holding.currentPrice)}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Modal */}
      {selectedStock && (
        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => {
            setIsTradeModalOpen(false);
            setSelectedStock(null);
          }}
          symbol={selectedStock.symbol}
          currentPrice={selectedStock.currentPrice}
          tradeType={tradeType}
          onTradeComplete={handleTradeComplete}
        />
      )}
    </>
  );
};

export default HoldingsTable;