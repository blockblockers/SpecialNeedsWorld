// EmotionalWellnessHub.jsx - Emotional Wellness hub for ATLASassist
// FIXED: All apps included with correct paths
// FIXED: Button styling matches main hub (transparent bg + colored border)
// FIXED: Animated background added

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color for this hub
const THEME_COLOR = '#20B2AA';

// Wellness app definitions - ALL APPS with correct paths
const wellnessApps = [
  {
    id: 'body-check-in',
    name: 'Body Check-In',
    description: 'How does your body feel?',
    color: '#4A9FD4',
    emoji: '🫀',
    path: '/wellness/body-check-in',
  },
  {
    id: 'breathing',
    name: 'Breathing Exercises',
    description: 'Calm breathing activities',
    color: '#87CEEB',
    emoji: '🌬️',
    path: '/wellness/calm-down',
  },
  {
    id: 'calm-down',
    name: 'Calm Down Corner',
    description: 'Tools to feel better',
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/wellness/calm-down',
  },
  {
    id: 'circles-control',
    name: 'Circles of Control',
    description: 'What can I control?',
    color: '#20B2AA',
    emoji: '⭕',
    path: '/wellness/circles-control',
  },
  {
    id: 'coping-skills',
    name: 'Coping Skills',
    description: 'Strategies for big feelings',
    color: '#5CB85C',
    emoji: '🛠️',
    path: '/wellness/coping-skills',
  },
  {
    id: 'emotion-chart',
    name: 'Emotion Chart',
    description: 'Learn about emotions',
    color: '#E86B9A',
    emoji: '💖',
    path: '/wellness/emotion-chart',
  },
  {
    id: 'emotion-check',
    name: 'Emotion Check-In',
    description: 'How do I feel right now?',
    color: '#FF6B6B',
    emoji: '🎭',
    path: '/wellness/feelings',
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Learn to grow from challenges',
    color: '#DAA520',
    emoji: '🌱',
    path: '/wellness/growth-mindset',
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Movement & sensory activities',
    color: '#8E6BBF',
    emoji: '✨',
    path: '/wellness/sensory-breaks',
  },
  {
    id: 'worry-jar',
    name: 'Worry Jar',
    description: 'Put worries away safely',
    color: '#E63B2E',
    emoji: '🫙',
    path: '/wellness/worry-jar',
  },
].sort((a, b) => a.name.localeCompare(b.name));

const EmotionalWellnessHub = () => {
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
              Emotional Wellness
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tools to understand and manage your feelings 💚
        </p>

        {/* Apps Grid - Matching main hub styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wellnessApps.map((app, index) => (
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

export default EmotionalWellnessHub;
