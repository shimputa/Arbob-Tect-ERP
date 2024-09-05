// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ExpenseCategoryForm from './ExpenseCateForm';

// const ITEMS_PER_PAGE = 7;

// function ExpenseCategoryList() {
//   const [categories, setCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch categories from API
//     // For now, we'll use dummy data
//     setCategories([
//       { id: 1, name: 'Salary', description: 'Monthly salary' },
//       { id: 2, name: 'Rent', description: 'House rent' },
//       { id: 3, name: 'Groceries', description: 'Weekly groceries' },
//       { id: 4, name: 'Utilities', description: 'Electricity bill' },
//       { id: 5, name: 'Entertainment', description: 'Movie tickets' },
//       { id: 6, name: 'Travel', description: 'Flight tickets' },
//       { id: 7, name: 'Healthcare', description: 'Doctor appointment' },
//       { id: 8, name: 'Insurance', description: 'Health insurance' },
//       { id: 9, name: 'Dining', description: 'Dinner at restaurant' }
//     ]);
//   }, []);

//   const handleAddCategory = (newCategory) => {
//     if (editingCategory) {
//       setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...editingCategory, ...newCategory } : cat));
//     } else {
//       setCategories([...categories, { ...newCategory, id: Date.now() }]);
//     }
//     setIsModalOpen(false);
//     setEditingCategory(null);
//   };

//   const handleDeleteCategory = (id) => {
//     setCategories(categories.filter(cat => cat.id !== id));
//   };

//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter and paginate categories
//   const filteredCategories = categories.filter(category =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 flex">
//       <div className={`flex-1 transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
//         <div className="flex justify-between items-center mb-4">
//           <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700">
//             ← Expense Categories
//           </button>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchTerm}
//               onChange={handleSearch}
//               className="border p-2 rounded"
//             />
//             <button onClick={() => {
//               setIsModalOpen(true);
//               setEditingCategory(null); // Clear editing state when adding a new category
//             }} className="bg-blue-500 text-white p-2 rounded">
//               Add New Category
//             </button>
//           </div>
//         </div>

//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="text-left p-2">Name</th>
//               <th className="text-left p-2">Description</th>
//               <th className="text-left p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedCategories.map((category) => (
//               <tr key={category.id}>
//                 <td className="p-2">{category.name}</td>
//                 <td className="p-2">{category.description}</td>
//                 <td className="p-2">
//                   <button onClick={() => handleEditCategory(category)} className="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
//                   <button onClick={() => handleDeleteCategory(category.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex justify-center mt-4 space-x-2">
//           <button
//             onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//             className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//             className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <ExpenseCategoryForm
//           onSubmit={handleAddCategory}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingCategory(null); // Reset editing state when closing the modal
//           }}
//           category={editingCategory}
//         />
//       )}
//     </div>
//   );
// }

// export default ExpenseCategoryList;

//with tailwind css
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseCategoryForm from './ExpenseCateForm';

const ITEMS_PER_PAGE = 5;

function ExpenseCategoryList() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from API (using dummy data for now)
    setCategories([
      { id: 1, name: 'Salary', description: 'Monthly salary' },
      { id: 2, name: 'Rent', description: 'House rent' },
      { id: 3, name: 'Groceries', description: 'Weekly groceries' },
      { id: 4, name: 'Utilities', description: 'Electricity bill' },
      { id: 5, name: 'Entertainment', description: 'Movie tickets' },
      { id: 6, name: 'Travel', description: 'Flight tickets' },
      { id: 7, name: 'Healthcare', description: 'Doctor appointment' },
      { id: 8, name: 'Insurance', description: 'Health insurance' },
      { id: 9, name: 'Dining', description: 'Dinner at restaurant' }
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

  // Filter and paginate categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-96' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => {
                setIsModalOpen(true);
                setEditingCategory(null);
              }} 
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Category
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditCategory(category)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)} 
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-center mt-6 space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
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
