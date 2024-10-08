// import React from 'react';
// import Header from './header';
// import Sidebar from './sideBar';

// function Layout({ children }) {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Layout;

import React from 'react';
import Header from './header';
import Sidebar from './sideBar';
import { Outlet } from 'react-router-dom';

function Layout({ onLogout, user}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onLogout={onLogout}  user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
