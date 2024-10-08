// import React,{useState} from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AppProvider } from './contexts/AppContext';
// import Layout from './components/Layout/layOut';
// // import Dashboard from './components/Dashboard/Dashboard';
// import Employees from './components/Employees/EmployeesList';
// import DailyAttendance from './components/Attendence/dailyAttendance';
// import AttendanceReport from './components/Attendence/attendanceReport';
// import Salary from './components/Salary/Salary';
// import CreatePayslip from './components/Salary/CreatePayslip';
// import PayslipList from './components/Salary/PayslipList';
// import Expense from './components/Expense/ExpenseList';
// import ExpenseCate from './components/ExpenseCate/ExpenseCateList';
// // import TaskManagement from './components/TaskManagement/TaskManagement';

// function App() {

//    // Manage the payslips state here
//    const [payslips, setPayslips] = useState([]);

//    const addPayslip = (payslip) => {
//      setPayslips([...payslips, payslip]);
//    };

//    const handleDelete = (id) => {
//     setPayslips((prevPayslips) => prevPayslips.filter((payslip) => payslip.id !== id));
//   };

//   const handlePrint = (payslip) => {
//     // Implement the logic to print the payslip
//     console.log('Printing payslip:', payslip);
//     // You can open a print dialog or send the payslip to a printing service here
//   };

//   return (
//     <AppProvider>
//       <Router>
//         <Layout>
//           <Routes>
//             {/* <Route path="/" element={<Dashboard />} /> */}
//             <Route path="/employees" element={<Employees />} />
//             <Route path="/attendance/daily-attendance" element={<DailyAttendance />} />
//             <Route path="/attendance/attendance-report" element={<AttendanceReport />} />
//             <Route path="/salary" element={<Salary />} />
//             <Route path="/salary/create-payslip" element={<CreatePayslip  onSubmit={addPayslip}/>} />
//             <Route path="/salary/payslip-list" element={<PayslipList payslips={payslips}  onDelete={handleDelete}
//               onPrint={handlePrint} />} />
//             <Route path="/expense" element={<Expense />} />
//             <Route path="/expenseCate" element={<ExpenseCate />} />
//           </Routes>
//         </Layout>
//       </Router>
//      </AppProvider>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/layOut';
import Login from './components/Layout/login';
import Employees from './components/Employees/EmployeesList';
import DailyAttendance from './components/Attendence/dailyAttendance';
import AttendanceReport from './components/Attendence/attendanceReport';
import Salary from './components/Salary/Salary';
import CreatePayslip from './components/Salary/CreatePayslip';
import PayslipList from './components/Salary/PayslipList';
import Expense from './components/Expense/ExpenseList';
import ExpenseCate from './components/ExpenseCate/ExpenseCateList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [payslips, setPayslips] = useState([]);

   // Dummy login with hardcoded email and password
   const login = (email, password) => {
    if (email === 'waseemkhyber123@gmail.com' && password === 'passpass') {
      setIsAuthenticated(true);
      setUser({
        name: "Waseem",
        email: "waseemkhyber123@gmail.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg" // Placeholder image for now
      });
    } else {
      alert('Invalid credentials!');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const addPayslip = (payslip) => {
    setPayslips([...payslips, payslip]);
  };

  const handleDelete = (id) => {
    setPayslips((prevPayslips) => prevPayslips.filter((payslip) => payslip.id !== id));
  };

  const handlePrint = (payslip) => {
    console.log('Printing payslip:', payslip);
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
            {/* Nested routes within Layout */}
            <Route path="employees" element={<Employees />} />
            <Route path="attendance/daily-attendance" element={<DailyAttendance />} />
            <Route path="attendance/attendance-report" element={<AttendanceReport />} />
            <Route path="salary" element={<Salary />} />
            <Route path="salary/create-payslip" element={<CreatePayslip onSubmit={addPayslip} />} />
            <Route path="salary/payslip-list" element={<PayslipList payslips={payslips} onDelete={handleDelete} onPrint={handlePrint} />} />
            <Route path="expense" element={<Expense />} />
            <Route path="expenseCate" element={<ExpenseCate />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;


