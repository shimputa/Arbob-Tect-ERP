import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import { usePermission } from '../../contexts/PermissionContext';
import { PermissionGate } from '../common/PermissionGate';
import { useTheme } from '../../contexts/ThemeContext';

const CURRENCY_SYMBOLS = {
  USD: '$',
  PKR: '₨',
  EUR: '€',
  GBP: '£'
};

const ITEMS_PER_PAGE = process.env.REACT_APP_DEFAULT_PAGE_SIZE || 5;

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchExpenses();
    fetchCategories(); 
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EXPENSE_API}`
      );
      console.log('API Response:', response.data); 

      const expensesData = response.data.expenses || response.data || [];
      setExpenses(expensesData);
    } catch (err) {
      console.error('Error fetching expenses:', err.response || err);
      setError('Failed to fetch expenses. Please try again later.');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EXPENSE_CATEGORIES_API}`
      );
      setCategories(response.data.categories || response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      setError(null);
      setFormErrors({});

      // Validate form data
      const errors = {};
      if (!newExpense.name.trim()) errors.name = 'Name is required';
      if (!newExpense.expenseCategoryName) errors.expenseCategoryName = 'Category Name is required';
      if (!newExpense.total) errors.total = 'Total amount is required';
      if (!newExpense.reference?.trim()) errors.reference = 'Reference is required';

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      let response;
      
      if (editingExpense) {
        response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EXPENSE_API}/${editingExpense.id}`,
          {
            ...editingExpense,
            ...newExpense,
          }
        );
        const updatedExpense = response.data.expense || response.data;
        setExpenses(expenses.map((exp) => 
          exp.id === editingExpense.id ? updatedExpense : exp
        ));
        setSuccessMessage('Expense updated successfully!');
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EXPENSE_API}`,
          newExpense
        );
        const createdExpense = response.data.expense || response.data;
        setExpenses(prevExpenses => [...prevExpenses, createdExpense]);
        setSuccessMessage('Expense added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingExpense(null);
      setSuccessMessage(editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
      
      await fetchExpenses();
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error in handleAddExpense:', err.response || err);
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {});
        setFormErrors(errors);
      } else {
        setError(err.response?.data?.message || 'Failed to save expense. Please try again.');
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setError(null);
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EXPENSE_API}/${id}`
      );
      setExpenses(expenses.filter((exp) => exp.id !== id));
      setSuccessMessage('Expense deleted successfully!');
      // Refetch to ensure data is in sync
      await fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error('Error deleting expense:', err);
    }
  };

  const handleEditExpense = (expense) => {
    setError(null);
    setFormErrors({});
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExpenses = Array.isArray(expenses)
    ? expenses.filter((expense) =>
        String(expense?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      <div
        className={`transition-all duration-300 ${
          isModalOpen ? "lg:mr-96" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Expense List</span>
          </button>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search expenses"
                value={searchTerm}
                onChange={handleSearch}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
                  ${isDarkMode 
                    ? 'bg-dark-accent border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'}`}
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
            <PermissionGate permission="expense:create">
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Expense
              </button>
            </PermissionGate>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700">
            <p className="text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow overflow-x-auto transition-colors duration-200`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'}`}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                  >
                    Currency
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden md:table-cell`}
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden lg:table-cell`}
                  >
                    Ref
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                {displayedExpenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {searchTerm
                        ? "No expenses found matching your search"
                        : "No expenses available"}
                    </td>
                  </tr>
                ) : (
                  displayedExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className={`${isDarkMode ? 'hover:bg-dark-accent/50' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {String(expense.name || "")}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isDarkMode ? 'bg-yellow-800 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {String(expense.expenseCategory.name || "")}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {String(expense.currency || "")}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {CURRENCY_SYMBOLS[expense.currency] || "$"}
                        {Number(expense.total || 0)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} hidden md:table-cell`}>
                        {String(expense.description || "")}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} hidden lg:table-cell`}>
                        {String(expense.reference || "")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <PermissionGate permission="expense:edit">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className={`${isDarkMode ? 'text-brand-light hover:text-brand-primary' : 'text-indigo-600 hover:text-indigo-900'} mr-4 transition-colors`}
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </PermissionGate>
                        <PermissionGate permission="expense:delete">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
                        </PermissionGate>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap justify-center mt-6 space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            className={`w-full sm:w-auto px-4 py-2 border rounded-md text-sm font-medium 
              ${isDarkMode 
                ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} transition-colors`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-full sm:w-auto px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                currentPage === index + 1
                  ? "bg-brand-primary text-white border-brand-primary"
                  : isDarkMode 
                    ? 'bg-dark-secondary text-gray-300 border-gray-600 hover:bg-dark-accent' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            className={`w-full sm:w-auto px-4 py-2 border rounded-md text-sm font-medium 
              ${isDarkMode 
                ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} transition-colors`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && hasPermission(editingExpense ? 'expense:edit' : 'expense:create') && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
            setFormErrors({});
            setError(null);
            setSuccessMessage("");
          }}
          expense={editingExpense}
          error={error}
          formErrors={formErrors}
          categories={categories}
        />
      )}
    </div>
  );
}

export default ExpenseList;