// Tools.jsx - Daily Tools hub
// FIXED: Single icon (emoji only)
// FIXED: Darker header color (#B8860B dark gold instead of #F8D14A light yellow)

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Tool definitions - FIXED: Removed icon property from render
const tools = [
  {
    id: 'timer',
    name: 'Visual Timer',
    description: 'See time counting down',
    color: '#E63B2E',
    emoji: '⏱️',
    path: '/tools/timer',
    ready: true,
  },
  {
    id: 'first-then',
    name: 'First-Then',
    description: 'First this, then that!',
    color: '#5CB85C',
    emoji: '1️⃣',
    path: '/tools/first-then',
    ready: true,
  },
  {
    id: 'calm-down',
    name: 'Calm Down',
    description: 'Breathing & relaxation',
    color: '#4A9FD4',
    emoji: '😌',
    path: '/tools/calm-down',
    ready: true,
  },
  {
    id: 'sound-board',
    name: 'Sound Board',
    description: 'Fun sounds to play',
    color: '#8E6BBF',
    emoji: '🔊',
    path: '/tools/soundboard',
    ready: true,
  },
  {
    id: 'counter',
    name: 'Counter',
    description: 'Count things easily',
    color: '#E86B9A',
    emoji: '🔢',
    path: '/tools/counter',
    ready: true,
  },
  {
    id: 'routines',
    name: 'Daily Routines',
    description: 'Morning & bedtime help',
    color: '#20B2AA',
    emoji: '📋',
    path: '/tools/routines',
    ready: true,
  },
];

const Tools = () => {
  const navigate = useNavigate();

  const handleToolClick = (tool) => {
    if (tool.ready) {
      navigate(tool.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header - FIXED: Using darker colors */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#B8860B]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* FIXED: Back button uses darker gold color */}
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#B8860B] 
                       rounded-xl font-display font-bold text-[#996515] hover:bg-[#B8860B] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            {/* FIXED: Using darker text color */}
            <h1 className="text-lg sm:text-xl font-display text-[#996515] crayon-text">
              🔧 Daily Tools
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Helpful tools for everyday! Tap to open.
        </p>

        {/* Tools Grid - FIXED: Only emoji, no Icon */}
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              disabled={!tool.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-white text-center
                transition-all duration-200 shadow-crayon
                ${tool.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: tool.color,
                borderColor: tool.color,
              }}
            >
              {/* FIXED: Only emoji */}
              <span className="text-4xl mb-2 block">{tool.emoji}</span>
              <span className="font-display text-base block">{tool.name}</span>
              <span className="font-crayon text-xs text-white/80 mt-1 block">
                {tool.description}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tools;
