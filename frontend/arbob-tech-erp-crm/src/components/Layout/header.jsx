import React from 'react';
import { PanelLeft } from 'lucide-react';
import ProfileDropdown from './profileDropdown';

function Header({ onLogout, user, toggleSidebar, isSidebarOpen, isMobile }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-2">
          {/* Left side with title and panel icon grouped together */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-md text-gray-600 
                hover:bg-gray-100 hover:text-gray-800 
                transition-colors duration-200 ease-in-out
                focus:outline-none
                ${(!isSidebarOpen && !isMobile) ? 'ml-24' : 'ml-10'}`}
            >
              <PanelLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 ml-8">ATT QUOHR</h1>
          </div>
          
          {/* Right side with profile dropdown */}
          <div className={`pr-4 ${(!isSidebarOpen && !isMobile) ? 'mr-28' : 'mr-10'}`}>
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;