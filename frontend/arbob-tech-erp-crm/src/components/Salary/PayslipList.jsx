
// import React, { useState, useEffect } from 'react';

// const ITEMS_PER_PAGE = 7;

// function PayslipList({ payslips,onDelete, onPrint }) {
//   const [filteredPayslips, setFilteredPayslips] = useState(payslips);
//   const [filterMonth, setFilterMonth] = useState('');
//   const [filterYear, setFilterYear] = useState('');
//   const [filterName, setFilterName] = useState(''); // Add filter by name
//   const [currentPage, setCurrentPage] = useState(1); // Add pagination state

//   useEffect(() => {
//     setFilteredPayslips(payslips);
//   }, [payslips]);

//   const handleFilter = () => {
//     const filtered = payslips.filter(payslip => {
//       return (
//         (filterMonth === '' || payslip.month === filterMonth) &&
//         (filterYear === '' || payslip.year === filterYear) &&
//         (filterName === '' || payslip.employee.toLowerCase().includes(filterName.toLowerCase()))
//       );
//     });
//     setFilteredPayslips(filtered);
//     setCurrentPage(1); // Reset to first page after filtering
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedPayslips = filteredPayslips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Payslip List</h2>
//       <div className="flex space-x-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by Name"
//           value={filterName}
//           onChange={(e) => setFilterName(e.target.value)}
//           className="border p-2"
//         />
//         <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="border p-2">
//           <option value="">Month: All</option>
//           <option value="January">January</option>
//           <option value="February">February</option>
//           {/* Add more months */}
//         </select>
//         <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="border p-2">
//           <option value="">Year: All</option>
//           <option value="2023">2023</option>
//           <option value="2024">2024</option>
//           {/* Add more years */}
//         </select>
//         <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
//       </div>
//       <table className="min-w-full bg-white">
//         <thead>
//           <tr>
//             <th className="text-left p-2">Employee Name</th>
//             <th className="text-left p-2">Month</th>
//             <th className="text-left p-2">Year</th>
//             <th className="text-left p-2">Summary</th>
//             <th className="text-left p-2">Status</th>
//             <th className="text-left p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayedPayslips.length > 0 ? (
//             displayedPayslips.map((payslip, index) => (
//               <tr key={index}>
//                 <td className="p-2">{payslip.employee}</td>
//                 <td className="p-2">{payslip.month}</td>
//                 <td className="p-2">{payslip.year}</td>
//                 <td className="p-2">
//                   Basic Salary: ${payslip.basicSalary} <br />
//                   Total Bonus: ${payslip.totalBonus} <br />
//                   Total Deduction: ${payslip.totalDeduction} <br />
//                   Net Salary: ${payslip.netSalary}
//                 </td>
//                 <td className="p-2">{payslip.status}</td>
//                 <td className="p-2">
//                   <button
//                     onClick={() => onDelete(payslip.id)}
//                     className="bg-red-500 text-white p-1 rounded mr-2"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => onPrint(payslip)}
//                     className="bg-green-500 text-white p-1 rounded"
//                   >
//                     Print
//                   </button>
//                 </td>
                
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="p-4 text-center text-gray-500">No payslips available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-4 space-x-2">
//         <button
//           onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//           className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index + 1}
//             onClick={() => setCurrentPage(index + 1)}
//             className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button
//           onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//           className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default PayslipList;

// modern tailwind css with and styles....

// import React, { useState, useEffect } from 'react';

// const ITEMS_PER_PAGE = 2;

// function PayslipList({ payslips, onDelete, onPrint }) {
//   const [filteredPayslips, setFilteredPayslips] = useState(payslips);
//   const [filterMonth, setFilterMonth] = useState('');
//   const [filterYear, setFilterYear] = useState('');
//   const [filterName, setFilterName] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setFilteredPayslips(payslips);
//   }, [payslips]);

//   const handleFilter = () => {
//     const filtered = payslips.filter(payslip => {
//       return (
//         (filterMonth === '' || payslip.month === filterMonth) &&
//         (filterYear === '' || payslip.year === filterYear) &&
//         (filterName === '' || payslip.employee.toLowerCase().includes(filterName.toLowerCase()))
//       );
//     });
//     setFilteredPayslips(filtered);
//     setCurrentPage(1);
//   };

//   const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedPayslips = filteredPayslips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Payslip List</h2>
//       <div className="flex flex-wrap gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by Name"
//           value={filterName}
//           onChange={(e) => setFilterName(e.target.value)}
//           className="flex-grow sm:flex-grow-0 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select 
//           value={filterMonth} 
//           onChange={(e) => setFilterMonth(e.target.value)} 
//           className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Month: All</option>
//           <option value="January">January</option>
//           <option value="February">February</option>
//           {/* Add more months */}
//         </select>
//         <select 
//           value={filterYear} 
//           onChange={(e) => setFilterYear(e.target.value)} 
//           className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Year: All</option>
//           <option value="2023">2023</option>
//           <option value="2024">2024</option>
//           {/* Add more years */}
//         </select>
//         <button 
//           onClick={handleFilter} 
//           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
//         >
//           Filter
//         </button>
//       </div>
//       <div className="overflow-x-auto shadow-md rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {displayedPayslips.length > 0 ? (
//               displayedPayslips.map((payslip, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">{payslip.employee}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{payslip.month}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{payslip.year}</td>
//                   <td className="px-6 py-4">
//                     <p>Basic Salary: <span className="font-medium">${payslip.basicSalary}</span></p>
//                     <p>Total Bonus: <span className="font-medium">${payslip.totalBonus}</span></p>
//                     <p>Total Deduction: <span className="font-medium">${payslip.totalDeduction}</span></p>
//                     <p>Net Salary: <span className="font-medium">${payslip.netSalary}</span></p>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       payslip.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {payslip.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => onDelete(payslip.id)}
//                       className="text-red-600 hover:text-red-900 mr-4 transition-colors duration-300"
//                     >
//                       Delete
//                     </button>
//                     <button
//                       onClick={() => onPrint(payslip)}
//                       className="text-green-600 hover:text-green-900 transition-colors duration-300"
//                     >
//                       Print
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No payslips available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-6 space-x-2">
//         <button
//           onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//           className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index + 1}
//             onClick={() => setCurrentPage(index + 1)}
//             className={`px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//               currentPage === index + 1
//                 ? 'bg-blue-600 text-white border-blue-600'
//                 : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
//             }`}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button
//           onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//           className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default PayslipList;


