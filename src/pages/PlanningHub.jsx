// PlanningHub.jsx - Planning & Documents hub for ATLASassist
// Critical planning, advocacy, and emergency documents
// FIXED: All items are now ready (no coming soon)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText,
  User,
  Heart,
  FileHeart,
  ScrollText,
  Shield,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';

// Planning & Documents apps - ALL READY
const planningApps = [
  {
    id: 'student-profile',
    name: 'Student Profile & One-Pager',
    description: 'Info sheets for teachers & providers',
    icon: User,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/planning/student-profile',
    emoji: '👤',
    ready: true,
    priority: 'high',
  },
  {
    id: 'file-of-life',
    name: 'File of Life',
    description: 'Emergency medical info card',
    icon: Shield,
    color: 'bg-[#E63B2E]',
    borderColor: 'border-red-600',
    path: '/planning/file-of-life',
    emoji: '🏥',
    ready: true,
    priority: 'high',
  },
  {
    id: 'person-centered',
    name: 'Person-Centered Plan',
    description: 'Transition & IEP planning template',
    icon: Heart,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-500',
    path: '/planning/person-centered',
    emoji: '💜',
    ready: true,
    priority: 'medium',
  },
  {
    id: 'memo-intent',
    name: 'Memorandum of Intent',
    description: 'Future care planning document',
    icon: ScrollText,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-500',
    path: '/planning/memo-intent',
    emoji: '📜',
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
    <div className="min-h-screen bg-[#FFFEF5]">
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
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#CD853F] crayon-text flex items-center gap-2">
              <FileText size={24} />
              Planning & Documents
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          📋 Important documents for advocacy, emergencies, and future planning
        </p>

        {/* Important Notice */}
        <div className="mb-6 p-4 bg-amber-50 rounded-2xl border-3 border-amber-300 flex gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-display text-amber-700 text-sm mb-1">Privacy Note</h3>
            <p className="font-crayon text-amber-600 text-xs">
              All documents are stored locally on your device. We recommend downloading 
              completed documents and storing them securely.
            </p>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 gap-4">
          {planningApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                disabled={!app.ready}
                className={`
                  relative p-4 rounded-2xl border-4 ${app.borderColor}
                  ${app.color} text-white
                  transition-all duration-200 shadow-crayon
                  ${app.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed grayscale-[30%]'
                  }
                `}
                style={{
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Priority Badge */}
                {app.priority === 'high' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-crayon">
                    Important
                  </div>
                )}

                {/* Emoji */}
                <div className="text-3xl mb-2">{app.emoji}</div>

                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={32} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-lg crayon-text">
                  {app.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-90 font-crayon mt-1">
                  {app.description}
                </p>
              </button>
            );
          })}
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
