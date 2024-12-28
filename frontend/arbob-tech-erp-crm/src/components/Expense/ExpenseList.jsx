// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ExpenseForm from './ExpenseForm';

// const ITEMS_PER_PAGE = 7;

// function ExpenseList() {
//   const [expenses, setExpenses] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch expenses from API
//     // For now, we'll use dummy data
//     setExpenses([
//       { id: 1, name: 'John Doe', expenseCategory: 'Salary', currency: 'USD', total: 50.00, description: 'Monthly salary', reference: 'waseem' },
//       { id: 2, name: 'Jane Smith', expenseCategory: 'Rent', currency: 'USD', total: 500.00, description: 'House rent', reference: 'israr' },
//       { id: 3, name: 'Alice Johnson', expenseCategory: 'Groceries', currency: 'USD', total: 100.00, description: 'Weekly groceries', reference: 'atsa' },
//       { id: 4, name: 'Bob Brown', expenseCategory: 'Utilities', currency: 'USD', total: 75.00, description: 'Electricity bill', ref: '...' },
//       { id: 5, name: 'Charlie Black', expenseCategory: 'Entertainment', currency: 'USD', total: 60.00, description: 'Movie tickets', ref: '...' },
//       { id: 6, name: 'Dave White', expenseCategory: 'Travel', currency: 'USD', total: 150.00, description: 'Flight tickets', ref: '...' },
//       { id: 7, name: 'Eve Blue', expenseCategory: 'Healthcare', currency: 'USD', total: 120.00, description: 'Doctor appointment', ref: '...' },
//       { id: 8, name: 'Frank Green', expenseCategory: 'Insurance', currency: 'USD', total: 200.00, description: 'Health insurance', ref: '...' },
//       { id: 9, name: 'Grace Yellow', expenseCategory: 'Dining', currency: 'USD', total: 80.00, description: 'Dinner at restaurant', ref: '...' }
//     ]);
//   }, []);

//   const handleAddExpense = (newExpense) => {
//     if (editingExpense) {
//       setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { ...editingExpense, ...newExpense } : exp));
//     } else {
//       setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
//     }
//     setIsModalOpen(false);
//     setEditingExpense(null);
//   };

//   const handleDeleteExpense = (id) => {
//     setExpenses(expenses.filter(exp => exp.id !== id));
//   };

//   const handleEditExpense = (expense) => {
//     setEditingExpense(expense);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter and paginate expenses
//   const filteredExpenses = expenses.filter(expense =>
//     expense.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 flex">
//       <div className={`flex-1 transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
//         <div className="flex justify-between items-center mb-4">
//           <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700">
//             ← Expense List
//           </button>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchTerm}
//               onChange={handleSearch}
//               className="border p-2 rounded"
//             />
//             <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded">
//               Add New Expense
//             </button>
//           </div>
//         </div>

//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="text-left p-2">Name</th>
//               <th className="text-left p-2">Expense Category</th>
//               <th className="text-left p-2">Currency</th>
//               <th className="text-left p-2">Total</th>
//               <th className="text-left p-2">Description</th>
//               <th className="text-left p-2">Ref</th>
//               <th className="text-left p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedExpenses.map((expense) => (
//               <tr key={expense.id}>
//                 <td className="p-2">{expense.name}</td>
//                 <td className="p-2">
//                   <span className="bg-yellow-200 px-2 py-1 rounded">{expense.expenseCategory}</span>
//                 </td>
//                 <td className="p-2">{expense.currency}</td>
//                 <td className="p-2">${Number(expense.total).toFixed(2)}</td>
//                 <td className="p-2">{expense.description}</td>
//                 <td className="p-2">{expense.reference}</td>
//                 <td className="p-2">
//                   <button onClick={() => handleEditExpense(expense)} className="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
//                   <button onClick={() => handleDeleteExpense(expense.id)} className="bg-red-500 text-white p-1 rounded ">Delete</button>
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
//         <ExpenseForm
//           onSubmit={handleAddExpense}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingExpense(null);
//           }}
//           expense={editingExpense}
//         />
//       )}
//     </div>
//   );
// }

// export default ExpenseList;

// tailwind css 

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ExpenseForm from './ExpenseForm';

// const ITEMS_PER_PAGE = 5;

