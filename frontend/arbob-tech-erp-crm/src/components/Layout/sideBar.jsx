
// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   Bars3Icon,   // Hamburger icon for opening the sidebar
//   XMarkIcon,   // Close icon for collapsing the sidebar
//   ChevronDownIcon,
//   ChevronUpIcon,
//   UserGroupIcon,
//   BanknotesIcon,
//   Squares2X2Icon,
//   HomeIcon,
// } from '@heroicons/react/24/outline';

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const toggleSalaryDropdown = () => setIsSalaryDropdownOpen(!isSalaryDropdownOpen);

//   return (
//     <div className={`h-screen bg-gray-100 p-4 ${isOpen ? 'w-70' : 'w-20'} transition-width duration-300 relative`}>
//       {/* Logo and Hamburger Menu */}
//       <div className="flex items-center justify-between mb-6">
//         {/* Company Logo and Name */}
//         <div className="flex items-center">
//           <img 
//             src="/path-to-your-logo.png" // Replace with the actual path to your logo
//             alt="Company Logo" 
//             className={`h-10 mr-3 ${isOpen ? 'block' : 'hidden'} transition-all duration-300`} // Show logo only when expanded
//           />
//         </div>
        
//         {/* Hamburger Menu Icon */}
//         <div className="ml-auto ">
//           {isOpen ? (
//             <XMarkIcon className="h-6 w-6 text-gray-700 hover:text-gray-900 cursor-pointer" onClick={toggleSidebar} />
//           ) : (
//             <Bars3Icon className="h-6 w-6 text-gray-700 hover:text-gray-900 cursor-pointer " onClick={toggleSidebar} />
//           )}
//         </div>
//       </div>

//       <ul className="space-y-8"> {/* Increased space between menu items */}
//         <li>
//           <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-blue-500 font-bold flex items-center' : 'text-black flex items-center hover:text-blue-500')}>
//             <HomeIcon className="h-6 w-6 mr-4 transition-transform transform hover:scale-110" /> {/* Added hover effect */}
//             {isOpen && 'Dashboard'}
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/employees" className={({ isActive }) => (isActive ? 'text-blue-500 font-bold flex items-center' : 'text-black flex items-center hover:text-blue-500')}>
//             <UserGroupIcon className="h-6 w-6 mr-4 transition-transform transform hover:scale-110" /> {/* Added hover effect */}
//             {isOpen && 'Employees'}
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/expense" className={({ isActive }) => (isActive ? 'text-blue-500 font-bold flex items-center' : 'text-black flex items-center hover:text-blue-500')}>
//             <BanknotesIcon className="h-6 w-6 mr-4 transition-transform transform hover:scale-110" /> {/* Added hover effect */}
//             {isOpen && 'Expenses'}
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/expenseCate" className={({ isActive }) => (isActive ? 'text-blue-500 font-bold flex items-center' : 'text-black flex items-center hover:text-blue-500')}>
//             <Squares2X2Icon className="h-6 w-6 mr-4 transition-transform transform hover:scale-110" /> {/* Added hover effect */}
//             {isOpen && 'Expense Categories'}
//           </NavLink>
//         </li>
//         <li>
//           <button onClick={toggleSalaryDropdown} className="w-full text-left flex items-center justify-between focus:outline-none text-black font-bold hover:text-blue-500">
//             <div className="flex items-center">
//               <BanknotesIcon className="h-6 w-6 mr-4 transition-transform transform hover:scale-110" /> {/* Added hover effect */}
//               {isOpen && 'Salary'}
//             </div>
//             {isOpen && (isSalaryDropdownOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}
//           </button>
//           {isSalaryDropdownOpen && isOpen && (
//             <ul className="mt-2 pl-6 space-y-2">
//               <li>
//                 <NavLink to="/salary/create-payslip" className={({ isActive }) => (isActive ? 'text-blue-500 font-bold' : 'text-black hover:text-blue-500')}>
//                   Create Payslip
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/salary/payslip-list" className={({ isActive }) => (isActive ? 'text-blue-500 font-bold' : 'text-black hover:text-blue-500')}>
//                   Payslip List
//                 </NavLink>
//               </li>
//             </ul>
//           )}
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;



// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   Bars3Icon,
//   XMarkIcon,
//   ChevronDownIcon,
//   UserGroupIcon,
//   BanknotesIcon,
//   Squares2X2Icon,
//   HomeIcon,
//   CurrencyDollarIcon,
// } from '@heroicons/react/24/outline';

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const toggleSalaryDropdown = () => setIsSalaryDropdownOpen(!isSalaryDropdownOpen);

//   return (
//     <div className={`h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 ${isOpen ? 'w-72' : 'w-24'} transition-all duration-300 ease-in-out shadow-lg`}>
//       {/* Logo and Toggle Button */}
//       <div className="flex items-center justify-between mb-10">
//         {/* Company Logo and Name */}
//         <div className="flex items-center">
//           <img 
//             src="/path-to-your-logo.png"
//             alt="Company Logo" 
//             className={`h-12 mr-3 ${isOpen ? 'block' : 'hidden'} transition-all duration-300`}
//           />
//         </div>
        
//         {/* Toggle Button */}
//         <button 
//           onClick={toggleSidebar}
//           className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           {isOpen ? (
//             <XMarkIcon className="h-7 w-7 text-white" />
//           ) : (
//             <Bars3Icon className="h-7 w-7 text-white" />
//           )}
//         </button>
//       </div>

