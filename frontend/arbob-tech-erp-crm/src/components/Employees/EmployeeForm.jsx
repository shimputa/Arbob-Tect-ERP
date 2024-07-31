import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-y-0 right-0 bg-white w-96 shadow-lg p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formEmployee.name} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Contact No</label>
          <input type="text" name="contact" value={formEmployee.contact} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formEmployee.email} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Position</label>
          <input type="text" name="position" value={formEmployee.position} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
