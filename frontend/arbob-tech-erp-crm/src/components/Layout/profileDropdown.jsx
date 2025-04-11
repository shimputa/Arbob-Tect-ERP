import React, { useState } from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-2 px-4 shadow-sm hover:bg-white/20 transition duration-300 ease-in-out focus:outline-none"
      >
        {user?.avatar && !avatarError ? (
          <img 
            src={user.avatar} 
            alt="User avatar" 
            className="w-8 h-8 rounded-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <span className="text-sm font-medium">{user?.name?.charAt(0) || <User className="w-5 h-5" />}</span>
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 transition duration-300 ease-in-out transform origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'No email provided'}</p>
          </div>
          <button 
            onClick={onLogout} 
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
