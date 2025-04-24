import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, UserX, Calendar,
  FileText, DollarSign 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line,
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  const CHART_COLORS = {
    salary: 'var(--brand-color, #6D28D9)',
    expenses: '#EA580C',
    present: '#10B981',
    absent: '#EF4444',
    leave: '#F59E0B',
    categoryColors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', 
      '#96CEB4', '#FFEEAD', '#D4A5A5',
      '#9DC183', '#F4A261', '#2A9D8F'
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_DASHBOARD_API}`
        );
        
        // Use response.data directly since axios already parses JSON
        const data = response.data;
        
        const transformedData = {
          ...data.data,
          salary: {
            ...data.data.salary
          },
          yearlyTrends: {
            salary: data.data.yearlyTrends?.salary?.map(d => ({
              year: d.year,
              amount: Number(d.amount)
            })) || [],
            expenses: data.data.yearlyTrends?.expenses?.map(d => ({
              year: d.year,
              amount: Number(d.amount)
            })) || []
          }
        };
        
        setDashboardData(transformedData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.response || err);
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`container mx-auto p-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Employees Card */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Total Employees</h3>
              <div className="text-4xl font-bold text-brand-primary">
                {dashboardData?.employees?.total ?? 0}
              </div>
            </div>
            <div className={`p-3 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-full`}>
              <Users className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        {/* Present Today Card */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Present Today</h3>
              <div className="text-4xl font-bold text-green-600">
                {dashboardData?.attendance?.present ?? 0}
              </div>
            </div>
            <div className={`p-3 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} rounded-full`}>
              <UserCheck className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        {/* Absent Today Card */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Absent Today</h3>
              <div className="text-4xl font-bold text-red-600">
                {dashboardData?.attendance?.absent ?? 0}
              </div>
            </div>
            <div className={`p-3 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} rounded-full`}>
              <UserX className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        {/* Leave Today Card */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>On Leave</h3>
              <div className="text-4xl font-bold text-yellow-600">
                {dashboardData?.attendance?.leave ?? 0}
              </div>
            </div>
            <div className={`p-3 ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} rounded-full`}>
              <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Salary Paid Card */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Total Salary Paid</h3>
              <div className="text-3xl font-bold text-brand-primary">
                ₨{(dashboardData?.salary?.paid ?? 0).toLocaleString()}
              </div>
            </div>
            <FileText className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Total Expenses</h3>
              <div className="text-3xl font-bold text-orange-600">
                ₨{(dashboardData?.expenses?.total ?? 0).toLocaleString()}
              </div>
            </div>
            <DollarSign className={`w-8 h-8 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
        </div>
      </div>

      {/* Yearly Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Yearly Salary Trend */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 h-80 transition-colors duration-200`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>Yearly Salary Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={dashboardData?.yearlyTrends?.salary ?? []}>
              <XAxis 
                dataKey="year" 
                label={{ value: 'Year', position: 'bottom' }}
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis 
                label={{ 
                  value: 'Amount (₨)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <Tooltip
                formatter={(value) => [`₨${value.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  background: isDarkMode ? '#1F2937' : '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  color: isDarkMode ? '#F9FAFB' : 'inherit'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={CHART_COLORS.salary}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.salary, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Expense Trend */}
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 h-80 transition-colors duration-200`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>Yearly Expense Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={dashboardData?.yearlyTrends?.expenses ?? []}>
              <XAxis 
                dataKey="year" 
                label={{ value: 'Year', position: 'bottom' }}
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis 
                label={{ 
                  value: 'Amount (₨)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
              <Tooltip
                formatter={(value) => [`₨${value.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  background: isDarkMode ? '#1F2937' : '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  color: isDarkMode ? '#F9FAFB' : 'inherit'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={CHART_COLORS.expenses}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.expenses, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown Chart */}
      <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-2xl shadow-lg p-6 h-80 transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Expense Categories</h3>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={dashboardData?.expenses?.categories ?? []}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {dashboardData?.expenses?.categories?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || CHART_COLORS.categoryColors[index % CHART_COLORS.categoryColors.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `₨${value.toLocaleString()}`}
              contentStyle={{
                background: isDarkMode ? '#1F2937' : '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: isDarkMode ? '#F9FAFB' : 'inherit'
              }}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;