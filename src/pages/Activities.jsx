// Activities.jsx - Activities hub for ATLASassist
// UPDATED: EmotionMatch removed (only in Games hub)
// UPDATED: Apps sorted alphabetically by name
// UPDATED: Animated background
// ADDED: Description banner at top

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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md hover:scale-105"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display crayon-text flex items-center gap-2 text-[#4A9FD4]">
              <Sparkles size={24} />
              Activities & Learning
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#4A9FD4] to-[#3B82F6] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={24} />
            <h2 className="text-lg font-display">Activities & Learning</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Fun activities to learn and explore! Create stories, practice words, 
            capture memories, and earn rewards.
          </p>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-gray-200 rounded"></div>
          <span className="font-crayon text-gray-400 text-sm">Choose an Activity</span>
          <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-gray-200 rounded"></div>
        </div>

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