// EmotionalWellnessHub.jsx - Emotional Wellness sub-hub
// FIXED: Back button says "Back" (not "Home")
// NAVIGATION: Back button goes to /hub (main app hub)

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';

// Wellness apps - Using emoji only (no lucide icons in buttons)
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
    color: '#DAA520', // Darker gold for better visibility
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
          {/* FIXED: Button says "Back" and navigates to /hub */}
          <button
            onClick={() => navigate('/hub')}
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

        {/* Apps Grid - Using emoji only */}
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
                borderRadius: index % 2 === 0 ? '30px 10px 30px 10px' : '10px 30px 10px 30px',
              }}
            >
              {/* Emoji Icon */}
              <span className="text-4xl block mb-2">{app.emoji}</span>
              
              {/* App Name */}
              <h3 
                className="font-display text-sm mb-1"
                style={{ color: app.color }}
              >
                {app.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500">
                {app.description}
              </p>
              
              {/* Coming Soon Badge */}
              {!app.ready && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 text-gray-500 text-xs font-crayon rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
          <h3 className="font-display text-purple-700 mb-2 flex items-center gap-2">
            <span className="text-xl">💜</span> About Emotional Wellness
          </h3>
          <p className="font-crayon text-gray-600 text-sm">
            Understanding and managing emotions is an important skill. These tools help identify feelings, 
            learn coping strategies, and develop emotional regulation abilities. Take your time exploring 
            each activity at your own pace.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmotionalWellnessHub;
