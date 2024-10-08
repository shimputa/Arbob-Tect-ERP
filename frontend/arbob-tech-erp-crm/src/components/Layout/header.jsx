import React from 'react';
import ProfileDropdown from './profileDropdown';

function Header({ onLogout , user }) {
   return (
    <header className="bg-white shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Arbob Tech ERP</h1>
        <div className="flex items-center space-x-4">
          <ProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}

export default Header;
