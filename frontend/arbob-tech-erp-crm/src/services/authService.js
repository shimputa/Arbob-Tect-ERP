import axios from 'axios';

// Configure axios instance for auth requests
const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// Set auth token for API calls
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, token);
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Also set it for the main axios instance
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
    delete authAxios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage
const initToken = () => {
  const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

// Add request interceptor to ensure token is always set for every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login user
const loginUser = async (email, password) => {
  try {
    const response = await authAxios.post(process.env.REACT_APP_AUTH_LOGIN_ENDPOINT, {
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
    
    const response = await authAxios.get(process.env.REACT_APP_AUTH_ME_ENDPOINT);
    
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