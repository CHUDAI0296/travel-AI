import React, { useState } from 'react';
import { Star, Heart, MapPin, Clock, Filter, Search } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  type: 'destination' | 'hotel' | 'restaurant' | 'activity';
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
}

export const Recommendations: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Tokyo Tower',
      type: 'destination',
      location: 'Tokyo, Japan',
      rating: 4.5,
      reviews: 15420,
      price: '$12',
      image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Iconic landmark offering 360-degree views of the city',
      tags: ['Sightseeing', 'Landmark', 'Night View'],
      isFavorite: false
    },
    {
      id: '2',
      title: 'Senso-ji Temple',
      type: 'destination',
      location: 'Tokyo, Japan',
      rating: 4.3,
      reviews: 8932,
      price: 'Free',
      image: 'https://images.pexels.com/photos/3532557/pexels-photo-3532557.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tokyo\'s oldest temple, experience traditional Japanese culture',
      tags: ['Historical', 'Cultural', 'Temple'],
      isFavorite: false
    },
    {
      id: '3',
      title: 'Park Hyatt Tokyo',
      type: 'hotel',
      location: 'Shinjuku, Tokyo',
      rating: 4.7,
      reviews: 2156,
      price: '$250/night',
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Luxury hotel in the heart of Shinjuku with convenient transportation',
      tags: ['Luxury', 'Business', 'Convenient'],
      isFavorite: false
    },
    {
      id: '4',
      title: 'Tsukiji Outer Market',
      type: 'restaurant',
      location: 'Tsukiji, Tokyo',
      rating: 4.6,
      reviews: 3421,
      price: '$15-50',
      image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Paradise for fresh seafood and sushi',
      tags: ['Seafood', 'Sushi', 'Traditional'],
      isFavorite: false
    },
    {
      id: '5',
      title: 'Tokyo Disneyland',
      type: 'activity',
      location: 'Urayasu, Chiba',
      rating: 4.8,
      reviews: 25680,
      price: '$70',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Magic Kingdom, a dream experience for the whole family',
      tags: ['Theme Park', 'Family', 'Entertainment'],
      isFavorite: false
    },
    {
      id: '6',
      title: 'Arashiyama Bamboo Grove',
      type: 'destination',
      location: 'Kyoto, Japan',
      rating: 4.4,
      reviews: 6789,
      price: 'Free',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Sagano Bamboo Forest, a perfect blend of nature and tranquility',
      tags: ['Nature', 'Photography', 'Hiking'],
      isFavorite: false
    }
  ];

  const types = [
    { id: 'all', label: 'All', count: recommendations.length },
    { id: 'destination', label: 'Attractions', count: recommendations.filter(r => r.type === 'destination').length },
    { id: 'hotel', label: 'Hotels', count: recommendations.filter(r => r.type === 'hotel').length },
    { id: 'restaurant', label: 'Restaurants', count: recommendations.filter(r => r.type === 'restaurant').length },
    { id: 'activity', label: 'Activities', count: recommendations.filter(r => r.type === 'activity').length }
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesType = selectedType === 'all' || rec.type === selectedType;
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'destination': return 'bg-teal-100 text-teal-800';
      case 'hotel': return 'bg-teal-100 text-teal-800';
      case 'restaurant': return 'bg-teal-100 text-teal-800';
      case 'activity': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Recommendations</h1>
        <p className="text-gray-600">Discover the best travel experiences for your next adventure</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search attractions, hotels, restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label} ({type.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={rec.image}
                alt={rec.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleFavorite(rec.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites.has(rec.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className={`${getTypeColor(rec.type)} px-2 py-1 rounded-md text-xs font-medium`}>
                  {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{rec.title}</h3>
              
              <div className="flex items-center space-x-1 mb-2">
                <MapPin className="h-3 w-3 text-gray-500" />
                <span className="text-sm text-gray-600">{rec.location}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{rec.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">{rec.reviews.toLocaleString()} reviews</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm font-medium text-teal-600">{rec.price}</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{rec.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {rec.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
          <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};