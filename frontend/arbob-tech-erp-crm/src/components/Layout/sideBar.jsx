
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
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] = useState(false); // New for Attendance dropdown
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSalaryDropdown = () => setIsSalaryDropdownOpen(!isSalaryDropdownOpen);
  const toggleAttendanceDropdown = () => setIsAttendanceDropdownOpen(!isAttendanceDropdownOpen); // New toggle for Attendance

  const handleSalaryClick = () => {
    if (!isOpen) {
      navigate('/salary/create-payslip');
    } else {
      toggleSalaryDropdown();
    }
  };

  const handleAttendanceClick = () => { // New for Attendance
    if (!isOpen) {
      navigate('/attendance/daily-attendance');
    } else {
      toggleAttendanceDropdown();
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 ${isOpen ? 'w-66' : 'w-24'} transition-all duration-300 ease-in-out shadow-lg`}>
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between mb-10">
        {/* Company Logo */}
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

      {/* Navigation Menu */}
      <ul className="space-y-5">
        <NavItem to="/dashboard" icon={<HomeIcon className="h-7 w-7" />} text="Dashboard" isOpen={isOpen} />
        <NavItem to="/employees" icon={<UserGroupIcon className="h-7 w-7" />} text="Employees" isOpen={isOpen} />
        <NavItem to="/expense" icon={<BanknotesIcon className="h-7 w-7" />} text="Expenses" isOpen={isOpen} />
        <NavItem to="/expenseCate" icon={<Squares2X2Icon className="h-7 w-7" />} text="Expense Categories" isOpen={isOpen} />

        {/* Salary Dropdown */}
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

        {/* Attendance Dropdown */}
        <li>
          <button 
            onClick={handleAttendanceClick}  // Same logic as Salary
            className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
          >
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-7 w-7 mr-4" />
              {isOpen && <span className="text-medium font-bold">Attendance</span>}
            </div>
            {isOpen && (
              <ChevronDownIcon 
                className={`h-5 w-5 transition-transform duration-200 ${isAttendanceDropdownOpen ? 'rotate-180' : ''}`} 
              />
            )}
          </button>
          {isAttendanceDropdownOpen && isOpen && (
            <ul className="mt-2 ml-7 space-y-2">
              <SubNavItem to="/attendance/daily-attendance" text="Daily Attendance" />
              <SubNavItem to="/attendance/attendance-report" text="Attendance Report" />
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
            : 'text-blue-100 hover:bg-blue-500 hover:text-white active:bg-blue-700'}`}
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
            : 'text-blue-100 hover:bg-blue-500 hover:text-white active:bg-blue-700'}`}
      >
        {text}
      </NavLink>
    </li>
  );
}

export default Sidebar;
