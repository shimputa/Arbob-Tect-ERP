
// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { useMediaQuery } from '@react-hook/media-query';
// import Header from './header';
// import Sidebar from './sideBar';

// function Layout({ onLogout, user }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const isMobile = useMediaQuery('(max-width: 768px)');

//   const handleToggleSidebar = () => {
//     setSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar with updated visibility logic */}
//       {(isMobile || sidebarOpen) && (
//         <Sidebar
//           isMobile={isMobile}
//           isOpen={sidebarOpen}
//           toggleSidebar={handleToggleSidebar}
//         />
//       )}

//       {/* Main content area */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header
//           onLogout={onLogout}
//           user={user}
//           toggleSidebar={handleToggleSidebar}
//         />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Layout;


// Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';
import Header from './header';
import Sidebar from './sideBar';

function Layout({ onLogout, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;