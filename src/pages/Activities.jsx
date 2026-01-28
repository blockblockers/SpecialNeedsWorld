// Activities.jsx - Activities hub for ATLASassist
// FIXED: Consistent AppHub-style buttons
// FIXED: Choice Board uses darker color (#D97706)
// FIXED: Say It Right description updated to "Practice articulating words"

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { getPictogramUrl } from '../services/arasaac';

// Activity apps with consistent styling
const activityApps = [
  {
    id: 'sensory-breaks',
    name: 'Sensory Breaks',
    description: 'Calming activities with timers',
    color: '#8E6BBF',
    arasaacId: 7098, // meditation/calm
    path: '/activities/sensory-breaks',
  },
  {
    id: 'choice-board',
    name: 'Choice Board',
    description: 'Make choices with pictures',
    color: '#D97706', // FIXED: Darker amber color
    arasaacId: 27561, // choose
    path: '/activities/choice-board',
  },
  {
    id: 'social-stories',
    name: 'Social Stories',
    description: 'Visual stories for situations',
    color: '#5CB85C',
    arasaacId: 7098, // book/story
    path: '/activities/social-stories',
  },
  {
    id: 'pronunciation',
    name: 'Say It Right',
    description: 'Practice articulating words', // FIXED: Updated description
    color: '#4A9FD4',
    arasaacId: 6009, // speak
    path: '/activities/pronunciation',
  },
  {
    id: 'coloring',
    name: 'Coloring Book',
    description: 'Fun coloring pages',
    color: '#E63B2E',
    arasaacId: 5501, // color/paint
    path: '/activities/coloring',
  },
  {
    id: 'music',
    name: 'Music & Sounds',
    description: 'Calming music and sounds',
    color: '#87CEEB',
    arasaacId: 2593, // music
    path: '/activities/music',
  },
  {
    id: 'emotion-match',
    name: 'Emotion Match',
    description: 'Match faces to feelings',
    color: '#E86B9A',
    arasaacId: 26684, // happy face
    path: '/activities/emotion-match',
  },
  {
    id: 'photo-journal',
    name: 'Photo Journal',
    description: 'Capture special moments',
    color: '#20B2AA',
    arasaacId: 36314, // camera
    path: '/activities/photo-journal',
  },
  {
    id: 'rewards',
    name: 'Reward Chart',
    description: 'Earn stars for achievements',
    color: '#DAA520',
    arasaacId: 5465, // trophy
    path: '/activities/rewards',
  },
];

const Activities = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative overflow-hidden">
      <AnimatedBackground variant="activities" />
      
      {/* Header - Consistent with other hubs */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#F5A623] flex items-center gap-2">
              <Sparkles size={24} />
              Activities
            </h1>
            <p className="text-sm text-gray-500 font-crayon">Games & learning fun</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Apps Grid - FIXED: Consistent AppHub-style buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {activityApps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="bg-white rounded-2xl border-4 p-4 shadow-lg hover:scale-105 
                         transition-all duration-200 text-left group"
              style={{ borderColor: app.color }}
            >
              {/* Icon container */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 
                           group-hover:scale-110 transition-transform mx-auto"
                style={{ backgroundColor: `${app.color}20` }}
              >
                <img 
                  src={getPictogramUrl(app.arasaacId)}
                  alt={app.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Text */}
              <h3 
                className="font-display text-base mb-1 text-center"
                style={{ color: app.color }}
              >
                {app.name}
              </h3>
              <p className="text-xs text-gray-500 font-crayon text-center line-clamp-2">
                {app.description}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Activities;
