import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

function CreatePayslip({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employee: '',
    month: '',
    year: '',
    bonus: '',
    advanceSalary: '',
    otherDeduction: '',
    basicSalary: 5000,
    totalBonus: 0,
    totalDeduction: 0,
    netSalary: 0,
    paymentMethod: '',
    status: ''
  });
  const [employees, setEmployees] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      const response = await axios.get(`${API_BASE_URL}/employees`);
      setEmployees(response.data.employees);
    } catch (error) {
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSalary = useMemo(
    () =>
      debounce((bonus, advanceSalary, otherDeduction, basicSalary) => {
        const totalBonus = Number(bonus) || 0;
        const totalDeduction = Number(advanceSalary) + Number(otherDeduction) || 0;
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
      formData.advanceSalary,
      formData.otherDeduction,
      formData.basicSalary
    );
  }, [formData.bonus, formData.advanceSalary, formData.otherDeduction, formData.basicSalary, calculateSalary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError('');
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (step === 1) {
        if (!formData.employee || !formData.month || !formData.year) {
          throw new Error('Please fill in all fields');
        }
        setStep(2);
      } else if (step === 2) {
        if (formData.bonus === '' || formData.advanceSalary === '' || formData.otherDeduction === '') {
          throw new Error('Please fill in all fields');
        }
        setStep(3);
      } else if (step === 3) {
        if (!formData.paymentMethod || !formData.status) {
          throw new Error('Please fill in all fields');
        }
        
        try {
          await onSubmit(formData);
          setSuccessMessage(`Payslip successfully created.`);
          
          // Reset form after success
          setFormData({
            employee: '',
            month: '',
            year: '',
            bonus: '',
            advanceSalary: '',
            otherDeduction: '',
            basicSalary: 5000,
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
        const errorMessage = 
        error.response?.data?.message || // axios error response
        error.message || // regular error message
        'Failed to create payslip'; // fallback message

      setError(errorMessage);
      
      if (errorMessage.includes('already exists')) {
        setStep(1);
      }
      
      // Don't hide error message automatically for duplicate entries
      if (!errorMessage.includes('already exists')) {
        setTimeout(() => {
          setError('');
        }, 3000);
      }
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };
    // ... continued from Part 1

    const inputClass = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";
    const buttonClass = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Create Payslip</h2>
  
        {/* Error Message Display */}
        {error && (
          <div className={`mb-4 p-4 rounded-md ${
            error.includes('already exists')
              ? 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700'
              : 'bg-red-50 border-l-4 border-red-500 text-red-700'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {error.includes('already exists') ? (
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
                {error.includes('already exists') && (
                  <p className="mt-2 text-sm">
                    Please select a different employee, month, or year.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
  
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
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
                className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${step >= stepNumber ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}`}
                >
                  {stepNumber}
                </span>
                <span className="ml-2">
                  {stepNumber === 1 ? 'Employee Info' : stepNumber === 2 ? 'Salary Details' : 'Payment Info'}
                </span>
                {stepNumber < 3 && <div className="w-24 h-1 mx-4 bg-gray-200"></div>}
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
                      <option key={employee._id} value={employee._id}>
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
                <label htmlFor="bonus" className={labelClass}>Bonus</label>
                <input
                  type="number"
                  id="bonus"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                <label htmlFor="advanceSalary" className={labelClass}>Advance Salary</label>
                <input
                  type="number"
                  id="advanceSalary"
                  name="advanceSalary"
                  value={formData.advanceSalary}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
                <label htmlFor="otherDeduction" className={`${labelClass} mt-4`}>Other Deduction</label>
                <input
                  type="number"
                  id="otherDeduction"
                  name="otherDeduction"
                  value={formData.otherDeduction}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
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