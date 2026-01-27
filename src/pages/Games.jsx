// Games.jsx - Games hub for ATLASassist
// FIXED: Button styling matches main hub (transparent bg + colored border)
// FIXED: Animated background added

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color for this hub
const THEME_COLOR = '#5CB85C';

// Game definitions - Alphabetized
const games = [
  {
    id: 'bubbles',
    name: 'Bubble Pop',
    description: 'Pop colorful bubbles!',
    color: '#4A9FD4',
    emoji: '🫧',
    path: '/games/bubbles',
  },
  {
    id: 'sorting',
    name: 'Color Sort',
    description: 'Sort by colors!',
    color: '#5CB85C',
    emoji: '🔴',
    path: '/games/sorting',
  },
  {
    id: 'emotion-match',
    name: 'Emotion Match',
    description: 'Match faces to feelings!',
    color: '#E86B9A',
    emoji: '😊',
    path: '/games/emotion-match',
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Find matching pairs!',
    color: '#F5A623',
    emoji: '🧠',
    path: '/games/memory',
  },
  {
    id: 'pattern',
    name: 'Pattern Sequence',
    description: 'Remember the pattern!',
    color: '#8E6BBF',
    emoji: '🎵',
    path: '/games/pattern',
  },
  {
    id: 'shapes',
    name: 'Shape Match',
    description: 'Match shapes to holes!',
    color: '#20B2AA',
    emoji: '🔷',
    path: '/games/shapes',
  },
  {
    id: 'sound-match',
    name: 'Sound Match',
    description: 'Match sounds to pictures!',
    color: '#E63B2E',
    emoji: '🔊',
    path: '/games/sound-match',
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative">
      {/* Animated Background */}
      <AnimatedBackground intensity="light" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: THEME_COLOR }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl font-display font-bold transition-all shadow-md hover:scale-105"
            style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display crayon-text flex items-center gap-2" style={{ color: THEME_COLOR }}>
              <Gamepad2 size={24} />
              Games
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Fun games to play! Tap a game to start. 🎮
        </p>

        {/* Games Grid - Matching main hub styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => navigate(game.path)}
              className="relative p-4 rounded-2xl border-4 text-center transition-all duration-200 
                       shadow-crayon hover:scale-105 hover:-rotate-1 active:scale-95"
              style={{
                backgroundColor: game.color + '20',
                borderColor: game.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${game.color}` }}
              >
                <span className="text-3xl">{game.emoji}</span>
              </div>
              
              {/* Name */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {game.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {game.description}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Games;
