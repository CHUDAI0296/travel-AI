import React, { useState } from 'react';
import { Plane, Hotel, UtensilsCrossed, Calendar, MapPin, Users, Search } from 'lucide-react';

type BookingType = 'flight' | 'hotel' | 'restaurant' | 'experience';

interface BookingOption {
  id: string;
  title: string;
  provider: string;
  price: string;
  rating: number;
  image: string;
  description: string;
  features: string[];
}

export const BookingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingType>('flight');
  const [searchQuery, setSearchQuery] = useState('');

  const bookingTabs = [
    { id: 'flight' as BookingType, label: 'Flights', icon: Plane },
    { id: 'hotel' as BookingType, label: 'Hotels', icon: Hotel },
    { id: 'restaurant' as BookingType, label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'experience' as BookingType, label: 'Experiences', icon: Calendar }
  ];

  const flightOptions: BookingOption[] = [
    {
      id: '1',
      title: 'Beijing → Tokyo',
      provider: 'Air China',
      price: '¥3,280',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Direct flight, 3 hours 20 minutes',
      features: ['Direct', 'Meals', 'Entertainment', 'Refundable']
    },
    {
      id: '2',
      title: 'Shanghai → Osaka',
      provider: 'China Eastern',
      price: '¥2,890',
      rating: 4.3,
      image: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Direct flight, 2 hours 45 minutes',
      features: ['Direct', 'Meals', 'WiFi']
    }
  ];

  const hotelOptions: BookingOption[] = [
    {
      id: '1',
      title: 'Tokyo Palace Hotel',
      provider: 'Palace Hotel Tokyo',
      price: '¥2,800/night',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Luxury hotel near the Imperial Palace',
      features: ['Free WiFi', 'Gym', 'Spa', 'Free Breakfast']
    },
    {
      id: '2',
      title: 'Shinjuku Washington Hotel',
      provider: 'Washington Hotel',
      price: '¥680/night',
      rating: 4.2,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Business hotel with convenient transportation',
      features: ['Free WiFi', 'Business Center', 'Restaurant']
    }
  ];

  const restaurantOptions: BookingOption[] = [
    {
      id: '1',
      title: 'Kyubei Ginza',
      provider: 'Kyubei Ginza',
      price: '¥1,200/person',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Traditional Edo-style sushi, Michelin starred',
      features: ['Michelin Star', 'Traditional Craft', 'Fresh Ingredients', 'Reservation Required']
    },
    {
      id: '2',
      title: 'Asakusa Daikokuya',
      provider: 'Daikokuya',
      price: '¥380/person',
      rating: 4.4,
      image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Century-old restaurant, famous tempura',
      features: ['100+ Years History', 'Tempura Specialty', 'Traditional Taste']
    }
  ];

  const experienceOptions: BookingOption[] = [
    {
      id: '1',
      title: 'Tea Ceremony Experience',
      provider: 'Tokyo Tea Ceremony',
      price: '¥450/person',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/3532543/pexels-photo-3532543.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Traditional Japanese tea ceremony course',
      features: ['Professional Guidance', 'Traditional Utensils', 'Matcha Tasting', 'English Service']
    },
    {
      id: '2',
      title: 'Sumo Watching',
      provider: 'Sumo Experience',
      price: '¥800/person',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Watch sumo matches and learn about Japanese culture',
      features: ['Professional Commentary', 'Close-up Viewing', 'Cultural Experience']
    }
  ];

  const getCurrentOptions = () => {
    switch (activeTab) {
      case 'flight': return flightOptions;
      case 'hotel': return hotelOptions;
      case 'restaurant': return restaurantOptions;
      case 'experience': return experienceOptions;
      default: return flightOptions;
    }
  };

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'flight':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
              <input type="text" placeholder="Beijing" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input type="text" placeholder="Tokyo" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>1 Passenger</option>
                <option>2 Passengers</option>
                <option>3 Passengers</option>
                <option>4 Passengers</option>
              </select>
            </div>
          </div>
        );
      case 'hotel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input type="text" placeholder="Tokyo" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>1 Room</option>
                <option>2 Rooms</option>
                <option>3 Rooms</option>
              </select>
            </div>
          </div>
        );
      case 'restaurant':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" placeholder="Tokyo" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>2 People</option>
                <option>4 People</option>
                <option>6 People</option>
                <option>8 People</option>
              </select>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" placeholder="Tokyo" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>1 Person</option>
                <option>2 People</option>
                <option>4 People</option>
                <option>6 People</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">One-Stop Booking</h1>
        <p className="text-gray-600">Book flights, hotels, restaurants and experiences for simpler travel</p>
      </div>

      {/* Booking Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-0">
            {bookingTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6">
          {renderSearchForm()}
          <div className="mt-4 flex justify-end">
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {getCurrentOptions().map((option) => (
          <div key={option.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/4 h-48 md:h-auto relative">
              <img src={option.image} alt={option.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.provider}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">{option.price}</div>
                  <div className="flex items-center justify-end">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">{option.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{option.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {option.features.map((feature, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};