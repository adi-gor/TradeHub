import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { portfolioAPI } from '../services/api';

interface PortfolioChartProps {
  type?: 'line' | 'area' | 'pie' | 'bar';
}

const PortfolioChart = ({ type = 'area' }: PortfolioChartProps) => {
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolio();
      const holdings = response.data;

      // Prepare data for pie chart (portfolio allocation)
      const pieData = holdings.map((holding: any) => ({
        name: holding.symbol,
        value: holding.totalValue,
        quantity: holding.quantity,
        profitLoss: holding.profitLoss,
      }));

      setPortfolioData(pieData);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
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

  if (portfolioData.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Start trading to see your portfolio performance</p>
      </div>
    );
  }

  const COLORS = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Value: ${data.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Quantity: {data.quantity}</p>
          <p className={`text-sm font-semibold ${data.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            P/L: {data.profitLoss >= 0 ? '+' : ''}${data.profitLoss.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / portfolioData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${entry.name} (${percent}%)`;
  };

  return (
    <div className="card animate-fadeIn">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Allocation</h3>
        <p className="text-gray-600">Distribution of your investments</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={portfolioData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {portfolioData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {portfolioData.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-600">
                ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioChart;