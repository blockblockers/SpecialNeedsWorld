// SpeechTherapyHub.jsx - Speech Therapy apps hub
// UPDATED: Added WordVault app (Home Speech Home inspired)
// UPDATED: Uses enhanced v2 apps for articulation, minimal pairs, conversation
// Based on recommendations from SLP Now blog and premier SLP apps

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mic, Volume2, BookOpen, MessageCircle,
  Target, Puzzle, Brain, Ear, Music, Sparkles,
  ExternalLink, Library
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { getPictogramUrl } from '../services/arasaac';

// Speech therapy apps - ALPHABETICALLY ORDERED
const speechApps = [
  {
    id: 'articulation-station',
    name: 'Articulation Station',
    description: '7-level practice with voice recording & data tracking',
    icon: Target,
    color: '#E63B2E',
    arasaacId: 6009, // speak
    path: '/speech-therapy/articulation',
  },
  {
    id: 'conversation-cards',
    name: 'Conversation Therapy',
    description: '11 topic categories with communication strategies',
    icon: MessageCircle,
    color: '#E86B9A',
    arasaacId: 6044, // conversation
    path: '/speech-therapy/conversation',
  },
  {
    id: 'language-builder',
    name: 'Language Builder',
    description: 'Build sentences and vocabulary',
    icon: BookOpen,
    color: '#5CB85C',
    arasaacId: 27342, // sentence
    path: '/speech-therapy/language-builder',
  },
  {
    id: 'listening-games',
    name: 'Listening Games',
    description: 'Auditory processing activities',
    icon: Ear,
    color: '#0891B2',
    arasaacId: 6024, // hear
    path: '/speech-therapy/listening',
  },
  {
    id: 'rhythm-speech',
    name: 'Rhythm & Speech',
    description: 'Use music for fluency practice',
    icon: Music,
    color: '#EC4899',
    arasaacId: 2593, // music
    path: '/speech-therapy/rhythm',
  },
  {
    id: 'minimal-pairs',
    name: 'Sound Contrasts',
    description: '4 phonological approaches with multiple game modes',
    icon: Ear,
    color: '#F5A623',
    arasaacId: 2401, // ear/listen
    path: '/speech-therapy/minimal-pairs',
  },
  {
    id: 'sound-sorter',
    name: 'Sound Sorter',
    description: 'Sort words by beginning sounds',
    icon: Puzzle,
    color: '#8E6BBF',
    arasaacId: 7447, // sort/categorize
    path: '/speech-therapy/sound-sorter',
  },
  {
    id: 'story-sequencing',
    name: 'Story Sequencing',
    description: 'Order events and retell stories',
    icon: Brain,
    color: '#6366F1',
    arasaacId: 7098, // story
    path: '/speech-therapy/sequencing',
  },
  {
    id: 'word-vault',
    name: 'Word Vault',
    description: 'Comprehensive word database with games & homework lists',
    icon: Library,
    color: '#10B981',
    arasaacId: 27342, // words/vocabulary
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
      <AnimatedBackground variant="speech" />
      
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
            and communication skills with evidence-based approaches inspired by 
            premier SLP apps like Articulation Station, SCIP, and Word Vault.
          </p>
        </div>

        {/* Apps Grid - Consistent AppHub-style */}
        <h3 className="font-display text-gray-700 mb-3">Practice Apps</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {speechApps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="bg-white rounded-2xl border-4 p-4 shadow-lg hover:scale-105 
                           transition-all duration-200 text-left group"
                style={{ borderColor: app.color }}
              >
                
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 
                             group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${app.color}20` }}
                >
                  {app.arasaacId ? (
                    <img 
                      src={getPictogramUrl(app.arasaacId)}
                      alt={app.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
                      }}
                    />
                  ) : null}
                  <Icon 
                    size={24} 
                    style={{ color: app.color, display: app.arasaacId ? 'none' : 'block' }} 
                  />
                </div>
                <h3 
                  className="font-display text-sm mb-1"
                  style={{ color: app.color }}
                >
                  {app.name}
                </h3>
                <p className="text-xs text-gray-500 font-crayon line-clamp-2">
                  {app.description}
                </p>
              </button>
            );
          })}
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
          <h3 className="font-display text-green-700 mb-2">💡 Speech Therapy Tips</h3>
          <ul className="text-sm text-green-700 font-crayon space-y-1">
            <li>• Practice sounds in short, frequent sessions (5-10 minutes)</li>
            <li>• Use a mirror to help see mouth movements</li>
            <li>• Celebrate effort, not just accuracy</li>
            <li>• Make it fun with games and rewards</li>
            <li>• Use the Word Vault to create homework lists</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SpeechTherapyHub;
