import React, { useState, useEffect } from 'react';

function ExpenseCategoryForm({ onSubmit, onClose, category }) {
  const [formCategory, setFormCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (category) {
      setFormCategory(category);
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formCategory);
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">{category ? 'Edit Expense Category' : 'Add New Category'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formCategory.name} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <textarea name="description" value={formCategory.description} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseCategoryForm;
