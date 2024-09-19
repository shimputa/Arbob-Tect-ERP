
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DailyAttendance = () => {
  const [selectedEmployees, setSelectedEmployees] = useState('All Employees');
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  // Sample employee list (replace later with data from API)
  const employees = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Alice Brown', 'Bob Wilson', 'Carol Davis', 'David Taylor'];

  const getEmployeesList = () => {
    const filteredEmployees = selectedEmployees === 'All Employees' ? employees : [selectedEmployees];
    const attendance = filteredEmployees.map((emp) => ({
      name: emp,
      status: 'Present',
    }));
    setAttendanceData(attendance);
  };

  // Handle status change across pages
  const handleStatusChange = (index, status) => {
    const globalIndex = startIndex + index; // Adjust index based on pagination
    const updatedAttendance = [...attendanceData];
    updatedAttendance[globalIndex].status = status;
    setAttendanceData(updatedAttendance);
  };

  const handleSubmit = () => {
    console.log('Submitting attendance data:', attendanceData);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Pagination logic
  const totalPages = Math.ceil(attendanceData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAttendance = attendanceData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Daily Attendance</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="employees" className="block text-lg font-medium text-gray-700 mb-1">Select Employees</label>
            <select
              id="employees"
              className="mt-1 block  py-1 pl-1 pr-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedEmployees}
              onChange={(e) => setSelectedEmployees(e.target.value)}
            >
              <option>All Employees</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee}>{employee}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              id="date"
              className="mt-1 block py-1 pl-1 pr-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={getEmployeesList}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Get Employees List
            </button>
          </div>
        </div>
      </div>

      {attendanceData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedAttendance.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      className="mt-1 block py-1 pl-1 pr-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={employee.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>On Leave</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attendanceData.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap justify-center space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-full sm:w-auto px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {attendanceData.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit Attendance
          </button>
        </div>
      )}

      {showSuccessMessage && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Attendance submitted successfully!</span>
        </div>
      )}
    </div>
  );
};

export default DailyAttendance;
