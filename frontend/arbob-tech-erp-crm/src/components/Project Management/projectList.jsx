// components/Projects/ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectForm from './projectForm';
import { usePermission } from '../../contexts/PermissionContext';
import { PermissionGate } from '../common/PermissionGate';
import { useTheme } from '../../contexts/ThemeContext';

const ITEMS_PER_PAGE = process.env.REACT_APP_DEFAULT_PAGE_SIZE || 5;

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const { hasPermission } = usePermission();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_PROJECTS_API}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)}`
          }
        }
      );
      setProjects(response.data.projects);
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_EMPLOYEES_API}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)}`
          }
        }
      );
      setEmployees(response.data.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees. Please try again later.');
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddProject = async (newProject, projectId) => {
    if (newProject.errors) {
      setFormErrors(newProject.errors);
      setError('Please fix the form errors');
      return;
    }

    setError(null);
    setFormErrors({});
    
    try {
      if (projectId || (editingProject && editingProject.id)) {
        const id = projectId || editingProject.id;
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_UPDATE_PROJECTS_API}/${id}`,
          newProject,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)}`
            }
          }
        );
        setSuccessMessage('Project updated successfully');
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_PROJECTS_API}`,
          newProject,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)}`
            }
          }
        );
        setSuccessMessage('Project created successfully');
      }
      
      setIsModalOpen(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {});
        setFormErrors(errors);
      } else if (err.response?.data?.message) {
        setError(`Update failed: ${err.response.data.message}`);
      } else {
        setError('Failed to save project. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_UPDATE_PROJECTS_API}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)}`
          }
        }
      );
      setSuccessMessage('Project deleted successfully');
      await fetchProjects();
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      console.error('Error deleting project:', err);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
    setError(null);
    setFormErrors({});
  };

  return (
    <div className={`container mx-auto p-4 sm:p-6 ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} min-h-screen transition-colors duration-200`}>
      <div className={`transition-all duration-300 ${isModalOpen ? 'lg:mr-[520px]' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button onClick={() => navigate(-1)} className={`flex items-center ${isDarkMode ? 'text-brand-primary hover:text-brand-light' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Project List</span>
          </button>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search projects"
                value={searchTerm}
                onChange={handleSearch}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
                  ${isDarkMode 
                    ? 'bg-dark-accent border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <PermissionGate permission="project:create">
              <button
                onClick={() => { 
                  setEditingProject(null); 
                  setIsModalOpen(true);
                  setError(null);
                  setFormErrors({});
                }}
                className="w-full sm:w-auto bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Project
              </button>
            </PermissionGate>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700">
            <p className="text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <>
            <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-xl shadow-lg overflow-x-auto transition-colors duration-200`}>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Project Details</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Timeline</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Team</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Client Info</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Financial Overview</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Status</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                  {displayedProjects.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className={`w-16 h-16 ${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'} rounded-full flex items-center justify-center`}>
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium text-lg`}>
                            {searchTerm ? 'No projects found matching your search' : 'No projects available'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedProjects.map(project => {
                      const amount = parseInt(project.amount) || 0;
                      const taxAmount = parseInt(project.tax) || 0;
                      const paidAmount = parseInt(project.paidAmount) || 0;
                      const amountAfterTax = project.amountAfterTax || amount - taxAmount;
                      const remainingAmount = project.remainingAmount || amountAfterTax - paidAmount;
                      const bonus = parseInt(project.bonus) || 0;
                      const sharedBonus = project.sharedBonus || 0;

                      const displayPaidStatus = {
                        'NOT_PAID': 'not paid',
                        'PARTIAL_PAID': 'partial',
                        'PAID': 'paid'
                      }[project.paidStatus] || project.paidStatus?.toLowerCase();

                      const displayProjectStatus = project.projectStatus?.toLowerCase();

                      return (
                        <tr key={project.id} className={`${isDarkMode ? 'hover:bg-dark-accent/50' : 'hover:bg-gray-50/50'} transition-colors duration-150`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.projectName}</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-50 text-blue-700 w-fit">
                                {project.platform?.toLowerCase()}
                              </span>
                              {project.note && (
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} line-clamp-2`}>{project.note}</p>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {new Date(project.startDate).toLocaleDateString()}
                                </span>
                              </div>
                              {project.endDate && (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {new Date(project.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1.5">
                              {project.collaborators && project.collaborators.split(',').map((c, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {c.trim()}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.ownerName}</span>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{project.ownerEmail}</span>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{project.ownerNumber}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total:</span>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PKR {amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>After Tax:</span>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PKR {amountAfterTax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Paid:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">PKR {paidAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Remaining:</span>
                                <span className="font-medium text-red-600 dark:text-red-400">PKR {remainingAmount.toLocaleString()}</span>
                              </div>
                              <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <div className="flex justify-between items-center">
                                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Bonus:</span>
                                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PKR {bonus.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Shared:</span>
                                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PKR {sharedBonus.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                displayProjectStatus === 'ongoing' 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                  : 'bg-green-50 text-green-700 border border-green-100'
                              }`}>
                                {displayProjectStatus}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                displayPaidStatus === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' :
                                displayPaidStatus === 'partial' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' 
                                : 'bg-red-50 text-red-700 border border-red-100'
                              }`}>
                                {displayPaidStatus}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <PermissionGate permission="project:edit">
                                <button
                                  onClick={() => handleEditProject(project)}
                                  className={`${isDarkMode ? 'text-brand-light hover:text-brand-primary' : 'text-indigo-600 hover:text-indigo-900'}`}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </PermissionGate>
                              
                              <PermissionGate permission="project:delete">
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </PermissionGate>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className={`px-4 py-2 border rounded-md text-sm font-medium 
                  ${isDarkMode 
                    ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
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
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : isDarkMode 
                        ? 'bg-dark-secondary text-gray-300 border-gray-600 hover:bg-dark-accent' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                className={`px-4 py-2 border rounded-md text-sm font-medium 
                  ${isDarkMode 
                    ? 'border-gray-600 text-gray-300 bg-dark-secondary hover:bg-dark-accent' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {isModalOpen && hasPermission(editingProject ? 'project:edit' : 'project:create') && (
        <ProjectForm
          onSubmit={handleAddProject}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
            setError(null);
            setFormErrors({});
          }}
          project={editingProject}
          error={error}
          formErrors={formErrors}
          employees={employees}
        />
      )}
    </div>
  );
}

export default ProjectList;