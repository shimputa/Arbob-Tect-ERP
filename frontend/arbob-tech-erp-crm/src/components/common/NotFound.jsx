import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full inline-flex mx-auto mb-6">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">404 - Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          
          <Link 
            to="/dashboard" 
            className="inline-flex items-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 