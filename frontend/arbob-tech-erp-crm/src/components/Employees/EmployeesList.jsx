import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';

const ITEMS_PER_PAGE = 5;

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data.employees);
    } catch (err) {
      setError('Failed to fetch employees. Please try again later.');
      console.error('Error fetching employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      setError(null);
      setFormErrors({});
      let response;
      if (editingEmployee) {
        response = await axios.put(`http://localhost:3000/api/employees/${editingEmployee.id}`, {
          ...editingEmployee,
          ...newEmployee,
        });
        setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? response.data : emp)));
        setSuccessMessage('Employee updated successfully!');
      } else {
        response = await axios.post('http://localhost:3000/api/employees', newEmployee);
        setEmployees([...employees, response.data]);
        setSuccessMessage('Employee added successfully!');
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      // Refetch the employees to ensure the UI is up-to-date
      await fetchEmployees();

       // Set a timeout to hide the success message after 3 seconds
       const timeoutId = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timeoutId);

    } catch (err) {
      // Check for field-specific errors from the backend response
      if (err.response?.data?.errors) {
        // Extract field errors into an object
        const errors = err.response.data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {});
        setFormErrors(errors); // Set formErrors for EmployeeForm to use
      } else {
        setError(err.response?.data?.message || 'Failed to save employee. Please try again.');
      }
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setError(null);
      await axios.delete(`http://localhost:3000/api/employee/${id}/deactivate`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      console.error('Error deleting employee:', err);
    }
  };

  const handleEditEmployee = (employee) => {
    setError(null);
    setFormErrors({});
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter and paginate employees
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) =>
        employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-96' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Employee
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? 'No employees found matching your search' : 'No employees available'}
                    </td>
                  </tr>
                ) : (
                  displayedEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
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
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border text-sm font-medium rounded-md ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
            setFormErrors({});
            setError(null);
            setSuccessMessage('');
          }}
          employee={editingEmployee}
          error={error}
          formErrors={formErrors}
        />
      )}
    </div>
  );
}

export default EmployeeList;