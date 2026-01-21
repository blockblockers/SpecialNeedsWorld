// ResourcesHub.jsx - Resources & Research hub for ATLASassist
// UPDATED: Combined featured resources, condensed spacing

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Library,
  Scale,
  BookOpen,
  Printer,
  ShoppingBag,
  ExternalLink,
  Star,
  Info,
  Stethoscope,
  BookMarked,
  HelpCircle
} from 'lucide-react';

// Resource sections
const resourceSections = [
  {
    id: 'laws',
    name: 'US & State Resources',
    description: 'Laws, rights & advocacy info',
    icon: Scale,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/knowledge',
    emoji: '⚖️',
    ready: true,
  },
  {
    id: 'research',
    name: 'Evidence-Based Research',
    description: 'Studies & best practices',
    icon: BookOpen,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-500',
    path: '/resources/research',
    emoji: '🔬',
    ready: true,
  },
  {
    id: 'therapy-types',
    name: 'Therapy Types',
    description: 'Learn about different therapies',
    icon: Stethoscope,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-500',
    path: '/resources/therapy-types',
    emoji: '🩺',
    ready: true,
  },
  {
    id: 'definitions',
    name: 'Definitions',
    description: 'Common terms explained',
    icon: BookMarked,
    color: 'bg-[#20B2AA]',
    borderColor: 'border-teal-500',
    path: '/resources/definitions',
    emoji: '📖',
    ready: true,
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions',
    icon: HelpCircle,
    color: 'bg-[#F8D14A]',
    borderColor: 'border-yellow-500',
    path: '/resources/faq',
    emoji: '❓',
    ready: true,
  },
  {
    id: 'printables',
    name: 'Printables Library',
    description: 'Charts, cards & worksheets',
    icon: Printer,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-500',
    path: '/resources/printables',
    emoji: '🖨️',
    ready: true,
  },
  {
    id: 'products',
    name: 'Recommended Products',
    description: 'Helpful tools & resources',
    icon: ShoppingBag,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-500',
    path: '/resources/products',
    emoji: '🛍️',
    ready: true,
  },
];

// Featured external resources - Combined from all sources
const FEATURED_RESOURCES = [
  {
    name: 'DREDF',
    description: 'Disability Rights Education & Defense Fund',
    url: 'https://dredf.org',
    emoji: '⚖️',
  },
  {
    name: 'IDEA - U.S. Department of Education',
    description: 'Individuals with Disabilities Education Act',
    url: 'https://www.ed.gov/laws-and-policy/individuals-disabilities/idea/',
    emoji: '🏛️',
  },
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
    emoji: '🏳️',
  },
  {
    name: 'Wrightslaw',
    description: 'Special education law and advocacy',
    url: 'https://www.wrightslaw.com',
    emoji: '📚',
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
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
            <Library size={22} />
            Resources & Research
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Intro - condensed */}
        <p className="text-center text-gray-600 font-crayon mb-4">
          Helpful information, guides, and tools
        </p>

        {/* Resource Sections Grid - condensed gap */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {resourceSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                disabled={!section.ready}
                className={`
                  relative p-3 rounded-2xl border-4 text-left
                  ${section.color} ${section.borderColor}
                  transition-all duration-200 shadow-crayon
                  ${section.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}
                style={{
                  borderRadius: index % 2 === 0 ? '1rem 1.5rem 1rem 1rem' : '1.5rem 1rem 1rem 1rem',
                }}
              >
                {!section.ready && (
                  <span className="absolute top-2 right-2 text-xs bg-white/90 px-2 py-0.5 rounded-full font-crayon">
                    Coming Soon
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{section.emoji}</span>
                  <IconComponent size={16} className="text-white" />
                </div>
                <h3 className="font-display text-white text-sm leading-tight">
                  {section.name}
                </h3>
                <p className="font-crayon text-white/80 text-xs mt-0.5">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Featured Resources - condensed spacing */}
        <div className="mb-4">
          <h2 className="font-display text-[#8E6BBF] text-sm mb-2 flex items-center gap-2">
            <Star size={16} className="text-[#F8D14A]" />
            Featured Resources
          </h2>
          <div className="space-y-1.5">
            {FEATURED_RESOURCES.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 bg-white rounded-xl border-2 border-gray-200 
                         hover:border-[#8E6BBF] hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{resource.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm text-[#8E6BBF] flex items-center gap-1">
                      <span className="truncate">{resource.name}</span>
                      <ExternalLink size={10} className="text-gray-400 flex-shrink-0" />
                    </h3>
                    <p className="font-crayon text-xs text-gray-500 truncate">{resource.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer - condensed */}
        <div className="p-2.5 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex gap-2">
            <Info size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-gray-500">
              Product recommendations are based on research and community feedback. 
              ATLASassist does not receive compensation for product mentions. 
              Always consult with your healthcare providers.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
