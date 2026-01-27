// EmotionalWellnessHub.jsx - Emotional Wellness hub for ATLASassist
// UPDATED: Apps sorted alphabetically by name
// UPDATED: Animated background

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Wellness app definitions - SORTED ALPHABETICALLY
const wellnessApps = [
  {
    id: 'body-check-in',
    name: 'Body Check-In',
    description: 'How does your body feel?',
    color: '#4A9FD4',
    emoji: '🫀',
    path: '/wellness/body-check-in',
    ready: true,
  },
  {
    id: 'breathing',
    name: 'Breathing Exercises',
    description: 'Calm breathing activities',
    color: '#4A9FD4',
    emoji: '🌬️',
    path: '/wellness/breathing',
    ready: true,
  },
  {
    id: 'calm-down',
    name: 'Calm Down Corner',
    description: 'Tools to feel better',
    color: '#8E6BBF',
    emoji: '🧘',
    path: '/wellness/calm-down',
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
    id: 'emotion-check',
    name: 'Emotion Check-In',
    description: 'How do I feel right now?',
    color: '#5CB85C',
    emoji: '🎭',
    path: '/wellness/emotion-check',
    ready: true,
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Learn to grow from challenges',
    color: '#DAA520',
    emoji: '🌱',
    path: '/wellness/growth-mindset',
    ready: true,
  },
  {
    id: 'feelings',
    name: 'How Do I Feel?',
    description: 'Track your daily feelings',
    color: '#F5A623',
    emoji: '😊',
    path: '/wellness/feelings',
    ready: true,
  },
  {
    id: 'sensory',
    name: 'Sensory Breaks',
    description: 'Take a sensory break',
    color: '#E86B9A',
    emoji: '✨',
    path: '/wellness/sensory',
    ready: true,
  },
  {
    id: 'worry-jar',
    name: 'Worry Jar',
    description: 'Put worries away',
    color: '#E63B2E',
    emoji: '🫙',
    path: '/wellness/worry-jar',
    ready: true,
  },
].sort((a, b) => a.name.localeCompare(b.name));

const EmotionalWellnessHub = () => {
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
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

      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tools to understand and manage your feelings
        </p>

        {/* Apps Grid */}
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

export default EmotionalWellnessHub;
