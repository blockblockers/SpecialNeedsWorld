// Activities.jsx - Activities hub for Special Needs World
// Contains creative and learning activities

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

// Activity apps
const activityApps = [
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Create visual stories to help understand situations',
    icon: BookOpen,
    color: '#8E6BBF',
    emoji: '📖',
    path: '/activities/social-stories',
    ready: true,
  },
  {
    id: 'pronunciation',
    name: 'Say It Right',
    description: 'Practice pronouncing words with pictures',
    icon: Mic,
    color: '#5CB85C',
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
    color: '#4A9FD4',
    emoji: '🎵',
    path: '/activities/music',
    ready: false,
  },
  {
    id: 'puzzles',
    name: 'Puzzles',
    description: 'Simple puzzles and matching games',
    icon: Puzzle,
    color: '#F5A623',
    emoji: '🧩',
    path: '/activities/puzzles',
    ready: false,
  },
  {
    id: 'photo-journal',
    name: 'Photo Journal',
    description: 'Capture and share special moments',
    icon: Camera,
    color: '#E86B9A',
    emoji: '📸',
    path: '/activities/photo-journal',
    ready: false,
  },
  {
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars for achievements',
    icon: Star,
    color: '#F8D14A',
    emoji: '⭐',
    path: '/activities/rewards',
    ready: false,
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
            alt="Special Needs World" 
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
          {activityApps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => app.ready ? navigate(app.path) : null}
                disabled={!app.ready}
                className={`
                  p-6 rounded-2xl border-4 text-left
                  transition-all transform
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
                    {!app.ready && (
                      <span className="inline-block mt-2 px-2 py-1 bg-white/30 rounded-full text-xs font-crayon text-white">
                        Coming Soon
                      </span>
                    )}
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
