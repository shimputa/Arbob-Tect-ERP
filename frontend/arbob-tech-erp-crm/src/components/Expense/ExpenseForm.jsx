import React, { useState, useEffect } from 'react';

function ExpenseForm({ onSubmit, onClose, expense }) {
  const [formExpense, setFormExpense] = useState({
    name: '',
    expenseCategory: '',
    currency: 'USD',
    total: '',
    description: ''
  });

  useEffect(() => {
    if (expense) {
      setFormExpense(expense);
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormExpense(prev => ({
      ...prev,
      [name]: name === 'total' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formExpense);
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formExpense.name} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Expense Category</label>
          <input type="text" name="expenseCategory" value={formExpense.expenseCategory} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Currency</label>
          <select name="currency" value={formExpense.currency} onChange={handleChange} className="w-full border p-2">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Total</label>
          <input type="number" name="total" value={formExpense.total} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <textarea name="description" value={formExpense.description} onChange={handleChange} className="w-full border p-2"></textarea>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Ref</label>
          <input type="text" name="reference" value={formExpense.reference} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
