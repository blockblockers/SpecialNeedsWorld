// SpeechTherapyHub.jsx - Speech Therapy apps hub
// FIXED: Button styling now matches AppHub exactly
// FIXED: All routes verified and working
// Based on recommendations from SLP Now blog and premier SLP apps

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mic, Sparkles, ExternalLink
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Speech therapy apps - ALPHABETICALLY ORDERED with emoji icons to match AppHub
const speechApps = [
  {
    id: 'articulation-station',
    name: 'Articulation Station',
    description: '7-level practice with voice recording',
    emoji: '🎯',
    color: '#E63B2E',
    path: '/speech-therapy/articulation',
  },
  {
    id: 'conversation-cards',
    name: 'Conversation Therapy',
    description: '11 topic categories for communication',
    emoji: '💬',
    color: '#E86B9A',
    path: '/speech-therapy/conversation',
  },
  {
    id: 'language-builder',
    name: 'Language Builder',
    description: 'Build sentences and vocabulary',
    emoji: '📖',
    color: '#5CB85C',
    path: '/speech-therapy/language-builder',
  },
  {
    id: 'listening-games',
    name: 'Listening Games',
    description: 'Auditory processing activities',
    emoji: '👂',
    color: '#0891B2',
    path: '/speech-therapy/listening',
  },
  {
    id: 'rhythm-speech',
    name: 'Rhythm & Speech',
    description: 'Use music for fluency practice',
    emoji: '🎵',
    color: '#EC4899',
    path: '/speech-therapy/rhythm',
  },
  {
    id: 'minimal-pairs',
    name: 'Sound Contrasts',
    description: '4 phonological approaches',
    emoji: '🔊',
    color: '#F5A623',
    path: '/speech-therapy/minimal-pairs',
  },
  {
    id: 'sound-sorter',
    name: 'Sound Sorter',
    description: 'Sort words by beginning sounds',
    emoji: '🧩',
    color: '#8E6BBF',
    path: '/speech-therapy/sound-sorter',
  },
  {
    id: 'story-sequencing',
    name: 'Story Sequencing',
    description: 'Order events and retell stories',
    emoji: '📚',
    color: '#6366F1',
    path: '/speech-therapy/sequencing',
  },
  {
    id: 'word-vault',
    name: 'Word Vault',
    description: 'Word database with games & homework',
    emoji: '📦',
    color: '#10B981',
    path: '/speech-therapy/word-vault',
  },
];

// External app recommendations (inspiration sources)
const externalApps = [
  {
    name: 'Articulation Station',
    developer: 'Little Bee Speech',
    description: 'Flashcards, memory & spinners for all sounds',
    url: 'http://littlebeespeech.com/articulation_station.php',
  },
  {
    name: 'SCIP',
    developer: 'Sound Contrasts in Phonology',
    description: '5 phonological pattern approaches',
    url: 'https://scipapp.com/',
  },
  {
    name: 'Tactus Therapy',
    developer: 'Tactus',
    description: 'Conversation therapy for older students',
    url: 'https://tactustherapy.com/app/conversation/',
  },
  {
    name: 'Word Vault',
    developer: 'Home Speech Home',
    description: 'Articulation, phonology & language stimuli',
    url: 'https://www.home-speech-home.com/word-vault-faq.html',
  },
];

const SpeechTherapyHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative overflow-hidden">
      <AnimatedBackground intensity="normal" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#10B981]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#10B981] 
                       rounded-xl font-display font-bold text-[#10B981] hover:bg-[#10B981] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#10B981] flex items-center gap-2">
              <Mic size={24} />
              Speech Therapy
            </h1>
            <p className="text-sm text-gray-500 font-crayon">Articulation & language tools</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Featured Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={24} />
            <h2 className="text-lg font-display">Speech & Language Practice</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Interactive apps designed to support articulation, language development, 
            and communication skills with evidence-based approaches.
          </p>
        </div>

        {/* Apps Grid - MATCHING APPHUB STYLE EXACTLY */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-gray-200 rounded"></div>
          <span className="font-crayon text-gray-400 text-sm">Practice Apps</span>
          <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {speechApps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="relative p-4 rounded-2xl border-4 text-center transition-all duration-200 
                       shadow-crayon hover:scale-105 hover:-rotate-1 active:scale-95"
              style={{
                backgroundColor: app.color + '20',
                borderColor: app.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container - matches AppHub exactly */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${app.color}` }}
              >
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Name */}
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

        {/* External App Recommendations */}
        <div className="bg-white rounded-2xl border-4 border-[#10B981] p-4">
          <h3 className="font-display text-[#10B981] mb-3 flex items-center gap-2">
            <ExternalLink size={18} />
            Inspiration Sources
          </h3>
          <p className="text-sm text-gray-500 font-crayon mb-3">
            Our apps are inspired by these premier SLP apps
          </p>
          <div className="space-y-2">
            {externalApps.map((app, index) => (
              <a
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl 
                           hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                  <Mic size={20} className="text-[#10B981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-crayon text-gray-800 truncate">{app.name}</p>
                  <p className="text-xs text-gray-500 truncate">{app.description}</p>
                </div>
                <ExternalLink size={16} className="text-gray-400 flex-shrink-0 
                                                    group-hover:text-[#10B981] transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-green-50 rounded-2xl border-2 border-green-200 p-4">
          <h3 className="font-display text-green-700 mb-2">Speech Therapy Tips</h3>
          <ul className="text-sm text-green-700 font-crayon space-y-1">
            <li>• Practice sounds in short, frequent sessions (5-10 minutes)</li>
            <li>• Use a mirror to help see mouth movements</li>
            <li>• Celebrate effort, not just accuracy</li>
            <li>• Make it fun with games and rewards</li>
            <li>• Use Word Vault to create homework lists</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SpeechTherapyHub;
