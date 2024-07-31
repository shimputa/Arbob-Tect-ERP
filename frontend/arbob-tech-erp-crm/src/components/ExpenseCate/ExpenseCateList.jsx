import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseCategoryForm from './ExpenseCateForm';

function ExpenseCategoryList() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from API
    // For now, we'll use dummy data
    setCategories([
      { id: 1, name: 'Salary', description: 'Monthly salary' },
      { id: 2, name: 'Rent', description: 'House rent' }
    ]);
  }, []);

  const handleAddCategory = (newCategory) => {
    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...editingCategory, ...newCategory } : cat));
    } else {
      setCategories([...categories, { ...newCategory, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 flex">
      <div className={`flex-1 transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700">
            ← Expense Categories
          </button>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="border p-2 rounded"
            />
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded">
              Add New Expense Category
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="p-2">{category.name}</td>
                <td className="p-2">{category.description}</td>
                <td className="p-2">
                  <button onClick={() => handleEditCategory(category)} className="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDeleteCategory(category.id)} className="bg-red-500 text-white p-1 rounded ">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button className="mx-1 px-3 py-1 bg-blue-500 text-white rounded">1</button>
          {/* Add more pagination buttons as needed */}
        </div>
      </div>

      {isModalOpen && (
        <ExpenseCategoryForm
          onSubmit={handleAddCategory}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
        />
      )}
    </div>
  );
}

export default ExpenseCategoryList;
