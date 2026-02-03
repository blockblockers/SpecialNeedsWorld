// FIXED: Updated Reminders color from yellow (#F5A623) to dark orange (#D35400)
// Services.jsx - My Care Team Hub (formerly Services and Trackers)
// FIXED: Renamed to "My Care Team" per user request
// FIXED: All paths to match App.jsx routes
// UPDATED: New cyan theme color and banner
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar,
  Target,
  Users,
  Bell,
  FileText,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Service tracker items with FIXED paths
const trackers = [
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Track upcoming visits',
    icon: Calendar,
    color: '#4A9FD4',
    path: '/services/appointments',
    emoji: '📅',
  },
  {
    id: 'goals',
    name: 'Goal Tracker',
    description: 'Track IEP & therapy goals',
    icon: Target,
    color: '#5CB85C',
    path: '/services/goals',
    emoji: '🎯',
  },
  {
    id: 'team',
    name: 'My Team',
    description: 'Provider contacts',
    icon: Users,
    color: '#8E6BBF',
    path: '/services/my-team', // FIXED: was /services/team
    emoji: '👥',
  },
  {
    id: 'reminders',
    name: 'Reminders',
    description: 'Set helpful reminders',
    icon: Bell,
    color: '#D35400',
    path: '/services/reminders',
    emoji: '🔔',
  },
  {
    id: 'notes',
    name: 'Quick Notes',
    description: 'Jot down notes',
    icon: FileText,
    color: '#E86B9A',
    path: '/services/notes',
    emoji: '📝',
  },
  {
    id: 'routines',
    name: 'Daily Routines',
    description: 'Track daily routines',
    icon: Clock,
    color: '#20B2AA',
    path: '/services/routines',
    emoji: '📋',
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative">
      {/* Animated Background */}
      <AnimatedBackground intensity="light" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#0891B2]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#0891B2] 
                       rounded-xl font-display font-bold text-[#0891B2] hover:bg-[#0891B2] 
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
            <h1 className="text-lg sm:text-xl font-display text-[#0891B2] crayon-text flex items-center gap-2">
              👥 My Care Team
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#0891B2] to-[#0E7490] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} />
            <h2 className="text-lg font-display">My Care Team</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Track appointments, goals, and your support network. Keep all your 
            important care information organized in one place. 👥
          </p>
        </div>

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

        {/* Trackers Grid - Updated to match EmotionalWellnessHub style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trackers.map((tracker, index) => (
            <button
              key={tracker.id}
              onClick={() => navigate(tracker.path)}
              className={`
                relative p-4 rounded-2xl border-4 text-center
                transition-all duration-200 shadow-crayon
                hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer
              `}
              style={{
                backgroundColor: tracker.color + '20',
                borderColor: tracker.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${tracker.color}` }}
              >
                <span className="text-3xl">{tracker.emoji}</span>
              </div>
              
              {/* Name - dark text */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {tracker.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {tracker.description}
              </p>
            </button>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💜 Your care team supports your journey!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Services;
