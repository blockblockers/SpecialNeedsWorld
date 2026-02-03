// Tools.jsx - Daily Tools hub for ATLASassist
// FIXED: Button styling matches main hub (transparent bg + colored border)
// FIXED: Animated background added
// UPDATED: Added description banner

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color for this hub
const THEME_COLOR = '#B8860B';

// Tool definitions - Alphabetized
const tools = [
  {
    id: 'counter',
    name: 'Counter',
    description: 'Count anything easily!',
    color: '#E86B9A',
    emoji: '🔢',
    path: '/tools/counter',
  },
  {
    id: 'routines',
    name: 'Daily Routines',
    description: 'Step-by-step routines',
    color: '#5CB85C',
    emoji: '📋',
    path: '/tools/daily-routines',
  },
  {
    id: 'first-then',
    name: 'First-Then Board',
    description: 'Visual task sequencing',
    color: '#8E6BBF',
    emoji: '1️⃣',
    path: '/tools/first-then',
  },
  {
    id: 'milestones',
    name: 'Milestone Guide',
    description: 'Development milestones',
    color: '#20B2AA',
    emoji: '📈',
    path: '/tools/milestones',
  },
  {
    id: 'soundboard',
    name: 'Sound Board',
    description: 'Quick sound effects!',
    color: '#F5A623',
    emoji: '🔊',
    path: '/tools/soundboard',
  },
  {
    id: 'timer',
    name: 'Visual Timer',
    description: 'See time counting down',
    color: '#E63B2E',
    emoji: '⏱️',
    path: '/tools/timer',
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Tools = () => {
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
              <Wrench size={24} />
              Daily Tools
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#B8860B] to-[#92400E] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Wrench size={24} />
            <h2 className="text-lg font-display">Daily Tools</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Helpful everyday tools! Timers, counters, first-then boards, 
            and more to support daily routines and transitions. 🔧
          </p>
        </div>

        {/* Tools Grid - Matching main hub styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="relative p-4 rounded-2xl border-4 text-center transition-all duration-200 
                       shadow-crayon hover:scale-105 hover:-rotate-1 active:scale-95"
              style={{
                backgroundColor: tool.color + '20',
                borderColor: tool.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-2 mx-auto"
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
