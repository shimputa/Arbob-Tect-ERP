import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

const ITEMS_PER_PAGE = process.env.REACT_APP_DEFAULT_PAGE_SIZE || 5;
const STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  ONLEAVE: 'ONLEAVE'
};

const MESSAGE_TIMEOUTS = {
  DEFAULT: 3000,
  EXISTING_ATTENDANCE: 5000
};

const DailyAttendance = () => {
  // State management
  const [selectedEmployees, setSelectedEmployees] = useState('All Employees');
  const [date] = useState(() => {
    const today = new Date();
    // Adjust for timezone to get correct local date
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Helper functions
  const clearError = (timeout = MESSAGE_TIMEOUTS.DEFAULT) => {
    setTimeout(() => setError(''), timeout);
  };

  const clearFormErrors = () => {
    setTimeout(() => setFormErrors({}), MESSAGE_TIMEOUTS.DEFAULT);
  };

  const showTemporarySuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), MESSAGE_TIMEOUTS.DEFAULT);
  };

  const handleExistingAttendanceError = (data, attendanceData) => {
    const existingNames = attendanceData
      .filter(emp => data.data.existingEmployees.includes(parseInt(emp.id)))
      .map(emp => emp.name)
      .join(', ');

    setError(`Attendance already marked for some employees on this date: ${existingNames}. Please select a employees whose attendance is not mark yet.`);
    clearError(MESSAGE_TIMEOUTS.EXISTING_ATTENDANCE);
  };

  // API calls
  const getEmployeesList = async () => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});

      const employeesToShow = selectedEmployees === 'All Employees' 
        ? employees 
        : employees.filter(emp => emp.id === parseInt(selectedEmployees));

      const attendance = employeesToShow.map(emp => ({
        id: emp.id,
        name: emp.name,
        status: STATUS.PRESENT
      }));

      setAttendanceData(attendance);
    } catch (err) {
      setError('Error preparing employee list. Please try again.');
      clearError();
      console.error('Error preparing employee list:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (attendanceData.length === 0) {
      setError('Please get employee list first');
      clearError();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFormErrors({});

      const attendancePayload = {
        attendanceData: attendanceData.map(emp => ({
          employeeId: parseInt(emp.id),
          status: emp.status
        })),
        date: new Date(date).toISOString()
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_ATTENDANCE_API}/mark`,
        attendancePayload
      );

      const data = response.data;
      
      if (data.success) {
        showTemporarySuccess();
        setAttendanceData([]);
        setError(null);
      } else {
        if (data.message === "Attendance already marked for some employees on this date" && data.data?.existingEmployees) {
          handleExistingAttendanceError(data, attendanceData);
        } else if (data.errors) {
          const errors = data.errors.reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
          }, {});
          setFormErrors(errors);
          clearFormErrors();
        } else {
          setError(data.message || 'Failed to submit attendance');
          clearError();
        }
      }
    } catch (err) {
      setError('Error submitting attendance. Please try again.');
      clearError();
      console.error('Error submitting attendance:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (index, status) => {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    const updatedAttendance = [...attendanceData];
    updatedAttendance[globalIndex].status = status;
    setAttendanceData(updatedAttendance);
  };

  // Pagination
  const totalPages = Math.ceil(attendanceData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAttendance = attendanceData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <button onClick={() => navigate(-1)} className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-medium">Daily Attendance</span>
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

      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md dark:bg-green-900/20 dark:border-green-600 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Attendance marked successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Form */}
      <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-xl shadow-md p-6 mb-6 transition-colors duration-200`}>
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Mark Attendance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Date
            </label>
            <div className={`relative rounded-md shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="date"
                value={date}
                readOnly
                className={`pl-10 block w-full rounded-lg border ${
                  isDarkMode 
                  ? 'bg-dark-accent border-gray-600 text-white focus:border-brand-primary focus:ring-brand-primary' 
                  : 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500'} 
                  py-2.5 text-sm transition-colors`}
              />
            </div>
          </div>
          
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
                value={selectedEmployees}
                onChange={(e) => setSelectedEmployees(e.target.value)}
                className={`pl-10 block w-full rounded-lg border ${
                  isDarkMode 
                  ? 'bg-dark-accent border-gray-600 text-white focus:border-brand-primary focus:ring-brand-primary' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} 
                  py-2.5 text-sm transition-colors`}
              >
                <option value="All Employees">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={getEmployeesList}
              disabled={!date || loading}
              className={`w-full flex justify-center items-center px-4 py-2.5 rounded-lg text-white font-medium ${
                !date || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'
              } transition-colors duration-200 shadow-sm`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              Get Employee List
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {attendanceData.length > 0 && (
        <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200 mb-6`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'}`}>
                <tr>
                  <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Employee Name</th>
                  <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                  <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                {displayedAttendance.map((employee, index) => (
                  <tr key={index} className={`${isDarkMode ? 'hover:bg-dark-accent/50' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{employee.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(index, STATUS.PRESENT)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            employee.status === STATUS.PRESENT 
                              ? 'bg-green-500 text-white ring-2 ring-green-500 ring-opacity-50' 
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(index, STATUS.ABSENT)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            employee.status === STATUS.ABSENT 
                              ? 'bg-red-500 text-white ring-2 ring-red-500 ring-opacity-50' 
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(index, STATUS.ONLEAVE)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            employee.status === STATUS.ONLEAVE 
                              ? 'bg-yellow-500 text-white ring-2 ring-yellow-500 ring-opacity-50' 
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          On Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-accent border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    isDarkMode 
                    ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent disabled:bg-gray-800 disabled:text-gray-500' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
                  } transition-colors disabled:cursor-not-allowed`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-brand-primary text-white'
                        : isDarkMode 
                          ? 'bg-dark-secondary text-gray-300 border border-gray-600 hover:bg-dark-accent' 
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    isDarkMode 
                    ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent disabled:bg-gray-800 disabled:text-gray-500' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
                  } transition-colors disabled:cursor-not-allowed`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {attendanceData.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Attendance
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyAttendance;
