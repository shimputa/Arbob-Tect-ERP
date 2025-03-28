/**
 * Utility function for making authenticated API requests
 * Adds the authentication token to any fetch request
 */
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Create headers with auth token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add token if it exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Return the original fetch with auth headers added
  return fetch(url, {
    ...options,
    headers
  });
};

export default fetchWithAuth; 