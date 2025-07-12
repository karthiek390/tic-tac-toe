
import React from 'react';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/60 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Tic-Tac-Toe Trainer. All rights reserved.
          </div>
          
          {/* Motivational Message */}
          <div className="flex items-center space-x-2 text-yellow-400">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Built to make you smarter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
