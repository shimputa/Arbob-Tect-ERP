

// import React from 'react';
// import { Bars3Icon } from '@heroicons/react/24/outline';
// import ProfileDropdown from './profileDropdown';

// function Header({ onLogout, user, toggleSidebar }) {
//   return (
//     <header className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center h-16">

//           {/* Left column (burger icon) */}
//           <div className="w-1/6 flex items-center">
//             <button
//               onClick={toggleSidebar}
//               className="p-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
//             >
//               <Bars3Icon className="h-6 w-6" />
//             </button>
//           </div>
          
//           {/* Center column (title) */}
//           <div className="w-1/3 flex justify-center">
//             <h1 className="text-2xl font-bold text-gray-900">Arbob Tech ERP</h1>
//           </div>
          
//           {/* Right column (profile dropdown or icon) */}
//           <div className="w-1/3 flex justify-end">
//             <ProfileDropdown user={user} onLogout={onLogout} />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ProfileDropdown from './profileDropdown';

function Header({ onLogout, user, toggleSidebar }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-2">
          {/* Left side with title and burger icon grouped together */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 ml-4 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            {/* Added mr-4 (1rem) between icon and title */}
            <h1 className="text-2xl font-bold text-gray-900 ml-8">ATT QUOHR</h1>
          </div>
          
          {/* Right side with profile dropdown */}
          <div className="pr-4 mr-4">
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;



