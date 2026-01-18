// Activities.jsx - Activities & Learning Hub
// FIXED: Button style now matches other hubs (smaller/square, centered)
// Contains: Social Stories, Choice Board, Coloring, Music, Photo Journal, Rewards, etc.

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Palette, 
  Music, 
  Camera,
  Sparkles,
  Star,
  Mic
} from 'lucide-react';

// Activity apps with consistent paths
const activityApps = [
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Visual stories for situations',
    icon: BookOpen,
    color: '#5CB85C',
    emoji: '📖',
    path: '/activities/social-stories',
  },
  {
    id: 'choice-board',
    name: 'Choice Board',
    description: 'Make choices with pictures',
    icon: Star,
    color: '#F5A623',
    emoji: '⭐',
    path: '/activities/choice-board',
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Calming activities with timers',
    icon: Sparkles,
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/activities/sensory-breaks',
  },
  {
    id: 'pronunciation',
    name: 'Say It Right',
    description: 'Practice pronouncing words',
    icon: Mic,
    color: '#4A9FD4',
    emoji: '🗣️',
    path: '/activities/pronunciation',
  },
  {
    id: 'coloring',
    name: 'Coloring Book',
    description: 'Fun coloring pages',
    icon: Palette,
    color: '#E63B2E',
    emoji: '🎨',
    path: '/activities/coloring',
  },
  {
    id: 'music',
    name: 'Music & Sounds',
    description: 'Calming music and fun sounds',
    icon: Music,
    color: '#87CEEB',
    emoji: '🎵',
    path: '/activities/music',
  },
  {
    id: 'photo-journal',
    name: 'Photo Journal',
    description: 'Capture special moments',
    icon: Camera,
    color: '#E86B9A',
    emoji: '📸',
    path: '/activities/photo-journal',
  },
  {
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars for achievements',
    icon: Star,
    color: '#F8D14A',
    emoji: '🏆',
    path: '/activities/rewards',
  },
];

const Activities = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <h1 className="text-xl sm:text-2xl font-display text-[#4A9FD4] crayon-text flex items-center gap-2">
            🎨 Activities & Learning
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun things to do and create!
        </p>

        {/* Activity Grid - FIXED: Now using consistent button style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {activityApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="p-4 rounded-2xl border-4 text-center
                         transition-all duration-200 shadow-crayon
                         hover:scale-105 hover:-rotate-1 active:scale-95"
                style={{
                  backgroundColor: `${app.color}15`,
                  borderColor: app.color,
                }}
              >
                {/* Emoji - centered */}
                <div className="text-3xl mb-2">{app.emoji}</div>

                {/* Icon - centered */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={28} style={{ color: app.color }} />
                </div>

                {/* Name - centered */}
                <h3 className="font-display text-base" style={{ color: app.color }}>
                  {app.name}
                </h3>

                {/* Description - centered */}
                <p className="text-xs text-gray-500 font-crayon mt-1">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#F8D14A] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            🌟 Learning is fun when you're having a good time!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Activities;
