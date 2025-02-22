import React, { useState, useMemo, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  ChevronDownIcon,
  UserGroupIcon,
  BanknotesIcon,
  Squares2X2Icon,
  HomeIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function Sidebar({ isMobile, isOpen, toggleSidebar }) {
  const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSalaryDropdown = useCallback(() => {
    setIsSalaryDropdownOpen(prev => !prev);
  }, []);

  const toggleAttendanceDropdown = useCallback(() => {
    setIsAttendanceDropdownOpen(prev => !prev);
  }, []);

  const navigationItems = useMemo(() => (
    <ul className="space-y-5">
      <NavItem to="/dashboard" icon={<HomeIcon className="h-7 w-7" />} text="Dashboard" />
      <NavItem to="/employees" icon={<UserGroupIcon className="h-7 w-7" />} text="Employees" />
      <NavItem to="/expense" icon={<BanknotesIcon className="h-7 w-7" />} text="Expenses" />
      <NavItem to="/expenseCate" icon={<Squares2X2Icon className="h-7 w-7" />} text="Expense Categories" />

      {/* Salary Section */}
      <li>
        <button
          onClick={toggleSalaryDropdown}
          className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg 
            transition-all duration-200 group hover:scale-105 hover:bg-white/5"
        >
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-7 w-7 mr-4" />
            <span className="text-medium font-bold group-hover:translate-x-1 transition-transform">
              Salary
            </span>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-200 ${isSalaryDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isSalaryDropdownOpen && (
          <ul className="mt-2 ml-7 space-y-2">
            <SubNavItem to="/salary/create-payslip" text="Create Payslip" />
            <SubNavItem to="/salary/payslip-list" text="Payslip List" />
          </ul>
        )}
      </li>

      {/* Attendance Section */}
      <li>
        <button
          onClick={toggleAttendanceDropdown}
          className="w-full text-left flex items-center justify-between py-3 px-5 rounded-lg 
            transition-all duration-200 group hover:scale-105 hover:bg-white/5"
        >
          <div className="flex items-center">
            <ClockIcon className="h-7 w-7 mr-4" />
            <span className="text-medium font-bold group-hover:translate-x-1 transition-transform">
              Attendance
            </span>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-200 ${isAttendanceDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isAttendanceDropdownOpen && (
          <ul className="mt-2 ml-7 space-y-2">
            <SubNavItem to="/attendance/daily-attendance" text="Daily Attendance" />
            <SubNavItem to="/attendance/attendance-report" text="Attendance Report" />
          </ul>
        )}
      </li>
    </ul>
  ), [isSalaryDropdownOpen, isAttendanceDropdownOpen, toggleSalaryDropdown, toggleAttendanceDropdown]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`
          bg-gradient-to-b from-indigo-600 via-blue-700 to-purple-800
          text-white p-4 flex flex-col z-50
          ${isMobile
            ? 'fixed top-0 left-0 h-screen w-64 transition-transform duration-300'
            : 'relative h-screen w-64'}
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Header area */}
        <div className="flex items-center justify-between mb-10">
          <img
            src="https://placehold.co/100x40/667EEA/ffffff?text=ATT"
            alt="ATT Logo"
            className="h-10"
          />
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none"
            >
              <XMarkIcon className="h-7 w-7 text-white" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        {navigationItems}
      </div>
    </>
  );
}

function NavItem({ to, icon, text }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center py-3 px-5 rounded-lg transition-all duration-200
          group hover:scale-105
          ${isActive
            ? 'bg-white/10 text-white backdrop-blur-sm shadow-lg'
            : 'text-blue-100 hover:bg-white/5 hover:text-white active:bg-white/20'}`
        }
      >
        {icon}
        <span className="ml-4 transition-transform duration-200 group-hover:translate-x-1">
          {text}
        </span>
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
            : 'text-blue-100 hover:bg-white/5 hover:text-white active:bg-white/20'}`
        }
      >
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          {text}
        </span>
      </NavLink>
    </li>
  );
}

export default Sidebar;