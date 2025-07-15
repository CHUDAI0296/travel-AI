import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MessageCircle } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  isCompact?: boolean;
  userLocation?: { lat: number; lng: number } | null; // Add userLocation prop
}

export const AIChat: React.FC<AIChatProps> = ({ isCompact = false, userLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hey, I\'m ChurAI your personal trip planner\n\nTell me what you want, and I\'ll handle the rest: flights, hotels, itineraries, in seconds.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 用于自动滚动到最新消息
  const chatContainerRef = useRef<HTMLDivElement>(null); // 用于检测滚动以应用动态效果

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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", // Replace with your actual OpenRouter API key
    dangerouslyAllowBrowser: true, // Required for client-side usage
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5173/", // Replace with your actual site URL
      "X-Title": "ChurAI Travel App", // Replace with your actual site name
    },
  });

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

    try {
      let systemMessageContent = 'You are ChurAI, a helpful travel planner AI. Provide concise and useful travel advice.';
      if (userLocation) {
        systemMessageContent += `\nUser's current location: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}. Use this information to provide more relevant suggestions, but do not directly expose the coordinates to the user.`;
      }

      const chatCompletion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-distill-qwen-7b", // 恢复为 DeepSeek R1 Distill Qwen 7B 模型
        messages: [
          { role: "system", content: systemMessageContent },
          ...messages.map(msg => ({ role: msg.type, content: msg.content } as { role: "user" | "assistant", content: string })),
          { role: "user", content: userMessage.content }, // Add the latest user message
        ],
      });

      const aiResponseContent = chatCompletion.choices[0].message.content || "Sorry, I couldn't get a response.";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，我遇到了错误。请稍后重试。',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 滚动时检测并应用动画
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const messageElements = chatContainerRef.current.querySelectorAll('.chat-message-item');
      messageElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
        if (isVisible) {
          el.classList.add('animate-fade-in-up');
        } else {
          el.classList.remove('animate-fade-in-up');
        }
      });
    }
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check for messages already in view
      handleScroll(); 
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const aiCommands = [
    "Find me a budget hotel in Bangkok",
    "What are the best restaurants in Rome?",
    "Create a 3-day itinerary for London",
    "Compare flight prices to Sydney"
  ];

  return (
    <div className={`${isCompact ? 'h-full' : 'max-w-3xl mx-auto py-8'}`}>
      <div className="bg-white h-full flex flex-col">
        {/* Messages */}
        <div 
          ref={chatContainerRef} // 添加 ref
          onScroll={handleScroll} // 添加 onScroll 事件
          className={`flex-1 p-4 space-y-4 ${isCompact ? 'overflow-y-auto' : ''} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex chat-message-item ${ // 添加 class 用于动画
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-[85%] ${
                message.type === 'user' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-800'
              } rounded-2xl p-3 ${isCompact ? 'text-sm' : ''}`}>
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 用于自动滚动 */} 
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Common AI commands */}
        {messages.length < 3 && !isCompact && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Try asking:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {aiCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(command);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-left flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-teal-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{command}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-200">
          <div className="bg-gray-100 rounded-xl p-2 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isCompact ? "Ask ChurAI..." : "Tokyo in 6 days: food, culture & bucket list..."}
              className="flex-1 bg-transparent border-none outline-none px-2 py-1 text-sm"
            />
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <Mic className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};