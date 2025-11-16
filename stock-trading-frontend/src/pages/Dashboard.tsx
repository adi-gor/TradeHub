import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PortfolioSummary from '../components/PortfolioSummary';
import HoldingsTable from '../components/HoldingsTable';
import TransactionHistory from '../components/TransactionHistory';

const Dashboard = () => {
  const { refreshUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <PortfolioSummary />
          <HoldingsTable onRefresh={refreshUser} />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;