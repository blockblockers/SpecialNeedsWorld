// EmotionalWellnessHub.jsx - Emotional Wellness Hub
// FIXED: Consistent button style matching other hubs
// FIXED: Icons centered within buttons
// FIXED: Removed Social Stories (now in Activities hub)
// FIXED: Back button goes to /hub (main hub)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain,
  Smile,
  Wind,
  Heart,
  Target,
  Lightbulb,
  Sparkles,
  Activity
} from 'lucide-react';

// Wellness apps - Social Stories REMOVED (moved to Activities)
const wellnessApps = [
  {
    id: 'calm-down',
    name: 'Calm Down',
    description: 'Breathing & calming tools',
    icon: Wind,
    color: '#20B2AA',
    emoji: '🌬️',
    path: '/wellness/calm-down',
  },
  {
    id: 'feelings',
    name: 'Feelings Tracker',
    description: 'Track how you feel',
    icon: Smile,
    color: '#F5A623',
    emoji: '😊',
    path: '/wellness/feelings',
  },
  {
    id: 'emotion-chart',
    name: 'Emotion Chart',
    description: 'Identify your emotions',
    icon: Heart,
    color: '#E86B9A',
    emoji: '❤️',
    path: '/wellness/emotion-chart',
  },
  {
    id: 'coping-skills',
    name: 'Coping Skills',
    description: 'Tools to feel better',
    icon: Sparkles,
    color: '#8E6BBF',
    emoji: '🛠️',
    path: '/wellness/coping-skills',
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Calming sensory activities',
    icon: Activity,
    color: '#4A9FD4',
    emoji: '🧘',
    path: '/wellness/sensory-breaks',
  },
  {
    id: 'circles-control',
    name: 'Circles of Control',
    description: 'What can I control?',
    icon: Target,
    color: '#5CB85C',
    emoji: '⭕',
    path: '/wellness/circles-control',
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Learn to grow from challenges',
    icon: Lightbulb,
    color: '#F8D14A',
    emoji: '🌱',
    path: '/wellness/growth-mindset',
  },
  {
    id: 'body-check-in',
    name: 'Body Check-In',
    description: 'How does your body feel?',
    icon: Activity,
    color: '#E63B2E',
    emoji: '🫀',
    path: '/wellness/body-check-in',
  },
];

const EmotionalWellnessHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#20B2AA]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back button goes to /hub (main hub) */}
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#20B2AA] 
                       rounded-xl font-display font-bold text-[#20B2AA] hover:bg-[#20B2AA] 
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
          <h1 className="text-xl sm:text-2xl font-display text-[#20B2AA] crayon-text flex items-center gap-2">
            <Brain size={24} />
            Emotional Wellness
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tools to understand and manage your feelings
        </p>

        {/* Apps Grid - Consistent button style with centered icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wellnessApps.map((app) => {
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
            💚 Understanding your feelings is a superpower!
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmotionalWellnessHub;
