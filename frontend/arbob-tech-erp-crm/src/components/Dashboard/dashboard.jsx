

// import React, { useEffect, useState } from 'react';
// import { 
//   Users, UserCheck, UserX, Calendar,
//   FileText, DollarSign 
// } from 'lucide-react';
// import { 
//   BarChart, Bar, 
//   PieChart, Pie, Cell, 
//   LineChart, Line,
//   ResponsiveContainer, 
//   XAxis, YAxis, Tooltip, Legend, Text 
// } from 'recharts';

// function Dashboard() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const CHART_COLORS = {
//     salary: '#6D28D9',
//     expenses: '#EA580C',
//     present: '#10B981',
//     absent: '#EF4444',
//     leave: '#F59E0B'
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/dashboard');
//         if (!response.ok) throw new Error('Failed to fetch data');
//         const { data } = await response.json();
        
//         const transformedData = {
//           ...data,
//           salary: {
//             ...data.salary,
//             // historical: data.salary.historical?.map(item => ({
//             //   month: item.month,
//             //   amount: Number(item.amount)
//             // })) || []
//           },
//           yearlyTrends: {
//             salary: data.yearlyTrends?.salary?.map(d => ({
//               year: d.year,
//               amount: Number(d.amount)
//             })) || [],
//             expenses: data.yearlyTrends?.expenses?.map(d => ({
//               year: d.year,
//               amount: Number(d.amount)
//             })) || []
//           }
//         };
        
//         setDashboardData(transformedData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center text-gray-500">
//         Loading dashboard data...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6 text-center text-red-500">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
//       {/* Main Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {/* Total Employees Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Employees</h3>
//               <div className="text-4xl font-bold text-blue-600">
//                 {dashboardData?.employees?.total ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Present Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Present Today</h3>
//               <div className="text-4xl font-bold text-green-600">
//                 {dashboardData?.attendance?.present ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <UserCheck className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//         </div>

//         {/* Absent Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Absent Today</h3>
//               <div className="text-4xl font-bold text-red-600">
//                 {dashboardData?.attendance?.absent ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-red-100 rounded-full">
//               <UserX className="w-8 h-8 text-red-600" />
//             </div>
//           </div>
//         </div>

//         {/* Leave Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">On Leave</h3>
//               <div className="text-4xl font-bold text-yellow-600">
//                 {dashboardData?.attendance?.leave ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <Calendar className="w-8 h-8 text-yellow-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Financial Summary Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Salary Paid Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Salary Paid</h3>
//               <div className="text-3xl font-bold text-purple-600">
//                 ${(dashboardData?.salary?.paid ?? 0).toLocaleString()}
//               </div>
//             </div>
//             <FileText className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>

//         {/* Monthly Expenses Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Expenses</h3>
//               <div className="text-3xl font-bold text-orange-600">
//                 ${(dashboardData?.expenses?.total ?? 0).toLocaleString()}
//               </div>
//             </div>
//             <DollarSign className="w-8 h-8 text-orange-600" />
//           </div>
//         </div>
//       </div>

//       {/* Monthly Trends Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Salary Trend Chart */}
//         {/* <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//           <h3 className="text-lg font-semibold text-gray-500 mb-4">Monthly Salary Trend</h3>
//           <ResponsiveContainer width="100%" height="80%">
//             <BarChart data={dashboardData?.salary?.historical ?? []}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip 
//                 formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
//                 contentStyle={{ 
//                   background: '#fff',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               />
//               <Bar 
//                 dataKey="amount" 
//                 fill={CHART_COLORS.salary}
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div> */}

//         {/* Expense Trend Chart */}
//         {/* <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//           <h3 className="text-lg font-semibold text-gray-500 mb-4">Monthly Expense Trend</h3>
//           <ResponsiveContainer width="100%" height="80%">
//             <BarChart data={dashboardData?.expenses?.monthlyHistorical ?? []}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip 
//                 formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
//                 contentStyle={{ 
//                   background: '#fff',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               />
//               <Bar 
//                 dataKey="amount" 
//                 fill={CHART_COLORS.expenses}
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div> */}
//       </div>

