// Tools.jsx - Daily Tools hub
// UPDATED: Apps sorted alphabetically by name

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Tool definitions - SORTED ALPHABETICALLY
const tools = [
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
    path: '/tools/daily-routines',
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
    id: 'milestones',
    name: 'Milestone Guide',
    description: 'Track development milestones',
    color: '#4A9FD4',
    emoji: '📈',
    path: '/tools/milestones',
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
    id: 'timer',
    name: 'Visual Timer',
    description: 'See time counting down',
    color: '#E63B2E',
    emoji: '⏱️',
    path: '/tools/timer',
    ready: true,
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Tools = () => {
  const navigate = useNavigate();

  const handleToolClick = (tool) => {
    if (tool.ready) {
      navigate(tool.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#B8860B]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
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

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              disabled={!tool.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-center
                transition-all duration-200 shadow-crayon
                ${tool.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: tool.color + '20',
                borderColor: tool.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${tool.color}` }}
              >
                <span className="text-3xl">{tool.emoji}</span>
              </div>
              
              {/* Name */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {tool.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {tool.description}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tools;
