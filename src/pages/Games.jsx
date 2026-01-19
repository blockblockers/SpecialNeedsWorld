// Games.jsx - Games hub for ATLASassist
// FIXED: Single icon (emoji only)
// ADDED: Sound Match game

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Game definitions - FIXED: Removed icon property from render
const games = [
  {
    id: 'bubbles',
    name: 'Bubble Pop',
    description: 'Pop colorful bubbles!',
    color: '#4A9FD4',
    emoji: '🫧',
    path: '/games/bubbles',
    ready: true,
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Find matching pairs!',
    color: '#F5A623',
    emoji: '🧠',
    path: '/games/memory',
    ready: true,
  },
  {
    id: 'sound-match',
    name: 'Sound Match',
    description: 'Match sounds to pictures!',
    color: '#8E6BBF',
    emoji: '🔊',
    path: '/games/sound-match',
    ready: true,
  },
  {
    id: 'sorting',
    name: 'Color Sort',
    description: 'Sort by colors!',
    color: '#5CB85C',
    emoji: '🔴',
    path: '/games/sorting',
    ready: true,
  },
  {
    id: 'shapes',
    name: 'Shape Match',
    description: 'Match shapes to holes!',
    color: '#20B2AA',
    emoji: '🔷',
    path: '/games/shapes',
    ready: true,
  },
  {
    id: 'pattern',
    name: 'Pattern Sequence',
    description: 'Remember the pattern!',
    color: '#E86B9A',
    emoji: '🎵',
    path: '/games/pattern',
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
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
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

        {/* Games Grid - FIXED: Only emoji, no Icon */}
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameClick(game)}
              disabled={!game.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-white text-center
                transition-all duration-200 shadow-crayon
                ${game.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: game.color,
                borderColor: game.color,
              }}
            >
              {/* FIXED: Only emoji */}
              <span className="text-4xl mb-2 block">{game.emoji}</span>
              <span className="font-display text-base block">{game.name}</span>
              <span className="font-crayon text-xs text-white/80 mt-1 block">
                {game.description}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Games;
