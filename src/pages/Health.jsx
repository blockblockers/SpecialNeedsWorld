// Health.jsx - Health hub for ATLASassist
// FIXED: Removed Emotional Wellness button (separate hub)
// FIXED: Button styling matches main hub (transparent bg + colored border)
// FIXED: Animated background added
// UPDATED: Added description banner

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color for this hub
const THEME_COLOR = '#E86B9A';

// Health app definitions - REMOVED Emotional Wellness
const healthApps = [
  {
    id: 'healthy-choices',
    name: 'Healthy Choices',
    description: 'Make good decisions',
    color: '#20B2AA',
    emoji: '✅',
    path: '/health/healthy-choices',
  },
  {
    id: 'exercise',
    name: 'Move & Exercise',
    description: 'Fun ways to move!',
    color: '#E63B2E',
    emoji: '🏃',
    path: '/health/exercise',
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Recipes',
    description: 'Visual recipes to make!',
    color: '#5CB85C',
    emoji: '🍳',
    path: '/health/nutrition',
  },
  {
    id: 'sleep',
    name: 'Sleep Tracker',
    description: 'Track your sleep',
    color: '#6B5B95',
    emoji: '😴',
    path: '/health/sleep',
  },
  {
    id: 'water',
    name: 'Water Tracker',
    description: 'Drink enough water!',
    color: '#4A9FD4',
    emoji: '💧',
    path: '/health/water',
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Health = () => {
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
              <Heart size={24} />
              Health & Wellness
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#E86B9A] to-[#DB2777] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={24} />
            <h2 className="text-lg font-display">Health & Wellness</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Track your body and health! Monitor water intake, sleep patterns, 
            nutrition, exercise, and make healthy choices every day. ❤️
          </p>
        </div>

        {/* Apps Grid - Matching main hub styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {healthApps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="relative p-4 rounded-2xl border-4 text-center transition-all duration-200 
                       shadow-crayon hover:scale-105 hover:-rotate-1 active:scale-95"
              style={{
                backgroundColor: app.color + '20',
                borderColor: app.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-2 mx-auto"
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
