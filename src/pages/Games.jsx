// Games.jsx - Games hub for fun learning games
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles,
  Grid3X3,
  Smile,
  Circle,
  Shapes,
  Music,
  Puzzle
} from 'lucide-react';

// Game items
const games = [
  {
    id: 'matching',
    name: 'Matching Game',
    description: 'Find the matching pairs!',
    icon: Grid3X3,
    color: 'bg-[#E63B2E]',
    borderColor: 'border-red-600',
    path: '/games/matching',
    emoji: '🎴',
    ready: true,
  },
  {
    id: 'emotions',
    name: 'Emotion Match',
    description: 'Match faces to feelings!',
    icon: Smile,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-500',
    path: '/games/emotions',
    emoji: '😊',
    ready: true,
  },
  {
    id: 'bubbles',
    name: 'Pop Bubbles',
    description: 'Pop the bubbles!',
    icon: Circle,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/games/bubbles',
    emoji: '🫧',
    ready: true,
  },
  {
    id: 'sorting',
    name: 'Color Sort',
    description: 'Sort by colors!',
    icon: Shapes,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-500',
    path: '/games/sorting',
    emoji: '🔴',
    ready: true,
  },
  {
    id: 'sounds',
    name: 'Sound Match',
    description: 'Match the sounds!',
    icon: Music,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-500',
    path: '/games/sounds',
    emoji: '🎵',
    ready: true,
  },
  {
    id: 'puzzles',
    name: 'Simple Puzzles',
    description: 'Put pieces together!',
    icon: Puzzle,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-500',
    path: '/games/puzzles',
    emoji: '🧩',
    ready: true,
  },
];

const Games = () => {
  const navigate = useNavigate();

  const handleGameClick = (game) => {
    if (game.ready) {
      navigate(game.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
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
            alt="Special Needs World" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
              🎮 Games
            </h1>
          </div>
          <Sparkles className="text-[#F8D14A] w-6 h-6 animate-pulse" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun games to play! Tap a game to start.
        </p>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => handleGameClick(game)}
                disabled={!game.ready}
                className={`
                  relative p-4 rounded-2xl border-4 ${game.borderColor}
                  ${game.color} text-white
                  transition-all duration-200 shadow-crayon
                  ${game.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed grayscale-[30%]'
                  }
                `}
                style={{
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Coming Soon Badge */}
                {!game.ready && (
                  <div className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full font-crayon">
                    Soon!
                  </div>
                )}

                {/* Emoji */}
                <div className="text-3xl mb-2">{game.emoji}</div>

                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={32} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-lg crayon-text">
                  {game.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-90 font-crayon mt-1">
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
