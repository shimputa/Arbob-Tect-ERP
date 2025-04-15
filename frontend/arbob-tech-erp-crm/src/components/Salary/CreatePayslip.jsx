import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';


function CreatePayslip({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employee: '',
    month: '',
    year: '',
    bonus: '',
    projectBonusShare: 0,
    advanceSalary: '', 
    advancePayment: '', 
    basicSalary: 0,
    totalBonus: 0,
    totalDeduction: 0,
    netSalary: 0,
    paymentMethod: '',
    status: ''
  });
  const [employees, setEmployees] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoadingBonuses, setIsLoadingBonuses] = useState(false);
  const [isLoadingAdvance, setIsLoadingAdvance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
    // eslint-disable-next-line no-unused-vars
  const [advanceDetails, setAdvanceDetails] = useState([]);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 6 }, (_, i) => 2020 + i);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EMPLOYEES_API}`
      );
      setEmployees(response.data.employees);
    } catch (error) {
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProjectBonuses = async (employeeId, month, year) => {
    if (!employeeId || !month || !year) return;
    
    setIsLoadingBonuses(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_SALARY_API}/project-bonuses`,
        { params: { employeeId, month, year } }
      );
      
      const { totalBonusShare } = response.data;
      
      setFormData(prev => {
        const updatedData = {
          ...prev,
          projectBonusShare: totalBonusShare || 0
        };

        calculateSalary(
          updatedData.bonus,
          totalBonusShare,
          updatedData.advancePayment,
          updatedData.basicSalary
        );

        return updatedData;
      });
    } catch (error) {
      console.error('Error fetching project bonus share:', error);
      setError('Failed to fetch project bonus share');
    } finally {
      setIsLoadingBonuses(false);
    }
  };

  const fetchRemainingAdvanceSalary = async (employeeId) => {
    if (!employeeId) return;
    
    setIsLoadingAdvance(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_SALARY_API}/remaining-advance`,
        { params: { employeeId } }
      );
      
      const { totalRemainingAmount, advanceSalaries } = response.data;
      
      setAdvanceDetails(advanceSalaries || []);
      
      setFormData(prev => {
        const updatedData = {
          ...prev,
          advanceSalary: totalRemainingAmount || 0,
          advancePayment: '', // Initialize empty to let user decide how much to pay
        };

        calculateSalary(
          updatedData.bonus,
          updatedData.projectBonusShare,
          0, // No advance payment initially
          updatedData.basicSalary
        );

        return updatedData;
      });
    } catch (error) {
      console.error('Error fetching remaining advance salary:', error);
      // Don't show error to user as this is an enhancement, not a critical feature
    } finally {
      setIsLoadingAdvance(false);
    }
  };

  const updateEmployeeDetails = (employeeId) => {
    try {
      const selectedEmployee = employees.find(emp => emp.id === Number(employeeId));
      if (selectedEmployee) {
        setFormData(prevData => {
          const updatedData = {
            ...prevData,
            employee: employeeId,
            basicSalary: selectedEmployee.basicSalary || 0,
          };

          calculateSalary(
            updatedData.bonus,
            updatedData.projectBonusShare,
            updatedData.advancePayment,
            updatedData.basicSalary
          );

          return updatedData;
        });
        
        // Fetch remaining advance salary when employee is selected
        fetchRemainingAdvanceSalary(employeeId);
      }
    } catch (error) {
      console.error('Error updating employee details:', error);
      setError('Failed to update employee details');
    }
  };

  const calculateSalary = useMemo(
    () =>
      debounce((bonus, projectBonusShare, advancePayment, basicSalary) => {
        const totalBonus = (Number(bonus) || 0) + (Number(projectBonusShare) || 0);
        const totalDeduction = Number(advancePayment) || 0; // Only advancePayment
        const netSalary = basicSalary + totalBonus - totalDeduction;

        setFormData((prevData) => ({
          ...prevData,
          totalBonus,
          totalDeduction,
          netSalary,
        }));
      }, 300),
    []
  );

  useEffect(() => {
    calculateSalary(
      formData.bonus,
      formData.projectBonusShare,
      formData.advancePayment,
      formData.basicSalary
    );
  }, [formData.bonus, formData.projectBonusShare, formData.advancePayment, formData.basicSalary, calculateSalary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'employee' && value) {
      updateEmployeeDetails(value);
    }
    
    // Special validation for advancePayment
    if (name === 'advancePayment') {
      const numValue = Number(value);
      const maxAdvance = Number(formData.advanceSalary);
      
      // Don't allow advance payment larger than available advance
      if (numValue > maxAdvance) {
        return;
      }
    }
    
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');

     // Fetch project bonuses when all required fields are filled
     if (['employee', 'month', 'year'].includes(name)) {
      const updatedData = { ...formData, [name]: value };
      if (updatedData.employee && updatedData.month && updatedData.year) {
        fetchProjectBonuses(updatedData.employee, updatedData.month, updatedData.year);
      }
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (step === 1) {
        if (!formData.employee || !formData.month || !formData.year) {
          setError('Please fill in all fields');
          return;
        }
        setError(''); // Clear any errors when moving to next step
        setStep(2);
      } else if (step === 2) {
        if (formData.bonus === '' || formData.advancePayment === '') {
          setError('Please fill in all fields');
          return;
        }
        setError(''); // Clear any errors when moving to next step
        setStep(3);
      } else if (step === 3) {
        if (!formData.paymentMethod || !formData.status) {
          setError('Please fill in all fields');
          return;
        }
        setIsSaving(true);
        
        // Find the selected employee to get their name
        const selectedEmployee = employees.find(emp => emp.id === Number(formData.employee));
        if (!selectedEmployee) {
          setError('Selected employee not found');
          setIsSaving(false);
          return;
        }

        // Format the data before submission
        const formattedData = {
          ...formData,
          employee: selectedEmployee.name, // Send employee name instead of ID
          bonus: Number(formData.bonus) || 0,
          projectBonusShare: Number(formData.projectBonusShare) || 0,
          advanceSalary: Number(formData.advanceSalary) || 0,
          advancePayment: Number(formData.advancePayment) || 0,
          basicSalary: Number(formData.basicSalary) || 0,
          totalBonus: Number(formData.totalBonus) || 0,
          totalDeduction: Number(formData.totalDeduction) || 0,
          netSalary: Number(formData.netSalary) || 0,
          year: formData.year.toString()
        };

        try {
          await onSubmit(formattedData);
          
          setSuccessMessage('Payslip successfully created.');
          
          // Reset form after success
          setFormData({
            employee: '',
            month: '',
            year: '',
            bonus: '',
            projectBonusShare: 0,
            advanceSalary: '',
            advancePayment: '',
            basicSalary: 0,
            totalBonus: 0,
            totalDeduction: 0,
            netSalary: 0,
            paymentMethod: '',
            status: ''
          });

          setTimeout(() => {
            setSuccessMessage('');
            navigate('/salary/payslip-list');
          }, 2000);

        } catch (error) {
          console.error("Form submission error:", error);
          
          let errorMessage = 'Failed to create payslip';
          
          if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
              try {
                const parsedData = JSON.parse(error.response.data);
                errorMessage = parsedData.message || errorMessage;
              } catch (e) {
                // If it's not valid JSON string
                errorMessage = error.response.data;
              }
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            }
          }
          
          console.log("Setting error message:", errorMessage);
          
          // Set the error before changing step
          setError(errorMessage);
          
          // Use setTimeout to ensure the error is set before changing the step
          if (errorMessage.includes('already exists')) {
            setTimeout(() => {
              setStep(1);
            }, 50);
          }
        } finally {
          setIsSaving(false);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(err.message || 'An unexpected error occurred');
      setIsSaving(false);
    }
  };

  const inputClass = `mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
    isDarkMode ? 'bg-dark-accent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
  }`;
  const labelClass = `block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`;
  const buttonClass = `inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;

  return (
    <div className={`max-w-3xl mx-auto p-6 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : ''}`}>Create Payslip</span>
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className={`mb-4 p-4 rounded-md ${
          error.includes('already exists')
            ? isDarkMode 
              ? 'bg-yellow-800/20 border-l-4 border-yellow-600 text-yellow-300'
              : 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700'
            : isDarkMode
              ? 'bg-red-800/20 border-l-4 border-red-600 text-red-300'
              : 'bg-red-50 border-l-4 border-red-500 text-red-700'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {error.includes('already exists') ? (
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className={`h-5 w-5 ${isDarkMode ? 'text-red-500' : 'text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
              {error.includes('already exists') && (
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-yellow-300' : ''}`}>
                  Please select a different employee, month, or year.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className={`mb-4 p-4 ${isDarkMode ? 'bg-green-800/20 border-l-4 border-green-600 text-green-300' : 'bg-green-50 border-l-4 border-green-400 text-green-700'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${isDarkMode ? 'text-green-500' : 'text-green-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= stepNumber ? 'border-blue-600 bg-blue-600 text-white' : isDarkMode ? 'border-gray-600 bg-dark-accent text-gray-400' : 'border-gray-400'}`}
              >
                {stepNumber}
              </span>
              <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                {stepNumber === 1 ? 'Employee Info' : stepNumber === 2 ? 'Salary Details' : 'Payment Info'}
              </span>
              {stepNumber < 3 && <div className={`w-24 h-1 mx-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Employee Info */}
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="employee" className={labelClass}>Employee</label>
              <div className="relative">
                <select
                  id="employee"
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="month" className={labelClass}>Month</label>
              <div className="relative">
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="year" className={labelClass}>Year</label>
              <div className="relative">
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={buttonClass}
              disabled={isLoading || isSaving}
            >
              {isLoading || isSaving ? 'Loading...' : 'Next'}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Salary Details */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-4">Allowance</h3>
              <label htmlFor="bonus" className={labelClass}>Additional Bonus</label>
              <input
                type="number"
                id="bonus"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                className={inputClass}
                min="0"
              />

              <label htmlFor="projectBonusShare" className={`${labelClass} mt-4`}>
                Project Bonus Share
                {isLoadingBonuses && (
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                )}
              </label>
              <input
                type="number"
                id="projectBonusShare"
                name="projectBonusShare"
                value={formData.projectBonusShare}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Deductions</h3>
              <label htmlFor="advanceSalary" className={labelClass}>
                Remaining Advance Salary
                {isLoadingAdvance && (
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                )}
              </label>
              <input
                type="number"
                id="advanceSalary"
                name="advanceSalary"
                value={formData.advanceSalary}
                readOnly
                className={`${inputClass} bg-gray-100`}
                min="0"
              />             
              <label htmlFor="advancePayment" className={`${labelClass} mt-4`}>
                Advance Salary Payment
                <span className="ml-2 text-xs text-gray-500"></span>
              </label>
              <input
                type="number"
                id="advancePayment"
                name="advancePayment"
                value={formData.advancePayment}
                onChange={handleChange}
                className={inputClass}
                min="0"
                max={formData.advanceSalary || 0}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <label htmlFor="basicSalary" className={labelClass}>Basic Salary</label>
              <input
                type="number"
                id="basicSalary"
                name="basicSalary"
                value={formData.basicSalary}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
              <label htmlFor="totalBonus" className={`${labelClass} mt-4`}>Total Bonus</label>
              <input
                type="number"
                id="totalBonus"
                name="totalBonus"
                value={formData.totalBonus}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
              <label htmlFor="totalDeduction" className={`${labelClass} mt-4`}>Total Deduction</label>
              <input
                type="number"
                id="totalDeduction"
                name="totalDeduction"
                value={formData.totalDeduction}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
              <label htmlFor="netSalary" className={`${labelClass} mt-4`}>Net Salary</label>
              <input
                type="number"
                id="netSalary"
                name="netSalary"
                value={formData.netSalary}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}
            >
              Back
            </button>
            <button
              type="submit"
              className={buttonClass}
              disabled={isLoading || isSaving}
            >
              {isLoading || isSaving ? 'Loading...' : 'Next'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment Info */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="paymentMethod" className={labelClass}>Payment Method</label>
              <div className="relative">
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Easypaisa">Easypaisa</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}
            >
              Back
            </button>
            <button
              type="submit"
              className={buttonClass}
              disabled={isLoading || isSaving}
            >
              {isSaving ? 'Saving...' : 'Create Payslip'}
            </button>
          </div>
        </form>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

CreatePayslip.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default CreatePayslip;