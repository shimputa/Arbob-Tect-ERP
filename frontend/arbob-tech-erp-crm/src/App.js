import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AppProvider } from './contexts/AppContext';
import { PermissionProvider } from './contexts/PermissionContext';
import Layout from './components/Layout/layOut';
import Login from './components/Layout/login';
import Employees from './components/Employees/EmployeesList';
import DailyAttendance from './components/Attendence/dailyAttendance';
import AttendanceReport from './components/Attendence/attendanceReport';
import Salary from './components/Salary/Salary';
import Expense from './components/Expense/ExpenseList';
import ExpenseCate from './components/ExpenseCate/ExpenseCateList';
import Dashboard from './components/Dashboard/dashboard';
import ProjectList from './components/Project Management/projectList';
import User from './components/Users/UserList';
import PermissionRoute from './components/common/PermissionRoute';
import NotFound from './components/common/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Set user state
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login using auth service with improved error handling
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_AUTH_LOGIN_ENDPOINT}`,
        { email, password }
      );
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Set axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        // Update state
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Invalid credentials!' 
        };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout using auth service
  const logout = () => {
    localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchPayslips = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_SALARY_API}`
      );
      
      // Handle the response based on your API structure
      if (response.data && response.data.salaries) {
        setPayslips(response.data.salaries);
      } else if (Array.isArray(response.data)) {
        setPayslips(response.data);
      }
    } catch (err) {
      console.error('Error fetching payslips:', err);
      setError('Failed to fetch payslips');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPayslips();
    }
  }, [isAuthenticated, fetchPayslips]);

  const handleAddPayslip = async (payslipData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_SALARY_API}`,
        payslipData);
      setPayslips(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw err;
      } else {
        setError('Failed to create payslip');
        throw new Error('Failed to create payslip');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayslip = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_SALARY_API}/${id}`
      );
      setPayslips(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete payslip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = (payslip) => {
    console.log('Printing payslip:', payslip);
    // Implement printing logic here
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <div className="spinner-border text-blue-500 mb-3" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AppProvider>
      <PermissionProvider user={user}>
        <Router>
          <Routes>
            {/* Login route */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={login} />
              } 
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout onLogout={logout} user={user}/>
                </ProtectedRoute>
              }
            >
              {/* Dashboard route - requiring dashboard:view permission */}
              <Route 
                index 
                element={
                  <PermissionRoute permissions={['dashboard:view']}>
                    <Dashboard />
                  </PermissionRoute>
                } 
              />
              <Route 
                path="dashboard" 
                element={
                  <PermissionRoute permissions={['dashboard:view']}>
                    <Dashboard />
                  </PermissionRoute>
                } 
              />
              
              {/* Employee routes */}
              <Route 
                path="employees" 
                element={
                  <PermissionRoute permissions={['employee:view']}>
                    <Employees />
                  </PermissionRoute>
                } 
              />
              
              {/* Project routes */}
              <Route 
                path="projects" 
                element={
                  <PermissionRoute permissions={['project:view']}>
                    <ProjectList />
                  </PermissionRoute>
                } 
              />
              
              {/* Attendance routes */}
              <Route 
                path="attendance/daily-attendance" 
                element={
                  <PermissionRoute permissions={['attendance:view']}>
                    <DailyAttendance />
                  </PermissionRoute>
                } 
              />
              <Route 
                path="attendance/attendance-report" 
                element={
                  <PermissionRoute permissions={['attendance:view']}>
                    <AttendanceReport />
                  </PermissionRoute>
                } 
              />
              
              {/* Salary routes */}
              <Route 
                path="salary/*" 
                element={
                  <PermissionRoute permissions={['salary:view']}>
                    <Salary 
                      payslips={payslips}
                      onDelete={handleDeletePayslip}
                      onPrint={handlePrint}
                      onSubmit={handleAddPayslip}
                      isLoading={isLoading}
                      error={error}
                      setError={setError}
                      onRefresh={fetchPayslips}
                    />
                  </PermissionRoute>
                } 
              />
              
              {/* Expense routes */}
              <Route 
                path="expense" 
                element={
                  <PermissionRoute permissions={['expense:view']}>
                    <Expense />
                  </PermissionRoute>
                } 
              />
              
              {/* Expense Category routes */}
              <Route 
                path="expenseCate" 
                element={
                  <PermissionRoute permissions={['expenseCategory:view']}>
                    <ExpenseCate />
                  </PermissionRoute>
                } 
              />
              
              {/* User routes */}
              <Route 
                path="users" 
                element={
                  <PermissionRoute permissions={['user:view']}>
                    <User />
                  </PermissionRoute>
                } 
              />
            </Route>

            {/* 404 Not Found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </PermissionProvider>
    </AppProvider>
  );
}

export default App;