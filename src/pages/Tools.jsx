// Tools.jsx - Daily Tools Hub for ATLASassist
// FIXED: Milestone Guide text is now white, all tools are ready (no coming soon)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calculator,
  Timer,
  Volume2,
  Lightbulb,
  BarChart3
} from 'lucide-react';

// Tool items - ALL ARE READY (no coming soon)
const tools = [
  {
    id: 'milestones',
    name: 'Milestone Guide',
    description: 'Development by age',
    icon: BarChart3,
    color: 'bg-[#F8D14A]',
    borderColor: 'border-yellow-500',
    path: '/tools/milestones',
    emoji: '📊',
    ready: true,
  },
  {
    id: 'timer',
    name: 'Visual Timer',
    description: 'See time counting down',
    icon: Timer,
    color: 'bg-[#E63B2E]',
    borderColor: 'border-red-600',
    path: '/tools/timer',
    emoji: '⏱️',
    ready: true,
  },
  {
    id: 'first-then',
    name: 'First / Then',
    description: 'First do this, then that!',
    icon: Clock,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-600',
    path: '/tools/first-then',
    emoji: '1️⃣',
    ready: true,
  },
  {
    id: 'calm-down',
    name: 'Calm Down',
    description: 'Breathing & relaxation',
    icon: Lightbulb,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-600',
    path: '/tools/calm-down',
    emoji: '😌',
    ready: true,
  },
  {
    id: 'sound-board',
    name: 'Sound Board',
    description: 'Fun sounds to play',
    icon: Volume2,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-600',
    path: '/tools/soundboard',
    emoji: '🔊',
    ready: true,
  },
  {
    id: 'counter',
    name: 'Counter',
    description: 'Count things easily',
    icon: Calculator,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-600',
    path: '/tools/counter',
    emoji: '🔢',
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
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F8D14A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
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
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F8D14A] crayon-text flex items-center gap-2">
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
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                disabled={!tool.ready}
                className={`
                  relative p-4 rounded-2xl border-4 ${tool.borderColor}
                  ${tool.color} text-white
                  transition-all duration-200 shadow-crayon
                  ${tool.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed grayscale-[30%]'
                  }
                `}
                style={{
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Emoji */}
                <div className="text-3xl mb-2">{tool.emoji}</div>

                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={32} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-lg crayon-text">
                  {tool.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-90 font-crayon mt-1">
                  {tool.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 These tools help with daily routines, communication, and calming.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Tools;
