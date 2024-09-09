// import React, { useState, useEffect } from 'react';

// function EmployeeForm({ onSubmit, onClose, employee }) {
//   const [formEmployee, setFormEmployee] = useState({
//     name: '',
//     contact: '',
//     email: '',
//     position: ''
//   });

//   useEffect(() => {
//     if (employee) {
//       setFormEmployee(employee);
//     }
//   }, [employee]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormEmployee(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formEmployee);
//   };

//   return (
//     <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-4 overflow-y-auto">
//       <h3 className="text-lg font-bold mb-4">{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="block mb-1">Name</label>
//           <input type="text" name="name" value={formEmployee.name} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Contact No</label>
//           <input type="text" name="contact" value={formEmployee.contact} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Email</label>
//           <input type="email" name="email" value={formEmployee.email} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Position</label>
//           <input type="text" name="position" value={formEmployee.position} onChange={handleChange} className="w-full border p-2" required />
//         </div>
//         <div className="flex justify-end">
//           <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
//           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EmployeeForm;


import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function EmployeeForm({ onSubmit, onClose, employee }) {
  const [formEmployee, setFormEmployee] = useState({
    name: '',
    contact: '',
    email: '',
    position: ''
  });

  useEffect(() => {
    if (employee) {
      setFormEmployee(employee);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formEmployee);
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          {employee ? 'Edit Employee' : 'Add New Employee'}
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
            value={formEmployee.name} 
            onChange={handleChange} 
            placeholder="Enter full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
          <input 
            type="text" 
            name="contact" 
            id="contact"
            value={formEmployee.contact} 
            onChange={handleChange} 
            placeholder="Enter contact number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            value={formEmployee.email} 
            onChange={handleChange} 
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150 ease-in-out"
            required 
          />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <input 
            type="text" 
            name="position" 
            id="position"
            value={formEmployee.position} 
            onChange={handleChange} 
            placeholder="Enter job position"
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

export default EmployeeForm;