// import React, { useState } from 'react';

// const AttendanceReport = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
//   const [year, setYear] = useState('');
//   const [month, setMonth] = useState('');
//   const [reportData, setReportData] = useState([]);

//   // Sample employee list (replace later with data from API)
//   const employees = ['John Doe', 'Jane Smith', 'Michael Johnson'];

//   // Handle "Show Report" button
//   const showReport = () => {
//     const dummyReportData = employees.map((employee) => ({
//       name: employee,
//       attendance: Array.from({ length: 31 }, () => (Math.random() > 0.7 ? 'Absent' : 'Present')),
//     }));
//     setReportData(dummyReportData);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h3 className="text-xl font-bold mb-4">Attendance Report</h3>
//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium">Select Employees</label>
//           <select
//             className="w-full mt-2 p-2 border border-gray-300 rounded"
//             value={selectedEmployee}
//             onChange={(e) => setSelectedEmployee(e.target.value)}
//           >
//             <option>All Employees</option>
//             {employees.map((employee, index) => (
//               <option key={index} value={employee}>
//                 {employee}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Select Year</label>
//           <input
//             type="number"
//             className="w-full mt-2 p-2 border border-gray-300 rounded"
//             placeholder="Year"
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Select Month</label>
//           <input
//             type="number"
//             className="w-full mt-2 p-2 border border-gray-300 rounded"
//             placeholder="Month (1-12)"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//           />
//         </div>
//         <div className="flex items-end">
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded"
//             onClick={showReport}
//           >
//             Show Report
//           </button>
//         </div>
//       </div>

//       {reportData.length > 0 && (
//         <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border border-gray-300 px-4 py-2">Employee Name</th>
//               {/* Generate columns for days of the month */}
//               {Array.from({ length: 31 }).map((_, i) => (
//                 <th key={i} className="border border-gray-300 px-2 py-1">
//                   {i + 1}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {reportData.map((employee, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
//                 {employee.attendance.map((status, dayIndex) => (
//                   <td key={dayIndex} className="border border-gray-300 px-2 py-1">
//                     {status}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AttendanceReport;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AttendanceReport() {
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();

  // Sample employee list (replace later with data from API)
  const employees = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown', 'David Wilson'];

  useEffect(() => {
    // Fetch report data from API (using dummy data for now)
    const dummyReportData = employees.map((employee) => ({
      name: employee,
      attendance: Array.from({ length: 31 }, () => Math.random() > 0.2 ? 'Present' : 'Absent'),
    }));
    setReportData(dummyReportData);
  }, []);

  const handleGenerateReport = () => {
    // In a real application, this would fetch data based on the selected criteria
    console.log('Generating report for:', selectedEmployee, year, month);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Attendance Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
            <select
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="All Employees">All Employees</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee}>{employee}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max="2099"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="number"
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleGenerateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                {Array.from({ length: 31 }, (_, i) => (
                  <th key={i} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  {employee.attendance.map((status, dayIndex) => (
                    <td key={dayIndex} className="px-2 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {status.charAt(0)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;
