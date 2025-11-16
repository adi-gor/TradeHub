import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StockSearch from '../components/StockSearch';
import StockQuoteDisplay from '../components/StockQuoteDisplay';
import TradeModal from '../components/TradeModal';
import { type StockQuote } from '../types';
import Navbar from '../components/Navbar';

const Trading = () => {
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState<boolean>(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelectStock = (quote: StockQuote) => {
    setSelectedQuote(quote);
  };

  const handleBuy = () => {
    setTradeType('BUY');
    setIsTradeModalOpen(true);
  };

  const handleSell = () => {
    setTradeType('SELL');
    setIsTradeModalOpen(true);
  };

  const handleTradeComplete = () => {
    // Optionally refresh quote or portfolio
    setSelectedQuote(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <StockSearch onSelectStock={handleSelectStock} />
          
          {selectedQuote && (
            <StockQuoteDisplay
              quote={selectedQuote}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          )}
        </div>
      </div>

      {selectedQuote && (
        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          symbol={selectedQuote.symbol}
          currentPrice={selectedQuote.currentPrice}
          tradeType={tradeType}
          onTradeComplete={handleTradeComplete}
        />
      )}
    </div>
  );
};

export default Trading;