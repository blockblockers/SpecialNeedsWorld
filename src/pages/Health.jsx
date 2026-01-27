// Health.jsx - Health hub for ATLASassist
// UPDATED: Apps sorted alphabetically by name
// UPDATED: Animated background

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Health app definitions - SORTED ALPHABETICALLY
const healthApps = [
  {
    id: 'emotional-wellness',
    name: 'Emotional Wellness',
    description: 'Feelings, coping & calm down tools',
    color: '#8E6BBF',
    emoji: '🧠',
    path: '/wellness',
    ready: true,
  },
  {
    id: 'healthy-choices',
    name: 'Healthy Choices',
    description: 'Make good decisions',
    color: '#20B2AA',
    emoji: '✅',
    path: '/health/healthy-choices',
    ready: true,
  },
  {
    id: 'exercise',
    name: 'Move & Exercise',
    description: 'Fun ways to move!',
    color: '#E63B2E',
    emoji: '🏃',
    path: '/health/exercise',
    ready: true,
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Recipes',
    description: 'Visual recipes to make!',
    color: '#5CB85C',
    emoji: '🍳',
    path: '/health/nutrition',
    ready: true,
  },
  {
    id: 'ot-exercises',
    name: 'OT Exercises',
    description: 'Occupational therapy activities',
    color: '#F5A623',
    emoji: '🤸',
    path: '/health/ot-exercises',
    ready: true,
  },
  {
    id: 'sleep',
    name: 'Sleep Tracker',
    description: 'Track your sleep',
    color: '#6B5B95',
    emoji: '😴',
    path: '/health/sleep',
    ready: true,
  },
  {
    id: 'water',
    name: 'Water Tracker',
    description: 'Drink enough water!',
    color: '#4A9FD4',
    emoji: '💧',
    path: '/health/water',
    ready: true,
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Health = () => {
  const navigate = useNavigate();

  const handleAppClick = (app) => {
    if (app.ready) {
      navigate(app.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative">
      {/* Animated Background */}
      <AnimatedBackground intensity="light" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
              ❤️ Health & Wellness
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Track your body & health! Tap to explore.
        </p>

        {/* Health Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {healthApps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              disabled={!app.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-center
                transition-all duration-200 shadow-crayon
                ${app.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: app.color + '20',
                borderColor: app.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${app.color}` }}
              >
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Name */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {app.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {app.description}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Health;
