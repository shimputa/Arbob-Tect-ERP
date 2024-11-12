import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

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
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setFilteredPayslips(Array.isArray(initialPayslips) ? initialPayslips : []);
  }, [initialPayslips]);

    // Separate search handler
  const handleSearch = useCallback(async (searchValue) => {
    if (!searchValue.trim()) {
      setFilteredPayslips(Array.isArray(initialPayslips) ? initialPayslips : []);
      return;
    }

    setLocalLoading(true);
    setLocalError(null);
    try {
      const response = await axios.get(`http://localhost:3000/salary/filter?employeeName=${encodeURIComponent(searchValue.trim())}`);
      
      if (response.data && response.data.salaries) {
        setFilteredPayslips(response.data.salaries);
      } else if (Array.isArray(response.data)) {
        setFilteredPayslips(response.data);
      } else {
        setFilteredPayslips([]);
      }
    }catch (err) {
      console.error('Search error:', err);
      // Don't set error for empty results
      if (err.response?.status !== 404) {
        setLocalError('Failed to search payslips. Please try again.');
      }
      setFilteredPayslips([]);
    } finally {
      setLocalLoading(false);
    }
  }, [initialPayslips]);

 // Regular filter handler for month and year
 const handleFilter = useCallback(async () => {
  setLocalLoading(true);
  setLocalError(null);
  try {
    const params = new URLSearchParams();
    if (filterMonth.trim()) params.append('month', filterMonth);
    if (filterYear.trim()) params.append('year', filterYear);

    const response = await axios.get(`http://localhost:3000/salary/filter?${params}`);
    
    if (response.data && response.data.salaries) {
      setFilteredPayslips(response.data.salaries);
    } else if (Array.isArray(response.data)) {
      setFilteredPayslips(response.data);
    } else {
      setFilteredPayslips([]);
    }
    setCurrentPage(1);
  } catch (err) {
    console.error('Filter error:', err);
    setLocalError('Failed to filter payslips. Please try again.');
    setFilteredPayslips([]);
  } finally {
    setLocalLoading(false);
  }
}, [filterMonth, filterYear]);

 // Debounced search effect
 useEffect(() => {
  const timeoutId = setTimeout(() => {
    handleSearch(filterName);
  }, 500);

  return () => clearTimeout(timeoutId);
}, [filterName, handleSearch]);

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

  if (isLoading || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md">
        <p>{error || localError}</p>
        <button 
          onClick={() => {
            onRefresh();
            setLocalError(null); // Clear local error when refreshing
          }}
          className="mt-2 text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-medium font-bold mb-6 text-gray-800">
          Payslip List
        </h2>

        {localError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {localError}
            <button
              onClick={() => setLocalError(null)}
              className="ml-2 text-sm text-red-800 hover:underline"
            >
               Dismiss
            </button>
          </div>
        )}
        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by Name"
                value={filterName}
                onChange={(e) => {setFilterName(e.target.value); setLocalError(null);}}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Month Select */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">Select Month</option>
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              <option value="">Select Year</option>
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                disabled={localLoading}
              >
                {localLoading ? 'Filtering...' : 'Filter'}
              </button>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Active Filters - Only showing month and year */}
          {(filterMonth || filterYear) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filterMonth && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Year: {filterYear}
                  <button
                    onClick={() => setFilterYear('')}
                    className="ml-2 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedPayslips.length > 0 ? (
                displayedPayslips.map((payslip, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payslip.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payslip.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payslip.year}
                    </td>
                    <td className="px-6 py-4">
                      <p>Basic Salary: <span className="font-medium">${payslip.basicSalary}</span></p>
                      <p>Total Bonus: <span className="font-medium">${payslip.totalBonus}</span></p>
                      <p>Total Deduction: <span className="font-medium">${payslip.totalDeduction}</span></p>
                      <p>Net Salary: <span className="font-medium">${payslip.netSalary}</span></p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payslip.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                        className="text-red-600 hover:text-red-900 mr-4 transition-colors duration-300"
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
                        className="text-green-600 hover:text-green-900 transition-colors duration-300"
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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