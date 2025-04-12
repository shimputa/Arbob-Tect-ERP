import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

function UserForm({ onSubmit, onClose, user, error, formErrors }) {
  const [formUser, setFormUser] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (user) {
      // Set form data from user object
      setFormUser({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        password: '', // Don't pre-fill password for security
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data before submission
      if (!formUser.name.trim()) {
        return;
      }
      if (!formUser.email.trim()) {
        return;
      }
      if (!formUser.role.trim()) {
        return;
      }
      // Only validate password for new users
      if (!user && !formUser.password.trim()) {
        return;
      }
      
      // For updates, only include password if it's provided
      const submissionData = user 
        ? { ...formUser, ...(formUser.password ? { password: formUser.password } : {}) }
        : formUser;
      
      await onSubmit(submissionData);
    } catch (err) {
      // No need to set a separate formError state, as we're using formErrors from the parent
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} w-96 shadow-lg p-6 overflow-y-auto transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-800'}`}>
          {user ? 'Edit User' : 'Add New User'}
        </h3>
        <button 
          onClick={onClose}
          className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition duration-150 ease-in-out`}
        >
          <X size={24} />
        </button>
      </div>

      {/* Display error messages if any */}
      {(error) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-700">
          <p className="text-red-600 text-sm dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formUser.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
                     transition duration-150 ease-in-out 
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.name ? 'border-red-500' : ''}`}
            required
          />
          {formErrors.name && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formUser.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
                     transition duration-150 ease-in-out 
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.email ? 'border-red-500' : ''}`}
            required
          />
          {formErrors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Role
          </label>
          <select
            name="role"
            id="role"
            value={formUser.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
                     transition duration-150 ease-in-out 
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.role ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select a role</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="FINANCE_MANAGER">Finance Manager</option>
            <option value="HR">HR</option>
          </select>
          {formErrors.role && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{formErrors.role}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formUser.password}
            onChange={handleChange}
            placeholder={user ? "keep current password/or update password" : "Enter password"}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
                     transition duration-150 ease-in-out 
                     ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                     ${formErrors.password ? 'border-red-500' : ''}`}
            required={!user} // Only required for new users
          />
          {formErrors.password && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{formErrors.password}</p>
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
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary
                     transition duration-150 ease-in-out`}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                     text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-brand-primary transition duration-150 ease-in-out"
          >
            {user ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm; 