//       {/* Yearly Trends Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Yearly Salary Trend */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//           <h3 className="text-lg font-semibold text-gray-500 mb-4">Yearly Salary Trend</h3>
//           <ResponsiveContainer width="100%" height="80%">
//             <LineChart data={dashboardData?.yearlyTrends?.salary ?? []}>
//               <XAxis 
//                 dataKey="year" 
//                 label={{ value: 'Year', position: 'bottom' }}
//               />
//               <YAxis 
//                 label={{ 
//                   value: 'Amount ($)', 
//                   angle: -90, 
//                   position: 'insideLeft' 
//                 }}
//               />
//               <Tooltip
//                 formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
//                 contentStyle={{
//                   background: '#fff',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="amount"
//                 stroke={CHART_COLORS.salary}
//                 strokeWidth={2}
//                 dot={{ fill: CHART_COLORS.salary, strokeWidth: 2 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Yearly Expense Trend */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//           <h3 className="text-lg font-semibold text-gray-500 mb-4">Yearly Expense Trend</h3>
//           <ResponsiveContainer width="100%" height="80%">
//             <LineChart data={dashboardData?.yearlyTrends?.expenses ?? []}>
//               <XAxis 
//                 dataKey="year" 
//                 label={{ value: 'Year', position: 'bottom' }}
//               />
//               <YAxis 
//                 label={{ 
//                   value: 'Amount ($)', 
//                   angle: -90, 
//                   position: 'insideLeft' 
//                 }}
//               />
//               <Tooltip
//                 formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
//                 contentStyle={{
//                   background: '#fff',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="amount"
//                 stroke={CHART_COLORS.expenses}
//                 strokeWidth={2}
//                 dot={{ fill: CHART_COLORS.expenses, strokeWidth: 2 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Expense Breakdown Chart */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-500">Expense Categories</h3>
//           <div className="text-sm text-gray-500">
//             Total: ${(dashboardData?.expenses?.total ?? 0).toLocaleString()}
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height="90%">
//           <PieChart>
//             <Pie
//               data={dashboardData?.expenses?.categories ?? []}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={5}
//               dataKey="value"
//             >
//               {dashboardData?.expenses?.categories?.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color || CHART_COLORS.expenses}
//                 />
//               ))}
//             </Pie>
//             <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//             <Legend 
//               layout="vertical"
//               align="right"
//               verticalAlign="middle"
//               formatter={(value) => <span className="text-sm">{value}</span>}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;




// import React, { useEffect, useState } from 'react';
// import { 
//   Users, UserCheck, UserX, Calendar,
//   FileText, DollarSign 
// } from 'lucide-react';
// import { 
//   PieChart, Pie, Cell, 
//   LineChart, Line,
//   ResponsiveContainer, 
//   XAxis, YAxis, Tooltip, Legend, Text 
// } from 'recharts';

// function Dashboard() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const CHART_COLORS = {
//     salary: '#6D28D9',
//     expenses: '#EA580C',
//     present: '#10B981',
//     absent: '#EF4444',
//     leave: '#F59E0B'
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/dashboard');
//         if (!response.ok) throw new Error('Failed to fetch data');
//         const { data } = await response.json();
        
//         const transformedData = {
//           ...data,
//           salary: {
//             ...data.salary
//           },
//           yearlyTrends: {
//             salary: data.yearlyTrends?.salary?.map(d => ({
//               year: d.year,
//               amount: Number(d.amount)
//             })) || [],
//             expenses: data.yearlyTrends?.expenses?.map(d => ({
//               year: d.year,
//               amount: Number(d.amount)
//             })) || []
//           }
//         };
        
//         setDashboardData(transformedData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center text-gray-500">
//         Loading dashboard data...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6 text-center text-red-500">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
//       {/* Main Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {/* Total Employees Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Employees</h3>
//               <div className="text-4xl font-bold text-blue-600">
//                 {dashboardData?.employees?.total ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Present Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Present Today</h3>
//               <div className="text-4xl font-bold text-green-600">
//                 {dashboardData?.attendance?.present ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <UserCheck className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//         </div>

//         {/* Absent Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Absent Today</h3>
//               <div className="text-4xl font-bold text-red-600">
//                 {dashboardData?.attendance?.absent ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-red-100 rounded-full">
//               <UserX className="w-8 h-8 text-red-600" />
//             </div>
//           </div>
//         </div>

//         {/* Leave Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">On Leave</h3>
//               <div className="text-4xl font-bold text-yellow-600">
//                 {dashboardData?.attendance?.leave ?? 0}
//               </div>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <Calendar className="w-8 h-8 text-yellow-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Financial Summary Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Salary Paid Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Salary Paid</h3>
//               <div className="text-3xl font-bold text-purple-600">
//                 ${(dashboardData?.salary?.paid ?? 0).toLocaleString()}
//               </div>
//             </div>
//             <FileText className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>

