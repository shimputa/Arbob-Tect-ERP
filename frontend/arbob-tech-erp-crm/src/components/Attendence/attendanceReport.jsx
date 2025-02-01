import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

function AttendanceReport() {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [reportData, setReportData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
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
      const response = await fetch(`${API_BASE_URL}/api/activeEmployees`);
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
      const response = await fetch(
        `${API_BASE_URL}/attendance/report?year=${year}&month=${monthNum}&employeeId=${selectedEmployee}`
      );
      const data = await response.json();
      
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
    } catch (error) {
      setError('Error generating report. Please try again.');
      setTimeout(() => setError(''), MESSAGE_TIMEOUTS.DEFAULT);
      console.error('Error generating report:', error);
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
        return 'bg-green-100 text-green-800';
      case STATUS.ABSENT:
        return 'bg-red-100 text-red-800';
      case STATUS.ONLEAVE:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <option value="all">All Employees</option>
              {employees && employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
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

        {loading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {reportData.length === 0 && !loading && !error && (
          <div className="mt-6 text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Records Found</h3>
            <p className="mt-1 text-sm text-gray-500">No attendance records are available for the selected period.</p>
          </div>
        )}

        {reportData.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  {Array.from({ length: 31 }, (_, i) => (
                    <th key={i} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {i + 1}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    {employee.attendance.map((status, dayIndex) => (
                      <td key={dayIndex} className="px-2 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center text-sm text-green-600 font-semibold">
                      {employee.totals.present}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-red-600 font-semibold">
                      {employee.totals.absent}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-yellow-600 font-semibold">
                      {employee.totals.leave}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceReport;
