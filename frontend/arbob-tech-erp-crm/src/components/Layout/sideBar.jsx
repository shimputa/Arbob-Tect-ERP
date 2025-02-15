
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink, useNavigate} from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserGroupIcon,
  BanknotesIcon,
  Squares2X2Icon,
  HomeIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Custom Tooltip component for reusability
function CustomTooltip({ children, content }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-[60] left-full ml-2 px-3 py-2 bg-gray-900/90 backdrop-blur-sm 
        text-white text-sm rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100
        pointer-events-none transition-opacity duration-200">
        {content}
      </div>
    </div>
  );
}
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSalaryDropdown = useCallback(() => setIsSalaryDropdownOpen(!isSalaryDropdownOpen), [isSalaryDropdownOpen]);
  const toggleAttendanceDropdown = useCallback(() => setIsAttendanceDropdownOpen(!isAttendanceDropdownOpen), [isAttendanceDropdownOpen]);

  const handleSalaryClick = useCallback(() => {
    if (!isOpen) {
      navigate('/salary/create-payslip');
    } else {
      toggleSalaryDropdown();
    }
  }, [isOpen, navigate, toggleSalaryDropdown]);

  const handleAttendanceClick = useCallback(() => {
    if (!isOpen) {
      navigate('/attendance/daily-attendance');
    } else {
      toggleAttendanceDropdown();
    }
  }, [isOpen, navigate, toggleAttendanceDropdown]);

  const navigationItems = useMemo(() => (
    <ul className="space-y-5">
      <NavItem to="/dashboard" icon={<HomeIcon className="h-7 w-7" />} text="Dashboard" isOpen={isOpen} />
      <NavItem to="/employees" icon={<UserGroupIcon className="h-7 w-7" />} text="Employees" isOpen={isOpen} />
      <NavItem to="/expense" icon={<BanknotesIcon className="h-7 w-7" />} text="Expenses" isOpen={isOpen} />
      <NavItem to="/expenseCate" icon={<Squares2X2Icon className="h-7 w-7" />} text="Expense Categories" isOpen={isOpen} />

      {/* Salary Dropdown */}
      <li>
        <button 
          onClick={handleSalaryClick}
          className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg 
            transition-all duration-200 group hover:scale-105 hover:bg-white/5"
          aria-expanded={isSalaryDropdownOpen}
        >
          <div className="flex items-center">
            {!isOpen ? (
              <CustomTooltip content="Salary">
                <CurrencyDollarIcon className="h-7 w-7 mr-4" />
              </CustomTooltip>
            ) : (
              <CurrencyDollarIcon className="h-7 w-7 mr-4" />
            )}
            {isOpen && <span className="text-medium font-bold group-hover:translate-x-1 transition-transform">Salary</span>}
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
          onClick={handleAttendanceClick}
          className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg 
            transition-all duration-200 group hover:scale-105 hover:bg-white/5"
          aria-expanded={isAttendanceDropdownOpen}
        >
          <div className="flex items-center">
            {!isOpen ? (
              <CustomTooltip content="Attendance">
                <ClockIcon className="h-7 w-7 mr-4" />
              </CustomTooltip>
            ) : (
              <ClockIcon className="h-7 w-7 mr-4" />
            )}
            {isOpen && <span className="text-medium font-bold group-hover:translate-x-1 transition-transform">Attendance</span>}
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
  ), [isOpen, isSalaryDropdownOpen, isAttendanceDropdownOpen,handleAttendanceClick,handleSalaryClick]);

  return (
    <div className={`h-screen bg-gradient-to-b from-indigo-600 via-blue-700 to-purple-800 
      text-white p-4 ${isOpen ? 'w-66' : 'w-24'} 
      transition-all duration-300 ease-in-out
     `}>
      
      {/* Logo and Toggle Button if logo is degined then this code use */}
      {/* <div className="flex items-center justify-center mb-10">
        <div className="flex items-center">
          <img 
            src="/path-to-your-logo.png"
            alt="Company Logo" 
            className={`h-12 mr-3 ${isOpen ? 'block' : 'hidden'} transition-all duration-300`}
          />
        </div>

        <button 
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label="Toggle sidebar"
          className={`p-2 rounded-full bg-white/10 hover:bg-white/20 
            active:bg-white/5 transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-white/20
            ${isOpen ? '' : 'mx-auto'}`}
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7 text-white" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-white" />
          )}
        </button>
      </div> */}

{/* Logo and Toggle Button */}
<div className="flex items-center justify-center mb-10">
  <div className="flex items-center">
    <img 
      src="https://placehold.co/100x40/667EEA/ffffff?text=ATT"
      alt="ATT Logo" 
      className={`h-10 transition-all duration-300 ${isOpen ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}
    />
  </div>

  <button 
    onClick={toggleSidebar}
    aria-expanded={isOpen}
    aria-label="Toggle sidebar"
    className={`p-2 rounded-full bg-white/10 hover:bg-white/20 
      active:bg-white/5 transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-white/20`}
  >
    {isOpen ? (
      <XMarkIcon className="h-7 w-7 text-white" />
    ) : (
      <Bars3Icon className="h-7 w-7 text-white" />
    )}
  </button>
</div>

      {navigationItems}
    </div>
  );
}

function NavItem({ to, icon, text, isOpen }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!isOpen) {
      e.preventDefault();
      e.stopPropagation();
      navigate(to);
    }
  };
 return (
    <li>
      <NavLink 
        to={to} 
        onClick={handleClick}
        className={({ isActive }) => 
          `flex items-center py-3 px-5 rounded-lg transition-all duration-200
          group hover:scale-105
          ${isActive 
            ? 'bg-white/10 text-white backdrop-blur-sm shadow-lg' 
            : 'text-blue-100 hover:bg-white/5 hover:text-white active:bg-white/20'}`}
      >
        {!isOpen ? (
          <CustomTooltip content={text}>
            <div className="cursor-pointer">
              {icon}
            </div>
          </CustomTooltip>
        ) : (
          <>
            {icon}
            <span className="ml-4 transition-transform duration-200 group-hover:translate-x-1">{text}</span>
          </>
        )}
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
          `block py-2 px-4 rounded-lg transition-all duration-200
          group hover:scale-105
          ${isActive 
            ? 'bg-white/10 text-white backdrop-blur-sm shadow-lg' 
            : 'text-blue-100 hover:bg-white/5 hover:text-white active:bg-white/20'}`}
      >
        <span className="transition-transform duration-200 group-hover:translate-x-1">{text}</span>
      </NavLink>
    </li>
  );
}

export default Sidebar;
