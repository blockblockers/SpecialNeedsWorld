// ResourcesHub.jsx - Resources & Research Hub
// FIXED: Correct routes for all resources
// FIXED: Knowledge = US & State Resources, ResearchHub = Evidence-Based Research
// FIXED: Consistent button style

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Library,
  BookOpen,
  FileText,
  ShoppingBag,
  Printer,
  Scale,
  GraduationCap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

// Resource apps with FIXED routes
const resourceApps = [
  {
    id: 'knowledge',
    name: 'US & State Resources',
    description: 'Laws, rights & services by state',
    icon: Scale,
    color: '#8E6BBF',
    emoji: '⚖️',
    path: '/resources/knowledge',
  },
  {
    id: 'research',
    name: 'Evidence-Based Research',
    description: 'Research & studies',
    icon: BookOpen,
    color: '#4A9FD4',
    emoji: '📚',
    path: '/resources/research',
  },
  {
    id: 'printables',
    name: 'Printables Library',
    description: 'Print visual supports',
    icon: Printer,
    color: '#5CB85C',
    emoji: '🖨️',
    path: '/resources/printables',
  },
  {
    id: 'products',
    name: 'Recommended Products',
    description: 'Helpful tools & products',
    icon: ShoppingBag,
    color: '#F5A623',
    emoji: '🛒',
    path: '/resources/products',
  },
  {
    id: 'therapy-types',
    name: 'Therapy Types',
    description: 'Learn about different therapies',
    icon: GraduationCap,
    color: '#E86B9A',
    emoji: '🎓',
    path: '/resources/therapy-types',
  },
  {
    id: 'definitions',
    name: 'Definitions',
    description: 'Special needs terminology',
    icon: FileText,
    color: '#20B2AA',
    emoji: '📖',
    path: '/resources/definitions',
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions',
    icon: HelpCircle,
    color: '#E63B2E',
    emoji: '❓',
    path: '/resources/faq',
  },
];

// Featured external resources
const featuredResources = [
  {
    name: 'DREDF',
    description: 'Disability Rights Education & Defense Fund',
    url: 'https://dredf.org',
    emoji: '⚖️',
  },
  {
    name: 'IDEA - US Dept of Education',
    description: 'Individuals with Disabilities Education Act',
    url: 'https://sites.ed.gov/idea/',
    emoji: '🏛️',
  },
  {
    name: 'Understood.org',
    description: 'Resources for learning differences',
    url: 'https://understood.org',
    emoji: '💡',
  },
];

const ResourcesHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
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
          <h1 className="text-xl sm:text-2xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
            <Library size={24} />
            Resources & Research
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Knowledge, tools, and resources to help you!
        </p>

        {/* Featured External Resources */}
        <div className="mb-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
          <h2 className="font-display text-purple-700 mb-3 flex items-center gap-2">
            ⭐ Featured Resources
          </h2>
          <div className="space-y-2">
            {featuredResources.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-purple-100 
                         hover:border-purple-300 transition-all group"
              >
                <span className="text-2xl">{resource.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-purple-700 text-sm">{resource.name}</p>
                  <p className="font-crayon text-xs text-gray-500">{resource.description}</p>
                </div>
                <ExternalLink size={16} className="text-purple-400 group-hover:text-purple-600" />
              </a>
            ))}
          </div>
        </div>

        {/* Resource Apps Grid - Consistent button style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {resourceApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="p-4 rounded-2xl border-4 text-center
                         transition-all duration-200 shadow-crayon
                         hover:scale-105 hover:-rotate-1 active:scale-95"
                style={{
                  backgroundColor: `${app.color}15`,
                  borderColor: app.color,
                }}
              >
                {/* Emoji - centered */}
                <div className="text-3xl mb-2">{app.emoji}</div>

                {/* Icon - centered */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={28} style={{ color: app.color }} />
                </div>

                {/* Name - centered */}
                <h3 className="font-display text-sm" style={{ color: app.color }}>
                  {app.name}
                </h3>

                {/* Description - centered */}
                <p className="text-xs text-gray-500 font-crayon mt-1">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
          <p className="text-center text-gray-600 font-crayon text-sm">
            📚 Knowledge is power! Learn about rights, resources, and research.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
