// ResourcesHub.jsx - Resources & Research hub for ATLASassist
// FIXED: Added Featured Resources section (merged from ResearchHub)
// FIXED: Added Therapy Types, Definitions, and FAQ sections
// FIXED: Evidence-Based Research now links to /resources/research (content page)

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, Info } from 'lucide-react';

// Resource sections
const resourceSections = [
  {
    id: 'laws',
    name: 'US & State Resources',
    description: 'Laws, rights & advocacy info',
    color: '#4A9FD4',
    emoji: '⚖️',
    path: '/resources/knowledge',
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
  {
    id: 'therapy-types',
    name: 'Therapy Types',
    description: 'Learn about different therapies',
    color: '#E86B9A',
    emoji: '🩺',
    path: '/resources/therapy-types',
    ready: true,
  },
  {
    id: 'definitions',
    name: 'Definitions',
    description: 'Key terms & concepts',
    color: '#20B2AA',
    emoji: '📖',
    path: '/resources/definitions',
    ready: true,
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Common questions answered',
    color: '#CD853F',
    emoji: '❓',
    path: '/resources/faq',
    ready: true,
  },
];

// Featured external resources - merged from ResearchHub
const FEATURED_RESOURCES = [
  {
    name: 'Understood.org',
    description: 'Free resources for learning and thinking differences',
    url: 'https://www.understood.org',
    emoji: '📖',
  },
  {
    name: 'ASAN',
    description: 'Autistic Self Advocacy Network',
    url: 'https://autisticadvocacy.org',
    emoji: '🏛️',
  },
  {
    name: 'Wrightslaw',
    description: 'Special education law and advocacy',
    url: 'https://www.wrightslaw.com',
    emoji: '⚖️',
  },
  {
    name: 'CDC Developmental Milestones',
    description: 'Track child development milestones',
    url: 'https://www.cdc.gov/ncbddd/actearly/milestones/',
    emoji: '📊',
  },
  {
    name: 'National Autism Association',
    description: 'Resources, support, and advocacy',
    url: 'https://nationalautismassociation.org',
    emoji: '💙',
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

        {/* Resources Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {resourceSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              disabled={!section.ready}
              className={`
                relative p-4 rounded-2xl border-4 text-center
                transition-all duration-200 shadow-crayon
                ${section.ready 
                  ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
                }
              `}
              style={{
                backgroundColor: section.color + '20',
                borderColor: section.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container with white background */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${section.color}` }}
              >
                <span className="text-3xl">{section.emoji}</span>
              </div>
              
              {/* Name - dark text */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {section.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {section.description}
              </p>
            </button>
          ))}
        </div>

        {/* Featured External Resources */}
        <div className="mb-8">
          <h2 className="font-display text-lg text-[#8E6BBF] mb-4 flex items-center gap-2">
            <Star size={20} className="text-[#F8D14A] fill-[#F8D14A]" />
            Featured Resources
          </h2>
          <div className="space-y-3">
            {FEATURED_RESOURCES.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-xl border-3 border-gray-200 
                         hover:border-[#8E6BBF] hover:shadow-crayon transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{resource.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-[#8E6BBF] flex items-center gap-2">
                      {resource.name}
                      <ExternalLink size={14} className="text-gray-400" />
                    </h3>
                    <p className="font-crayon text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex gap-2">
            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-gray-500">
              Product recommendations are based on research and community feedback. 
              ATLASassist does not receive compensation for product mentions. 
              Always consult with your healthcare providers before making purchases.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
