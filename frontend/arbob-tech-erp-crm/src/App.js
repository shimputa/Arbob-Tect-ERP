import React,{useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/layOut';
// import Dashboard from './components/Dashboard/Dashboard';
import Employees from './components/Employees/EmployeesList';
// import Attendance from './components/Attendance/Attendance';
import Salary from './components/Salary/Salary';
import CreatePayslip from './components/Salary/CreatePayslip';
import PayslipList from './components/Salary/PayslipList';
import Expense from './components/Expense/ExpenseList';
import ExpenseCate from './components/ExpenseCate/ExpenseCateList';
// import TaskManagement from './components/TaskManagement/TaskManagement';

function App() {

   // Manage the payslips state here
   const [payslips, setPayslips] = useState([]);

   const addPayslip = (payslip) => {
     setPayslips([...payslips, payslip]);
   };

   const handleDelete = (id) => {
    setPayslips((prevPayslips) => prevPayslips.filter((payslip) => payslip.id !== id));
  };

  const handlePrint = (payslip) => {
    // Implement the logic to print the payslip
    console.log('Printing payslip:', payslip);
    // You can open a print dialog or send the payslip to a printing service here
  };

  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/employees" element={<Employees />} />
            {/* <Route path="/attendance" element={<Attendance />} /> */}
            <Route path="/salary" element={<Salary />} />
            <Route path="/salary/create-payslip" element={<CreatePayslip  onSubmit={addPayslip}/>} />
            {/* <Route path="/salary/create-payslip" element={<CreatePayslip/>} /> */}
            <Route path="/salary/payslip-list" element={<PayslipList payslips={payslips}  onDelete={handleDelete}
              onPrint={handlePrint} />} />
            {/* <Route path="/salary/payslip-list" element={<PayslipList />} /> */}

            {/* <Route path="/salary/*" element={<Salary payslips={payslips} addPayslip={addPayslip} />} /> */}
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
