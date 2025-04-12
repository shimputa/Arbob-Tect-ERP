import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const ITEMS_PER_PAGE = 2;

// Constants
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
})();

function PayslipList({ payslips: initialPayslips, onDelete, onPrint, isLoading, error, onRefresh }) {
  const [filteredPayslips, setFilteredPayslips] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [localError, setLocalError] = useState(null);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(initialPayslips)) {
      setFilteredPayslips(initialPayslips);
    } else {
      console.warn('Invalid payslips data received:', initialPayslips);
      setFilteredPayslips([]);
    }
  }, [initialPayslips]);

  // Simple search and filter without API calls
  useEffect(() => {
    if (!Array.isArray(initialPayslips)) return;
    
    // Apply all filters (name, month, year)
    const filtered = initialPayslips.filter((payslip) => {
      const nameMatch = !filterName || 
        (payslip.employee && payslip.employee.toLowerCase().includes(filterName.toLowerCase()));
      
      const monthMatch = !filterMonth || payslip.month === filterMonth;
      
      // Handle year comparison - convert both to strings for comparison
      const payslipYear = String(payslip.year);
      const selectedYear = String(filterYear);
      const yearMatch = !filterYear || payslipYear === selectedYear;
      
      return nameMatch && monthMatch && yearMatch;
    });
    
    setFilteredPayslips(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filterName, filterMonth, filterYear, initialPayslips]);

  const handleSearch = (e) => {
    setFilterName(e.target.value);
    setLocalError(null);
  };

  const handleFilter = () => {
    // Already handled by the useEffect
  };

  const handleClearFilters = () => {
    setFilterMonth('');
    setFilterYear('');
    setFilterName('');
    setFilteredPayslips(Array.isArray(initialPayslips) ? initialPayslips : []);
    setCurrentPage(1);
    setLocalError(null);
  };

  const safeFilteredPayslips = Array.isArray(filteredPayslips) ? filteredPayslips : [];
  const totalPages = Math.ceil(safeFilteredPayslips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPayslips = safeFilteredPayslips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className={`p-4 rounded-md ${isDarkMode ? 'bg-red-900/20 text-red-400 border border-red-700' : 'text-red-600 bg-red-50'}`}>
        <p>{error || localError}</p>
        <button 
          onClick={() => {
            onRefresh();
            setLocalError(null); // Clear local error when refreshing
          }}
          className={`mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} hover:underline`}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      <div className="container mx-auto py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button 
            onClick={() => navigate(-1)} 
            className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className={`font-medium ${isDarkMode ? 'text-gray-200' : ''}`}>Payslip List</span>
          </button>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by employee name"
                value={filterName}
                onChange={handleSearch}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${isDarkMode 
                    ? 'bg-dark-accent border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkMode 
                  ? 'bg-dark-accent border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="">Select Month</option>
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkMode 
                  ? 'bg-dark-accent border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="">Select Year</option>
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button
              onClick={handleFilter}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {!isLoading ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </>
              ) : (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Filtering...
                </>
              )}
            </button>
          </div>
        </div>

        {localError && (
          <div className={`mb-4 p-4 rounded-md ${isDarkMode ? 'bg-red-900/20 text-red-400 border border-red-700' : 'bg-red-50 text-red-600'}`}>
            {localError}
            <button
              onClick={() => setLocalError(null)}
              className={`ml-2 text-sm ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-800 hover:text-red-700'}`}
            >
               Dismiss
            </button>
          </div>
        )}
        
        {/* Active Filters */}
        {(filterMonth || filterYear) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filterMonth && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                Month: {filterMonth}
                <button
                  onClick={() => setFilterMonth('')}
                  className="ml-2 focus:outline-none"
                >
                  ×
                </button>
              </span>
            )}
            {filterYear && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                Year: {filterYear}
                <button
                  onClick={() => setFilterYear('')}
                  className="ml-2 focus:outline-none"
                >
                  ×
                </button>
              </span>
            )}
            {(filterMonth || filterYear) && (
              <button
                onClick={handleClearFilters}
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Employee Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Month
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Year
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Summary
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
              {displayedPayslips.length > 0 ? (
                displayedPayslips.map((payslip, index) => (
                  <tr key={index} className={`${isDarkMode ? 'hover:bg-dark-accent/50' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {payslip.employee}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {payslip.month}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {payslip.year}
                    </td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : ''}`}>
                      <p>Basic Salary: <span className="font-medium">PKR {payslip.basicSalary}</span></p>
                      <p>Total Bonus: <span className="font-medium">PKR {payslip.totalBonus}</span></p>
                      <p>Total Deduction: <span className="font-medium">PKR {payslip.totalDeduction}</span></p>
                      <p>Net Salary: <span className="font-medium">PKR {payslip.netSalary}</span></p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payslip.status === 'Paid' 
                          ? isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800' 
                          : isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
                      }`}>
                        {payslip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this payslip?')) {
                            onDelete(payslip.id);
                          }
                        }}
                        className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'} mr-4 transition-colors duration-300`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onPrint(payslip)}
                        className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'} transition-colors duration-300`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 9V2h12v7M6 18v-3h12v3m-4 4h-4m6-4H6a2 2 0 01-2-2V9a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No payslips available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {displayedPayslips.length > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              className={`px-4 py-2 border rounded-md text-sm font-medium 
                ${isDarkMode 
                  ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isDarkMode 
                      ? 'bg-dark-secondary text-gray-300 border-gray-600 hover:bg-dark-accent' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              className={`px-4 py-2 border rounded-md text-sm font-medium 
                ${isDarkMode 
                  ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

PayslipList.propTypes = {
  payslips: PropTypes.array,
  onDelete: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func.isRequired
};

PayslipList.defaultProps = {
  payslips: [],
  isLoading: false,
  error: null
};

export default PayslipList;