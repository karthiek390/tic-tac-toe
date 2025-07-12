
import React from 'react';
import { Home, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-yellow-400">
              Tic-Tac-Toe Trainer
            </h2>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <a
              href="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-yellow-500/20 hover:to-yellow-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group"
            >
              <Home className="w-4 h-4 text-gray-300 group-hover:text-yellow-400 transition-colors" />
              <span className="text-gray-300 group-hover:text-yellow-400 transition-colors">Home</span>
            </a>
            
            <a
              href="/signin"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-500/20 hover:to-blue-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              <LogIn className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
              <span className="text-gray-300 group-hover:text-blue-400 transition-colors">Sign In</span>
            </a>
            
            <a
              href="/signup"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/40 text-black font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
