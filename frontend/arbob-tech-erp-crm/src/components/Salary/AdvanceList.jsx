import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdvanceForm from './AdvanceForm';
import { usePermission } from '../../contexts/PermissionContext';
import { PermissionGate } from '../common/PermissionGate';
import { useTheme } from '../../contexts/ThemeContext';

const ITEMS_PER_PAGE = 5;

function AdvanceList() {
  const [advances, setAdvances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const { hasPermission } = usePermission();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdvances();
  }, []);

  const fetchAdvances = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/advance-salary');
      setAdvances(response.data.advances);
    } catch (err) {
      setError('Failed to fetch advance records. Please try again later.');
      console.error('Error fetching advance salary:', err);
      setAdvances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdvance = async (newAdvance) => {
    try {
      setError(null);
      setFormErrors({});
      let response;
      
      // Ensure amount is a number
      const formattedAdvance = {
        ...newAdvance,
        amount: Number(newAdvance.amount),
        remainingAmount: Number(newAdvance.remainingAmount)
      };

      if (editingAdvance) {
        response = await axios.put(`http://localhost:3000/advance-salary/${editingAdvance.id}`, {
          ...editingAdvance,
          ...formattedAdvance,
        });
        setAdvances(advances.map((adv) => (adv.id === editingAdvance.id ? response.data : adv)));
        setSuccessMessage('Advance record updated successfully!');
      } else {
        // For new advances, ensure amount is greater than 0
        if (formattedAdvance.amount <= 0) {
          setError('Amount must be greater than 0 for new advances');
          return;
        }
        response = await axios.post('http://localhost:3000/advance-salary', formattedAdvance);
        setAdvances([...advances, response.data]);
        setSuccessMessage('Advance record added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingAdvance(null);
      await fetchAdvances();

      const timeoutId = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timeoutId);

    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {});
        setFormErrors(errors);
      } else {
        setError(err.response?.data?.message || 'Failed to save advance salary record. Please try again.');
      }
    }
  };

  const handleDeleteAdvance = async (id) => {
    try {
      setError(null);
      await axios.delete(`http://localhost:3000/advance-salary/${id}`);
      setAdvances(advances.filter((adv) => adv.id !== id));
      setSuccessMessage('Advance record deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete advance salary record. Please try again.');
      console.error('Error deleting advance salary:', err);
    }
  };

  const handleEditAdvance = (advance) => {
    setError(null);
    setFormErrors({});
    setEditingAdvance(advance);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdvances = Array.isArray(advances)
    ? advances.filter((advance) =>
        advance?.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const totalPages = Math.ceil(filteredAdvances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAdvances = filteredAdvances.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-96' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button onClick={() => navigate(-1)} className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className={`font-medium ${isDarkMode ? 'text-gray-200' : ''}`}>Advance Salary List</span>
          </button>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by employee name"
                value={searchTerm}
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
            
            {/* Only show Add button if user has permission */}
            <PermissionGate permission="advance:create">
              <button
                onClick={() => {
                  setEditingAdvance(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Advance
              </button>
            </PermissionGate>
          </div>
        </div>

        {error && (
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <p className={isDarkMode ? 'text-red-400' : 'text-red-600'}>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-600'}`}>
            <p className={isDarkMode ? 'text-green-400' : 'text-green-600'}>{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow overflow-x-auto transition-colors duration-200`}>
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Employee Name</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Remaining Amount</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Description</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                {displayedAdvances.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? 'No advance records found matching your search' : 'No advance records available'}
                    </td>
                  </tr>
                ) : (
                  displayedAdvances.map((advance) => (
                    <tr key={advance.id} className={`${isDarkMode ? 'hover:bg-dark-accent/50' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{advance.employeeName}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>${advance.amount}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>${advance.remainingAmount}</td>
                      <td className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} max-w-xs`}>
                        {advance.description || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(advance.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Only show Edit button if user has permission */}
                        <PermissionGate permission="advance:edit">
                          <button
                            onClick={() => handleEditAdvance(advance)}
                            className={`${isDarkMode ? 'text-brand-light hover:text-brand-primary' : 'text-indigo-600 hover:text-indigo-900'} mr-4`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </PermissionGate>
                        
                        {/* Only show Delete button if user has permission */}
                        <PermissionGate permission="advance:delete">
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this advance salary record?')) {
                                handleDeleteAdvance(advance.id);
                              }
                            }}
                            className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </PermissionGate>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {displayedAdvances.length > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              className={`px-4 py-2 border rounded-md text-sm font-medium 
                ${isDarkMode 
                  ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border text-sm font-medium rounded-md ${
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
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Only show the form modal if user has appropriate permissions */}
      {isModalOpen && hasPermission(editingAdvance ? 'advance:edit' : 'advance:create') && (
        <AdvanceForm
          onSubmit={handleAddAdvance}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAdvance(null);
            setFormErrors({});
            setError(null);
            setSuccessMessage('');
          }}
          advance={editingAdvance}
          error={error}
          formErrors={formErrors}
        />
      )}
    </div>
  );
}

export default AdvanceList; 