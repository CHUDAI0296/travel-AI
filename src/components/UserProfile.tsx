import React, { useState } from 'react';
import { User, Heart, Calendar, MapPin, Settings, Share2, Camera, Edit, Plus } from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'completed' | 'upcoming' | 'draft';
  image: string;
}

interface Favorite {
  id: string;
  title: string;
  type: string;
  location: string;
  image: string;
}

export const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trips' | 'favorites' | 'settings'>('trips');

  const trips: Trip[] = [
    {
      id: '1',
      title: 'Tokyo Cherry Blossom Tour',
      location: 'Tokyo, Japan',
      date: '2024-03-15',
      status: 'upcoming',
      image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Bali Vacation',
      location: 'Bali, Indonesia',
      date: '2024-01-20',
      status: 'completed',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'European Cultural Tour',
      location: 'Paris, France',
      date: '2024-06-10',
      status: 'draft',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const favorites: Favorite[] = [
    {
      id: '1',
      title: 'Tokyo Tower',
      type: 'Attraction',
      location: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Park Hyatt Tokyo',
      type: 'Hotel',
      location: 'Shinjuku, Tokyo',
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Ginza Kyubey',
      type: 'Restaurant',
      location: 'Ginza, Tokyo',
      image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'upcoming': return 'Upcoming';
      case 'draft': return 'Draft';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-teal-500 rounded-t-lg"></div>
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zhang Xiaoming</h1>
              <p className="text-gray-600">Travel Enthusiast • World Explorer</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Visited 12 countries</span>
                <span>Completed 25 trips</span>
                <span>Saved 48 places</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-0">
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'trips'
                  ? 'text-teal-600 border-b-2 border-teal-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>My Trips</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'favorites'
                  ? 'text-teal-600 border-b-2 border-teal-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>My Favorites</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'text-teal-600 border-b-2 border-teal-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'trips' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Trips</h2>
                <button className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Create New Trip</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{trip.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(trip.date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Favorites</h2>
                <p className="text-gray-600">{favorites.length} items</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={favorite.image}
                      alt={favorite.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{favorite.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {favorite.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{favorite.location}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value="Zhang Xiaoming" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value="zhang@example.com" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        value="+1 234 567 8901" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        value="Beijing, China" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive email updates about your trips</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform transform translate-x-6"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Currency</h4>
                        <p className="text-sm text-gray-600">Your preferred currency for prices</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>CNY</option>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>JPY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};