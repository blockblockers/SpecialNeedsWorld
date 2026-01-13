// Health.jsx - Health hub with multiple apps
// Contains: Nutrition/Recipes, Feelings, Water Tracker, etc.

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Utensils, 
  Droplets,
  Smile,
  Moon,
  Activity,
  Apple,
  Dumbbell
} from 'lucide-react';

// Health app categories
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
    id: 'feelings',
    name: 'How Do I Feel?',
    description: 'Track your feelings',
    icon: Smile,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-500',
    path: '/health/feelings',
    emoji: '😊',
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
    icon: Activity,
    color: 'bg-[#E63B2E]',
    borderColor: 'border-red-500',
    path: '/health/exercise',
    emoji: '🏃',
    ready: true,
  },
  {
    id: 'ot-exercises',
    name: 'OT Exercises',
    description: 'Stretches & therapy',
    icon: Dumbbell,
    color: 'bg-[#20B2AA]',
    borderColor: 'border-teal-500',
    path: '/health/ot',
    emoji: '🧘',
    ready: true,
  },
  {
    id: 'healthy-choices',
    name: 'Healthy Choices',
    description: 'Track healthy decisions',
    icon: Apple,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-500',
    path: '/health/choices',
    emoji: '✨',
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
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text flex items-center gap-2">
              <Heart size={24} fill="currentColor" />
              Health
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Stay healthy and happy! Tap to explore.
        </p>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 gap-4">
          {healthApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                disabled={!app.ready}
                className={`
                  relative p-4 rounded-2xl border-4 ${app.borderColor}
                  ${app.color} text-white
                  transition-all duration-200 shadow-crayon
                  ${app.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed grayscale-[30%]'
                  }
                `}
                style={{
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Coming Soon Badge */}
                {!app.ready && (
                  <div className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full font-crayon">
                    Soon!
                  </div>
                )}

                {/* Emoji */}
                <div className="text-3xl mb-2">{app.emoji}</div>

                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={32} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-lg crayon-text">
                  {app.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-90 font-crayon mt-1">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            ❤️ Taking care of yourself is important! More health tools coming soon.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Health;
