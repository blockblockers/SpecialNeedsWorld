// Activities.jsx - Activities & Learning hub for ATLASassist
// FIXED: Button styling matches main hub (transparent bg + colored border)
// FIXED: Animated background added

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color for this hub
const THEME_COLOR = '#4A9FD4';

// Activity definitions - Alphabetized
const activities = [
  {
    id: 'choice-board',
    name: 'Choice Board',
    description: 'Make choices visually!',
    color: '#8E6BBF',
    emoji: '🎯',
    path: '/activities/choice-board',
  },
  {
    id: 'coloring',
    name: 'Coloring Book',
    description: 'Color fun pictures!',
    color: '#E86B9A',
    emoji: '🖍️',
    path: '/activities/coloring',
  },
  {
    id: 'music',
    name: 'Music & Sounds',
    description: 'Play instruments!',
    color: '#F5A623',
    emoji: '🎵',
    path: '/activities/music',
  },
  {
    id: 'photo-journal',
    name: 'Photo Journal',
    description: 'Capture memories!',
    color: '#20B2AA',
    emoji: '📸',
    path: '/activities/photo-journal',
  },
  {
    id: 'pronunciation',
    name: 'Pronunciation Practice',
    description: 'Learn to say words!',
    color: '#5CB85C',
    emoji: '🗣️',
    path: '/activities/pronunciation',
  },
  {
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars & rewards!',
    color: '#F8D14A',
    emoji: '⭐',
    path: '/activities/rewards',
  },
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Movement activities!',
    color: '#8E6BBF',
    emoji: '✨',
    path: '/activities/sensory-breaks',
  },
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Stories to help learn!',
    color: '#E63B2E',
    emoji: '📚',
    path: '/activities/social-stories',
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Activities = () => {
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
              <Palette size={24} />
              Activities & Learning
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Create, learn & explore! Tap to start. 🎨
        </p>

        {/* Activities Grid - Matching main hub styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              onClick={() => navigate(activity.path)}
              className="relative p-4 rounded-2xl border-4 text-center transition-all duration-200 
                       shadow-crayon hover:scale-105 hover:-rotate-1 active:scale-95"
              style={{
                backgroundColor: activity.color + '20',
                borderColor: activity.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${activity.color}` }}
              >
                <span className="text-3xl">{activity.emoji}</span>
              </div>
              
              {/* Name */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {activity.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {activity.description}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Activities;