// function ExpenseList() {
//   const [expenses, setExpenses] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch expenses from API (using dummy data for now)
//     setExpenses([
//       { id: 1, name: 'John Doe', expenseCategory: 'Salary', currency: 'USD', total: 50.00, description: 'Monthly salary', reference: 'waseem' },
//       { id: 2, name: 'Jane Smith', expenseCategory: 'Rent', currency: 'USD', total: 500.00, description: 'House rent', reference: 'israr' },
//       { id: 3, name: 'Alice Johnson', expenseCategory: 'Groceries', currency: 'USD', total: 100.00, description: 'Weekly groceries', reference: 'atsa' },
//       { id: 4, name: 'Bob Brown', expenseCategory: 'Utilities', currency: 'USD', total: 75.00, description: 'Electricity bill', reference: 'util1' },
//       { id: 5, name: 'Charlie Black', expenseCategory: 'Entertainment', currency: 'USD', total: 60.00, description: 'Movie tickets', reference: 'ent1' },
//       { id: 6, name: 'Dave White', expenseCategory: 'Travel', currency: 'USD', total: 150.00, description: 'Flight tickets', reference: 'trv1' },
//       { id: 7, name: 'Eve Blue', expenseCategory: 'Healthcare', currency: 'USD', total: 120.00, description: 'Doctor appointment', reference: 'hc1' },
//       { id: 8, name: 'Frank Green', expenseCategory: 'Insurance', currency: 'USD', total: 200.00, description: 'Health insurance', reference: 'ins1' },
//       { id: 9, name: 'Grace Yellow', expenseCategory: 'Dining', currency: 'USD', total: 80.00, description: 'Dinner at restaurant', reference: 'din1' }
//     ]);
//   }, []);

//   const handleAddExpense = (newExpense) => {
//     if (editingExpense) {
//       setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { ...editingExpense, ...newExpense } : exp));
//     } else {
//       setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
//     }
//     setIsModalOpen(false);
//     setEditingExpense(null);
//   };

//   const handleDeleteExpense = (id) => {
//     setExpenses(expenses.filter(exp => exp.id !== id));
//   };

