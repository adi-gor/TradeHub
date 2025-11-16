import Navbar from '../components/Navbar';
import PortfolioChart from '../components/PortfolioChart';
//import PerformanceChart from '../components/PerformanceChart';
import HoldingsValueChart from '../components/HoldingsValueChart';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="inline-block mr-3">📊</span>
            Portfolio Analytics
          </h1>
          <p className="text-gray-600">Detailed insights into your investment performance</p>
        </div>

        <div className="space-y-8">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PortfolioChart />
          </div>

          <HoldingsValueChart />

        
        </div>
      </div>
    </div>
  );
};

export default Analytics;