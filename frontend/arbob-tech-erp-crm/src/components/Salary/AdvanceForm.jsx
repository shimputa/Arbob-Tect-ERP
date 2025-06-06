import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

function AdvanceForm({ onSubmit, onClose, advance, error, formErrors }) {
  const [employees, setEmployees] = useState([]);
  const [formAdvance, setFormAdvance] = useState({
    employeeId: '',
    employeeName: '',
    amount: '',
    remainingAmount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 1
  });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (advance) {
      setFormAdvance({
        employeeId: advance.employeeId || '',
        employeeName: advance.employeeName || '',
        amount: advance.amount?.toString() || '',
        remainingAmount: advance.remainingAmount?.toString() || advance.amount?.toString() || '',
        date: advance.date ? new Date(advance.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: advance.description || '',
        status: advance.status ?? 1
      });
    }
  }, [advance]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp.id === Number(value));
      setFormAdvance(prev => ({
        ...prev,
        employeeId: value,
        employeeName: selectedEmployee ? selectedEmployee.name : '',
      }));
    } else if (name === 'amount') {
      setFormAdvance(prev => ({
        ...prev,
        [name]: value,
        remainingAmount: value, // Set remaining amount equal to amount initially
      }));
    } else {
      setFormAdvance(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formAdvance.employeeId) {
        return;
      }
      
      // Allow zero amount for updates
      if (formAdvance.amount === '' || isNaN(formAdvance.amount)) {
        return;
      }
      
      const submissionData = {
        ...formAdvance,
        amount: Number(formAdvance.amount),
        remainingAmount: Number(formAdvance.remainingAmount),
        employeeId: Number(formAdvance.employeeId),
        status: Number(formAdvance.status)
      };
      
      await onSubmit(submissionData);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} w-96 shadow-lg p-6 overflow-y-auto transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {advance ? 'Edit Advance Record' : 'Add New Advance'}
        </h3>
        <button 
          onClick={onClose}
          className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition duration-150 ease-in-out`}
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className={`mb-4 p-3 rounded-md ${isDarkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="employeeId" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Employee
          </label>
          <select
            id="employeeId"
            name="employeeId"
            value={formAdvance.employeeId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.employeeId ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          {formErrors.employeeId && (
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.employeeId}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formAdvance.amount}
            onChange={handleChange}
            placeholder="Enter advance amount"
            className={`w-full px-3 py-2 border rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.amount ? 'border-red-500' : ''}`}
            required
            min="0"
            step="0.01"
          />
          {formErrors.amount && (
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.amount}</p>
          )}
        </div>

        <div>
          <label htmlFor="remainingAmount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Remaining Amount
          </label>
          <input
            type="number"
            name="remainingAmount"
            id="remainingAmount"
            value={formAdvance.remainingAmount}
            className={`w-full px-3 py-2 border rounded-md shadow-sm 
                     ${isDarkMode ? 'bg-dark-accent/50 border-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500 border-gray-300'}
                     cursor-not-allowed
                     ${formErrors.remainingAmount ? 'border-red-500' : ''}`}
            readOnly
            disabled
          />
          {formErrors.remainingAmount && (
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.remainingAmount}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formAdvance.description}
            onChange={handleChange}
            placeholder="Enter reason for advance"
            className={`w-full px-3 py-2 border rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.description ? 'border-red-500' : ''}`}
            rows="3"
          />
          {formErrors.description && (
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formAdvance.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.date ? 'border-red-500' : ''}`}
            required
          />
          {formErrors.date && (
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.date}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className={`px-4 py-2 border rounded-md text-sm font-medium 
                     ${isDarkMode 
                       ? 'border-gray-600 text-gray-300 hover:bg-dark-accent' 
                       : 'border-gray-300 text-gray-700 hover:bg-gray-50'} 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transition duration-150 ease-in-out`}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                     text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500
                     transition duration-150 ease-in-out"
          >
            {advance ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdvanceForm; 