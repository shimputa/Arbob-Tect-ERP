// // components/Dashboard/Dashboard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Users, Clock, UserCheck, UserX, 
//   PlusCircle, FileText, DollarSign 
// } from 'lucide-react';

// function Dashboard() {
//   // Dummy data
//   const dummyData = {
//     employees: { total: 72 },
//     attendance: { presentToday: 65, absentToday: 7 },
//     expenses: { total: 25000 },
//     salary: { paid: 450000 }
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
//       {/* Main Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {/* Total Employees Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Employees</h3>
//               <div className="text-4xl font-bold text-blue-600 animate-fade-in">
//                 {dummyData.employees.total}
//               </div>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Present Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Present Today</h3>
//               <div className="text-4xl font-bold text-green-600 animate-fade-in">
//                 {dummyData.attendance.presentToday}
//               </div>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <UserCheck className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//         </div>

//         {/* Absent Today Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Absent Today</h3>
//               <div className="text-4xl font-bold text-red-600 animate-fade-in">
//                 {dummyData.attendance.absentToday}
//               </div>
//             </div>
//             <div className="p-3 bg-red-100 rounded-full">
//               <UserX className="w-8 h-8 text-red-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Secondary Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Salary Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Salary Paid</h3>
//               <div className="text-3xl font-bold text-purple-600">
//                 ${dummyData.salary.paid.toLocaleString()}
//               </div>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-full">
//               <FileText className="w-8 h-8 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         {/* Expenses Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-500 mb-2">Monthly Expenses</h3>
//               <div className="text-3xl font-bold text-orange-600">
//                 ${dummyData.expenses.total.toLocaleString()}
//               </div>
//             </div>
//             <div className="p-3 bg-orange-100 rounded-full">
//               <DollarSign className="w-8 h-8 text-orange-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Link
//           to="/attendance/daily-attendance"
//           className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl group"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
//               <PlusCircle className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Mark Attendance</h3>
//               <p className="text-sm text-gray-500">Record daily presence</p>
//             </div>
//           </div>
//         </Link>

//         <Link
//           to="/salary/create-payslip"
//           className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl group"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
//               <FileText className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Create Payslip</h3>
//               <p className="text-sm text-gray-500">Generate salary slips</p>
//             </div>
//           </div>
//         </Link>

//         <Link
//           to="/expense"
//           className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl group"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
//               <DollarSign className="w-6 h-6 text-purple-600" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Add Expense</h3>
//               <p className="text-sm text-gray-500">Record new expenditure</p>
//             </div>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// components/Dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Clock, UserCheck, UserX, Calendar,
  PlusCircle, FileText, DollarSign 
} from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

function Dashboard() {
  // Enhanced dummy data with historical records
  const dummyData = {
    employees: { total: 72 },
    attendance: { 
      presentToday: 65, 
      absentToday: 7,
      leaveToday: 5
    },
    expenses: { 
      total: 25000,
      historical: [
        { month: 'Jan', amount: 22000 },
        { month: 'Feb', amount: 24500 },
        { month: 'Mar', amount: 25000 },
      ]
    },
    salary: { 
      paid: 450000,
      historical: [
        { month: 'Jan', amount: 420000 },
        { month: 'Feb', amount: 435000 },
        { month: 'Mar', amount: 450000 },
      ]
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Main Stats Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Employees Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Employees</h3>
              <div className="text-4xl font-bold text-blue-600 animate-fade-in">
                {dummyData.employees.total}
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Present Today Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Present Today</h3>
              <div className="text-4xl font-bold text-green-600 animate-fade-in">
                {dummyData.attendance.presentToday}
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Absent Today Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Absent Today</h3>
              <div className="text-4xl font-bold text-red-600 animate-fade-in">
                {dummyData.attendance.absentToday}
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Leave Today Card - New Addition */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Leave Today</h3>
              <div className="text-4xl font-bold text-yellow-600 animate-fade-in">
                {dummyData.attendance.leaveToday}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Salary Paid Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">Salary Paid Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={dummyData.salary.historical}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Bar 
                dataKey="amount" 
                fill="#6D28D9" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">Expenses Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={dummyData.expenses.historical}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#EA580C" 
                fill="#FFEDD5" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/attendance/daily-attendance"
          className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <PlusCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Mark Attendance</h3>
              <p className="text-sm text-gray-500">Record daily presence</p>
              <span className="text-xs text-blue-500 mt-1 block">3 pending requests</span>
            </div>
          </div>
        </Link>

        <Link
          to="/salary/create-payslip"
          className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Create Payslip</h3>
              <p className="text-sm text-gray-500">Generate salary slips</p>
              <span className="text-xs text-green-500 mt-1 block">2 drafts in progress</span>
            </div>
          </div>
        </Link>

        <Link
          to="/expense"
          className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Add Expense</h3>
              <p className="text-sm text-gray-500">Record new expenditure</p>
              <span className="text-xs text-purple-500 mt-1 block">$1,200 pending approval</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;