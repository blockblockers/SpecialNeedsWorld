// EmotionalWellnessHub.jsx - Emotional Wellness sub-hub under Health
// NAVIGATION: Back button goes to /health (parent hub)
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Wind, Smile, Heart, Target, Lightbulb, BookOpen, Activity } from 'lucide-react';

// Wellness apps available in this hub
const wellnessApps = [
  {
    id: 'calm-down',
    name: 'Calm Down',
    description: 'Breathing exercises & calming activities',
    icon: Wind,
    color: '#87CEEB',
    emoji: '😌',
    path: '/wellness/calm-down',
    ready: true,
  },
  {
    id: 'feelings',
    name: 'How Do I Feel?',
    description: 'Track your feelings throughout the day',
    icon: Smile,
    color: '#F5A623',
    emoji: '😊',
    path: '/wellness/feelings',
    ready: true,
  },
  {
    id: 'emotion-chart',
    name: 'Emotion Chart',
    description: 'Learn about different emotions',
    icon: Heart,
    color: '#E86B9A',
    emoji: '💖',
    path: '/wellness/emotion-chart',
    ready: true,
  },
  {
    id: 'coping-skills',
    name: 'Coping Skills',
    description: 'Strategies to handle big feelings',
    icon: Target,
    color: '#5CB85C',
    emoji: '🛠️',
    path: '/wellness/coping-skills',
    ready: true,
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Movement & sensory activities',
    icon: Activity,
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/wellness/sensory-breaks',
    ready: true,
  },
  {
    id: 'circles-control',
    name: 'Circles of Control',
    description: 'What can I control?',
    icon: Target,
    color: '#20B2AA',
    emoji: '⭕',
    path: '/wellness/circles-control',
    ready: true,
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Learn to grow from challenges',
    icon: Lightbulb,
    color: '#F8D14A',
    emoji: '🌱',
    path: '/wellness/growth-mindset',
    ready: true,
  },
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Prepare for new situations',
    icon: BookOpen,
    color: '#4A9FD4',
    emoji: '📖',
    path: '/wellness/social-stories',
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /health (parent hub) */}
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
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
          <h1 className="text-xl sm:text-2xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
            <Brain size={24} />
            Emotional Wellness
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tools to understand and manage your feelings
        </p>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wellnessApps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                disabled={!app.ready}
                className={`
                  relative p-4 rounded-2xl border-4 text-left
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
                  <IconComponent size={28} style={{ color: app.color }} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-base crayon-text" style={{ color: app.color }}>
                  {app.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 font-crayon mt-1 line-clamp-2">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#8E6BBF]/30 shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            🧠 Understanding your feelings is a superpower! Explore these tools to learn about emotions.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmotionalWellnessHub;
