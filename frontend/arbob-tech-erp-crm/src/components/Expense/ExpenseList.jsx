import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState(null); // New state for tracking the expense being edited
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch expenses from API
    // For now, we'll use dummy data
    setExpenses([
      { id: 1, name: 'wajahat', expenseCategory: 'salary', currency: 'USD', total: 50.00, description: 'jjj', ref: '...' }
    ]);
  }, []);

  const handleAddExpense = (newExpense) => {
    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { ...editingExpense, ...newExpense } : exp));
    } else {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingExpense(null); // Reset editing state
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 flex">
      <div className={`flex-1 transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700">
            ← Expense List
          </button>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="border p-2 rounded"
            />
            <button onClick={() => {/* Implement refresh logic */}} className="bg-gray-200 p-2 rounded">
              🔄 Refresh
            </button>
            <button onClick={() => {
              setIsModalOpen(true);
              setEditingExpense(null); // Clear editing state when adding a new expense
            }} className="bg-blue-500 text-white p-2 rounded">
              Add New Expense
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left p-1">Name</th>
              <th className="text-left p-1">Expense Category</th>
              <th className="text-left p-1">Currency</th>
              <th className="text-left p-1">Total</th>
              <th className="text-left p-1">Description</th>
              <th className="text-left p-1">Ref</th>
              <th className="text-left p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td className="p-1">{expense.name}</td>
                <td className="p-1">
                  <span className="bg-yellow-200 px-2 py-1 rounded">{expense.expenseCategory}</span>
                </td>
                <td className="p-1">{expense.currency}</td>
                <td className="p-1">${Number(expense.total).toFixed(2)}</td>
                <td className="p-1">{expense.description}</td>
                <td className="p-1">{expense.reference}</td>
                <td className="p-1">
                  <button onClick={() => handleEditExpense(expense)} className="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
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
        <ExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null); // Reset editing state when closing the modal
          }}
          expense={editingExpense}
        />
      )}
    </div>
  );
}

export default ExpenseList;

