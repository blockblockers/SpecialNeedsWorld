// ResourcesHub.jsx - Resources & Research hub for ATLASassist
// FIXED: Single icon (emoji only)

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Resource sections - FIXED: Removed icon property from render
const resourceSections = [
  {
    id: 'laws',
    name: 'US & State Resources',
    description: 'Laws, rights & advocacy info',
    color: '#4A9FD4',
    emoji: '⚖️',
    path: '/knowledge',
    ready: true,
  },
  {
    id: 'research',
    name: 'Evidence-Based Research',
    description: 'Studies & best practices',
    color: '#5CB85C',
    emoji: '🔬',
    path: '/resources/research',
    ready: true,
  },
  {
    id: 'printables',
    name: 'Printables Library',
    description: 'Charts, cards & worksheets',
    color: '#F5A623',
    emoji: '🖨️',
    path: '/resources/printables',
    ready: true,
  },
  {
    id: 'products',
    name: 'Recommended Products',
    description: 'Helpful tools & resources',
    color: '#8E6BBF',
    emoji: '🛒',
    path: '/resources/products',
    ready: true,
  },
];

const ResourcesHub = () => {
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    if (section.ready) {
      navigate(section.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              📚 Resources & Research
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Laws, research & printable resources for advocacy!
        </p>

        {/* Resources Grid - FIXED: Only emoji, no Icon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resourceSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              disabled={!section.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-white text-center
                transition-all duration-200 shadow-crayon
                ${section.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: section.color,
                borderColor: section.color,
              }}
            >
              {/* FIXED: Only emoji */}
              <span className="text-4xl mb-2 block">{section.emoji}</span>
              <span className="font-display text-base block">{section.name}</span>
              <span className="font-crayon text-xs text-white/80 mt-1 block">
                {section.description}
              </span>
            </button>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#8E6BBF]/30 shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            📖 Knowledge is power! Use these resources to advocate effectively.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
