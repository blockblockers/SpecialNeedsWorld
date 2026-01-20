// FIXED: Updated FeelingsTracker color from yellow (#F5A623) to coral (#FF6B6B)
// EmotionalWellnessHub.jsx - Emotional Wellness sub-hub under Health
// NAVIGATION: Back button goes to /health (parent hub)
// FIXED: Single icon (emoji only), darker Growth Mindset color

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';

// Wellness apps - FIXED: Removed icon property from render
const wellnessApps = [
  {
    id: 'calm-down',
    name: 'Calm Down',
    description: 'Breathing exercises & calming activities',
    color: '#87CEEB',
    emoji: '😌',
    path: '/wellness/calm-down',
    ready: true,
  },
  {
    id: 'feelings',
    name: 'How Do I Feel?',
    description: 'Track your feelings throughout the day',
    color: '#FF6B6B',
    emoji: '😊',
    path: '/wellness/feelings',
    ready: true,
  },
  {
    id: 'emotion-chart',
    name: 'Emotion Chart',
    description: 'Learn about different emotions',
    color: '#E86B9A',
    emoji: '💖',
    path: '/wellness/emotion-chart',
    ready: true,
  },
  {
    id: 'coping-skills',
    name: 'Coping Skills',
    description: 'Strategies to handle big feelings',
    color: '#5CB85C',
    emoji: '🛠️',
    path: '/wellness/coping-skills',
    ready: true,
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Movement & sensory activities',
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/wellness/sensory-breaks',
    ready: true,
  },
  {
    id: 'circles-control',
    name: 'Circles of Control',
    description: 'What can I control?',
    color: '#20B2AA',
    emoji: '⭕',
    path: '/wellness/circles-control',
    ready: true,
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Learn to grow from challenges',
    // FIXED: Darker gold instead of #F8D14A
    color: '#DAA520',
    emoji: '🌱',
    path: '/wellness/growth-mindset',
    ready: true,
  },
  {
    id: 'body-check-in',
    name: 'Body Check-In',
    description: 'How does your body feel?',
    color: '#4A9FD4',
    emoji: '🫀',
    path: '/wellness/body-check-in',
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
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
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

        {/* Apps Grid - FIXED: Only emoji, no Icon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wellnessApps.map((app, index) => (
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
              {/* FIXED: Only emoji - removed IconComponent */}
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
