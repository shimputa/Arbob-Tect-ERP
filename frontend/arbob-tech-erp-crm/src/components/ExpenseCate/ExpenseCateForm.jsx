// import React, { useState, useEffect } from 'react';

// function ExpenseCategoryForm({ onSubmit, onClose, category }) {
//   const [formCategory, setFormCategory] = useState({
//     name: '',
//     description: ''
//   });

//   useEffect(() => {
//     if (category) {
//       setFormCategory(category);
//     }
//   }, [category]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormCategory(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formCategory);
//   };

//   return (
//     <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-4 overflow-y-auto">
//       <h3 className="text-lg font-bold mb-4">{category ? 'Edit Expense Category' : 'Add New Category'}</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="block mb-1">Name</label>
//           <input type="text" name="name" value={formCategory.name} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Description</label>
//           <textarea name="description" value={formCategory.description} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="flex justify-end">
//           <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
//           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ExpenseCategoryForm;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Ensure you have installed lucide-react for the X icon

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
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-6 overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">{category ? 'Edit Expense Category' : 'Add New Category'}</h3>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input 
            type="text" 
            name="name" 
            value={formCategory.name} 
            onChange={handleChange} 
            placeholder="Enter category name" 
            className="w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea 
            name="description" 
            value={formCategory.description} 
            onChange={handleChange} 
            placeholder="Enter category description" 
            className="w-full border rounded-md shadow-sm p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required 
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseCategoryForm;

