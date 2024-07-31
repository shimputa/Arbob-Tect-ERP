import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/layOut';
// import Dashboard from './components/Dashboard/Dashboard';
import Employees from './components/Employees/EmployeesList';
// import Attendance from './components/Attendance/Attendance';
// import Salary from './components/Salary/Salary';
import Expense from './components/Expense/ExpenseList';
import ExpenseCate from './components/ExpenseCate/ExpenseCateList';
// import TaskManagement from './components/TaskManagement/TaskManagement';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/employees" element={<Employees />} />
            {/* <Route path="/attendance" element={<Attendance />} /> */}
            {/* <Route path="/salary" element={<Salary />} /> */}
            <Route path="/expense" element={<Expense />} />
            <Route path="/expenseCate" element={<ExpenseCate />} />
            {/* <Route path="/tasks" element={<TaskManagement />} /> */}
          </Routes>
        </Layout>
      </Router>
     </AppProvider>
  );
}

export default App;
