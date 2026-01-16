// EmotionalWellnessHub.jsx - Emotional Wellness hub for ATLASassist
// Contains emotional wellness, calming tools, and regulation resources
// FIXED: All items are now ready (no coming soon)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart,
  Smile,
  Wind,
  Sparkles,
  Target,
  HeartHandshake,
  ListChecks,
  Lightbulb,
  CircleDot
} from 'lucide-react';

// Emotional Wellness apps - ALL READY
const wellnessApps = [
  {
    id: 'calm-down',
    name: 'Calm Down Corner',
    description: 'Breathing exercises & grounding',
    icon: Wind,
    color: 'bg-[#87CEEB]',
    borderColor: 'border-sky-500',
    path: '/wellness/calm-down',
    emoji: '🌬️',
    ready: true,
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Regulation activities & timers',
    icon: Sparkles,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-500',
    path: '/wellness/sensory-breaks',
    emoji: '✨',
    ready: true,
  },
  {
    id: 'feelings',
    name: 'Feelings Tracker',
    description: 'Daily emotion check-ins',
    icon: Heart,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-500',
    path: '/wellness/feelings',
    emoji: '💗',
    ready: true,
  },
  {
    id: 'emotion-chart',
    name: 'Emotion Chart',
    description: 'Identify & understand feelings',
    icon: Smile,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-500',
    path: '/wellness/emotion-chart',
    emoji: '😊',
    ready: true,
  },
  {
    id: 'circles-control',
    name: 'Circles of Control',
    description: 'Sort worries & focus energy',
    icon: CircleDot,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/wellness/circles-control',
    emoji: '🎯',
    ready: true,
  },
  {
    id: 'coping-skills',
    name: 'Coping Skills Chart',
    description: 'Your personalized strategies',
    icon: ListChecks,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-500',
    path: '/wellness/coping-skills',
    emoji: '📋',
    ready: true,
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Positive thoughts & affirmations',
    icon: Lightbulb,
    color: 'bg-[#F8D14A]',
    borderColor: 'border-yellow-500',
    path: '/wellness/growth-mindset',
    emoji: '💡',
    ready: true,
  },
  {
    id: 'self-care',
    name: 'Self-Care Checklist',
    description: 'Daily wellness activities',
    icon: HeartHandshake,
    color: 'bg-[#20B2AA]',
    borderColor: 'border-teal-500',
    path: '/wellness/self-care',
    emoji: '🌸',
    ready: true,
  },
];

const EmotionalWellnessHub = () => {
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
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text flex items-center gap-2">
              <Heart size={24} fill="currentColor" />
              Emotional Wellness
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tools to help understand and manage emotions 💜
        </p>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 gap-4">
          {wellnessApps.map((app) => {
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
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#E86B9A] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💜 Remember: All feelings are okay. These tools help us understand and manage them.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmotionalWellnessHub;
