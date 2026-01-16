// Activities.jsx - Activities hub for ATLASassist
// UPDATED: Added Music & Sounds, Photo Journal, Reward Chart
// REMOVED: Puzzles per user request

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

// Activity apps - All working apps
const activityApps = [
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Calming activities with timers and tracking',
    icon: Sparkles,
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/activities/sensory-breaks',
    ready: true,
  },
  {
    id: 'choice-board',
    name: 'Choice Board',
    description: 'Make choices with pictures and add to schedule',
    icon: Star,
    color: '#F5A623',
    emoji: '⭐',
    path: '/activities/choice-board',
    ready: true,
  },
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Create visual stories to help understand situations',
    icon: BookOpen,
    color: '#5CB85C',
    emoji: '📖',
    path: '/activities/social-stories',
    ready: true,
  },
  {
    id: 'pronunciation',
    name: 'Say It Right',
    description: 'Practice pronouncing words with pictures',
    icon: Mic,
    color: '#4A9FD4',
    emoji: '🗣️',
    path: '/activities/pronunciation',
    ready: true,
  },
  {
    id: 'coloring',
    name: 'Coloring Book',
    description: 'Fun coloring pages to enjoy',
    icon: Palette,
    color: '#E63B2E',
    emoji: '🎨',
    path: '/activities/coloring',
    ready: true,
  },
  // NEW APPS
  {
    id: 'music',
    name: 'Music & Sounds',
    description: 'Calming music and fun sounds',
    icon: Music,
    color: '#87CEEB',
    emoji: '🎵',
    path: '/activities/music',
    ready: true,
  },
  {
    id: 'photo-journal',
    name: 'Photo Journal',
    description: 'Capture and share special moments',
    icon: Camera,
    color: '#E86B9A',
    emoji: '📸',
    path: '/activities/photo-journal',
    ready: true,
  },
  {
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars for achievements',
    icon: Star,
    color: '#F8D14A',
    emoji: '⭐',
    path: '/activities/rewards',
    ready: true,
  },
  // NOTE: Puzzles removed per user request
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
            🎨 Activities
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun things to do and create!
        </p>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activityApps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="p-6 rounded-2xl border-4 text-left transition-all transform
                       hover:-translate-y-1 hover:shadow-crayon-lg cursor-pointer"
              style={{ 
                backgroundColor: app.color,
                borderColor: app.color,
              }}
            >
              {/* Emoji Badge */}
              <span className="text-4xl mb-3 block">{app.emoji}</span>
              
              {/* Name */}
              <h2 className="text-xl font-display text-white mb-1">
                {app.name}
              </h2>
              
              {/* Description */}
              <p className="text-white/80 font-crayon text-sm">
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
