// import React from 'react';
// import Header from './header';
// import Sidebar from './sideBar';
// import { Outlet } from 'react-router-dom';

// function Layout({ onLogout, user}) {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header onLogout={onLogout}  user={user} />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Layout;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';
import Header from './header';
import Sidebar from './sideBar';

function Layout({ onLogout, user }) {
  // If you want the sidebar initially open on desktop, set this to true. Otherwise, false.
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detect if we are on a mobile screen
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (controls are passed down) */}
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        toggleSidebar={handleToggleSidebar}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onLogout={onLogout}
          user={user}
          toggleSidebar={handleToggleSidebar}
          // We no longer hide the hamburger on desktop; it's always shown
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;