// import React, { useState, useEffect } from 'react';
// import { XCircle, Printer } from 'lucide-react';

// const ITEMS_PER_PAGE = 2;

// function PayslipList({ payslips, onDelete, onPrint }) {
//   const [filteredPayslips, setFilteredPayslips] = useState(payslips);
//   const [filterMonth, setFilterMonth] = useState('');
//   const [filterYear, setFilterYear] = useState('');
//   const [filterName, setFilterName] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setFilteredPayslips(payslips);
//   }, [payslips]);

//   const handleFilter = () => {
//     const filtered = payslips.filter(payslip => {
//       return (
//         (filterMonth === '' || payslip.month === filterMonth) &&
//         (filterYear === '' || payslip.year === filterYear) &&
//         (filterName === '' || payslip.employee.toLowerCase().includes(filterName.toLowerCase()))
//       );
//     });
//     setFilteredPayslips(filtered);
//     setCurrentPage(1);
//   };

//   const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const displayedPayslips = filteredPayslips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
//       <div className="container mx-auto py-8">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">Payslip List</h2>
//         <div className="flex flex-wrap gap-4 mb-6">
//           <div className="relative flex-grow sm:flex-grow-0">
//             <input
//               type="text"
//               placeholder="Search by Name"
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />
//           </div>
//           <select
//             value={filterMonth}
//             onChange={(e) => setFilterMonth(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Month: All</option>
//             <option value="January">January</option>
//             <option value="February">February</option>
//             {/* Add more months */}
//           </select>
//           <select
//             value={filterYear}
//             onChange={(e) => setFilterYear(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Year: All</option>
//             <option value="2023">2023</option>
//             <option value="2024">2024</option>
//             {/* Add more years */}
//           </select>
//           <button
//             onClick={handleFilter}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
//           >
//             Filter
//           </button>
//         </div>
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedPayslips.length > 0 ? (
//                 displayedPayslips.map((payslip, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">{payslip.employee}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{payslip.month}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{payslip.year}</td>
//                     <td className="px-6 py-4">
//                       <p>Basic Salary: <span className="font-medium">${payslip.basicSalary}</span></p>
//                       <p>Total Bonus: <span className="font-medium">${payslip.totalBonus}</span></p>
//                       <p>Total Deduction: <span className="font-medium">${payslip.totalDeduction}</span></p>
//                       <p>Net Salary: <span className="font-medium">${payslip.netSalary}</span></p>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         payslip.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {payslip.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => onDelete(payslip.id)}
//                         className="text-red-600 hover:text-red-900 mr-4 transition-colors duration-300"
//                       >
//                         <XCircle className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => onPrint(payslip)}
//                         className="text-green-600 hover:text-green-900 transition-colors duration-300"
//                       >
//                         <Printer className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No payslips available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-center mt-6 space-x-2">
//           <button
//             onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                 currentPage === index + 1
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PayslipList;

import React, { useState, useEffect } from 'react'

const ITEMS_PER_PAGE = 2;

function PayslipList({ payslips, onDelete, onPrint }) {
  const [filteredPayslips, setFilteredPayslips] = useState(payslips);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilteredPayslips(payslips);
  }, [payslips]);

  const handleFilter = () => {
    const filtered = payslips.filter(payslip => {
      return (
        (filterMonth === '' || payslip.month === filterMonth) &&
        (filterYear === '' || payslip.year === filterYear) &&
        (filterName === '' || payslip.employee.toLowerCase().includes(filterName.toLowerCase()))
      );
    });
    setFilteredPayslips(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPayslips = filteredPayslips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h2 className="text-2xl  font-medium font-bold mb-6 text-gray-800">
          Payslip List
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          {/* <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Search by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div> */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Month: All</option>
            <option value="January">January</option>
            <option value="February">February</option>
            {/* Add more months */}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Year: All</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Add more years */}
          </select>
          <button
            onClick={handleFilter}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Filter
          </button>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedPayslips.length > 0 ? (
                displayedPayslips.map((payslip, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payslip.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payslip.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payslip.year}
                    </td>
                    <td className="px-6 py-4">
                      <p>
                        Basic Salary:{" "}
                        <span className="font-medium">
                          ${payslip.basicSalary}
                        </span>
                      </p>
                      <p>
                        Total Bonus:{" "}
                        <span className="font-medium">
                          ${payslip.totalBonus}
                        </span>
                      </p>
                      <p>
                        Total Deduction:{" "}
                        <span className="font-medium">
                          ${payslip.totalDeduction}
                        </span>
                      </p>
                      <p>
                        Net Salary:{" "}
                        <span className="font-medium">
                          ${payslip.netSalary}
                        </span>
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payslip.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payslip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onDelete(payslip.id)}
                        className="text-red-600 hover:text-red-900 mr-4 transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onPrint(payslip)}
                        className="text-green-600 hover:text-green-900 transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 9V2h12v7M6 18v-3h12v3m-4 4h-4m6-4H6a2 2 0 01-2-2V9a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No payslips available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayslipList;





