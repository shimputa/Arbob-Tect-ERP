import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';
import Header from './header';
import Sidebar from './sideBar';
import { useTheme } from '../../contexts/ThemeContext';

function Layout({ onLogout, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isDarkMode } = useTheme();

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-100'} transition-colors duration-200`}>
      {/* Sidebar with updated visibility logic */}
      {(isMobile || sidebarOpen) && (
        <Sidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          toggleSidebar={handleToggleSidebar}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onLogout={onLogout}
          user={user}
          toggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isDarkMode ? 'bg-dark-primary' : 'bg-gray-200'} p-6 transition-colors duration-200`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;