//       <ul className="space-y-5">
//         <NavItem to="/dashboard" icon={<HomeIcon className="h-7 w-7" />} text="Dashboard" isOpen={isOpen} />
//         <NavItem to="/employees" icon={<UserGroupIcon className="h-7 w-7" />} text="Employees" isOpen={isOpen} />
//         <NavItem to="/expense" icon={<BanknotesIcon className="h-7 w-7" />} text="Expenses" isOpen={isOpen} />
//         <NavItem to="/expenseCate" icon={<Squares2X2Icon className="h-7 w-7" />} text="Expense Categories" isOpen={isOpen} />
        
//         <li>
//           <button 
//             onClick={toggleSalaryDropdown} 
//             className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
//           >
//             <div className="flex items-center">
//               <CurrencyDollarIcon className="h-7 w-7 mr-4" />
//               {isOpen && <span className="text-medium font-bold">Salary</span>}
//             </div>
//             {isOpen && (
//               <ChevronDownIcon 
//                 className={`h-5 w-5 transition-transform duration-200 ${isSalaryDropdownOpen ? 'rotate-180' : ''}`} 
//               />
//             )}
//           </button>
//           {isSalaryDropdownOpen && isOpen && (
//             <ul className="mt-2 ml-7 space-y-2">
//               <SubNavItem to="/salary/create-payslip" text="Create Payslip" />
//               <SubNavItem to="/salary/payslip-list" text="Payslip List" />
//             </ul>
//           )}
//         </li>
//       </ul>
//     </div>
//   );
// }

// function NavItem({ to, icon, text, isOpen }) {
//   return (
//     <li>
//       <NavLink 
//         to={to} 
//         className={({ isActive }) => 
//           `flex items-center py-3 px-5 rounded-lg transition-colors duration-200 text-medium font-bold
//           ${isActive 
//             ? 'bg-black text-white' 
//             : 'text-blue-100 hover:bg-blue-500 hover:text-white active:bg-blue-700'}`
//         }
//       >
//         {icon}
//         {isOpen && <span className="ml-4">{text}</span>}
//       </NavLink>
//     </li>
//   );
// }

// function SubNavItem({ to, text }) {
//   return (
//     <li>
//       <NavLink 
//         to={to} 
//         className={({ isActive }) => 
//           `block py-2 px-4 rounded-lg transition-colors duration-200 text-medium font-bold
//           ${isActive 
//             ? 'bg-black text-white' 
//             : 'text-blue-100 hover:bg-blue-500 hover:text-white active:bg-blue-700'}`
//         }
//       >
//         {text}
//       </NavLink>
//     </li>
//   );
// }

// export default Sidebar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserGroupIcon,
  BanknotesIcon,
  Squares2X2Icon,
  HomeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSalaryDropdown = () => setIsSalaryDropdownOpen(!isSalaryDropdownOpen);

  const handleSalaryClick = () => {
    if (!isOpen) {
      navigate('/salary/create-payslip');
    } else {
      toggleSalaryDropdown();
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 ${isOpen ? 'w-66' : 'w-24'} transition-all duration-300 ease-in-out shadow-lg`}>
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between mb-10">
        {/* Company Logo and Name */}
        <div className="flex items-center">
          <img 
            src="/path-to-your-logo.png"
            alt="Company Logo" 
            className={`h-12 mr-3 ${isOpen ? 'block' : 'hidden'} transition-all duration-300`}
          />
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7 text-white" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-white" />
          )}
        </button>
      </div>

      <ul className="space-y-5">
        <NavItem to="/dashboard" icon={<HomeIcon className="h-7 w-7" />} text="Dashboard" isOpen={isOpen} />
        <NavItem to="/employees" icon={<UserGroupIcon className="h-7 w-7" />} text="Employees" isOpen={isOpen} />
        <NavItem to="/expense" icon={<BanknotesIcon className="h-7 w-7" />} text="Expenses" isOpen={isOpen} />
        <NavItem to="/expenseCate" icon={<Squares2X2Icon className="h-7 w-7" />} text="Expense Categories" isOpen={isOpen} />
        
        <li>
          <button 
            onClick={handleSalaryClick}
            className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
          >
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-7 w-7 mr-4" />
              {isOpen && <span className="text-medium font-bold">Salary</span>}
            </div>
            {isOpen && (
              <ChevronDownIcon 
                className={`h-5 w-5 transition-transform duration-200 ${isSalaryDropdownOpen ? 'rotate-180' : ''}`} 
              />
            )}
          </button>
          {isSalaryDropdownOpen && isOpen && (
            <ul className="mt-2 ml-7 space-y-2">
              <SubNavItem to="/salary/create-payslip" text="Create Payslip" />
              <SubNavItem to="/salary/payslip-list" text="Payslip List" />
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

function NavItem({ to, icon, text, isOpen }) {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center py-3 px-5 rounded-lg transition-colors duration-200 text-medium font-bold
          ${isActive 
            ? 'bg-black text-white' 
            : 'text-blue-100 hover:bg-blue-500 hover:text-white active:bg-blue-700'}`
        }
      >
        {icon}
        {isOpen && <span className="ml-4">{text}</span>}
      </NavLink>
    </li>
  );
}

function SubNavItem({ to, text }) {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `block py-2 px-4 rounded-lg transition-colors duration-200 text-medium font-bold
          ${isActive 
            ? 'bg-black text-white' 
            : 'text-blue-100 hover:bg-blue-500 hover:text-white active:bg-blue-700'}`
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

export default Sidebar;