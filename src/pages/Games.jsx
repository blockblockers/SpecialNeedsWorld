// Games.jsx - Games Hub
// FIXED: All game routes match App.jsx
// FIXED: Consistent button style matching other hubs

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Gamepad2,
  Puzzle,
  Palette,
  Shapes,
  Music,
  Grid3X3,
  Heart,
  Sparkles
} from 'lucide-react';

// Games list with FIXED routes
const games = [
  {
    id: 'matching',
    name: 'Matching Game',
    description: 'Find the matching pairs!',
    icon: Grid3X3,
    color: '#4A9FD4',
    emoji: '🃏',
    path: '/games/matching',
  },
  {
    id: 'emotion-match',
    name: 'Emotion Match',
    description: 'Match feelings to faces!',
    icon: Heart,
    color: '#E86B9A',
    emoji: '😊',
    path: '/games/emotion-match',
  },
  {
    id: 'bubble-pop',
    name: 'Pop Bubbles',
    description: 'Pop the colorful bubbles!',
    icon: Sparkles,
    color: '#8E6BBF',
    emoji: '🫧',
    path: '/games/bubble-pop',
  },
  {
    id: 'color-sort',
    name: 'Color Sort',
    description: 'Sort items by color!',
    icon: Palette,
    color: '#F5A623',
    emoji: '🎨',
    path: '/games/color-sort',
  },
  {
    id: 'shape-match',
    name: 'Shape Match',
    description: 'Match the shapes!',
    icon: Shapes,
    color: '#5CB85C',
    emoji: '🔷',
    path: '/games/shape-match',
  },
  {
    id: 'puzzles',
    name: 'Simple Puzzles',
    description: 'Put pieces together!',
    icon: Puzzle,
    color: '#20B2AA',
    emoji: '🧩',
    path: '/games/puzzles',
  },
  {
    id: 'patterns',
    name: 'Pattern Sequence',
    description: 'Complete the pattern!',
    icon: Music,
    color: '#E63B2E',
    emoji: '🔢',
    path: '/games/patterns',
  },
];

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
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
          <h1 className="text-xl sm:text-2xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
            <Gamepad2 size={24} />
            Games
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun games to play and learn!
        </p>

        {/* Games Grid - Consistent button style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => navigate(game.path)}
                className="p-4 rounded-2xl border-4 text-center
                         transition-all duration-200 shadow-crayon
                         hover:scale-105 hover:-rotate-1 active:scale-95"
                style={{
                  backgroundColor: `${game.color}15`,
                  borderColor: game.color,
                }}
              >
                {/* Emoji - centered */}
                <div className="text-3xl mb-2">{game.emoji}</div>

                {/* Icon - centered */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={28} style={{ color: game.color }} />
                </div>

                {/* Name - centered */}
                <h3 className="font-display text-base" style={{ color: game.color }}>
                  {game.name}
                </h3>

                {/* Description - centered */}
                <p className="text-xs text-gray-500 font-crayon mt-1">
                  {game.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Fun Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#F8D14A] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            🌟 Great job playing games! Games help us learn and have fun!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Games;
