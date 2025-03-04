import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function EmployeeForm({ onSubmit, onClose, employee, error, formErrors }) {
  const [formEmployee, setFormEmployee] = useState({
    name: '',
    contact: '',
    email: '',
    position: '',
    basicSalary: '',
  });

  useEffect(() => {
    if (employee) {
      // Set form data from employee object
      setFormEmployee({
        name: employee.name || '',
        contact: employee.contact || '',
        email: employee.email || '',
        position: employee.position || '',
        basicSalary: employee.basicSalary || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any field-specific errors when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data before submission
      if (!formEmployee.name.trim()) {
        return;
      }
      if (!formEmployee.email.trim()) {
        return;
      }
      if (!formEmployee.contact.trim()) {
        return;
      }
      if (!formEmployee.position.trim()) {
        return;
      }
      
      if (formEmployee.basicSalary === '' || formEmployee.basicSalary === undefined) {
        error.basicSalary = 'Basic salary is required';
      } else if (isNaN(formEmployee.basicSalary) || Number(formEmployee.basicSalary) < 0) {
        error.basicSalary = 'Basic salary must be a non-negative number';
      }
      
      await onSubmit(formEmployee);
    } catch (err) {
      // No need to set a separate formError state, as we're using formErrors from the parent
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        >
          <X size={24} />
        </button>
      </div>

      {/* Display error messages if any */}
      {(error) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formEmployee.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-150 ease-in-out ${
                       formErrors.name ? 'border-red-500' : ''
                     }`}
            required
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
            Contact No
          </label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={formEmployee.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-150 ease-in-out ${
                       formErrors.contact ? 'border-red-500' : ''
                     }`}
            required
          />
          {formErrors.contact && (
            <p className="text-red-500 text-sm mt-1">{formErrors.contact}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formEmployee.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-150 ease-in-out ${
                       formErrors.email ? 'border-red-500' : ''
                     }`}
            required
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <input
            type="text"
            name="position"
            id="position"
            value={formEmployee.position}
            onChange={handleChange}
            placeholder="Enter job position"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-150 ease-in-out ${
                       formErrors.position ? 'border-red-500' : ''
                     }`}
            required
          />
          {formErrors.position && (
            <p className="text-red-500 text-sm mt-1">{formErrors.position}</p>
          )}
        </div>

        <div>
          <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Basic Salary
          </label>
          <input
            type="number"
            name="basicSalary"
            id="basicSalary"
            value={formEmployee.basicSalary}
            onChange={handleChange}
            placeholder="Enter basic salary"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-150 ease-in-out ${
                       formErrors.basicSalary ? 'border-red-500' : ''
                     }`}
            required
          />
          {formErrors.basicSalary && (
            <p className="text-red-500 text-sm mt-1">{formErrors.basicSalary}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                     text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            {employee ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;