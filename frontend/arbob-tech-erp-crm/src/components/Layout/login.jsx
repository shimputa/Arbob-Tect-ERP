import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, DollarSign, Users, CheckSquare, Clock, CreditCard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSwitcher from '../common/ThemeSwitcher';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    setFieldErrors({});
    
    // Basic validation
    let hasErrors = false;
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
      hasErrors = true;
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_AUTH_LOGIN_ENDPOINT}`,
        { email, password }
      );
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, response.data.token);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        // Call the parent's onLogin function to update the app state
        const loginResult = await onLogin(email, password);
        if (loginResult.success) {
          navigate('/dashboard');
        } else {
          setLoginError(loginResult.message || 'Login failed');
        }
      } else {
        setLoginError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-dark-primary' : 'bg-gradient-to-br from-blue-100 to-indigo-200'} transition-colors duration-200`}>
      {/* Theme switcher in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      
      <div className={`hidden lg:flex flex-1 flex-col justify-center items-center p-12 ${isDarkMode ? 'bg-dark-secondary bg-opacity-95' : 'bg-white bg-opacity-90'}`}>
        <div className="mb-8 flex justify-center">
          <div className="bg-white/90 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-brand-primary px-4 py-2" style={{ minWidth: 180 }}>
            <img
              src="/images/8hr.jpg"
              alt="8HR Logo"
              className="w-60 h-auto object-contain"
              style={{ maxHeight: 110 }}
            />
          </div>
        </div>
        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-800'} mb-4`}>Empowering Startups with Smart Solutions</h2>
        <p className={`text-xl ${isDarkMode ? 'text-dark-secondary' : 'text-gray-600'} mb-8 text-center text-justify max-w-md`}>All-in-one Enterprise resource planning (ERP) and customer relationship management (CRM) platform for modern businesses</p>
        <ul className="space-y-6 w-full max-w-md">
          <li className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'bg-green-800' : 'bg-green-100'} p-3 rounded-full`}>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-700'}`}>Expense Management</h3>
              <p className={`${isDarkMode ? 'text-dark-secondary' : 'text-gray-600'}`}>Track and control your startup's spending</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'} p-3 rounded-full`}>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-700'}`}>Employee Management</h3>
              <p className={`${isDarkMode ? 'text-dark-secondary' : 'text-gray-600'}`}>Streamline HR processes and team coordination</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'bg-purple-800' : 'bg-purple-100'} p-3 rounded-full`}>
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-700'}`}>Task Management</h3>
              <p className={`${isDarkMode ? 'text-dark-secondary' : 'text-gray-600'}`}>Organize and track projects efficiently</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'bg-yellow-800' : 'bg-yellow-100'} p-3 rounded-full`}>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-700'}`}>Attendance Tracking</h3>
              <p className={`${isDarkMode ? 'text-dark-secondary' : 'text-gray-600'}`}>Monitor work hours and improve productivity</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'bg-red-800' : 'bg-red-100'} p-3 rounded-full`}>
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-primary' : 'text-gray-700'}`}>Salary Management</h3>
              <p className={`${isDarkMode ? 'text-dark-secondary' : 'text-gray-600'}`}>Simplify payroll and compensation processes</p>
            </div>
          </li>
        </ul>
      </div>
      <div className={`flex-1 flex flex-col justify-center items-center p-8 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow-2xl`}>
        <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-dark-primary' : 'text-gray-800'} mb-8`}>Welcome Back</h2>
        
        {loginError && (
          <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="relative">
            <label htmlFor="email" className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary pl-10 
                  ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
                  ${fieldErrors.email ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-1/2 transform -translate-y-1/2`} />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>
          
          <div className="relative">
            <label htmlFor="password" className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary pl-10 pr-10
                  ${isDarkMode ? 'bg-dark-accent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
                  ${fieldErrors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              <Lock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-1/2 transform -translate-y-1/2`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary text-white py-3 px-4 rounded-lg hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;