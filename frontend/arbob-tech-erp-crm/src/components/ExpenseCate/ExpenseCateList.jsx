import React, { useState, useEffect } from 'react';
import ExpenseCategoryForm from './ExpenseCateForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../contexts/PermissionContext';
import { PermissionGate } from '../common/PermissionGate';

const ITEMS_PER_PAGE = 5;
const API_URL = 'http://localhost:3000/expense-categories';

// Alert component for success and error messages
const Alert = ({ message, type = 'error', onClose }) => (
  <div className={`mb-4 bg-${type === 'success' ? 'green' : 'red'}-50 border border-${type === 'success' ? 'green' : 'red'}-200 text-${type === 'success' ? 'green' : 'red'}-600 px-4 py-3 rounded relative`} role="alert">
    <span className="block sm:inline">{message}</span>
    <button onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3">
      <span className="sr-only">Close</span>
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Header component with back button and search
const Header = ({ onSearch, searchTerm, onAddNew }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
    <button onClick={() => window.history.back()} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">Expense Categories</span>
    </button>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search categories"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <PermissionGate permission="expenseCategory:create">
        <button 
          onClick={onAddNew}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Category
        </button>
      </PermissionGate>
    </div>
  </div>
);

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex flex-wrap justify-center mt-6 space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
    <button
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
      disabled={currentPage === 1}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => onPageChange(index + 1)}
        className={`w-full sm:w-auto px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
          currentPage === index + 1
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
);

// Category table component
const CategoryTable = ({ categories, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {categories.length === 0 ? (
          <tr>
            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
              No categories found
            </td>
          </tr>
        ) : (
          categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <PermissionGate permission="expenseCategory:edit">
                  <button 
                    onClick={() => onEdit(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </PermissionGate>
                <PermissionGate permission="expenseCategory:delete">
                  <button 
                    onClick={() => onDelete(category.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
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
);

function ExpenseCategoryList() {
  const [state, setState] = useState({
    categories: [],
    isModalOpen: false,
    editingCategory: null,
    searchTerm: '',
    currentPage: 1,
    loading: false,
    error: null,
    formErrors: {},
    successMessage: ''
  });
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get(API_URL);
      setState(prev => ({
        ...prev,
        categories: response.data.categories || [],
        loading: false
      }));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch categories. Please try again later.',
        categories: [],
        loading: false
      }));
    }
  };

  const handleSaveCategory = async (categoryData) => {
    setState(prev => ({ ...prev, formErrors: {} }));
    try {
      if (state.editingCategory) {
        const response = await axios.put(`${API_URL}/${state.editingCategory.id}`, categoryData);
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === state.editingCategory.id ? response.data.category : cat
          ),
          successMessage: 'Category updated successfully'
        }));
      } else {
        const response = await axios.post(API_URL, categoryData);
        setState(prev => ({
          ...prev,
          categories: [...prev.categories, response.data.category],
          successMessage: 'Category added successfully'
        }));
      }
      closeModal();
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const validationErrors = {};
        
        // Handle array of validation errors
        if (Array.isArray(errors)) {
          errors.forEach(error => {
            if (error.path && error.msg) {
              validationErrors[error.path] = error.msg;
            }
          });
        }
        // Handle object of validation errors
        else {
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              validationErrors[key] = errors[key][0].msg;
            } else if (typeof errors[key] === 'string') {
              validationErrors[key] = errors[key];
            } else if (errors[key]?.msg) {
              validationErrors[key] = errors[key].msg;
            }
          });
        }
        
        setState(prev => ({ ...prev, formErrors: validationErrors }));
      } else {
        setState(prev => ({ ...prev, error: 'Failed to save category. Please try again.' }));
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/deactivate`);
      setState(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.id !== id),
        successMessage: 'Category deleted successfully'
      }));
    } catch (err) {
      console.error('Error deleting category:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to delete category. Please try again.'
      }));
    }
  };

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      editingCategory: null,
      formErrors: {}
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (state.successMessage) {
      const timer = setTimeout(() => 
        setState(prev => ({ ...prev, successMessage: '' })), 
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [state.successMessage]);

  const filteredCategories = state.categories.filter(category =>
    category.name.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const displayedCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      {state.error && (
        <Alert 
          message={state.error} 
          type="error" 
          onClose={() => setState(prev => ({ ...prev, error: null }))} 
        />
      )}

      {state.successMessage && (
        <Alert 
          message={state.successMessage} 
          type="success" 
          onClose={() => setState(prev => ({ ...prev, successMessage: '' }))} 
        />
      )}

      <div className={`transition-all duration-300 ${state.isModalOpen ? 'lg:mr-96' : ''}`}>
        <Header 
          searchTerm={state.searchTerm}
          onSearch={(value) => setState(prev => ({ ...prev, searchTerm: value, currentPage: 1 }))}
          onAddNew={() => setState(prev => ({ ...prev, isModalOpen: true, editingCategory: null }))}
        />

        {state.loading ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <CategoryTable 
              categories={displayedCategories}
              onEdit={(category) => setState(prev => ({ 
                ...prev, 
                editingCategory: category, 
                isModalOpen: true,
                formErrors: {}
              }))}
              onDelete={handleDeleteCategory}
            />

            <Pagination 
              currentPage={state.currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setState(prev => ({ ...prev, currentPage: page }))}
            />
          </>
        )}
      </div>

      {state.isModalOpen && hasPermission(state.editingCategory ? 'expenseCategory:edit' : 'expenseCategory:create') && (
        <ExpenseCategoryForm
          onSubmit={handleSaveCategory}
          onClose={closeModal}
          category={state.editingCategory}
          formErrors={state.formErrors}
        />
      )}
    </div>
  );
}

export default ExpenseCategoryList;
