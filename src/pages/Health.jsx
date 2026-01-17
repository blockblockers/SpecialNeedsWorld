// Health.jsx - Health hub for ATLASassist
// UPDATED: Removed Emotional Wellness (now a separate main hub at /wellness)
// Physical health tracking tools only

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Utensils, Droplets, Moon, Activity, Apple, Dumbbell } from 'lucide-react';

// Health app categories - Physical health focused
const healthApps = [
  {
    id: 'nutrition',
    name: 'Nutrition & Recipes',
    description: 'Visual recipes to make!',
    icon: Utensils,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-600',
    path: '/health/nutrition',
    emoji: '🍳',
    ready: true,
  },
  {
    id: 'water',
    name: 'Water Tracker',
    description: 'Drink enough water!',
    icon: Droplets,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/health/water',
    emoji: '💧',
    ready: true,
  },
  {
    id: 'sleep',
    name: 'Sleep Tracker',
    description: 'Track your sleep',
    icon: Moon,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-500',
    path: '/health/sleep',
    emoji: '😴',
    ready: true,
  },
  {
    id: 'exercise',
    name: 'Move & Exercise',
    description: 'Fun ways to move!',
    icon: Dumbbell,
    color: 'bg-[#E63B2E]',
    borderColor: 'border-red-500',
    path: '/health/exercise',
    emoji: '🏃',
    ready: true,
  },
  {
    id: 'healthy-choices',
    name: 'Healthy Choices',
    description: 'Make good choices today!',
    icon: Apple,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-500',
    path: '/health/healthy-choices',
    emoji: '🍎',
    ready: true,
  },
  {
    id: 'body-check',
    name: 'Body Check-In',
    description: 'How does your body feel?',
    icon: Activity,
    color: 'bg-[#20B2AA]',
    borderColor: 'border-teal-500',
    path: '/health/body-check',
    emoji: '🫀',
    ready: true,
  },
];

const Health = () => {
  const navigate = useNavigate();

  const handleAppClick = (app) => {
    if (app.ready) {
      navigate(app.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
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
          <h1 className="text-xl sm:text-2xl font-display text-[#E86B9A] crayon-text flex items-center gap-2">
            <Heart size={24} />
            Health & Wellness
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tools to take care of your body and stay healthy
        </p>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {healthApps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                disabled={!app.ready}
                className={`
                  relative p-4 sm:p-5 rounded-2xl border-4 text-left
                  ${app.color} ${app.borderColor}
                  transition-all duration-200 shadow-crayon text-white
                  ${app.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}
                style={{
                  borderRadius: index % 2 === 0 ? '1rem 1.5rem 1rem 1rem' : '1.5rem 1rem 1rem 1rem',
                }}
              >
                {!app.ready && (
                  <span className="absolute top-2 right-2 text-xs bg-white/90 text-gray-600 px-2 py-0.5 rounded-full font-crayon">
                    Coming Soon
                  </span>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{app.emoji}</span>
                  <IconComponent size={20} className="opacity-80" />
                </div>
                
                <h3 className="font-display text-sm sm:text-base leading-tight mb-1">
                  {app.name}
                </h3>
                
                <p className="font-crayon text-xs text-white/80">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>
        
        {/* Link to Emotional Wellness */}
        <div className="mt-8 p-4 bg-[#20B2AA]/10 rounded-2xl border-3 border-[#20B2AA]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[#20B2AA] flex items-center gap-2">
                💚 Looking for Emotional Wellness?
              </h3>
              <p className="font-crayon text-sm text-gray-600 mt-1">
                Feelings, coping skills, and calming tools
              </p>
            </div>
            <button
              onClick={() => navigate('/wellness')}
              className="px-4 py-2 bg-[#20B2AA] text-white rounded-xl font-crayon 
                       hover:scale-105 transition-transform"
            >
              Go →
            </button>
          </div>
        </div>
        
        {/* Helpful tip */}
        <div className="mt-4 p-4 bg-pink-50 rounded-2xl border-2 border-[#E86B9A]/30">
          <p className="font-crayon text-center text-gray-600 text-sm">
            💪 <strong>Tip:</strong> Taking care of your body helps you feel your best! 
            Try to drink water, move your body, and get enough sleep.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Health;
