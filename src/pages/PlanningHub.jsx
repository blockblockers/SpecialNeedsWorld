// PlanningHub.jsx - Planning & Documents hub for ATLASassist
// FIXED: Single icon (emoji only)
// UPDATED: Added AnimatedBackground and description banner

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Planning apps - FIXED: Removed icon property from render
const planningApps = [
  {
    id: 'student-profile',
    name: 'Student Profile & One-Pager',
    description: 'Info sheets for teachers & providers',
    color: '#4A9FD4',
    emoji: '👤',
    path: '/planning/student-profile',
    ready: true,
    priority: 'high',
  },
  {
    id: 'file-of-life',
    name: 'File of Life',
    description: 'Emergency medical info card',
    color: '#E63B2E',
    emoji: '🏥',
    path: '/planning/file-of-life',
    ready: true,
    priority: 'high',
  },
  {
    id: 'person-centered',
    name: 'Person-Centered Plan',
    description: 'Transition & IEP planning template',
    color: '#E86B9A',
    emoji: '💜',
    path: '/planning/person-centered',
    ready: true,
    priority: 'medium',
  },
  {
    id: 'memo-intent',
    name: 'Memorandum of Intent',
    description: 'Future care planning document',
    color: '#8E6BBF',
    emoji: '📜',
    path: '/planning/memorandum',
    ready: true,
    priority: 'low',
  },
];

const PlanningHub = () => {
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#CD853F]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#CD853F] 
                       rounded-xl font-display font-bold text-[#CD853F] hover:bg-[#CD853F] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#CD853F] crayon-text">
              📋 Planning & Documents
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#CD853F] to-[#B45309] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList size={24} />
            <h2 className="text-lg font-display">Planning & Documents</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Important documents and planning tools for advocacy. Create student profiles, 
            emergency info cards, and transition plans. 📋
          </p>
        </div>

        {/* Apps Grid - Updated to match EmotionalWellnessHub style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {planningApps.map((app, index) => (
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
              {/* Priority Badge */}
              {app.priority === 'high' && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-crayon z-10">
                  Important
                </div>
              )}
              
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${app.color}` }}
              >
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Name - dark text */}
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
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#CD853F] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            📝 These documents help communicate your child's needs to schools, 
            healthcare providers, and caregivers.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PlanningHub;
