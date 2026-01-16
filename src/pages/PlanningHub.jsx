// PlanningHub.jsx - Planning & Documents hub for ATLASassist
// Critical planning, advocacy, and emergency documents

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

// Planning & Documents apps
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
            <p className="font-crayon text-xs text-amber-600">
              These documents contain sensitive information. They are stored locally on your 
              device by default. You control when and how to share them.
            </p>
          </div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {planningApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              disabled={!app.ready}
              className={`relative ${app.color} ${app.borderColor} border-4 rounded-2xl p-5 
                         shadow-crayon transition-all duration-200 
                         flex items-start gap-4 text-white text-left
                         ${app.ready 
                           ? 'hover:shadow-crayon-lg hover:scale-105 active:scale-95' 
                           : 'opacity-70 cursor-not-allowed'}`}
              style={{
                borderRadius: '20px 40px 20px 40px / 40px 20px 40px 20px',
              }}
            >
              {/* NEW Badge */}
              {app.isNew && (
                <span className="absolute -top-2 -right-2 bg-[#20B2AA] text-white text-xs font-display 
                                 px-2 py-0.5 rounded-full shadow-md">
                  Coming Soon
                </span>
              )}

              {/* Icon */}
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Text */}
              <div>
                <h3 className="font-display text-base leading-tight mb-1">
                  {app.name}
                </h3>
                <p className="font-crayon text-sm text-white/80">
                  {app.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* What Are These? */}
        <div className="mt-6 space-y-4">
          <h3 className="font-display text-gray-700 text-lg">📖 What Are These Documents?</h3>
          
          <div className="bg-white rounded-2xl border-3 border-gray-200 shadow-sm p-4">
            <h4 className="font-display text-[#4A9FD4] mb-2">👤 Student Profile & One-Pager</h4>
            <p className="font-crayon text-sm text-gray-600">
              A concise document sharing important information about your child with teachers, 
              substitutes, and new providers. Includes strengths, needs, communication style, 
              and what helps them succeed.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-3 border-gray-200 shadow-sm p-4">
            <h4 className="font-display text-[#E63B2E] mb-2">🏥 File of Life</h4>
            <p className="font-crayon text-sm text-gray-600">
              Emergency medical information in the standard format recognized by first responders. 
              Includes conditions, medications, allergies, emergency contacts, and communication needs.
              Can be printed as a wallet card or fridge magnet.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-3 border-gray-200 shadow-sm p-4">
            <h4 className="font-display text-[#E86B9A] mb-2">💜 Person-Centered Plan</h4>
            <p className="font-crayon text-sm text-gray-600">
              A comprehensive planning template focusing on what's important TO the person 
              (their preferences) and what's important FOR them (health & safety). Used for 
              IEP meetings, transition planning, and life planning.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-3 border-gray-200 shadow-sm p-4">
            <h4 className="font-display text-[#8E6BBF] mb-2">📜 Memorandum of Intent</h4>
            <p className="font-crayon text-sm text-gray-600">
              A detailed letter to future caregivers about your loved one's history, preferences, 
              routines, and needs. Not legally binding, but provides invaluable guidance for 
              whoever may provide care in the future.
            </p>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="mt-6 p-4 bg-[#CD853F]/10 rounded-2xl border-3 border-[#CD853F]/30">
          <h3 className="font-display text-[#CD853F] mb-2 flex items-center gap-2">
            <Heart size={18} />
            Why This Matters
          </h3>
          <p className="font-crayon text-sm text-gray-600">
            Having these documents prepared and up-to-date helps ensure your loved one receives 
            consistent, informed care - whether it's a substitute teacher, an emergency room visit, 
            or planning for the future. These tools guide you through creating them step by step.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PlanningHub;
