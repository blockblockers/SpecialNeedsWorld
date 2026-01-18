// Tools.jsx - Daily Tools Hub
// FIXED: Consistent button style matching other hubs
// FIXED: All routes match App.jsx

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wrench,
  Timer,
  ArrowRightLeft,
  Hash,
  Volume2,
  Clock,
  TrendingUp
} from 'lucide-react';

// Tools list with correct paths
const tools = [
  {
    id: 'timer',
    name: 'Visual Timer',
    description: 'See time counting down',
    icon: Timer,
    color: '#E63B2E',
    emoji: '⏱️',
    path: '/tools/timer',
  },
  {
    id: 'first-then',
    name: 'First/Then Board',
    description: 'First do this, then that!',
    icon: ArrowRightLeft,
    color: '#5CB85C',
    emoji: '➡️',
    path: '/tools/first-then',
  },
  {
    id: 'counter',
    name: 'Counter',
    description: 'Count things easily',
    icon: Hash,
    color: '#4A9FD4',
    emoji: '🔢',
    path: '/tools/counter',
  },
  {
    id: 'soundboard',
    name: 'Sound Board',
    description: 'Fun sounds to play',
    icon: Volume2,
    color: '#8E6BBF',
    emoji: '🔊',
    path: '/tools/soundboard',
  },
  {
    id: 'daily-routines',
    name: 'Daily Routines',
    description: 'Track daily routines',
    icon: Clock,
    color: '#20B2AA',
    emoji: '📋',
    path: '/tools/daily-routines',
  },
  {
    id: 'milestones',
    name: 'Milestone Guide',
    description: 'Track developmental milestones',
    icon: TrendingUp,
    color: '#F5A623',
    emoji: '📈',
    path: '/tools/milestones',
  },
];

const Tools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F8D14A]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F8D14A] 
                       rounded-xl font-display font-bold text-[#F8D14A] hover:bg-[#F8D14A] 
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
          <h1 className="text-xl sm:text-2xl font-display text-[#F8D14A] crayon-text flex items-center gap-2">
            <Wrench size={24} />
            Daily Tools
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Helpful tools for everyday!
        </p>

        {/* Tools Grid - Consistent button style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className="p-4 rounded-2xl border-4 text-center
                         transition-all duration-200 shadow-crayon
                         hover:scale-105 hover:-rotate-1 active:scale-95"
                style={{
                  backgroundColor: `${tool.color}15`,
                  borderColor: tool.color,
                }}
              >
                {/* Emoji - centered */}
                <div className="text-3xl mb-2">{tool.emoji}</div>

                {/* Icon - centered */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={28} style={{ color: tool.color }} />
                </div>

                {/* Name - centered */}
                <h3 className="font-display text-base" style={{ color: tool.color }}>
                  {tool.name}
                </h3>

                {/* Description - centered */}
                <p className="text-xs text-gray-500 font-crayon mt-1">
                  {tool.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            🔧 Tools help make every day easier!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Tools;
