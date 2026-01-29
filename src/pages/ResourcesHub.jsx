// ResourcesHub.jsx - Resources & Research hub for ATLASassist
// FIXED: Button styling matches main hub (transparent bg + colored border)
// FIXED: Animated background added
// ADDED: Description banner at top
// ADDED: Therapy Materials Library link

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Library, ExternalLink, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color for this hub
const THEME_COLOR = '#8E6BBF';

// Resource apps - Alphabetized
const resourceApps = [
  {
    id: 'definitions',
    name: 'Definitions',
    description: 'Common terms explained',
    color: '#20B2AA',
    emoji: '📖',
    path: '/resources/definitions',
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions',
    color: '#DAA520',
    emoji: '❓',
    path: '/resources/faq',
  },
  {
    id: 'printables',
    name: 'Printables Library',
    description: 'Charts, cards & worksheets',
    color: '#F5A623',
    emoji: '🖨️',
    path: '/resources/printables',
  },
  {
    id: 'products',
    name: 'Recommended Products',
    description: 'Helpful tools & resources',
    color: '#8E6BBF',
    emoji: '🛒',
    path: '/resources/products',
  },
  {
    id: 'research',
    name: 'Research Hub',
    description: 'Evidence-based studies',
    color: '#5CB85C',
    emoji: '🔬',
    path: '/resources/research',
  },
  {
    id: 'therapy-materials',
    name: 'Therapy Materials',
    description: 'SLP resources & smart decks',
    color: '#10B981',
    emoji: '📋',
    path: '/resources/therapy-materials',
  },
  {
    id: 'therapy-types',
    name: 'Therapy Types',
    description: 'Learn about different therapies',
    color: '#E86B9A',
    emoji: '🩺',
    path: '/resources/therapy-types',
  },
  {
    id: 'laws',
    name: 'US & State Resources',
    description: 'Laws, rights & advocacy info',
    color: '#4A9FD4',
    emoji: '⚖️',
    path: '/resources/knowledge',
  },
].sort((a, b) => a.name.localeCompare(b.name));

// Featured external resources
const FEATURED_RESOURCES = [
  {
    name: 'DREDF',
    description: 'Disability Rights Education & Defense Fund',
    url: 'https://dredf.org',
    emoji: '⚖️',
  },
  {
    name: 'Understood.org',
    description: 'Free resources for learning differences',
    url: 'https://www.understood.org',
    emoji: '📖',
  },
  {
    name: 'ASAN',
    description: 'Autistic Self Advocacy Network',
    url: 'https://autisticadvocacy.org',
    emoji: '🏳️',
  },
  {
    name: 'Wrightslaw',
    description: 'Special education law & advocacy',
    url: 'https://www.wrightslaw.com',
    emoji: '📚',
  },
];

const ResourcesHub = () => {
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
              <Library size={24} />
              Resources & Research
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#8E6BBF] to-[#6366F1] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={24} />
            <h2 className="text-lg font-display">Resources & Research</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Helpful information, guides, and tools to support your journey. 
            Find printables, research, therapy guides, and advocacy resources.
          </p>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-gray-200 rounded"></div>
          <span className="font-crayon text-gray-400 text-sm">Browse Resources</span>
          <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-gray-200 rounded"></div>
        </div>

        {/* Apps Grid - Matching main hub styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {resourceApps.map((app, index) => (
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
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-2 mx-auto"
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

        {/* External Resources Section */}
        <div className="mb-4">
          <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
            <ExternalLink size={20} style={{ color: THEME_COLOR }} />
            Helpful Websites
          </h2>
          
          <div className="space-y-2">
            {FEATURED_RESOURCES.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 
                         hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <span className="text-2xl">{resource.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm text-gray-800">{resource.name}</h3>
                  <p className="font-crayon text-xs text-gray-500 truncate">{resource.description}</p>
                </div>
                <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
