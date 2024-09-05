
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import EmployeeForm from './EmployeeForm';

// const ITEMS_PER_PAGE = 7;

// function EmployeeList() {
//   const [employees, setEmployees] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1); // Add state for current page
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch employees from API
//     // For now, we'll use dummy data
//     setEmployees([
//       { id: 1, name: 'John Doe', contact: '123-456-7890', email: 'john@example.com', position: 'Manager' },
//       { id: 2, name: 'Jane Smith', contact: '987-654-3210', email: 'jane@example.com', position: 'Developer' },
//       { id: 3, name: 'Alice Johnson', contact: '123-123-1234', email: 'alice@example.com', position: 'Designer' },
//       { id: 4, name: 'Bob Brown', contact: '456-456-4567', email: 'bob@example.com', position: 'Developer' },
//       { id: 5, name: 'Charlie Black', contact: '789-789-7890', email: 'charlie@example.com', position: 'Manager' },
//       { id: 6, name: 'Dave White', contact: '321-321-3210', email: 'dave@example.com', position: 'Intern' },
//       { id: 7, name: 'Eve Blue', contact: '654-654-6543', email: 'eve@example.com', position: 'CEO' },
//       { id: 8, name: 'Frank Green', contact: '987-987-9876', email: 'frank@example.com', position: 'HR' },
//       { id: 9, name: 'Grace Yellow', contact: '147-147-1470', email: 'grace@example.com', position: 'Developer' }
//     ]);
//   }, []);

//   const handleAddEmployee = (newEmployee) => {
//     if (editingEmployee) {
//       setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...editingEmployee, ...newEmployee } : emp));
//     } else {
//       setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
//     }
//     setIsModalOpen(false);
//     setEditingEmployee(null);
//   };

//   const handleDeleteEmployee = (id) => {
//     setEmployees(employees.filter(emp => emp.id !== id));
//   };

//   const handleEditEmployee = (employee) => {
//     setEditingEmployee(employee);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter and paginate employees
//   const filteredEmployees = employees.filter(employee =>
//     employee.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 flex">
//       <div className={`flex-1 transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
//         <div className="flex justify-between items-center mb-4">
//           <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-700">
//             ← Employees
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
//               Add New Employee
//             </button>
//           </div>
//         </div>

//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="text-left p-2">Name</th>
//               <th className="text-left p-2">Contact No</th>
//               <th className="text-left p-2">Email</th>
//               <th className="text-left p-2">Position</th>
//               <th className="text-left p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedEmployees.map((employee) => (
//               <tr key={employee.id}>
//                 <td className="p-2">{employee.name}</td>
//                 <td className="p-2">{employee.contact}</td>
//                 <td className="p-2">{employee.email}</td>
//                 <td className="p-2">{employee.position}</td>
//                 <td className="p-2">
//                   <button onClick={() => handleEditEmployee(employee)} className="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
//                   <button onClick={() => handleDeleteEmployee(employee.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
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
//         <EmployeeForm
//           onSubmit={handleAddEmployee}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingEmployee(null);
//           }}
//           employee={editingEmployee}
//         />
//       )}
//     </div>
//   );
// }

// export default EmployeeList;


// code with modren tailwind css...
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import EmployeeForm from './EmployeeForm';

// const ITEMS_PER_PAGE = 5;

// function EmployeeList() {
//   const [employees, setEmployees] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch employees from API
//     // For now, we'll use dummy data
//     setEmployees([
//       { id: 1, name: 'John Doe', contact: '123-456-7890', email: 'john@example.com', position: 'Manager' },
//       { id: 2, name: 'Jane Smith', contact: '987-654-3210', email: 'jane@example.com', position: 'Developer' },
//       { id: 3, name: 'Alice Johnson', contact: '123-123-1234', email: 'alice@example.com', position: 'Designer' },
//       { id: 4, name: 'Bob Brown', contact: '456-456-4567', email: 'bob@example.com', position: 'Developer' },
//       { id: 5, name: 'Charlie Black', contact: '789-789-7890', email: 'charlie@example.com', position: 'Manager' },
//       { id: 6, name: 'Dave White', contact: '321-321-3210', email: 'dave@example.com', position: 'Intern' },
//       { id: 7, name: 'Eve Blue', contact: '654-654-6543', email: 'eve@example.com', position: 'CEO' },
//       { id: 8, name: 'Frank Green', contact: '987-987-9876', email: 'frank@example.com', position: 'HR' },
//       { id: 9, name: 'Grace Yellow', contact: '147-147-1470', email: 'grace@example.com', position: 'Developer' }
//     ]);
//   }, []);

//   const handleAddEmployee = (newEmployee) => {
//     if (editingEmployee) {
//       setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...editingEmployee, ...newEmployee } : emp));
//     } else {
//       setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
//     }
//     setIsModalOpen(false);
//     setEditingEmployee(null);
//   };

//   const handleDeleteEmployee = (id) => {
//     setEmployees(employees.filter(emp => emp.id !== id));
//   };

//   const handleEditEmployee = (employee) => {
//     setEditingEmployee(employee);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter and paginate employees
//   const filteredEmployees = employees.filter(employee =>
//     employee.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
//       <div className={`transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
//         <div className="flex justify-between items-center mb-6">
//         <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
//             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             <span className="font-medium">Employees</span>
//           </button>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//               </svg>
//             </div>
//             <button 
//               onClick={() => setIsModalOpen(true)} 
//               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//               </svg>
//               Add New Employee
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedEmployees.map((employee) => (
//                 <tr key={employee.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.contact}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button onClick={() => handleEditEmployee(employee)} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//                       </svg>
//                     </button>
//                     <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-center mt-6 space-x-2">
//           <button
//             onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-4 py-2 border rounded-md text-sm font-medium ${
//                 currentPage === index + 1
//                   ? 'bg-blue-500 text-white border-blue-500'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <EmployeeForm
//           onSubmit={handleAddEmployee}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingEmployee(null);
//           }}
//           employee={editingEmployee}
//         />
//       )}
//     </div>
//   );
// }

// export default EmployeeList;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';

const ITEMS_PER_PAGE = 5;

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees from API (using dummy data for now)
    setEmployees([
      { id: 1, name: 'John Doe', contact: '123-456-7890', email: 'john@example.com', position: 'Manager' },
      { id: 2, name: 'Jane Smith', contact: '987-654-3210', email: 'jane@example.com', position: 'Developer' },
      { id: 3, name: 'Alice Johnson', contact: '123-123-1234', email: 'alice@example.com', position: 'Designer' },
      { id: 4, name: 'Bob Brown', contact: '456-456-4567', email: 'bob@example.com', position: 'Developer' },
      { id: 5, name: 'Charlie Black', contact: '789-789-7890', email: 'charlie@example.com', position: 'Manager' },
      { id: 6, name: 'Dave White', contact: '321-321-3210', email: 'dave@example.com', position: 'Intern' },
      { id: 7, name: 'Eve Blue', contact: '654-654-6543', email: 'eve@example.com', position: 'CEO' },
    ]);
  }, []);

  const handleAddEmployee = (newEmployee) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...editingEmployee, ...newEmployee } : emp));
    } else {
      setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter and paginate employees
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-96' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Employee List</span>
          </button>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search employees"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Employee
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditEmployee(employee)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteEmployee(employee.id)} 
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
        <EmployeeForm
          onSubmit={handleAddEmployee}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          employee={editingEmployee}
        />
      )}
    </div>
  );
}

export default EmployeeList;