// FIXED: Updated Choice Board button color from yellow (#F5A623) to dark goldenrod (#B8860B)
// Activities.jsx - Activities hub for ATLASassist
// FIXED: Single icon (emoji only), darker Reward Chart color

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Activity apps - FIXED: Removed icon property from render
const activityApps = [
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
    id: 'choice-board',
    name: 'Choice Board',
    description: 'Make choices with pictures',
    color: '#B8860B',
    emoji: '⭐',
    path: '/activities/choice-board',
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
    color: '#E86B9A',
    emoji: '📸',
    path: '/activities/photo-journal',
    ready: true,
  },
  {
    // FIXED: Darker gold color (#DAA520) instead of light yellow (#F8D14A)
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars for achievements',
    color: '#DAA520',
    emoji: '🏆',
    path: '/activities/rewards',
    ready: true,
  },
];

const Activities = () => {
  const navigate = useNavigate();

  const handleAppClick = (app) => {
    if (app.ready) {
      navigate(app.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text">
              🎨 Activities & Learning
            </h1>
          </div>
          <Sparkles className="text-[#F8D14A] w-6 h-6 animate-pulse" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun activities to create, learn & explore! 🌟
        </p>

        {/* Activities Grid - Updated to match EmotionalWellnessHub style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {activityApps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              disabled={!app.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-center
                transition-all duration-200 shadow-crayon
                ${app.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: app.color + '20',
                borderColor: app.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${app.color}` }}
              >
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Name - dark text */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {app.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {app.description}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Activities;
