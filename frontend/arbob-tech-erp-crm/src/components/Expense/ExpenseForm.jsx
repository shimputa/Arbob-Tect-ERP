import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Form field component for reusability
const FormField = ({ label, children, isDarkMode }) => (
  <div className="space-y-2">
    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
    {children}
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function ExpenseForm({ onSubmit, onClose, expense, formErrors = {}, categories }) {
  const [formExpense, setFormExpense] = useState({
    name: '',
    expenseCategoryName: '',
    currency: 'USD',
    total: '',
    description: '',
    reference: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (expense) {
      setFormExpense({
        name: expense.name || '',
        expenseCategoryName: expense.expenseCategoryName || '',
        currency: expense.currency || 'USD',
        total: expense.total || '',
        description: expense.description || '',
        reference: expense.reference || ''
      });
    }
  }, [expense]);

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formExpense.name.trim()) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formExpense.name.trim())) {
      errors.name = 'Name should only contain letters and spaces';
    } else if (formExpense.name.length < 3 || formExpense.name.length > 100) {
      errors.name = 'Name must be between 3 and 100 characters';
    }

    // Validate expense category
    if (!formExpense.expenseCategoryName) {
      errors.expenseCategoryName = 'Expense category is required';
    }

    // Validate total
    if (!formExpense.total) {
      errors.total = 'Total amount is required';
    } else if (isNaN(formExpense.total) || formExpense.total <= 0) {
      errors.total = 'Total must be a positive number';
    }

    // Validate description
    if (!formExpense.description.trim()) {
      errors.description = 'Description is required';
    } else if (formExpense.description.length < 3 || formExpense.description.length > 500) {
      errors.description = 'Description must be between 3 and 500 characters';
    }

    // Validate reference
    if (!formExpense.reference.trim()) {
      errors.reference = 'Reference is required';
    } else if (formExpense.reference.length < 3 || formExpense.reference.length > 50) {
      errors.reference = 'Reference must be between 3 and 50 characters';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    setLocalErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    setFormExpense(prev => ({
      ...prev,
      [name]: name === 'total' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formExpense);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => (
    <>
      <div className="space-y-2">
        <FormField label="Name" isDarkMode={isDarkMode}>
          <input 
            type="text" 
            name="name" 
            value={formExpense.name} 
            onChange={handleChange} 
            placeholder="Enter name" 
            className={`w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              (formErrors?.name || localErrors?.name) ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}
            disabled={isSubmitting}
            required 
          />
        </FormField>
        {(formErrors?.name || localErrors?.name) && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formErrors?.name || localErrors?.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <FormField label="Expense Category" isDarkMode={isDarkMode}>
          <select
            name="expenseCategoryName"
            value={formExpense.expenseCategoryName}
            onChange={handleChange}
            className={`w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              (formErrors?.expenseCategoryName || localErrors?.expenseCategoryName) ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}
            disabled={isSubmitting}
            required
          >
            <option value="">Select a category</option>
            {categories?.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>
        {(formErrors?.expenseCategoryName || localErrors?.expenseCategoryName) && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formErrors?.expenseCategoryName || localErrors?.expenseCategoryName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <FormField label="Currency" isDarkMode={isDarkMode}>
          <select
            name="currency"
            value={formExpense.currency}
            onChange={handleChange}
            className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}
            disabled={isSubmitting}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="PKR">PKR</option>
          </select>
        </FormField>
      </div>

      <div className="space-y-2">
        <FormField label="Total" isDarkMode={isDarkMode}>
          <input 
            type="number" 
            name="total" 
            value={formExpense.total} 
            onChange={handleChange} 
            placeholder="Enter total amount" 
            className={`w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              (formErrors?.total || localErrors?.total) ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}
            disabled={isSubmitting}
            required 
            min="0"
            step="0.01"
          />
        </FormField>
        {(formErrors?.total || localErrors?.total) && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formErrors?.total || localErrors?.total}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <FormField label="Description" isDarkMode={isDarkMode}>
          <textarea 
            name="description" 
            value={formExpense.description} 
            onChange={handleChange} 
            placeholder="Enter description"
            className={`w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              (formErrors?.description || localErrors?.description) ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}
            disabled={isSubmitting}
            rows={4}
            required 
          />
        </FormField>
        {(formErrors?.description || localErrors?.description) && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formErrors?.description || localErrors?.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <FormField label="Reference" isDarkMode={isDarkMode}>
          <input 
            type="text" 
            name="reference" 
            value={formExpense.reference} 
            onChange={handleChange} 
            placeholder="Enter reference" 
            className={`w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              (formErrors?.reference || localErrors?.reference) ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white text-gray-900'
            }`}
            disabled={isSubmitting}
            required 
          />
        </FormField>
        {(formErrors?.reference || localErrors?.reference) && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formErrors?.reference || localErrors?.reference}
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className={`fixed inset-y-0 right-0 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} w-96 shadow-lg p-6 overflow-y-auto flex flex-col transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-800'}`}>
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h3>
        <button 
          type="button" 
          onClick={onClose}
          disabled={isSubmitting}
          className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition duration-150 ease-in-out`}
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderFormFields()}
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 bg-dark-accent hover:bg-dark-accent/80 focus:ring-gray-500' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
            }`}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-brand-primary hover:bg-brand-dark rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 flex items-center transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              expense ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
