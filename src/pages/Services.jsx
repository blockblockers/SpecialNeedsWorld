// Services.jsx - Services and Trackers hub
// Privacy-focused: All data stored locally, no PHI
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar,
  Target,
  Users,
  Bell,
  FileText,
  Clock,
  Shield
} from 'lucide-react';

// Service tracker items
const trackers = [
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Track upcoming visits',
    icon: Calendar,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/services/appointments',
    emoji: '📅',
    ready: true,
  },
  {
    id: 'goals',
    name: 'Goal Tracker',
    description: 'Track IEP & therapy goals',
    icon: Target,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-500',
    path: '/services/goals',
    emoji: '🎯',
    ready: true,
  },
  {
    id: 'team',
    name: 'My Team',
    description: 'Provider contacts',
    icon: Users,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-500',
    path: '/services/team',
    emoji: '👥',
    ready: true,
  },
  {
    id: 'reminders',
    name: 'Reminders',
    description: 'Set helpful reminders',
    icon: Bell,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-500',
    path: '/services/reminders',
    emoji: '🔔',
    ready: true,
  },
  {
    id: 'notes',
    name: 'Quick Notes',
    description: 'Jot down notes',
    icon: FileText,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-500',
    path: '/services/notes',
    emoji: '📝',
    ready: true,
  },
  {
    id: 'routines',
    name: 'Daily Routines',
    description: 'Track daily routines',
    icon: Clock,
    color: 'bg-[#20B2AA]',
    borderColor: 'border-teal-500',
    path: '/services/routines',
    emoji: '📋',
    ready: true,
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleTrackerClick = (tracker) => {
    if (tracker.ready) {
      navigate(tracker.path);
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
            alt="Special Needs World" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#20B2AA] crayon-text flex items-center gap-2">
              📋 Services & Trackers
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Track appointments, goals, and your care team!
        </p>

        {/* Privacy Notice */}
        <div className="mb-6 p-4 bg-green-50 rounded-2xl border-3 border-green-300 flex items-start gap-3">
          <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-crayon text-green-800 text-sm">
              <strong>Your Privacy:</strong> All information stays on your device. 
              We don't store or share any personal or medical information.
            </p>
          </div>
        </div>

        {/* Trackers Grid */}
        <div className="grid grid-cols-2 gap-4">
          {trackers.map((tracker) => {
            const IconComponent = tracker.icon;
            return (
              <button
                key={tracker.id}
                onClick={() => handleTrackerClick(tracker)}
                disabled={!tracker.ready}
                className={`
                  relative p-4 rounded-2xl border-4 ${tracker.borderColor}
                  ${tracker.color} text-white
                  transition-all duration-200 shadow-crayon
                  ${tracker.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed grayscale-[30%]'
                  }
                `}
                style={{
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Coming Soon Badge */}
                {!tracker.ready && (
                  <div className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full font-crayon">
                    Soon!
                  </div>
                )}

                {/* Emoji */}
                <div className="text-3xl mb-2">{tracker.emoji}</div>

                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={32} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-lg crayon-text">
                  {tracker.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-90 font-crayon mt-1">
                  {tracker.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Use these trackers to stay organized and prepared for appointments and IEP meetings!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Services;
