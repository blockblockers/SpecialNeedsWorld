// EmotionalWellnessHub.jsx - Emotional Wellness hub for ATLASassist
// Contains emotional wellness, calming tools, and regulation resources
// Renamed from "Coping & Regulation" per user feedback

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

// Emotional Wellness apps
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#20B2AA]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
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
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#20B2AA] crayon-text flex items-center gap-2">
              <HeartHandshake size={24} />
              Emotional Wellness
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          💚 Tools to help you understand feelings and feel your best
        </p>

        {/* App Grid */}
        <div className="grid grid-cols-2 gap-4">
          {wellnessApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              disabled={!app.ready}
              className={`relative ${app.color} ${app.borderColor} border-4 rounded-2xl p-4 
                         shadow-crayon transition-all duration-200 
                         flex flex-col items-center gap-3 text-white
                         ${app.ready 
                           ? 'hover:shadow-crayon-lg hover:scale-105 active:scale-95' 
                           : 'opacity-70 cursor-not-allowed'}`}
              style={{
                borderRadius: '20px 40px 20px 40px / 40px 20px 40px 20px',
              }}
            >
              {/* NEW Badge */}
              {app.isNew && (
                <span className="absolute -top-2 -right-2 bg-[#E63B2E] text-white text-xs font-display 
                                 px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  NEW
                </span>
              )}
              
              {/* Coming Soon Badge */}
              {!app.ready && !app.isNew && (
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-display 
                                 px-2 py-0.5 rounded-full shadow-md">
                  Soon
                </span>
              )}

              {/* Icon */}
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Text */}
              <div className="text-center">
                <h3 className="font-display text-base leading-tight">
                  {app.name}
                </h3>
                <p className="font-crayon text-xs text-white/80 mt-1">
                  {app.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-[#20B2AA]/10 rounded-2xl border-3 border-[#20B2AA]/30">
          <h3 className="font-display text-[#20B2AA] mb-2 flex items-center gap-2">
            <Heart size={18} />
            About Emotional Wellness
          </h3>
          <p className="font-crayon text-sm text-gray-600">
            Everyone has big feelings sometimes - and that's okay! These tools can help you 
            understand how you're feeling, find ways to feel better, and practice staying calm. 
            Take your time exploring - there's no rush! 💜
          </p>
        </div>

        {/* Quick Access Tips */}
        <div className="mt-4 p-4 bg-white rounded-2xl border-3 border-gray-200 shadow-sm">
          <h3 className="font-display text-gray-700 mb-2">💡 Where to Start</h3>
          <ul className="font-crayon text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#87CEEB]">🌬️</span>
              <span><strong>Feeling overwhelmed?</strong> Try the Calm Down Corner for breathing exercises</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F5A623]">😊</span>
              <span><strong>Not sure what you feel?</strong> The Emotion Chart helps you identify feelings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9FD4]">🎯</span>
              <span><strong>Worried about something?</strong> Circles of Control helps you focus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8E6BBF]">✨</span>
              <span><strong>Need a break?</strong> Sensory Breaks has timed calming activities</span>
            </li>
          </ul>
        </div>

        {/* Emotion Check-in Prompt */}
        <div className="mt-4 p-4 bg-gradient-to-r from-[#E86B9A]/20 to-[#F5A623]/20 rounded-2xl border-3 border-[#E86B9A]/30">
          <h3 className="font-display text-[#E86B9A] mb-2 flex items-center gap-2">
            <Smile size={18} />
            Quick Check-In
          </h3>
          <p className="font-crayon text-sm text-gray-600 mb-3">
            How are you feeling right now? It's good to notice!
          </p>
          <div className="flex justify-center gap-3">
            {['😊', '😐', '😢', '😤', '😰'].map((emoji, i) => (
              <button
                key={i}
                onClick={() => navigate('/wellness/feelings')}
                className="text-3xl hover:scale-125 transition-transform active:scale-95"
                title="Tap to track your feeling"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmotionalWellnessHub;
