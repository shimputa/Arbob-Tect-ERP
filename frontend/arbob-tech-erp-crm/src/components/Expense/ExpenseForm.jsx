// import React, { useState, useEffect } from 'react';

// function ExpenseForm({ onSubmit, onClose, expense }) {
//   const [formExpense, setFormExpense] = useState({
//     name: '',
//     expenseCategory: '',
//     currency: 'USD',
//     total: '',
//     description: ''
//   });

//   useEffect(() => {
//     if (expense) {
//       setFormExpense(expense);
//     }
//   }, [expense]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormExpense(prev => ({
//       ...prev,
//       [name]: name === 'total' ? parseFloat(value) : value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formExpense);
//   };

//   return (
//     <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-4 overflow-y-auto">
//       <h3 className="text-lg font-bold mb-4">{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="block mb-1">Name</label>
//           <input type="text" name="name" value={formExpense.name} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Expense Category</label>
//           <input type="text" name="expenseCategory" value={formExpense.expenseCategory} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Currency</label>
//           <select name="currency" value={formExpense.currency} onChange={handleChange} className="w-full border p-2">
//             <option value="USD">USD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Total</label>
//           <input type="number" name="total" value={formExpense.total} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Description</label>
//           <textarea name="description" value={formExpense.description} onChange={handleChange} className="w-full border p-2"></textarea>
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Ref</label>
//           <input type="text" name="reference" value={formExpense.reference} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="flex justify-end">
//           <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
//           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ExpenseForm;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ExpenseForm({ onSubmit, onClose, expense }) {
  const [formExpense, setFormExpense] = useState({
    name: '',
    expenseCategory: '',
    currency: 'USD',
    total: '',
    description: '',
    reference: ''
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
        </div>
        <div>
          <label htmlFor="expenseCategory" className="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
          <input 
            type="text" 
            name="expenseCategory" 
            id="expenseCategory"
            value={formExpense.expenseCategory} 
            onChange={handleChange} 
            placeholder="Enter expense category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select 
            name="currency" 
            id="currency"
            value={formExpense.currency} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
          >
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description" 
            id="description"
            value={formExpense.description} 
            onChange={handleChange} 
            placeholder="Enter expense description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;

