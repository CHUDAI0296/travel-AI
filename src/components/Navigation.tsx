import React from 'react';
import { ChevronDown, Globe, Menu } from 'lucide-react';
import { Page } from '../App';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  toggleSidebar: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, toggleSidebar }) => {
  return (
    <nav className="bg-white sticky top-0 z-50 py-2 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-teal-500 flex items-center justify-center">
                <img src="https://via.placeholder.com/40" alt="ChurAI" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-teal-500">ChurAI</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-full text-sm">
                <span>CNY</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <button className="p-2 rounded-full border border-gray-200 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};