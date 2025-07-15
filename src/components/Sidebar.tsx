import React from 'react';
import { Plane, Calendar, HelpCircle, Star, CreditCard, User, MessageCircle, PlusCircle } from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'planner' as Page, label: 'Trip Planner', icon: Calendar },
    { id: 'recommendations' as Page, label: 'Recommendations', icon: Star },
    { id: 'quiz' as Page, label: 'Travel Quiz', icon: HelpCircle },
    { id: 'booking' as Page, label: 'Booking', icon: CreditCard },
    { id: 'profile' as Page, label: 'Profile', icon: User },
  ];

  const trips = [
    { id: '1', title: '6-Day Romantic Luxury Wellness & Adventure in Japan', date: 'Oct 1-7' },
    { id: '2', title: 'Weekend in Paris', date: 'Nov 10-12' },
    { id: '3', title: 'Family Trip to Disney', date: 'Dec 20-27' },
  ];

  return (
    <div className="h-full bg-white p-4 overflow-y-auto">
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 w-full px-4 py-2 text-teal-500 font-medium"
        >
          <Plane className="h-5 w-5" />
          <span>ChurAI Travel</span>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
          Menu
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        <div className="flex items-center justify-between px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            My Trips
          </h3>
          <button className="text-teal-500 hover:text-teal-600">
            <PlusCircle className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1">
          {trips.map((trip) => (
            <button
              key={trip.id}
              onClick={() => onNavigate('planner')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                <Plane className="h-4 w-4 text-gray-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{trip.title}</p>
                <p className="text-xs text-gray-500">{trip.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 