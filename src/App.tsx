import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { AIChat } from './components/AIChat';
import { TripPlanner } from './components/TripPlanner';
import { TravelQuiz } from './components/TravelQuiz';
import { Recommendations } from './components/Recommendations';
import { BookingHub } from './components/BookingHub';
import { UserProfile } from './components/UserProfile';
import { Sidebar } from './components/Sidebar';

export type Page = 'home' | 'chat' | 'planner' | 'quiz' | 'recommendations' | 'booking' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero onNavigate={setCurrentPage} />;
      case 'chat':
        return <AIChat />;
      case 'planner':
        return <TripPlanner />;
      case 'quiz':
        return <TravelQuiz />;
      case 'recommendations':
        return <Recommendations />;
      case 'booking':
        return <BookingHub />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className={`border-r border-gray-200 bg-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        } flex-shrink-0 h-full`}>
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-6 min-h-full overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;