// components/Projects/ProjectForm.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';

function ProjectForm({ onSubmit, onClose, project, error, formErrors = {}, employees }) {
  const { isDarkMode } = useTheme();
  const [formProject, setFormProject] = useState({
    projectName: '',
    ownerName: '',
    ownerEmail: '',
    ownerNumber: '',
    note: '',
    startDate: '',
    endDate: '',
    paidStatus: 'not paid',
    paidAmount: '',
    amount: '',
    tax: '',
    taxPercentage: '',
    amountAfterTax: '',
    remainingAmount: '',
    bonus: '',
    sharedBonus: '',
    platform: 'upwork',
    projectStatus: 'ongoing',
    collaborators: '',
    selectedEmployeeIds: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormErrors, setLocalFormErrors] = useState({});

  useEffect(() => {
    if (project) {
      const projectData = {...project};
      
      if (project.taxPercentage !== undefined) {
        projectData.tax = project.taxPercentage;
      } else if (project.amount && project.tax) {
        const amount = parseFloat(project.amount);
        const taxAmount = parseFloat(project.tax);
        if (amount > 0) {
          projectData.tax = Math.round((taxAmount / amount) * 100);
        }
      }
      
      if (projectData.platform) {
        projectData.platform = projectData.platform.toLowerCase();
      }
      
      if (projectData.projectStatus) {
        projectData.projectStatus = projectData.projectStatus.toLowerCase();
      }
      
      if (projectData.paidStatus) {
        const paidStatusMap = {
          'NOT_PAID': 'not paid',
          'PARTIAL_PAID': 'partial',
          'PAID': 'paid'
        };
        projectData.paidStatus = paidStatusMap[projectData.paidStatus] || projectData.paidStatus.toLowerCase();
      }
      
      // Handle existing collaborators from project employees
      if (projectData.projectEmployees) {
        projectData.selectedEmployeeIds = projectData.projectEmployees
          .map(pe => pe.employee.id);
        projectData.collaborators = projectData.projectEmployees
          .map(pe => pe.employee.name)
          .join(', ');
      }
      
      setFormProject({
        ...projectData,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [project]);

  useEffect(() => {
    setLocalFormErrors(formErrors || {});
  }, [formErrors]);

  const calculateValues = (name, value) => {
    const updated = { ...formProject, [name]: value };
    
    const amount = parseFloat(updated.amount) || 0;
    const taxPercentage = parseFloat(updated.tax) || 0;
    const paid = parseFloat(updated.paidAmount) || 0;
    const bonus = parseFloat(updated.bonus) || 0;
    
    const taxAmount = Math.round(amount * taxPercentage / 100);
    
    updated.amountAfterTax = amount - taxAmount;
    updated.remainingAmount = amount - taxAmount - paid;
    updated.taxPercentage = taxPercentage;
    
    const collaborators = updated.collaborators.split(',')
      .filter(c => c.trim() !== '').length || 1;
    updated.sharedBonus = Math.round(bonus / collaborators);

    return updated;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProject(prev => calculateValues(name, value));
    
    if (localFormErrors[name]) {
      setLocalFormErrors(prev => {
        const updated = {...prev};
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formProject.projectName.trim()) errors.projectName = 'Project name is required';
    if (!formProject.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formProject.ownerEmail.trim()) errors.ownerEmail = 'Owner email is required';
    if (!formProject.ownerNumber.trim()) errors.ownerNumber = 'Owner number is required';
    if (!formProject.startDate) errors.startDate = 'Start date is required';
    if (!formProject.collaborators.trim()) errors.collaborators = 'Collaborators are required';
    
    if (!formProject.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(formProject.amount) || Number(formProject.amount) < 0) {
      errors.amount = 'Amount must be a non-negative number';
    }
    
    if (formProject.tax && (isNaN(formProject.tax) || Number(formProject.tax) < 0 || Number(formProject.tax) > 100)) {
      errors.tax = 'Tax must be a percentage between 0 and 100';
    }
    
    if (!formProject.paidAmount) {
      errors.paidAmount = 'Paid amount is required';
    } else if (isNaN(formProject.paidAmount) || Number(formProject.paidAmount) < 0) {
      errors.paidAmount = 'Paid amount must be a non-negative number';
    }
    
    if (formProject.ownerEmail && !/^\S+@\S+\.\S+$/.test(formProject.ownerEmail)) {
      errors.ownerEmail = 'Please enter a valid email address';
    }
    
    if (formProject.endDate && formProject.startDate && new Date(formProject.endDate) < new Date(formProject.startDate)) {
      errors.endDate = 'End date cannot be before start date';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setLocalFormErrors(validationErrors);
        setIsSubmitting(false);
        onSubmit({ errors: validationErrors });
        return;
      }

      const submissionData = {
        projectName: formProject.projectName,
        ownerName: formProject.ownerName,
        ownerEmail: formProject.ownerEmail,
        ownerNumber: formProject.ownerNumber,
        note: formProject.note || '',
        collaborators: formProject.collaborators,
        paidStatus: formProject.paidStatus,
        platform: formProject.platform.toLowerCase(),
        projectStatus: formProject.projectStatus.toLowerCase(),
        amount: parseFloat(formProject.amount) || 0,
        paidAmount: parseFloat(formProject.paidAmount) || 0,
        bonus: parseFloat(formProject.bonus) || 0,
        sharedBonus: parseFloat(formProject.sharedBonus) || 0,
        amountAfterTax: parseFloat(formProject.amountAfterTax) || 0,
        remainingAmount: parseFloat(formProject.remainingAmount) || 0,
        tax: parseFloat(formProject.tax) || 0,
        taxPercentage: parseFloat(formProject.tax) || 0
      };
      
      if (formProject.startDate) {
        submissionData.startDate = new Date(formProject.startDate).toISOString();
      }
      
      if (formProject.endDate) {
        submissionData.endDate = formProject.endDate ? new Date(formProject.endDate).toISOString() : null;
      } else {
        submissionData.endDate = null;
      }
      
      if (project && project.id) {
        const projectId = project.id;
        await onSubmit(submissionData, projectId);
      } else {
        await onSubmit(submissionData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} w-[520px] shadow-lg p-8 overflow-y-auto transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-800'}`}>
          {project ? 'Edit Project' : 'Add New Project'}
        </h3>
        <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-700">
          <p className="text-red-600 text-sm dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Information */}
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Project Name*</label>
          <input
            type="text"
            name="projectName"
            value={formProject.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            className={`w-full px-4 py-2 border rounded-md ${
              localFormErrors?.projectName ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
            } focus:ring-2 focus:ring-brand-primary`}
          />
          {localFormErrors?.projectName && (
            <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.projectName}</p>
          )}
        </div>

        {/* Owner Information */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formProject.ownerName}
              onChange={handleChange}
              placeholder="Enter owner name"
              className={`w-full px-4 py-2 border rounded-md ${
                isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Owner Email*</label>
            <input
              type="email"
              name="ownerEmail"
              value={formProject.ownerEmail}
              onChange={handleChange}
              placeholder="Enter owner email"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.ownerEmail ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.ownerEmail && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.ownerEmail}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Owner Number*</label>
            <input
              type="tel"
              name="ownerNumber"
              value={formProject.ownerNumber}
              onChange={handleChange}
              placeholder="Enter owner phone number"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.ownerNumber ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.ownerNumber && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.ownerNumber}</p>
            )}
          </div>
        </div>

        {/* Financial Section */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Amount (PKR)*</label>
            <input
              type="number"
              name="amount"
              value={formProject.amount}
              onChange={handleChange}
              placeholder="Enter total amount"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.amount ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.amount && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.amount}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Tax (%)</label>
            <input
              type="number"
              name="tax"
              value={formProject.tax}
              onChange={handleChange}
              placeholder="Enter tax percentage"
              min="0"
              max="100"
              step="1"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.tax ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.tax && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.tax}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Paid Amount (PKR)*</label>
            <input
              type="number"
              name="paidAmount"
              value={formProject.paidAmount}
              onChange={handleChange}
              placeholder="Enter amount paid"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.paidAmount ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.paidAmount && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.paidAmount}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-accent text-white' : 'bg-gray-50'}`}>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount After Tax</div>
            <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PKR {formProject.amountAfterTax || '0'}</div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-accent text-white' : 'bg-gray-50'}`}>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remaining Amount</div>
            <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PKR {formProject.remainingAmount || '0'}</div>
          </div>
        </div>

        {/* Employee Selection with React Select */}
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Select Employees*</label>
          <Select
            isMulti
            name="collaborators"
            options={employees.map(emp => ({
              value: emp.id,
              label: emp.name,
              name: emp.name
            }))}
            value={employees
              .filter(emp => formProject.selectedEmployeeIds.includes(emp.id))
              .map(emp => ({
                value: emp.id,
                label: emp.name,
                name: emp.name
              }))}
            onChange={(selectedOptions) => {
              const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
              const selectedNames = selectedOptions ? selectedOptions.map(option => option.name).join(', ') : '';
              
              setFormProject(prev => ({
                ...prev,
                selectedEmployeeIds: selectedIds,
                collaborators: selectedNames
              }));

              if (localFormErrors.collaborators) {
                setLocalFormErrors(prev => {
                  const updated = {...prev};
                  delete updated.collaborators;
                  return updated;
                });
              }
            }}
            className={localFormErrors?.collaborators ? 'react-select-error' : ''}
            classNamePrefix="react-select"
            placeholder="Select employees..."
            noOptionsMessage={() => "No employees found"}
            isClearable={true}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: localFormErrors?.collaborators ? '#ef4444' : state.isFocused ? '#3b82f6' : '#e5e7eb',
                boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                '&:hover': {
                  borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb'
                },
                backgroundColor: isDarkMode ? '#374151' : 'white',
                color: isDarkMode ? 'white' : '#1f2937'
              }),
              menu: (base) => ({
                ...base,
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: isDarkMode ? '#1F2937' : 'white',
                '::-webkit-scrollbar': {
                  width: '8px'
                },
                '::-webkit-scrollbar-track': {
                  background: isDarkMode ? '#374151' : '#f1f1f1',
                  borderRadius: '4px'
                },
                '::-webkit-scrollbar-thumb': {
                  background: isDarkMode ? '#4B5563' : '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: isDarkMode ? '#6B7280' : '#555'
                  }
                }
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: '200px',
                padding: '4px'
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected 
                  ? '#3b82f6' 
                  : (state.isFocused 
                    ? (isDarkMode ? '#4B5563' : '#dbeafe') 
                    : (isDarkMode ? '#1F2937' : 'transparent')),
                color: state.isSelected 
                  ? 'white' 
                  : (isDarkMode ? '#E5E7EB' : '#1f2937'),
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:active': {
                  backgroundColor: state.isSelected ? '#3b82f6' : (isDarkMode ? '#6B7280' : '#bfdbfe')
                }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: isDarkMode ? '#374151' : '#dbeafe',
                borderRadius: '4px',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: isDarkMode ? '#E5E7EB' : '#1e40af',
                padding: '2px 6px'
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: isDarkMode ? '#E5E7EB' : '#1e40af',
                ':hover': {
                  backgroundColor: isDarkMode ? '#4B5563' : '#bfdbfe',
                  color: isDarkMode ? '#F3F4F6' : '#1e40af',
                }
              }),
              input: (base) => ({
                ...base,
                color: isDarkMode ? 'white' : 'inherit'
              }),
              placeholder: (base) => ({
                ...base,
                color: isDarkMode ? '#9CA3AF' : '#6B7280'
              }),
              singleValue: (base) => ({
                ...base,
                color: isDarkMode ? 'white' : 'inherit'
              })
            }}
          />
          {localFormErrors?.collaborators && (
            <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.collaborators}</p>
          )}
        </div>

        {/* Bonus Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Bonus (PKR)</label>
            <input
              type="number"
              name="bonus"
              value={formProject.bonus}
              onChange={handleChange}
              placeholder="Enter bonus amount"
              className={`w-full px-4 py-2 border rounded-md ${
                isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Shared Bonus (Auto)</label>
            <input
              type="text"
              value={`PKR ${formProject.sharedBonus || '0'}`}
              readOnly
              className={`w-full px-4 py-2 border rounded-md ${
                isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              }`}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Start Date*</label>
            <input
              type="date"
              name="startDate"
              value={formProject.startDate}
              onChange={handleChange}
              placeholder="Select start date"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.startDate ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.startDate && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.startDate}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formProject.endDate}
              onChange={handleChange}
              placeholder="Select end date"
              className={`w-full px-4 py-2 border rounded-md ${
                localFormErrors?.endDate ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            />
            {localFormErrors?.endDate && (
              <p className="text-red-500 text-sm mt-1 dark:text-red-400">{localFormErrors.endDate}</p>
            )}
          </div>
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Payment Status</label>
            <select
              name="paidStatus"
              value={formProject.paidStatus}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            >
              <option value="not paid">Not Paid</option>
              <option value="partial">Partial Paid</option>
              <option value="paid">Fully Paid</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Project Status</label>
            <select
              name="projectStatus"
              value={formProject.projectStatus}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            >
              <option value="ongoing">Ongoing</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Platform</label>
            <select
              name="platform"
              value={formProject.platform}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
              } focus:ring-2 focus:ring-brand-primary`}
            >
              <option value="upwork">Upwork</option>
              <option value="fiver">Fiverr</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Notes</label>
          <textarea
            name="note"
            value={formProject.note}
            onChange={handleChange}
            placeholder="Enter additional notes or details about the project"
            className={`w-full px-4 py-2 border rounded-md ${
              isDarkMode ? 'border-gray-600 bg-dark-accent text-white' : 'border-gray-300 bg-white'
            } focus:ring-2 focus:ring-brand-primary`}
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 border rounded-md text-sm font-medium 
              ${isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-dark-accent' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark disabled:opacity-70 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (project ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;