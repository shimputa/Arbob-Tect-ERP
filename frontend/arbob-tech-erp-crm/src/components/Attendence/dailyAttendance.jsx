import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../utils/fetchWithAuth';

const API_BASE_URL = 'http://localhost:3000'; 

// Constants
const ITEMS_PER_PAGE = 5;
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
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuth(`${API_BASE_URL}/api/activeEmployees`);
      const data = await response.json();
      
      if (data.employees) {  
        const employeesList = data.employees.map(emp => ({
          id: emp.id,
          name: emp.name
        }));
        setEmployees(employeesList);
      } else {
        setError('Failed to fetch employees list');
      }
    } catch (error) {
      setError('Error fetching employees. Please try again.');
      console.error('Error fetching employees:', error);
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
    } catch (error) {
      setError('Error preparing employee list. Please try again.');
      clearError();
      console.error('Error preparing employee list:', error);
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

      const response = await fetchWithAuth(`${API_BASE_URL}/attendance/mark`, {
        method: 'POST',
        body: JSON.stringify(attendancePayload),
      });

      const data = await response.json();
      
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
    } catch (error) {
      setError('Error submitting attendance. Please try again.');
      clearError();
      console.error('Error submitting attendance:', error);
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
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {Object.keys(formErrors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          {Object.entries(formErrors).map(([field, message]) => (
            <p key={field} className="text-red-600 text-sm">
              {message}
            </p>
          ))}
        </div>
      )}

      {showSuccessMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">Attendance marked successfully!</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Daily Attendance</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={date}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
            <select
              value={selectedEmployees}
              onChange={(e) => setSelectedEmployees(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="All Employees">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex items-end">
            <button
              onClick={getEmployeesList}
              disabled={!date}
              className={`w-full px-4 py-2 rounded-md text-white font-medium ${
                !date ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Get Employee List
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(index, STATUS.PRESENT)}
                        className={`px-2 py-1 rounded ${
                          employee.status === STATUS.PRESENT ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(index, STATUS.ABSENT)}
                        className={`px-2 py-1 rounded ${
                          employee.status === STATUS.ABSENT ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleStatusChange(index, STATUS.ONLEAVE)}
                        className={`px-2 py-1 rounded ${
                          employee.status === STATUS.ONLEAVE ? 'bg-yellow-500 text-white' : 'bg-gray-200'
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
    </div>
  );
};

export default DailyAttendance;