//   const handleEditExpense = (expense) => {
//     setEditingExpense(expense);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter and paginate expenses
//   const filteredExpenses = expenses.filter(expense =>
//     expense.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
//       <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-96' : ''}`}>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
//           <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
//             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             <span className="font-medium">Expense List</span>
//           </button>
//           <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search expenses"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//               <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <button 
//               onClick={() => setIsModalOpen(true)} 
//               className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add New Expense
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ref</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedExpenses.map((expense) => (
//                 <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                       {expense.expenseCategory}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.currency}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(expense.total).toFixed(2)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{expense.description}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{expense.reference}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button 
//                       onClick={() => handleEditExpense(expense)} 
//                       className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteExpense(expense.id)} 
//                       className="text-red-600 hover:text-red-900 transition-colors"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex flex-wrap justify-center mt-6 space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
//           <button
//             onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//             className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`w-full sm:w-auto px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
//                 currentPage === index + 1
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//             className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <ExpenseForm
//           onSubmit={handleAddExpense}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingExpense(null);
//           }}
//           expense={editingExpense}
//         />
//       )}
//     </div>
//   );
// }

// export default ExpenseList;


// // ExpenseList.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ExpenseForm from './ExpenseForm';

// const ITEMS_PER_PAGE = 5;

// function ExpenseList() {
//   const [expenses, setExpenses] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formErrors, setFormErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get('http://localhost:3000/expense');
//       setExpenses(response.data.expenses);
//     } catch (err) {
//       setError('Failed to fetch expenses. Please try again later.');
//       console.error('Error fetching expenses:', err);
//       setExpenses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddExpense = async (newExpense) => {
//     try {
//       setError(null);
//       setFormErrors({});
//       let response;
//       if (editingExpense) {
//         response = await axios.put(`http://localhost:3000/expense/${editingExpense.id}`, {
//           ...editingExpense,
//           ...newExpense,
//         });
//         setExpenses(expenses.map((exp) => (exp.id === editingExpense.id ? response.data : exp)));
//         setSuccessMessage('Expense updated successfully!');
//       } else {
//         response = await axios.post('http://localhost:3000/expense', newExpense);
//         setExpenses([...expenses, response.data]);
//         setSuccessMessage('Expense added successfully!');
//       }
//       setIsModalOpen(false);
//       setEditingExpense(null);
      
//       // Refetch the expenses to ensure the UI is up-to-date
//       await fetchExpenses();

//       // Set a timeout to hide the success message after 3 seconds
//       const timeoutId = setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//       return () => clearTimeout(timeoutId);

//     } catch (err) {
//       // Check for field-specific errors from the backend response
//       if (err.response?.data?.errors) {
//         // Extract field errors into an object
//         const errors = err.response.data.errors.reduce((acc, error) => {
//           acc[error.path] = error.msg;
//           return acc;
//         }, {});
//         setFormErrors(errors); // Set formErrors for ExpenseForm to use
//       } else {
//         setError(err.response?.data?.message || 'Failed to save expense. Please try again.');
//       }
//     }
//   };

//   const handleDeleteExpense = async (id) => {
//     try {
//       setError(null);
//       await axios.delete(`http://localhost:3000/expense/${id}`);
//       setExpenses(expenses.filter((exp) => exp.id !== id));
//       setSuccessMessage('Expense deleted successfully!');
//     } catch (err) {
//       setError('Failed to delete expense. Please try again.');
//       console.error('Error deleting expense:', err);
//     }
//   };

//   const handleEditExpense = (expense) => {
//     setError(null);
//     setFormErrors({});
//     setEditingExpense(expense);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter and paginate expenses
//   const filteredExpenses = Array.isArray(expenses)
//     ? expenses.filter((expense) =>
//         expense?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];
//   const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
//       <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-96' : ''}`}>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
//           <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
//             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             <span className="font-medium">Expense List</span>
//           </button>
//           <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search expenses"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//               <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <button 
//               onClick={() => {
//                 setEditingExpense(null);
//                 setIsModalOpen(true);
//               }}
//               className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add New Expense
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600">{error}</p>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <p className="text-green-600">{successMessage}</p>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ref</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {displayedExpenses.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                       {searchTerm ? 'No expenses found matching your search' : 'No expenses available'}
//                     </td>
//                   </tr>
//                 ) : (
//                   displayedExpenses.map((expense) => (
//                     <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           {expense.expenseCategory}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.currency}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(expense.total).toFixed(2)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{expense.description}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{expense.reference}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button 
//                           onClick={() => handleEditExpense(expense)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteExpense(expense.id)}
//                           className="text-red-600 hover:text-red-900 transition-colors"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="flex flex-wrap justify-center mt-6 space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
//           <button
//             onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//             className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`w-full sm:w-auto px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
//                 currentPage === index + 1
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//             className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <ExpenseForm
//           onSubmit={handleAddExpense}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingExpense(null);
//             setFormErrors({});
//             setError(null);
//             setSuccessMessage('');
//           }}
//           expense={editingExpense}
//           error={error}
//           formErrors={formErrors}
//         />
//       )}
//     </div>
//   );
// }

// export default ExpenseList;

// today

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';

const CURRENCY_SYMBOLS = {
  USD: '$',
  PKR: '₨',
  EUR: '€',
  GBP: '£'
};

const ITEMS_PER_PAGE = 5;

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

  useEffect(() => {
    fetchExpenses();
    fetchCategories(); 
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/expense');
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

  // Add this function after your other fetch functions
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/expense-categories');
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
        response = await axios.put(`http://localhost:3000/expense/${editingExpense.id}`, {
          ...editingExpense,
          ...newExpense,
        });
        const updatedExpense = response.data.expense || response.data;
        setExpenses(expenses.map((exp) => 
          exp.id === editingExpense.id ? updatedExpense : exp
        ));
        setSuccessMessage('Expense updated successfully!');
      } else {
        response = await axios.post('http://localhost:3000/expense', newExpense);
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
      console.error('Error in handleAddExpense:', err.response || err); // Add this to debug
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
      await axios.delete(`http://localhost:3000/expense/${id}`);
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
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div
        className={`transition-all duration-300 ${
          isModalOpen ? "lg:mr-96" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
            <button
              onClick={() => {
                setEditingExpense(null);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
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
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Currency
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Ref
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedExpenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
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
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {String(expense.name || "")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {String(expense.expenseCategory.name || "")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {String(expense.currency || "")}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${Number(expense.total || 0).toFixed(2)}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {CURRENCY_SYMBOLS[expense.currency] || "$"}
                        {Number(expense.total || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {String(expense.description || "")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {String(expense.reference || "")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
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
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
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