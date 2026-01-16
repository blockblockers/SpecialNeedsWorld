// Activities.jsx - Activities hub for ATLASassist
// Contains creative and learning activities
// FIXED: All items are now ready (no coming soon)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Palette, 
  Music, 
  Puzzle,
  Camera,
  Sparkles,
  Heart,
  Star,
  Mic
} from 'lucide-react';

// Activity apps - ALL READY
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
    id: 'puzzles',
    name: 'Puzzles',
    description: 'Simple puzzles and matching games',
    icon: Puzzle,
    color: '#F5A623',
    emoji: '🧩',
    path: '/games/puzzles',
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
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text flex items-center gap-2">
              🎨 Activities
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun things to do and make! Tap to explore.
        </p>

        {/* Apps List */}
        <div className="space-y-3">
          {activityApps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                disabled={!app.ready}
                className={`
                  w-full p-4 rounded-2xl border-4 text-white
                  transition-all duration-200 shadow-crayon text-left
                  ${app.ready 
                    ? 'hover:-translate-y-1 hover:shadow-crayon-lg cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}
                style={{ 
                  backgroundColor: app.ready ? app.color : '#E5E5E5',
                  borderColor: app.ready ? app.color : '#CCCCCC',
                  borderRadius: index % 2 === 0 
                    ? '255px 15px 225px 15px/15px 225px 15px 255px'
                    : '15px 255px 15px 225px/225px 15px 255px 15px',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <IconComponent size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-white flex items-center gap-2">
                      {app.emoji} {app.name}
                    </h3>
                    <p className="font-crayon text-sm text-white/80 mt-1">
                      {app.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-[#8E6BBF]/10 rounded-2xl border-3 border-[#8E6BBF]/30">
          <div className="flex items-start gap-3">
            <Sparkles size={24} className="text-[#8E6BBF] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-[#8E6BBF]">About Social Stories</h3>
              <p className="font-crayon text-sm text-gray-600 mt-1">
                Social Stories help explain everyday situations in a simple, visual way. 
                Just type what you'd like a story about, and we'll create a personalized 
                story with pictures to help understand and prepare!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Activities;
