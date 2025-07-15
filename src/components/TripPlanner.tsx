import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, MapPin, Clock, Plus, Edit, Share2, Save, ChevronRight, CreditCard, Copy, Trash2, Send, Mic, ChevronDown } from 'lucide-react';
import { AIChat } from './AIChat';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library for default icon

interface TripDay {
  date: string;
  activities: Activity[];
  location?: string; // 添加城市位置字段
}

interface Activity {
  id: string;
  title: string;
  location: string;
  time: string;
  type: 'transport' | 'attraction' | 'restaurant' | 'hotel' | 'activity';
  description: string;
  duration: string;
  lat?: number;
  lng?: number;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const initialMapCenter = {
  lat: 35.6895,
  lng: 139.6917
};

export const TripPlanner: React.FC = () => {
  // 语言设置
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  
  const [destination, setDestination] = useState('Japan');
  const [tripTitle, setTripTitle] = useState(`6-Day Romantic Luxury Wellness & Adventure in ${destination}`);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTripTitle, setEditableTripTitle] = useState(tripTitle);
  const [tripDays, setTripDays] = useState<TripDay[]>([
    {
      date: '2024-10-01',
      location: 'Kyoto',
      activities: [
        {
          id: '1',
          title: 'Arrive at Kyoto',
          location: 'Kyoto Station',
          time: '14:00',
          type: 'transport',
          description: 'Arrival by Shinkansen from Tokyo',
          duration: '2 hours'
        },
        {
          id: '2',
          title: 'Check-in at Luxury Ryokan',
          location: 'Gion District',
          time: '16:00',
          type: 'hotel',
          description: 'Traditional Japanese inn with hot springs',
          duration: '1 hour'
        },
        {
          id: '3',
          title: 'Dinner at Michelin Star Restaurant',
          location: 'Pontocho Alley',
          time: '19:00',
          type: 'restaurant',
          description: 'Kaiseki multi-course dining experience',
          duration: '2 hours'
        }
      ]
    },
    {
      date: '2024-10-02',
      location: 'Kyoto',
      activities: [
        {
          id: '4',
          title: 'Visit Kinkaku-ji (Golden Pavilion)',
          location: 'Kinkaku-ji Temple',
          time: '09:00',
          type: 'attraction',
          description: 'Zen Buddhist temple with golden exterior',
          duration: '1.5 hours'
        },
        {
          id: '5',
          title: 'Arashiyama Bamboo Grove',
          location: 'Arashiyama',
          time: '14:00',
          type: 'activity',
          description: 'Walk through the iconic bamboo forest',
          duration: '2 hours'
        }
      ]
    },
    {
      date: '2024-10-03',
      location: 'Hakone',
      activities: [
        {
          id: '6',
          title: 'Travel to Hakone',
          location: 'Hakone',
          time: '10:00',
          type: 'transport',
          description: 'Scenic train ride to Hakone',
          duration: '3 hours'
        }
      ]
    }
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Now that we have your trip, how about we modify and reserve it. I can help you tailor your trip, update your preferences and add or remove things.',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'ai',
      content: 'I can help you modify your trip! What would you like to change?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editableActivity, setEditableActivity] = useState<Activity | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const activityInputRefs = useRef<Record<string, HTMLInputElement>>({});

  // No need for GOOGLE_MAPS_API_KEY and useJsApiLoader
  // const GOOGLE_MAPS_API_KEY = 'AIzaSyAUW3N3qJir-Iw9295rkpCAHUjupqevjDY'; // Replace with your actual API key
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  // });

  // const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // No need for onLoad and onUnmount with react-leaflet (MapContainer handles it)

  // 多语言文本
  const translations = {
    en: {
      yourAdventure: `Your ${destination} Adventure`,
      experienceBeauty: `Experience the beauty of ${destination} with ChurAI`,
      itinerary: 'Itinerary',
      bookings: 'Bookings',
      budget: 'Budget',
      addActivity: 'Add activity',
      tripMap: 'Trip Map',
      viewFullMap: 'View Full Map',
      modifyRoute: 'Modify Route',
      assistant: 'ChurAI Assistant',
      askAnything: 'Ask anything...',
      scrollDown: 'Scroll down',
      travelers: '2 travelers',
      copySuccess: 'Copied!',
      email: 'Email',
      whatsapp: 'WhatsApp',
      wechat: 'WeChat',
      enterDestination: 'Enter new destination:',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      activityTitle: 'Activity Title',
      location: 'Location',
      time: 'Time',
      duration: 'Duration',
      description: 'Description',
      type: 'Type',
    },
    zh: {
      yourAdventure: `您的${destination}之旅`,
      experienceBeauty: `与ChurAI一起体验${destination}的美丽`,
      itinerary: '行程',
      bookings: '预订',
      budget: '预算',
      addActivity: '添加活动',
      tripMap: '行程地图',
      viewFullMap: '查看完整地图',
      modifyRoute: '修改路线',
      assistant: 'ChurAI助手',
      askAnything: '问我任何问题...',
      scrollDown: '向下滚动',
      travelers: '2位旅客',
      copySuccess: '已复制!',
      email: '电子邮件',
      whatsapp: 'WhatsApp',
      wechat: '微信',
      enterDestination: '输入新的目的地:',
      edit: '编辑',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      activityTitle: '活动标题',
      location: '地点',
      time: '时间',
      duration: '时长',
      description: '描述',
      type: '类型',
    }
  };

  // 获取当前语言的文本
  const t = translations[language];

  // Update trip title when destination changes
  useEffect(() => {
    if (language === 'en') {
      setTripTitle(`6-Day Romantic Luxury Wellness & Adventure in ${destination}`);
      setEditableTripTitle(`6-Day Romantic Luxury Wellness & Adventure in ${destination}`);
    } else {
      setTripTitle(`6天${destination}浪漫豪华康养冒险之旅`);
      setEditableTripTitle(`6天${destination}浪漫豪华康养冒险之旅`);
    }
  }, [destination, language]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setScrollPosition(window.scrollY);
        
        if (window.scrollY > 100) {
          setShowScrollIndicator(false);
        } else {
          setShowScrollIndicator(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add animation classes to elements when they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 } // Increased threshold for better visibility
    );
    
    // Observe all activity cards
    document.querySelectorAll('.activity-card').forEach((el) => {
      observer.observe(el);
    });
    
    // Observe map and chat containers
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const scrollToContent = () => {
    if (itineraryRef.current) {
      itineraryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I can help you modify your trip! What would you like to change?',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'transport': return '✈️';
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'activity': return '🎯';
      default: return '📍';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'transport': return 'bg-teal-100 text-teal-800';
      case 'attraction': return 'bg-teal-100 text-teal-800';
      case 'restaurant': return 'bg-teal-100 text-teal-800';
      case 'hotel': return 'bg-teal-100 text-teal-800';
      case 'activity': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const aiCommands = [
    "Modify trip",
    "Make it cheaper",
    "Find me flights"
  ];

  const handleDestinationChange = (newDestination: string) => {
    setDestination(newDestination);
    
    // 更新行程中的地点名称，如果目的地是一个国家，可能需要更具体的逻辑
    // 这里只是一个简单示例
    if (newDestination !== destination) {
      // 可以根据需要更新行程中的具体地点
      // 例如，如果从日本改为法国，可能需要将京都改为巴黎等
      console.log(`Destination changed from ${destination} to ${newDestination}`);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 100);
  };

  const handleTitleSave = () => {
    setTripTitle(editableTripTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  };

  const handleCopyItinerary = () => {
    const itineraryText = `${tripTitle}\n\nDates: Oct 1 - 7, 2024\nDestination: ${destination}\nTravelers: 2\n\nItinerary:\n${
      tripDays.map((day, index) => {
        const dayDate = new Date(day.date);
        return `Day ${index + 1} - ${dayDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}\n${
          day.activities.map(act => `${act.time} - ${act.title} at ${act.location} (${act.duration})`).join('\n')
        }`;
      }).join('\n\n')
    }`;
    
    navigator.clipboard.writeText(itineraryText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleShareItinerary = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setEditableActivity({ ...activity });
  };

  const handleSaveActivity = (dayIndex: number, activityId: string) => {
    if (!editableActivity) return;

    setTripDays(prevTripDays =>
      prevTripDays.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              activities: day.activities.map(act =>
                act.id === activityId ? editableActivity : act
              ),
            }
          : day
      )
    );
    setEditingActivityId(null);
    setEditableActivity(null);
  };

  const handleCancelEdit = () => {
    setEditingActivityId(null);
    setEditableActivity(null);
  };

  const handleActivityInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableActivity(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    setTripDays(prevTripDays =>
      prevTripDays.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              activities: day.activities.filter(act => act.id !== activityId),
            }
          : day
      )
    );
  };

  const handleAddActivity = (dayIndex: number) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: language === 'en' ? 'New Activity' : '新活动',
      location: '',
      time: '',
      type: 'activity',
      description: '',
      duration: '',
    };

    setTripDays(prevTripDays =>
      prevTripDays.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              activities: [...day.activities, newActivity],
            }
          : day
      )
    );
    setEditingActivityId(newActivity.id); // 自动进入编辑模式
    setEditableActivity(newActivity);
  };

  return (
    <div ref={contentRef} className="flex flex-col h-full">
      {/* Language Toggle */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-2 right-2 z-10 bg-white/80 px-2 py-1 rounded-md text-xs hover:bg-white transition-colors"
      >
        {language === 'en' ? '中文' : 'English'}
      </button>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer animate-bounce"
          onClick={scrollToContent}
        >
          <div className="bg-white p-2 rounded-full shadow-lg flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">{t.scrollDown}</span>
            <ChevronDown className="h-5 w-5 text-teal-500" />
          </div>
        </div>
      )}
      
      {/* Parallax Header */}
      <div 
        className="w-full h-40 bg-gradient-to-r from-teal-500 to-teal-400 mb-6 relative overflow-hidden"
        style={{ 
          transform: `translateY(${scrollPosition * 0.3}px)`,
          opacity: 1 - scrollPosition / 500
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative">
          <h1 className="text-white text-3xl font-bold mb-2">{t.yourAdventure}</h1>
          <p className="text-white text-opacity-90">{t.experienceBeauty}</p>
        </div>
      </div>
      
      <div ref={itineraryRef} className="flex h-full gap-3 px-3 transition-all duration-500">
        {/* Left Content - Itinerary */}
        <div className="w-full lg:w-1/3 overflow-y-auto opacity-0 animate-slideIn" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
                <div className="flex-1">
                  {isEditingTitle ? (
                    <div className="flex items-center">
              <input
                        ref={titleInputRef}
                type="text"
                        value={editableTripTitle}
                        onChange={(e) => setEditableTripTitle(e.target.value)}
                        onKeyPress={handleTitleKeyPress}
                        onBlur={handleTitleSave}
                        className="text-lg font-bold text-gray-900 w-full border-b border-teal-500 focus:outline-none"
                      />
                      <button 
                        onClick={handleTitleSave}
                        className="ml-2 p-1 text-teal-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center group">
                      <h1 className="text-lg font-bold text-gray-900">{tripTitle}</h1>
                      <button 
                        onClick={handleTitleEdit}
                        className="ml-2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  )}
            </div>
                <div className="flex items-center space-x-1 relative">
                  <button 
                    className={`p-1 text-sm ${copySuccess ? 'text-green-600' : 'text-gray-600 hover:text-teal-600'} hover:scale-110 transition-all`}
                    onClick={handleCopyItinerary}
                    title="Copy itinerary"
                  >
                    <Copy className="h-4 w-4" />
                    {copySuccess && (
                      <span className="absolute -bottom-6 -left-6 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                        {t.copySuccess}
                      </span>
                    )}
              </button>
                  <div className="relative">
                    <button 
                      className="p-1 text-sm text-gray-600 hover:text-teal-600 hover:scale-110 transition-transform"
                      onClick={handleShareItinerary}
                      title="Share itinerary"
                    >
                <Share2 className="h-4 w-4" />
                    </button>
                    {showShareOptions && (
                      <div className="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10">
                        <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors">
                          {t.email}
                        </button>
                        <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors">
                          {t.whatsapp}
                        </button>
                        <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors">
                          {t.wechat}
              </button>
            </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-1 flex items-center space-x-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Oct 1 - 7, 2024</span>
          </div>
            <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span className="cursor-pointer hover:text-teal-600 hover:underline" onClick={() => {
                    const newDestination = prompt(t.enterDestination, destination);
                    if (newDestination) handleDestinationChange(newDestination);
                  }}>
                    {destination}
                  </span>
            </div>
            <div className="flex items-center space-x-1">
                  <CreditCard className="h-3 w-3" />
                  <span>{t.travelers}</span>
            </div>
          </div>
        </div>

            {/* Itinerary Tabs */}
            <div className="flex border-b border-gray-200">
              <button className="flex-1 py-1.5 text-center text-xs font-medium text-teal-600 border-b-2 border-teal-500 hover:bg-teal-50 transition-colors">
                {t.itinerary}
              </button>
              <button className="flex-1 py-1.5 text-center text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                {t.bookings}
              </button>
              <button className="flex-1 py-1.5 text-center text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                {t.budget}
              </button>
            </div>

            {/* Itinerary Content */}
            <div className="p-3 overflow-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="space-y-4">
            {tripDays.map((day, dayIndex) => (
              <div key={dayIndex} className="relative">
                {/* Day Header */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center justify-center w-7 h-7 bg-teal-500 text-white rounded-full text-xs font-medium shadow-sm">
                        {dayIndex + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {day.location || (dayIndex === 0 ? 'Kyoto' : dayIndex === 1 ? 'Kyoto' : 'Hakone')}
                  </div>
                        <div className="text-xs text-gray-600">
                          {new Date(day.date).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'long'
                    })}
                        </div>
                  </div>
                </div>

                {/* Activities */}
                    <div className="space-y-2 ml-3.5">
                  {day.activities.map((activity, actIndex) => (
                        <div 
                          key={activity.id} 
                          className="relative activity-card opacity-0"
                          style={{ animationDelay: `${0.1 + actIndex * 0.1}s`, animationFillMode: 'forwards' }}
                          onMouseEnter={() => setHoveredActivity(activity.id)}
                          onMouseLeave={() => setHoveredActivity(null)}
                        >
                      {/* Timeline line */}
                      {actIndex < day.activities.length - 1 && (
                            <div className="absolute left-3 top-8 w-0.5 h-10 bg-gray-200"></div>
                      )}
                      
                          <div className="flex items-start space-x-2">
                        {/* Time */}
                            <div className="flex flex-col items-center min-w-[32px] pt-1">
                              <div className="text-xs font-medium text-gray-900">{activity.time}</div>
                              <div className={`w-1.5 h-1.5 bg-teal-500 rounded-full mt-1 ${hoveredActivity === activity.id ? 'animate-pulse' : ''}`}></div>
                        </div>

                        {/* Activity Card */}
                            {editingActivityId === activity.id && editableActivity ? (
                              <div className="flex-1 bg-white rounded-lg p-2 border border-teal-200 shadow-md">
                                <div className="space-y-1">
                                  <div>
                                    <label htmlFor={`title-${activity.id}`} className="block text-xxs font-medium text-gray-500">{t.activityTitle}</label>
                                    <input
                                      type="text"
                                      id={`title-${activity.id}`}
                                      name="title"
                                      value={editableActivity.title}
                                      onChange={handleActivityInputChange}
                                      className="w-full text-sm font-medium text-gray-900 border-b border-gray-200 focus:outline-none focus:border-teal-500"
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                            <div className="flex-1">
                                      <label htmlFor={`location-${activity.id}`} className="block text-xxs font-medium text-gray-500">{t.location}</label>
                                      <input
                                        type="text"
                                        id={`location-${activity.id}`}
                                        name="location"
                                        value={editableActivity.location}
                                        onChange={handleActivityInputChange}
                                        className="w-full text-xs text-gray-600 border-b border-gray-200 focus:outline-none focus:border-teal-500"
                                      />
                                    </div>
                                    <div className="w-20">
                                      <label htmlFor={`time-${activity.id}`} className="block text-xxs font-medium text-gray-500">{t.time}</label>
                                      <input
                                        type="time"
                                        id={`time-${activity.id}`}
                                        name="time"
                                        value={editableActivity.time}
                                        onChange={handleActivityInputChange}
                                        className="w-full text-xs text-gray-600 border-b border-gray-200 focus:outline-none focus:border-teal-500"
                                      />
                                    </div>
                                    <div className="w-24">
                                      <label htmlFor={`duration-${activity.id}`} className="block text-xxs font-medium text-gray-500">{t.duration}</label>
                                      <input
                                        type="text"
                                        id={`duration-${activity.id}`}
                                        name="duration"
                                        value={editableActivity.duration}
                                        onChange={handleActivityInputChange}
                                        className="w-full text-xs text-gray-600 border-b border-gray-200 focus:outline-none focus:border-teal-500"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label htmlFor={`description-${activity.id}`} className="block text-xxs font-medium text-gray-500">{t.description}</label>
                                    <textarea
                                      id={`description-${activity.id}`}
                                      name="description"
                                      value={editableActivity.description}
                                      onChange={handleActivityInputChange}
                                      rows={2}
                                      className="w-full text-xs text-gray-600 border-b border-gray-200 focus:outline-none focus:border-teal-500 resize-none"
                                    ></textarea>
                                  </div>
                                  <div>
                                    <label htmlFor={`type-${activity.id}`} className="block text-xxs font-medium text-gray-500">{t.type}</label>
                                    <select
                                      id={`type-${activity.id}`}
                                      name="type"
                                      value={editableActivity.type}
                                      onChange={handleActivityInputChange}
                                      className="w-full text-xs text-gray-600 border-b border-gray-200 focus:outline-none focus:border-teal-500 bg-white"
                                    >
                                      <option value="transport">{language === 'en' ? 'Transport' : '交通'}</option>
                                      <option value="attraction">{language === 'en' ? 'Attraction' : '景点'}</option>
                                      <option value="restaurant">{language === 'en' ? 'Restaurant' : '餐厅'}</option>
                                      <option value="hotel">{language === 'en' ? 'Hotel' : '酒店'}</option>
                                      <option value="activity">{language === 'en' ? 'Activity' : '活动'}</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-2">
                                  <button 
                                    onClick={handleCancelEdit}
                                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    {t.cancel}
                                  </button>
                                  <button 
                                    onClick={() => handleSaveActivity(dayIndex, activity.id)}
                                    className="px-2 py-1 text-xs bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                                  >
                                    {t.save}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className={`flex-1 bg-white rounded-lg p-2 border border-gray-200 transition-all duration-300 ${
                                hoveredActivity === activity.id 
                                  ? 'shadow-md border-teal-200 -translate-y-0.5' 
                                  : 'hover:shadow-sm hover:-translate-y-0.5'
                              }`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-1 mb-0.5">
                                      <span className="text-sm">{getActivityIcon(activity.type)}</span>
                                      <h3 className="font-medium text-sm text-gray-900">{activity.title}</h3>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                      <div className="flex items-center space-x-0.5">
                                  <MapPin className="h-3 w-3" />
                                  <span>{activity.location}</span>
                                </div>
                                      <div className="flex items-center space-x-0.5">
                                  <Clock className="h-3 w-3" />
                                  <span>{activity.duration}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`flex space-x-1 ${hoveredActivity === activity.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                                    <button 
                                      onClick={() => handleEditActivity(activity)}
                                      className="text-gray-400 hover:text-teal-600 p-0.5 hover:bg-teal-50 rounded transition-colors"
                                      title={t.edit}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteActivity(dayIndex, activity.id)}
                                      className="text-gray-400 hover:text-red-600 p-0.5 hover:bg-red-50 rounded transition-colors"
                                      title={t.delete}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Activity Button */}
                      <button onClick={() => handleAddActivity(dayIndex)} className="flex items-center space-x-1 text-teal-500 hover:text-teal-600 ml-8 text-xs group transition-transform hover:translate-x-0.5">
                        <Plus className="h-3 w-3 group-hover:scale-110 transition-transform" />
                        <span>{t.addActivity}</span>
                  </button>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Content - Map */}
        <div className="hidden lg:block lg:w-1/3 opacity-0 animate-on-scroll animate-slideIn" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="bg-white rounded-lg border border-gray-200 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-sm text-gray-900">{t.tripMap}</h2>
              <div className="flex space-x-2">
                <button className="text-xs text-teal-500 hover:text-teal-600 hover:underline transition-all">{t.viewFullMap}</button>
              </div>
            </div>
            <div className="h-[calc(100%-43px)] bg-gray-100 relative">
              <MapContainer 
                center={userLocation || initialMapCenter}
                zoom={10}
                scrollWheelZoom={false}
                style={ { height: '100%', width: '100%' } }
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Markers for trip activities */}
                {tripDays.flatMap(day => 
                  day.activities.map(activity => (
                    activity.lat && activity.lng ? (
                      <Marker
                        key={activity.id}
                        position={{ lat: activity.lat, lng: activity.lng }}
                      >
                        <Popup>{activity.title}</Popup>
                      </Marker>
                    ) : null
                  ))
                )}

                {/* Marker for user's current location */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                  >
                    <Popup>{language === 'en' ? 'Your Location' : '您的位置'}</Popup>
                  </Marker>
                )}
              </MapContainer>
              <button className="absolute bottom-3 right-3 bg-white rounded-lg shadow-md px-3 py-1 text-xs font-medium text-gray-700 hover:shadow-lg hover:bg-gray-50 transition-all">
                {t.modifyRoute}
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - AI Chat */}
        <div className="hidden lg:block lg:w-1/3 opacity-0 animate-on-scroll animate-slideIn" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-3 border-b border-gray-200">
              <h2 className="font-semibold text-sm text-gray-900">{t.assistant}</h2>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {/* Pass userLocation to AIChat component */}
              <AIChat isCompact={true} userLocation={userLocation} />
            </div>
            
            {/* No need for Common AI commands and Input section here, as they are now part of AIChat */}
          </div>
        </div>
      </div>
    </div>
  );
};