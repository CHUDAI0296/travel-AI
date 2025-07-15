import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  value: string;
}

interface QuizResult {
  travelStyle: string;
  description: string;
  recommendations: string[];
  color: string;
}

export const TravelQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const questions: Question[] = [
    {
      id: 'pace',
      question: 'What travel pace do you prefer?',
      options: [
        { id: '1', text: 'Slow and immersive, deep experiences', value: 'slow' },
        { id: '2', text: 'Efficient and packed, see as much as possible', value: 'fast' },
        { id: '3', text: 'Balanced, with both relaxation and activities', value: 'balanced' }
      ]
    },
    {
      id: 'budget',
      question: 'What is your budget preference?',
      options: [
        { id: '1', text: 'Budget-friendly, value for money', value: 'budget' },
        { id: '2', text: 'Mid-range, comfortable experience', value: 'mid' },
        { id: '3', text: 'Luxury, quality is priority', value: 'luxury' }
      ]
    },
    {
      id: 'accommodation',
      question: 'What type of accommodation do you prefer?',
      options: [
        { id: '1', text: 'Hostels or homestays, local experience', value: 'local' },
        { id: '2', text: 'Business hotels, convenient and comfortable', value: 'business' },
        { id: '3', text: 'Resorts, full-service amenities', value: 'resort' }
      ]
    },
    {
      id: 'activities',
      question: 'What are your favorite travel activities?',
      options: [
        { id: '1', text: 'History and culture, museums and monuments', value: 'culture' },
        { id: '2', text: 'Nature and landscapes, outdoor adventures', value: 'nature' },
        { id: '3', text: 'Food and shopping, urban experiences', value: 'urban' }
      ]
    },
    {
      id: 'planning',
      question: 'What is your travel planning style?',
      options: [
        { id: '1', text: 'Detailed planning, follow the itinerary', value: 'planned' },
        { id: '2', text: 'Framework planning, flexible adjustments', value: 'flexible' },
        { id: '3', text: 'Spontaneous, go with the flow', value: 'spontaneous' }
      ]
    }
  ];

  const travelStyles: Record<string, QuizResult> = {
    'cultural-explorer': {
      travelStyle: 'Cultural Explorer',
      description: 'You love to deeply understand different cultures, enjoy historical sites and museums, and seek meaningful travel experiences.',
      recommendations: ['Historical Sites', 'Museums & Art Galleries', 'Local Cultural Experiences', 'Heritage Destinations'],
      color: 'bg-purple-500'
    },
    'adventure-seeker': {
      travelStyle: 'Adventure Seeker',
      description: 'You enjoy challenges and new experiences, love outdoor activities and natural exploration, and seek exciting travel adventures.',
      recommendations: ['Outdoor Adventures', 'Natural Landscapes', 'Extreme Sports', 'Wilderness Camping'],
      color: 'bg-green-500'
    },
    'luxury-traveler': {
      travelStyle: 'Luxury Traveler',
      description: 'You pursue high-quality travel experiences, value comfort and service, and enjoy refined travel arrangements.',
      recommendations: ['Five-Star Hotels', 'Michelin Restaurants', 'Private Experiences', 'Luxury Resorts'],
      color: 'bg-yellow-500'
    },
    'budget-explorer': {
      travelStyle: 'Budget Explorer',
      description: 'You excel at finding value-for-money travel options, enjoy connecting with locals, and seek authentic travel experiences.',
      recommendations: ['Hostels', 'Local Street Food', 'Public Transportation', 'Free Attractions'],
      color: 'bg-blue-500'
    },
    'balanced-traveler': {
      travelStyle: 'Balanced Traveler',
      description: 'You seek balance in your travels, wanting both comfort and economy, both planning and flexibility.',
      recommendations: ['Mid-Range Hotels', 'Local Restaurants', 'Mixed Transportation', 'Popular Attractions'],
      color: 'bg-indigo-500'
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    // Simple logic to determine travel style
    const { pace, budget, accommodation, activities, planning } = answers;
    
    let styleKey = 'balanced-traveler';
    
    if (budget === 'luxury' && accommodation === 'resort') {
      styleKey = 'luxury-traveler';
    } else if (budget === 'budget' && accommodation === 'local') {
      styleKey = 'budget-explorer';
    } else if (activities === 'culture' && planning === 'planned') {
      styleKey = 'cultural-explorer';
    } else if (activities === 'nature' && pace === 'fast') {
      styleKey = 'adventure-seeker';
    }

    setResult(travelStyles[styleKey]);
    setCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setCompleted(false);
    setResult(null);
  };

  if (completed && result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">Based on your answers, we've analyzed your travel style</p>
          </div>

          <div className={`${result.color} text-white rounded-lg p-6 mb-6`}>
            <h3 className="text-2xl font-bold mb-3">Your Travel Style: {result.travelStyle}</h3>
            <p className="text-lg opacity-90">{result.description}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Recommendations for You:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900">{rec}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={resetQuiz}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retake Quiz
            </button>
            <button className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors">
              View Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Travel Style Quiz</h2>
            <span className="text-sm text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[questions[currentQuestion].id] === option.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[questions[currentQuestion].id] === option.value
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[questions[currentQuestion].id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                currentQuestion === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
            <button
              onClick={nextQuestion}
              disabled={!answers[questions[currentQuestion].id]}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg ${
                answers[questions[currentQuestion].id]
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};