import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, DollarSign, Users, CheckSquare, Clock, CreditCard } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-white bg-opacity-90">
        <div className="mb-8">
          <img src="/api/placeholder/200/80" alt="ARBOB TECH" className="w-48" />
        </div>
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Arbob Tech Team</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Empowering Startups with Smart Solutions</h2>
        <p className="text-xl text-gray-600 mb-8 text-center text-justify max-w-md">All-in-one Enterprise resource planning (ERP) and customer relationship management (CRM) platform for modern businesses</p>
        <ul className="space-y-6 w-full max-w-md">
          <li className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Expense Management</h3>
              <p className="text-gray-600">Track and control your startup's spending</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Employee Management</h3>
              <p className="text-gray-600">Streamline HR processes and team coordination</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Task Management</h3>
              <p className="text-gray-600">Organize and track projects efficiently</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Attendance Tracking</h3>
              <p className="text-gray-600">Monitor work hours and improve productivity</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Salary Management</h3>
              <p className="text-gray-600">Simplify payroll and compensation processes</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white shadow-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="relative">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-10"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              onClick={() => alert('Forgot password clicked')}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            onClick={() => alert('Register Now clicked')}
          >
            Register Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;