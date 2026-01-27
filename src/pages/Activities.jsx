// Activities.jsx - Activities hub for ATLASassist
// UPDATED: EmotionMatch removed (only in Games hub)
// UPDATED: Apps sorted alphabetically by name
// UPDATED: Animated background

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Activity apps - SORTED ALPHABETICALLY (EmotionMatch removed - only in Games)
const activityApps = [
  {
    id: 'choice-board',
    name: 'Choice Board',
    description: 'Make choices with pictures',
    color: '#F5A623',
    emoji: '⭐',
    path: '/activities/choice-board',
    ready: true,
  },
  {
    id: 'coloring',
    name: 'Coloring Book',
    description: 'Fun coloring pages',
    color: '#E63B2E',
    emoji: '🎨',
    path: '/activities/coloring',
    ready: true,
  },
  {
    id: 'music',
    name: 'Music & Sounds',
    description: 'Calming music and sounds',
    color: '#87CEEB',
    emoji: '🎵',
    path: '/activities/music',
    ready: true,
  },
  {
    id: 'photo-journal',
    name: 'Photo Journal',
    description: 'Capture special moments',
    color: '#20B2AA',
    emoji: '📸',
    path: '/activities/photo-journal',
    ready: true,
  },
  {
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars for achievements',
    color: '#DAA520',
    emoji: '🏆',
    path: '/activities/rewards',
    ready: true,
  },
  {
    id: 'pronunciation',
    name: 'Say It Right',
    description: 'Practice pronouncing words',
    color: '#4A9FD4',
    emoji: '🗣️',
    path: '/activities/pronunciation',
    ready: true,
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Calming activities with timers',
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/activities/sensory-breaks',
    ready: true,
  },
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Visual stories for situations',
    color: '#5CB85C',
    emoji: '📖',
    path: '/activities/social-stories',
    ready: true,
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Activities = () => {
  const navigate = useNavigate();

  const handleAppClick = (app) => {
    if (app.ready) {
      navigate(app.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative">
      {/* Animated Background */}
      <AnimatedBackground intensity="light" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#E86B9A] 
                       rounded-xl font-display text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-lg font-display text-[#E86B9A] flex items-center gap-2">
            <Sparkles size={24} />
            Activities
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun activities to learn and explore!
        </p>

        {/* App Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {activityApps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              disabled={!app.ready}
              className={`relative p-4 rounded-2xl border-4 transition-all hover:scale-105 
                ${app.ready 
                  ? 'bg-white shadow-crayon hover:shadow-lg cursor-pointer' 
                  : 'bg-gray-100 opacity-60 cursor-not-allowed'
                }`}
              style={{ 
                borderColor: app.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Emoji Icon */}
              <div 
                className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${app.color}20` }}
              >
                {app.emoji}
              </div>
              
              {/* Name */}
              <p 
                className="font-display text-sm text-center mb-1"
                style={{ color: app.color }}
              >
                {app.name}
              </p>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 text-center">
                {app.description}
              </p>
              
              {/* Coming Soon Badge */}
              {!app.ready && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white text-xs rounded-full font-crayon">
                  Soon
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Activities;
