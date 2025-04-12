import { useTheme } from '../../contexts/ThemeContext';

function ExpenseCateList() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-full p-6 ${isDarkMode ? 'bg-dark-primary text-white' : 'bg-gray-100'} transition-colors duration-200`}>
      <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Expense Categories</h1>
        <button
          onClick={() => openFormDialog()}
          className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          Add Category
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <div className={`relative flex-1 ${messageType ? 'mb-4' : ''}`}>
          <input
            type="text"
            placeholder="Search expense categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-dark-accent border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-brand-primary`}
          />
        </div>
      </div>
      {messageType && (
        <div className={`flex items-center p-4 mb-4 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100' 
            : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
        }`}>
          {message}
        </div>
      )}
      <div className={`w-full overflow-x-auto ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-md shadow`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${isDarkMode ? 'bg-dark-accent' : 'bg-gray-50'}`}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Name
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Description
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Created At
              </th>
              <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'bg-dark-secondary divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
            {categories.map((category) => (
              <tr key={category.id} className={`${isDarkMode ? 'hover:bg-dark-accent' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {category.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {category.description || '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formatDate(category.createdAt)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirmDialog(category)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No expense categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={`px-6 py-3 flex items-center justify-between border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex-1 flex justify-between sm:hidden`}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 ${
              isDarkMode 
                ? 'bg-dark-accent text-gray-300 border-gray-700' 
                : 'bg-white text-gray-700 border-gray-300'
            } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} 
            text-sm font-medium rounded-md border`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 ${
              isDarkMode 
                ? 'bg-dark-accent text-gray-300 border-gray-700' 
                : 'bg-white text-gray-700 border-gray-300'
            } ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} 
            text-sm font-medium rounded-md border`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCateList; 