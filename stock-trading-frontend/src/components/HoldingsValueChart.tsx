import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { portfolioAPI } from '../services/api';

const HoldingsValueChart = () => {
  const [valueData, setValueData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchValueData();
  }, []);

  const fetchValueData = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolio();
      const holdings = response.data;

      // Sort by total value for better visualization
      const sortedData = holdings
        .sort((a: any, b: any) => b.totalValue - a.totalValue)
        .map((holding: any) => ({
          symbol: holding.symbol,
          value: holding.totalValue,
          quantity: holding.quantity,
          price: holding.currentPrice,
        }));

      setValueData(sortedData);
    } catch (error) {
      console.error('Failed to fetch value data:', error);
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

  if (valueData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-900 mb-2">{data.symbol}</p>
          <p className="text-sm text-gray-600">Quantity: {data.quantity}</p>
          <p className="text-sm text-gray-600">Price: ${data.price.toFixed(2)}</p>
          <p className="text-sm font-bold text-blue-600">
            Total Value: ${data.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card animate-fadeIn">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Holdings Value Distribution</h3>
        <p className="text-gray-600">Value of each position in your portfolio</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={valueData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="symbol" 
            stroke="#6B7280"
            style={{ fontSize: '14px', fontWeight: '600' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoldingsValueChart;