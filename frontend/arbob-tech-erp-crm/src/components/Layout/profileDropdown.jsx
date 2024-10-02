import React, { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-3 bg-white border border-gray-200 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <img 
          src={user.avatar} 
          alt="User avatar" 
          className="w-8 h-8 rounded-full object-cover"
        />
        {/* <span className="font-medium text-gray-700">{user.name}</span> */}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 transition duration-300 ease-in-out transform origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button 
            onClick={() => {/* Add logout functionality */}} 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition duration-150 ease-in-out"
          >
            <LogOut className="w-4 h-4 mr-3 text-gray-400" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;