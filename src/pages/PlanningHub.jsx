// PlanningHub.jsx - Planning & Documents Hub
// FIXED: Consistent button style matching other hubs
// FIXED: All routes correct including Memorandum of Intent

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText,
  User,
  Heart,
  Target,
  ScrollText,
  FolderOpen
} from 'lucide-react';

// Planning documents with correct paths
const planningDocs = [
  {
    id: 'student-profile',
    name: 'Student Profile',
    description: 'One-page student summary',
    icon: User,
    color: '#4A9FD4',
    emoji: '👤',
    path: '/planning/student-profile',
  },
  {
    id: 'file-of-life',
    name: 'File of Life',
    description: 'Emergency info card',
    icon: Heart,
    color: '#E63B2E',
    emoji: '🆘',
    path: '/planning/file-of-life',
  },
  {
    id: 'person-centered',
    name: 'Person-Centered Plan',
    description: 'Goals, dreams & preferences',
    icon: Target,
    color: '#5CB85C',
    emoji: '🎯',
    path: '/planning/person-centered',
  },
  {
    id: 'memorandum',
    name: 'Memorandum of Intent',
    description: 'Future care instructions',
    icon: ScrollText,
    color: '#8E6BBF',
    emoji: '📜',
    path: '/planning/memorandum',
  },
];

const PlanningHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#CD853F]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
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
          <h1 className="text-xl sm:text-2xl font-display text-[#CD853F] crayon-text flex items-center gap-2">
            <FolderOpen size={24} />
            Planning & Documents
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Important documents for planning and care
        </p>

        {/* Planning Docs Grid - Consistent button style */}
        <div className="grid grid-cols-2 gap-4">
          {planningDocs.map((doc) => {
            const IconComponent = doc.icon;
            return (
              <button
                key={doc.id}
                onClick={() => navigate(doc.path)}
                className="p-4 rounded-2xl border-4 text-center
                         transition-all duration-200 shadow-crayon
                         hover:scale-105 hover:-rotate-1 active:scale-95"
                style={{
                  backgroundColor: `${doc.color}15`,
                  borderColor: doc.color,
                }}
              >
                {/* Emoji - centered */}
                <div className="text-3xl mb-2">{doc.emoji}</div>

                {/* Icon - centered */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={28} style={{ color: doc.color }} />
                </div>

                {/* Name - centered */}
                <h3 className="font-display text-base" style={{ color: doc.color }}>
                  {doc.name}
                </h3>

                {/* Description - centered */}
                <p className="text-xs text-gray-500 font-crayon mt-1">
                  {doc.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-amber-50 rounded-2xl border-3 border-amber-300">
          <p className="text-center text-amber-800 font-crayon text-sm">
            📋 These documents help ensure your loved one receives the best care.
            All information stays on your device for privacy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PlanningHub;
