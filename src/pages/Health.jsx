// Health.jsx - Health & Wellness Hub
// FIXED: Consistent button style matching other hubs
// FIXED: All routes match App.jsx
// NOTE: Emotional Wellness link goes to /wellness (separate hub)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Utensils, 
  Droplets, 
  Smile, 
  Moon, 
  Activity, 
  Dumbbell, 
  Brain,
  CheckSquare
} from 'lucide-react';

// Health apps with correct paths
const healthApps = [
  {
    id: 'nutrition',
    name: 'Nutrition & Recipes',
    description: 'Visual recipes to make!',
    icon: Utensils,
    color: '#5CB85C',
    emoji: '🍳',
    path: '/health/nutrition',
  },
  {
    id: 'feelings',
    name: 'How Do I Feel?',
    description: 'Track your feelings',
    icon: Smile,
    color: '#F5A623',
    emoji: '😊',
    path: '/health/feelings',
  },
  {
    id: 'water',
    name: 'Water Tracker',
    description: 'Drink enough water!',
    icon: Droplets,
    color: '#4A9FD4',
    emoji: '💧',
    path: '/health/water',
  },
  {
    id: 'sleep',
    name: 'Sleep Tracker',
    description: 'Track your sleep',
    icon: Moon,
    color: '#8E6BBF',
    emoji: '😴',
    path: '/health/sleep',
  },
  {
    id: 'exercise',
    name: 'Move & Exercise',
    description: 'Fun ways to move!',
    icon: Dumbbell,
    color: '#E63B2E',
    emoji: '🏃',
    path: '/health/exercise',
  },
  {
    id: 'ot-exercises',
    name: 'OT Exercises',
    description: 'Occupational therapy activities',
    icon: Activity,
    color: '#20B2AA',
    emoji: '🤸',
    path: '/health/ot-exercises',
  },
  {
    id: 'healthy-choices',
    name: 'Healthy Choices',
    description: 'Make good choices!',
    icon: CheckSquare,
    color: '#E86B9A',
    emoji: '✅',
    path: '/health/healthy-choices',
  },
];

const Health = () => {
  const navigate = useNavigate();

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
          Take care of your body and mind!
        </p>

        {/* Link to Emotional Wellness Hub */}
        <button
          onClick={() => navigate('/wellness')}
          className="w-full mb-6 p-4 bg-gradient-to-r from-[#8E6BBF] to-[#20B2AA] 
                   rounded-2xl border-4 border-purple-400 text-white
                   shadow-crayon hover:scale-[1.02] transition-all flex items-center gap-4"
        >
          <div className="text-4xl">🧠</div>
          <div className="text-left flex-1">
            <h3 className="font-display text-lg">Emotional Wellness Hub</h3>
            <p className="font-crayon text-sm opacity-90">Feelings, coping & calm down tools</p>
          </div>
          <Brain size={32} />
        </button>

        {/* Health Apps Grid - Consistent button style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {healthApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="p-4 rounded-2xl border-4 text-center
                         transition-all duration-200 shadow-crayon
                         hover:scale-105 hover:-rotate-1 active:scale-95"
                style={{
                  backgroundColor: `${app.color}15`,
                  borderColor: app.color,
                }}
              >
                {/* Emoji - centered */}
                <div className="text-3xl mb-2">{app.emoji}</div>

                {/* Icon - centered */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={28} style={{ color: app.color }} />
                </div>

                {/* Name - centered */}
                <h3 className="font-display text-base" style={{ color: app.color }}>
                  {app.name}
                </h3>

                {/* Description - centered */}
                <p className="text-xs text-gray-500 font-crayon mt-1">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            ❤️ Taking care of yourself is important!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Health;
