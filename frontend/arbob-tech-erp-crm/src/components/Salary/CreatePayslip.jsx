// version 1

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// function CreatePayslip({ onSubmit }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     employee: '',
//     month: '',
//     year: '',
//     bonus: '',
//     advanceSalary: '',
//     otherDeduction: '',
//     basicSalary: 5000,  // Example basic salary
//     totalBonus: 0,
//     totalDeduction: 0,
//     netSalary: 0,
//     paymentMethod: '',
//     status: ''
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const totalBonus = Number(formData.bonus) || 0;
//     const totalDeduction = Number(formData.advanceSalary) + Number(formData.otherDeduction) || 0;
//     const netSalary = formData.basicSalary + totalBonus - totalDeduction;

//     setFormData((prevData) => ({
//       ...prevData,
//       totalBonus,
//       totalDeduction,
//       netSalary,
//     }));
//   }, [formData.bonus, formData.advanceSalary, formData.otherDeduction, formData.basicSalary]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (step === 1) {
//       setStep(2);
//     } else if (step === 2) {
//       setStep(3);
//     } else if (step === 3) {
//       onSubmit(formData);
//       setSuccessMessage(`Payslip successfully created for ${formData.employee}.`);
      
//       // Reset form data
//       setFormData({ 
//         employee: '',
//         month: '',
//         year: '',
//         bonus: '',
//         advanceSalary: '',
//         otherDeduction: '',
//         basicSalary: 5000,
//         totalBonus: 0,
//         totalDeduction: 0,
//         netSalary: 0,
//         paymentMethod: '',
//         status: ''
//       });
      
//       // Navigate to payslip list after a delay
//       setTimeout(() => {
//         setSuccessMessage('');
//         navigate('/salary/payslip-list');
//       }, 3000);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Create Payslip</h2>

//       {successMessage && (
//         <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
//           {successMessage}
//         </div>
//       )}

//       {step === 1 && (
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label>Select Employee:</label>
//               <select name="employee" value={formData.employee} onChange={handleChange} className="border p-2 w-full" required>
//                 <option value="">Select Employee</option>
//                 <option value="John Doe">John Doe</option>
//                 <option value="Jane Smith">Jane Smith</option>
//                 {/* Add more employees */}
//               </select>
//             </div>
//             <div>
//               <label>Month:</label>
//               <select name="month" value={formData.month} onChange={handleChange} className="border p-2 w-full" required>
//                 <option value="">Select Month</option>
//                 <option value="January">January</option>
//                 <option value="February">February</option>
//                 {/* Add more months */}
//               </select>
//             </div>
//             <div>
//               <label>Year:</label>
//               <select name="year" value={formData.year} onChange={handleChange} className="border p-2 w-full" required>
//                 <option value="">Select Year</option>
//                 <option value="2023">2023</option>
//                 <option value="2024">2024</option>
//                 {/* Add more years */}
//               </select>
//             </div>
//           </div>
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">Next</button>
//         </form>
//       )}

//       {step === 2 && (
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <h3 className="text-lg font-semibold">Allowance</h3>
//               <label>Bonus:</label>
//               <input type="number" name="bonus" value={formData.bonus} onChange={handleChange} className="border p-2 w-full" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Deductions</h3>
//               <label>Advance Salary:</label>
//               <input type="number" name="advanceSalary" value={formData.advanceSalary} onChange={handleChange} className="border p-2 w-full" />
//               <label>Other Deduction:</label>
//               <input type="number" name="otherDeduction" value={formData.otherDeduction} onChange={handleChange} className="border p-2 w-full" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Summary</h3>
//               <label>Basic Salary:</label>
//               <input type="number" name="basicSalary" value={formData.basicSalary} readOnly className="border p-2 w-full bg-gray-100" />
//               <label>Total Bonus:</label>
//               <input type="number" name="totalBonus" value={formData.totalBonus} readOnly className="border p-2 w-full bg-gray-100" />
//               <label>Total Deduction:</label>
//               <input type="number" name="totalDeduction" value={formData.totalDeduction} readOnly className="border p-2 w-full bg-gray-100" />
//               <label>Net Salary:</label>
//               <input type="number" name="netSalary" value={formData.netSalary} readOnly className="border p-2 w-full bg-gray-100" />
//             </div>
//           </div>
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">Next</button>
//         </form>
//       )}

//       {step === 3 && (
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label>Payment Method:</label>
//               <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="border p-2 w-full" required>
//                 <option value="">Select Payment Method</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Cash">Cash</option>
//               </select>
//             </div>
//             <div>
//               <label>Status:</label>
//               <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full" required>
//                 <option value="">Select Status</option>
//                 <option value="Paid">Paid</option>
//                 <option value="Unpaid">Unpaid</option>
//               </select>
//             </div>
//           </div>
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">Create Payslip</button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default CreatePayslip;

