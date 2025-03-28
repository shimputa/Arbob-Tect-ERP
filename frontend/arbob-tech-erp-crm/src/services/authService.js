import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Configure axios instance for auth requests
const authAxios = axios.create({
  baseURL: API_URL
});

// Set auth token for API calls
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Also set it for the main axios instance
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete authAxios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage
const initToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

// Login user
const loginUser = async (email, password) => {
  try {
    const response = await authAxios.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      setAuthToken(response.data.token);
      return {
        success: true,
        user: response.data.user
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Login failed'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const token = initToken();
    if (!token) {
      return { success: false };
    }
    
    const response = await authAxios.get('/auth/me');
    
    if (response.data.success) {
      return {
        success: true,
        user: response.data.user
      };
    }
    
    return { success: false };
  } catch (error) {
    // Clear invalid token
    setAuthToken(null);
    return { success: false };
  }
};

// Logout user
const logoutUser = () => {
  setAuthToken(null);
};

const authService = {
  loginUser,
  getCurrentUser,
  logoutUser,
  initToken
};

export default authService; 