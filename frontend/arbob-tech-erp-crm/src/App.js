// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { AppProvider } from './contexts/AppContext';
// import Layout from './components/Layout/layOut';
// import Login from './components/Layout/login';
// import Employees from './components/Employees/EmployeesList';
// import DailyAttendance from './components/Attendence/dailyAttendance';
// import AttendanceReport from './components/Attendence/attendanceReport';
// import Salary from './components/Salary/Salary';
// import CreatePayslip from './components/Salary/CreatePayslip';
// import PayslipList from './components/Salary/PayslipList';
// import Expense from './components/Expense/ExpenseList';
// import ExpenseCate from './components/ExpenseCate/ExpenseCateList';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [payslips, setPayslips] = useState([]);

//    // Dummy login with hardcoded email and password
//    const login = (email, password) => {
//     if (email === 'waseemkhyber123@gmail.com' && password === 'passpass') {
//       setIsAuthenticated(true);
//       setUser({
//         name: "Waseem",
//         email: "waseemkhyber123@gmail.com",
//         avatar: "https://randomuser.me/api/portraits/men/1.jpg" // Placeholder image for now
//       });
//     } else {
//       alert('Invalid credentials!');
//     }
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   const addPayslip = (payslip) => {
//     setPayslips([...payslips, payslip]);
//   };

//   const handleDelete = (id) => {
//     setPayslips((prevPayslips) => prevPayslips.filter((payslip) => payslip.id !== id));
//   };

//   const handlePrint = (payslip) => {
//     console.log('Printing payslip:', payslip);
//   };

//   // Protected Route component
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />;
//     }
//     return children;
//   };

//   return (
//     <AppProvider>
//       <Router>
//         <Routes>
//           {/* Login route */}
//           <Route path="/login" element={<Login onLogin={login} />} />

//           {/* Protected routes */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Layout onLogout={logout} user={user}/>
//               </ProtectedRoute>
//             }
//           >
//             {/* Nested routes within Layout */}
//             <Route path="employees" element={<Employees />} />
//             <Route path="attendance/daily-attendance" element={<DailyAttendance />} />
//             <Route path="attendance/attendance-report" element={<AttendanceReport />} />
//             <Route path="salary" element={<Salary />} />
//             <Route path="salary/create-payslip" element={<CreatePayslip onSubmit={addPayslip} />} />
//             <Route path="salary/payslip-list" element={<PayslipList payslips={payslips} onDelete={handleDelete} onPrint={handlePrint} />} />
//             <Route path="expense" element={<Expense />} />
//             <Route path="expenseCate" element={<ExpenseCate />} />
//           </Route>
//         </Routes>
//       </Router>
//     </AppProvider>
//   );
// }

// export default App;

import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/layOut';
import Login from './components/Layout/login';
import Employees from './components/Employees/EmployeesList';
import DailyAttendance from './components/Attendence/dailyAttendance';
import AttendanceReport from './components/Attendence/attendanceReport';
import Salary from './components/Salary/Salary';
import Expense from './components/Expense/ExpenseList';
import ExpenseCate from './components/ExpenseCate/ExpenseCateList';
import Dashboard from './components/Dashboard/dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dummy login with hardcoded email and password
  const login = (email, password) => {
    if (email === 'waseemkhyber123@gmail.com' && password === 'passpass') {
      setIsAuthenticated(true);
      setUser({
        name: "Waseem",
        email: "waseemkhyber123@gmail.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg" // Placeholder image
      });
    } else {
      alert('Invalid credentials!');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchPayslips = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/salary`);
      setPayslips(response.data.salaries);
    } catch (err) {
      setError('Failed to fetch payslips');
      console.error(err);
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
      const response = await axios.post('http://localhost:3000/salary', payslipData);
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
      await axios.delete(`http://localhost:3000/salary/${id}`);
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
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<Login onLogin={login} />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout onLogout={logout} user={user}/>
              </ProtectedRoute>
            }
          >
             {/* Dashboard route */}
             <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* Nested routes within Layout */}
            <Route path="employees" element={<Employees />} />
            <Route path="attendance/daily-attendance" element={<DailyAttendance />} />
            <Route path="attendance/attendance-report" element={<AttendanceReport />} />
            <Route 
              path="salary/*" 
              element={
                <Salary 
                  payslips={payslips}
                  onDelete={handleDeletePayslip}
                  onPrint={handlePrint}
                  onSubmit={handleAddPayslip}
                  isLoading={isLoading}
                  error={error}
                  setError={setError}  // Add this line
                  onRefresh={fetchPayslips}
                />
              } 
            />
            <Route path="expense" element={<Expense />} />
            <Route path="expenseCate" element={<ExpenseCate />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;