// version 1 with styles

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePayslip({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employee: '',
    month: '',
    year: '',
    bonus: '',
    advanceSalary: '',
    otherDeduction: '',
    basicSalary: 5000,
    totalBonus: 0,
    totalDeduction: 0,
    netSalary: 0,
    paymentMethod: '',
    status: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const totalBonus = Number(formData.bonus) || 0;
    const totalDeduction = Number(formData.advanceSalary) + Number(formData.otherDeduction) || 0;
    const netSalary = formData.basicSalary + totalBonus - totalDeduction;

    setFormData((prevData) => ({
      ...prevData,
      totalBonus,
      totalDeduction,
      netSalary,
    }));
  }, [formData.bonus, formData.advanceSalary, formData.otherDeduction, formData.basicSalary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      onSubmit(formData);
      setSuccessMessage(`Payslip successfully created for ${formData.employee}.`);
      
      setFormData({ 
        employee: '',
        month: '',
        year: '',
        bonus: '',
        advanceSalary: '',
        otherDeduction: '',
        basicSalary: 5000,
        totalBonus: 0,
        totalDeduction: 0,
        netSalary: 0,
        paymentMethod: '',
        status: ''
      });
      
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/salary/payslip-list');
      }, 3000);
    }
  };

  const inputClass = "mt-1 block  py-1 pl-1 pr-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-lg font-medium text-gray-700 mb-1";
  const buttonClass = "mt-4 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Create Payslip</h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <p className="font-bold">Success!</p>
          <p>{successMessage}</p>
        </div>
      )}

      <div className="mb-6">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          {['Employee Info', 'Salary Details', 'Payment Info'].map((label, index) => (
            <li key={index} className={`flex md:w-full items-center ${step > index ? 'text-blue-600 dark:text-blue-500' : ''}`}>
              <span className={`flex items-center justify-center w-8 h-8 mr-2 text-xs border ${step > index ? 'border-blue-600 dark:border-blue-500' : 'border-gray-500'} rounded-full shrink-0`}>
                {index + 1}
              </span>
              {label}
              {index < 2 && (
                <svg aria-hidden="true" className="w-4 h-4 ml-2 sm:ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="employee" className={labelClass}>Select Employee</label>
              <select id="employee" name="employee" value={formData.employee} onChange={handleChange} className={inputClass} required>
                <option value="">Select Employee</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </select>
            </div>
            <div>
              <label htmlFor="month" className={labelClass}>Month</label>
              <select id="month" name="month" value={formData.month} onChange={handleChange} className={inputClass} required>
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className={labelClass}>Year</label>
              <select id="year" name="year" value={formData.year} onChange={handleChange} className={inputClass} required>
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
          <button type="submit" className={buttonClass}>Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-4">Allowance</h3>
              <label htmlFor="bonus" className={labelClass}>Bonus</label>
              <input type="number" id="bonus" name="bonus" value={formData.bonus} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Deductions</h3>
              <label htmlFor="advanceSalary" className={labelClass}>Advance Salary</label>
              <input type="number" id="advanceSalary" name="advanceSalary" value={formData.advanceSalary} onChange={handleChange} className={inputClass} />
              <label htmlFor="otherDeduction" className={`${labelClass} mt-4`}>Other Deduction</label>
              <input type="number" id="otherDeduction" name="otherDeduction" value={formData.otherDeduction} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <label htmlFor="basicSalary" className={labelClass}>Basic Salary</label>
              <input type="number" id="basicSalary" name="basicSalary" value={formData.basicSalary} readOnly className={`${inputClass} bg-gray-100`} />
              <label htmlFor="totalBonus" className={`${labelClass} mt-4`}>Total Bonus</label>
              <input type="number" id="totalBonus" name="totalBonus" value={formData.totalBonus} readOnly className={`${inputClass} bg-gray-100`} />
              <label htmlFor="totalDeduction" className={`${labelClass} mt-4`}>Total Deduction</label>
              <input type="number" id="totalDeduction" name="totalDeduction" value={formData.totalDeduction} readOnly className={`${inputClass} bg-gray-100`} />
              <label htmlFor="netSalary" className={`${labelClass} mt-4`}>Net Salary</label>
              <input type="number" id="netSalary" name="netSalary" value={formData.netSalary} readOnly className={`${inputClass} bg-gray-100`} />
            </div>
          </div>
          <button type="submit" className={buttonClass}>Next</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="paymentMethod" className={labelClass}>Payment Method</label>
              <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClass} required>
                <option value="">Select Payment Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass} required>
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
          <button type="submit" className={buttonClass}>Create Payslip</button>
        </form>
      )}
    </div>
  );
}

export default CreatePayslip;
