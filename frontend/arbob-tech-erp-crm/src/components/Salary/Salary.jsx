// import React from 'react';
// import { BrowserRouter as  Route, NavLink, Routes } from 'react-router-dom';
// import CreatePayslip from './CreatePayslip';
// import PayslipList from './PayslipList';

// function Salary({ payslips, addPayslip }) {
//   return (
//     <div className="container mx-auto p-4">
//       <nav className="mb-4">
//         <NavLink to="/salary/create-payslip" className="mr-4 text-blue-500 hover:underline">Create Payslip</NavLink>
//         <NavLink to="/salary/payslip-list" className="text-blue-500 hover:underline">Payslip List</NavLink>
//       </nav>
//       <Routes>
//         <Route path="create-payslip" element={<CreatePayslip onSubmit={addPayslip} />} />
//         <Route path="payslip-list" element={<PayslipList payslips={payslips} />} />
//       </Routes>
//     </div>
//   );
// }

// export default Salary;

// import React, { useState } from 'react';
// import { Route, NavLink, Routes } from 'react-router-dom';
// import CreatePayslip from './CreatePayslip';
// import PayslipList from './PayslipList';

// function Salary() {
//   const [payslips, setPayslips] = useState([]);

//   const addPayslip = (newPayslip) => {
//     setPayslips(prevPayslips => [...prevPayslips, newPayslip]);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <nav className="mb-4">
//         <NavLink to="/salary/create-payslip" className="mr-4 text-blue-500 hover:underline">Create Payslip</NavLink>
//         <NavLink to="/salary/payslip-list" className="text-blue-500 hover:underline">Payslip List</NavLink>
//       </nav>
//       <Routes>
//         <Route path="create-payslip" element={<CreatePayslip onSubmit={addPayslip} />} />
//         <Route path="payslip-list" element={<PayslipList payslips={payslips} />} />
//       </Routes>
//     </div>
//   );
// }

// export default Salary;

// delete and print verisions

import React, { useState } from 'react';
import { Route, NavLink, Routes } from 'react-router-dom';
import CreatePayslip from './CreatePayslip';
import PayslipList from './PayslipList';

function Salary( {handleDelete ,handlePrint}) {
  const [payslips, setPayslips] = useState([]);

  const addPayslip = (newPayslip) => {
    setPayslips((prevPayslips) => [...prevPayslips, newPayslip]);
  };

  // const handleDelete = (id) => {
  //   setPayslips((prevPayslips) => prevPayslips.filter((payslip) => payslip.id !== id));
  // const handlePrint = (payslip) => {
  //   // Implement the logic to print the payslip
  //   console.log('Printing payslip:', payslip);
  //   // You can open a print dialog or send the payslip to a printing service here
  // };// };

  

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <NavLink to="/salary/create-payslip" className="mr-4 text-blue-500 hover:underline">
          Create Payslip
        </NavLink>
        <NavLink to="/salary/payslip-list" className="text-blue-500 hover:underline">
          Payslip List
        </NavLink>
      </nav>
      <Routes>
        <Route path="create-payslip" element={<CreatePayslip onSubmit={addPayslip} />} />
        <Route
          path="payslip-list"
          element={
            <PayslipList
              payslips={payslips}
              onDelete={handleDelete}
              onPrint={handlePrint}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default Salary;
