import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ExpenseForm({ onSubmit, onClose, expense, error, formErrors,categories }) {
  const [formExpense, setFormExpense] = useState({
    name: '',
    expenseCategoryName: '',
    currency: 'USD',
    total: '',
    description: '',
    reference: ''
  });

  useEffect(() => {
    if (expense) {
      setFormExpense({
        name: expense.name || '',
        expenseCategoryName: expense.expenseCategoryName|| '',
        currency: expense.currency || 'USD',
        total: expense.total || '',
        description: expense.description || '',
        reference: expense.reference || ''
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormExpense(prev => ({
      ...prev,
      [name]: name === 'total' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data before submission
      if (!formExpense.name.trim()) return;
      if (!formExpense.expenseCategoryName) return;
      if (!formExpense.total) return;
      if (!formExpense.reference.trim()) return;

      await onSubmit(formExpense);
    } catch (err) {
      // Error handling is managed by parent component
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            name="name" 
            id="name"
            value={formExpense.name} 
            onChange={handleChange} 
            placeholder="Enter expense name"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       ${formErrors?.name ? 'border-red-500' : 'border-gray-300'}`}
            required 
          />
          {formErrors?.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        {/* <div>
          <label htmlFor="expenseCategory" className="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
          <input 
            type="text" 
            name="expenseCategory" 
            id="expenseCategory"
            value={formExpense.expenseCategory} 
            onChange={handleChange} 
            placeholder="Enter expense category"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       ${formErrors?.expenseCategory ? 'border-red-500' : 'border-gray-300'}`}
            required 
          />
          {formErrors?.expenseCategory && (
            <p className="text-red-500 text-sm mt-1">{formErrors.expenseCategory}</p>
          )}
        </div> */}
<div>
  <label htmlFor="expenseCategoryName" className="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
  <select 
    name="expenseCategoryName" 
    id="expenseCategoryName"
    value={categories.find(cat => cat.name === formExpense.expenseCategoryName)?.id || ''} 
    onChange={(e) => {
      const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
      handleChange({
        target: {
          name: 'expenseCategoryName',
          value: selectedCategory ? selectedCategory.name : ''
        }
      });
    }}
    className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${formErrors?.expenseCategoryName ? 'border-red-500' : 'border-gray-300'}`}
    required 
  >
    <option value="">Select a category</option>
    {categories.map(category => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
  {formErrors?.expenseCategoryName && (
    <p className="text-red-500 text-sm mt-1">{formErrors.expenseCategoryName}</p>
  )}
</div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select 
            name="currency" 
            id="currency"
            value={formExpense.currency} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="PKR">PKR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">Total</label>
          <input 
            type="number" 
            name="total" 
            id="total"
            value={formExpense.total} 
            onChange={handleChange} 
            placeholder="Enter total amount"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       ${formErrors?.total ? 'border-red-500' : 'border-gray-300'}`}
            required 
          />
          {formErrors?.total && (
            <p className="text-red-500 text-sm mt-1">{formErrors.total}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description" 
            id="description"
            value={formExpense.description} 
            onChange={handleChange} 
            placeholder="Enter expense description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Ref</label>
          <input 
            type="text" 
            name="reference" 
            id="reference"
            value={formExpense.reference} 
            onChange={handleChange} 
            placeholder="Enter reference number"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       ${formErrors?.reference ? 'border-red-500' : 'border-gray-300'}`}
            required 
          />
          {formErrors?.reference && (
            <p className="text-red-500 text-sm mt-1">{formErrors.reference}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {expense ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;