//         {/* Monthly Expenses Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Expenses</h3>
//               <div className="text-3xl font-bold text-orange-600">
//                 ${(dashboardData?.expenses?.total ?? 0).toLocaleString()}
//               </div>
//             </div>
//             <DollarSign className="w-8 h-8 text-orange-600" />
//           </div>
//         </div>
//       </div>
//       {/* Yearly Trends Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Yearly Salary Trend */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//           <h3 className="text-lg font-semibold text-gray-500 mb-4">Yearly Salary Trend</h3>
//           <ResponsiveContainer width="100%" height="80%">
//             <LineChart data={dashboardData?.yearlyTrends?.salary ?? []}>
//               <XAxis 
//                 dataKey="year" 
//                 label={{ value: 'Year', position: 'bottom' }}
//               />
//               <YAxis 
//                 label={{ 
//                   value: 'Amount ($)', 
//                   angle: -90, 
//                   position: 'insideLeft' 
//                 }}
//               />
//               <Tooltip
//                 formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
//                 contentStyle={{
//                   background: '#fff',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="amount"
//                 stroke={CHART_COLORS.salary}
//                 strokeWidth={2}
//                 dot={{ fill: CHART_COLORS.salary, strokeWidth: 2 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Yearly Expense Trend */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//           <h3 className="text-lg font-semibold text-gray-500 mb-4">Yearly Expense Trend</h3>
//           <ResponsiveContainer width="100%" height="80%">
//             <LineChart data={dashboardData?.yearlyTrends?.expenses ?? []}>
//               <XAxis 
//                 dataKey="year" 
//                 label={{ value: 'Year', position: 'bottom' }}
//               />
//               <YAxis 
//                 label={{ 
//                   value: 'Amount ($)', 
//                   angle: -90, 
//                   position: 'insideLeft' 
//                 }}
//               />
//               <Tooltip
//                 formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
//                 contentStyle={{
//                   background: '#fff',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="amount"
//                 stroke={CHART_COLORS.expenses}
//                 strokeWidth={2}
//                 dot={{ fill: CHART_COLORS.expenses, strokeWidth: 2 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Expense Breakdown Chart */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-500">Expense Categories</h3>
//           <div className="text-sm text-gray-500">
//             Total: ${(dashboardData?.expenses?.total ?? 0).toLocaleString()}
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height="90%">
//           <PieChart>
//             <Pie
//               data={dashboardData?.expenses?.categories ?? []}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={5}
//               dataKey="value"
//             >
//               {dashboardData?.expenses?.categories?.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color || CHART_COLORS.expenses}
//                 />
//               ))}
//             </Pie>
//             <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//             <Legend 
//               layout="vertical"
//               align="right"
//               verticalAlign="middle"
//               formatter={(value) => <span className="text-sm">{value}</span>}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, UserX, Calendar,
  FileText, DollarSign 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line,
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, Legend, Text 
} from 'recharts';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CHART_COLORS = {
    salary: '#6D28D9',
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
        const response = await fetch('http://localhost:3000/dashboard');
        if (!response.ok) throw new Error('Failed to fetch data');
        const { data } = await response.json();
        
        const transformedData = {
          ...data,
          salary: {
            ...data.salary
          },
          yearlyTrends: {
            salary: data.yearlyTrends?.salary?.map(d => ({
              year: d.year,
              amount: Number(d.amount)
            })) || [],
            expenses: data.yearlyTrends?.expenses?.map(d => ({
              year: d.year,
              amount: Number(d.amount)
            })) || []
          }
        };
        
        setDashboardData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-500">
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
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Employees Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Employees</h3>
              <div className="text-4xl font-bold text-blue-600">
                {dashboardData?.employees?.total ?? 0}
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Present Today Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Present Today</h3>
              <div className="text-4xl font-bold text-green-600">
                {dashboardData?.attendance?.present ?? 0}
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Absent Today Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Absent Today</h3>
              <div className="text-4xl font-bold text-red-600">
                {dashboardData?.attendance?.absent ?? 0}
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Leave Today Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">On Leave</h3>
              <div className="text-4xl font-bold text-yellow-600">
                {dashboardData?.attendance?.leave ?? 0}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Salary Paid Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Salary Paid</h3>
              <div className="text-3xl font-bold text-purple-600">
                ₨{(dashboardData?.salary?.paid ?? 0).toLocaleString()}
              </div>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Expenses</h3>
              <div className="text-3xl font-bold text-orange-600">
                ₨{(dashboardData?.expenses?.total ?? 0).toLocaleString()}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Yearly Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Yearly Salary Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">Yearly Salary Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={dashboardData?.yearlyTrends?.salary ?? []}>
              <XAxis 
                dataKey="year" 
                label={{ value: 'Year', position: 'bottom' }}
              />
              <YAxis 
                label={{ 
                  value: 'Amount (₨)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip
                formatter={(value) => [`₨${value.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
        <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">Yearly Expense Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={dashboardData?.yearlyTrends?.expenses ?? []}>
              <XAxis 
                dataKey="year" 
                label={{ value: 'Year', position: 'bottom' }}
              />
              <YAxis 
                label={{ 
                  value: 'Amount (₨)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip
                formatter={(value) => [`₨${value.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
      <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-500">Expense Categories</h3>
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
            <Tooltip formatter={(value) => `₨${value.toLocaleString()}`} />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;