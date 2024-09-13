import React, { useState } from 'react';

const AttendanceReport = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [reportData, setReportData] = useState([]);

  // Sample employee list (replace later with data from API)
  const employees = ['John Doe', 'Jane Smith', 'Michael Johnson'];

  // Handle "Show Report" button
  const showReport = () => {
    const dummyReportData = employees.map((employee) => ({
      name: employee,
      attendance: Array.from({ length: 31 }, () => (Math.random() > 0.7 ? 'Absent' : 'Present')),
    }));
    setReportData(dummyReportData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Attendance Report</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Select Employees</label>
          <select
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option>All Employees</option>
            {employees.map((employee, index) => (
              <option key={index} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Select Year</label>
          <input
            type="number"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Select Month</label>
          <input
            type="number"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Month (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={showReport}
          >
            Show Report
          </button>
        </div>
      </div>

      {reportData.length > 0 && (
        <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Employee Name</th>
              {/* Generate columns for days of the month */}
              {Array.from({ length: 31 }).map((_, i) => (
                <th key={i} className="border border-gray-300 px-2 py-1">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((employee, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                {employee.attendance.map((status, dayIndex) => (
                  <td key={dayIndex} className="border border-gray-300 px-2 py-1">
                    {status}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceReport;
