import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

function AttendanceReport() {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [reportData, setReportData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Generate array of years from 2000 to 2030
  const years = Array.from({ length: 31 }, (_, i) => (2000 + i).toString());

  // Array of months
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Constants for message timeouts
  const MESSAGE_TIMEOUTS = {
    DEFAULT: 3000,
    ERROR: 5000
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_ACTIVE_EMPLOYEES_API}`
      );
      
      const data = response.data;
      
      if (data.employees) {
        const employeesList = data.employees.map(emp => ({
          id: emp.id,
          name: emp.name
        }));
        setEmployees(employeesList);
      } else {
        setError('Failed to fetch employees list');
      }
    } catch (err) {
      setError('Error fetching employees. Please try again.');
      console.error('Error fetching employees:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!year || !month) {
      setError('Please select both year and month');
      setTimeout(() => setError(''), MESSAGE_TIMEOUTS.DEFAULT);
      return;
    }

    setLoading(true);
    setError('');
    setFormErrors({});
    
    try {
      const monthNum = parseInt(month);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_ATTENDANCE_API}/report?year=${year}&month=${monthNum}&employeeId=${selectedEmployee}`
      );
      
      const data = response.data;
      
      if (data.success) {
        const { attendance, statistics } = data.data;
        
        if (!attendance || attendance.length === 0 || !statistics || Object.keys(statistics).length === 0) {
          setError(`No attendance records found for ${months.find(m => m.value === month)?.label} ${year}`);
          setTimeout(() => setError(''), MESSAGE_TIMEOUTS.DEFAULT);
          setReportData([]);
          return;
        }

        const attendanceByEmployee = {};
        
        Object.entries(statistics).forEach(([empId, stat]) => {
          attendanceByEmployee[empId] = {
            name: stat.employeeName,
            attendance: Array(31).fill('-'),
            totals: {
              present: stat.present,
              absent: stat.absent,
              leave: stat.leave
            }
          };
        });

        attendance.forEach(record => {
          const empId = record.employeeId.toString();
          const day = new Date(record.date).getDate() - 1;
          if (attendanceByEmployee[empId]) {
            attendanceByEmployee[empId].attendance[day] = record.status;
          }
        });

        const formattedData = Object.values(attendanceByEmployee);
        setReportData(formattedData);
      } else {
        if (data.errors) {
          const errors = data.errors.reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
          }, {});
          setFormErrors(errors);
          setTimeout(() => setFormErrors({}), MESSAGE_TIMEOUTS.DEFAULT);
        } else {
          setError(data.message || 'Failed to generate report');
          setTimeout(() => setError(''), MESSAGE_TIMEOUTS.DEFAULT);
        }
      }
    } catch (err) {
      setError('Error generating report. Please try again.');
      setTimeout(() => setError(''), MESSAGE_TIMEOUTS.DEFAULT);
      console.error('Error generating report:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    ONLEAVE: 'ONLEAVE'
  };

  const getStatusClass = (status) => {
    switch (status) {
      case STATUS.PRESENT:
        return isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800';
      case STATUS.ABSENT:
        return isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800';
      case STATUS.ONLEAVE:
        return isDarkMode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case STATUS.PRESENT:
        return 'P';
      case STATUS.ABSENT:
        return 'A';
      case STATUS.ONLEAVE:
        return 'L';
      default:
        return '-';
    }
  };

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <button onClick={() => navigate(-1)} className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-medium">Attendance Report</span>
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md dark:bg-red-900/20 dark:border-red-600 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {Object.keys(formErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md dark:bg-red-900/20 dark:border-red-600 shadow-sm">
          {Object.entries(formErrors).map(([field, message]) => (
            <p key={field} className="text-sm font-medium text-red-600 dark:text-red-400 mb-1 last:mb-0">
              {message}
            </p>
          ))}
        </div>
      )}

      {/* Report Form */}
      <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-xl shadow-md p-6 mb-6 transition-colors duration-200`}>
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Generate Attendance Report</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Employee
            </label>
            <div className={`relative rounded-md shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className={`pl-10 block w-full rounded-lg border ${
                  isDarkMode 
                  ? 'bg-dark-accent border-gray-600 text-white focus:border-brand-primary focus:ring-brand-primary' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} 
                  py-2.5 text-sm transition-colors`}
              >
                <option value="all">All Employees</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Year
            </label>
            <div className={`relative rounded-md shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`pl-10 block w-full rounded-lg border ${
                  isDarkMode 
                  ? 'bg-dark-accent border-gray-600 text-white focus:border-brand-primary focus:ring-brand-primary' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} 
                  py-2.5 text-sm transition-colors`}
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Month
            </label>
            <div className={`relative rounded-md shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2.555 6.955a.75.75 0 01.696.522L4.5 10.692V14.69c0 .372.266.604.572.604a.52.52 0 00.498-.374l1.6-5.333a.75.75 0 011.456 0l1.6 5.333a.52.52 0 00.498.374c.306 0 .572-.232.572-.604v-3.998l1.249-3.215a.75.75 0 011.418 0l1.25 3.215v3.998c0 .372.266.604.572.604a.52.52 0 00.498-.374l1.6-5.333a.75.75 0 01.456-.522" />
                </svg>
              </div>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={`pl-10 block w-full rounded-lg border ${
                  isDarkMode 
                  ? 'bg-dark-accent border-gray-600 text-white focus:border-brand-primary focus:ring-brand-primary' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} 
                  py-2.5 text-sm transition-colors`}
              >
                <option value="">Select Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={handleGenerateReport}
              disabled={loading || !month || !year}
              className={`w-full flex justify-center items-center px-4 py-2.5 rounded-lg text-white font-medium ${
                loading || !month || !year ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'
              } transition-colors duration-200 shadow-sm`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && !error && reportData.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Generating report...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {reportData.length === 0 && !loading && !error && (
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-xl shadow-md p-8 mb-6 text-center transition-colors duration-200`}>
          <svg className={`mx-auto h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className={`mt-4 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>No Records Found</h3>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select a month and year above to generate an attendance report.</p>
        </div>
      )}

      {/* Report Data */}
      {reportData.length > 0 && (
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Attendance Report: {months.find(m => m.value === month)?.label} {year}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
              {reportData.length} Employee{reportData.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'}`}>
                <tr>
                  <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider sticky left-0 ${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'} z-10`}>
                    Employee Name
                  </th>
                  {Array.from({ length: 31 }, (_, i) => (
                    <th key={i} scope="col" className={`w-10 py-4 text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      {i + 1}
                    </th>
                  ))}
                  <th scope="col" className={`px-4 py-4 text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider bg-green-50 dark:bg-green-900/20`}>P</th>
                  <th scope="col" className={`px-4 py-4 text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider bg-red-50 dark:bg-red-900/20`}>A</th>
                  <th scope="col" className={`px-4 py-4 text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider bg-yellow-50 dark:bg-yellow-900/20`}>L</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                {reportData.map((employee, index) => (
                  <tr key={index} className={`${isDarkMode ? 'hover:bg-dark-accent/50' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} sticky left-0 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} z-10`}>
                      {employee.name}
                    </td>
                    {employee.attendance.map((status, dayIndex) => (
                      <td key={dayIndex} className="w-10 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 text-xs font-medium rounded-full ${getStatusClass(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center whitespace-nowrap bg-green-50 dark:bg-green-900/20">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {employee.totals.present}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap bg-red-50 dark:bg-red-900/20">
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {employee.totals.absent}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        {employee.totals.leave}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-accent">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 text-xs font-medium mr-2">P</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Present</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 text-xs font-medium mr-2">A</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Absent</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400 text-xs font-medium mr-2">L</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>On Leave</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium mr-2">-</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>No Record</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
