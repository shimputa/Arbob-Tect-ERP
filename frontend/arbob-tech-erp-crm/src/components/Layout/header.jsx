import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

function Header() {
  const { user } = useAppContext();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tech ERP</h1>
        <div className="flex items-center">
          {user ? (
            <>
              <span className="text-gray-700 mr-4">Welcome, {user.name}</span>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;