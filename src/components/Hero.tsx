import React, { useState } from 'react';
import { MessageCircle, Calendar, HelpCircle, Star, ArrowRight, Globe, MapPin, Users, Mic, Send } from 'lucide-react';
import { Page } from '../App';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  
  const aiCommands = [
    "Plan a weekend trip to Paris",
    "Find family-friendly hotels in Tokyo",
    "Best time to visit Bali",
    "Budget travel tips for Europe",
    "Must-see attractions in New York"
  ];

  const handleSend = () => {
    if (input.trim()) {
      onNavigate('chat');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Hey, I'm ChurAI your personal trip planner
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Tell me what you want, and I'll handle the rest: flights, hotels, itineraries, in seconds.
        </p>
        
        <div className="w-full bg-gray-100 rounded-xl p-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Tokyo in 6 days: food, culture & bucke"
              className="w-full py-3 px-4 pr-20 rounded-lg bg-transparent focus:outline-none text-gray-800"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Mic className="h-5 w-5" />
              </button>
              <button 
                className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                onClick={handleSend}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm mb-8">
          Not sure where to start? <a href="#" className="text-gray-800 font-medium">See how it works ↓</a>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Try asking ChurAI:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiCommands.map((command, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(command);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-teal-500 mr-3" />
                  <span>{command}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};