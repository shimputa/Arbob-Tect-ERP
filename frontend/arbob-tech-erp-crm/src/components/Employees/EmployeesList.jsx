// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import EmployeeForm from './EmployeeForm';

// function EmployeeList() {
//   const [employees, setEmployees] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch employees from API
//     // For now, we'll use dummy data
//     setEmployees([
//       { id: 1, name: 'John Doe', contact: '123-456-7890', email: 'john@example.com', position: 'Manager' },
//       { id: 2, name: 'Jane Smith', contact: '987-654-3210', email: 'jane@example.com', position: 'Developer' }
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

//   const filteredEmployees = employees.filter(employee =>
//     employee.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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
//             {filteredEmployees.map((employee) => (
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

//         <div className="flex justify-center mt-4">
//           <button className="mx-1 px-3 py-1 bg-blue-500 text-white rounded">1</button>
//           {/* Add more pagination buttons as needed */}
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


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import EmployeeForm from './EmployeeForm';

// const ITEMS_PER_PAGE = 7;
// 
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
    // Fetch employees from API
    // For now, we'll use dummy data
    setEmployees([
      { id: 1, name: 'John Doe', contact: '123-456-7890', email: 'john@example.com', position: 'Manager' },
      { id: 2, name: 'Jane Smith', contact: '987-654-3210', email: 'jane@example.com', position: 'Developer' },
      { id: 3, name: 'Alice Johnson', contact: '123-123-1234', email: 'alice@example.com', position: 'Designer' },
      { id: 4, name: 'Bob Brown', contact: '456-456-4567', email: 'bob@example.com', position: 'Developer' },
      { id: 5, name: 'Charlie Black', contact: '789-789-7890', email: 'charlie@example.com', position: 'Manager' },
      { id: 6, name: 'Dave White', contact: '321-321-3210', email: 'dave@example.com', position: 'Intern' },
      { id: 7, name: 'Eve Blue', contact: '654-654-6543', email: 'eve@example.com', position: 'CEO' },
      { id: 8, name: 'Frank Green', contact: '987-987-9876', email: 'frank@example.com', position: 'HR' },
      { id: 9, name: 'Grace Yellow', contact: '147-147-1470', email: 'grace@example.com', position: 'Developer' }
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
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter and paginate employees
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`transition-all duration-300 ${isModalOpen ? 'mr-96' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4 sm:mb-0">
            ← Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Add New Employee
            </button>
          </div>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEditEmployee(employee)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-300">Edit</button>
                    <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900 transition-colors duration-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
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
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
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