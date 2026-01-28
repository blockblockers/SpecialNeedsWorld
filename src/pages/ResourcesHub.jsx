// ResourcesHub.jsx - Resources and Research hub
// FIXED: Consistent AppHub-style buttons
// ADDED: Therapy Materials Library (SLP Now style resource)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, FileText, Video, Link as LinkIcon,
  GraduationCap, HelpCircle, Download, Library, Layers,
  ExternalLink
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Resources with consistent styling
const resources = [
  {
    id: 'therapy-materials',
    name: 'Therapy Materials',
    description: 'Evidence-based materials & Smart Decks',
    icon: Library,
    color: '#10B981',
    path: '/resources/therapy-materials',
  },
  {
    id: 'printables',
    name: 'Printables Library',
    description: 'Visual schedules & worksheets',
    icon: FileText,
    color: '#4A9FD4',
    path: '/resources/printables',
  },
  {
    id: 'video-tutorials',
    name: 'Video Tutorials',
    description: 'Step-by-step guides',
    icon: Video,
    color: '#E63B2E',
    path: '/resources/videos',
  },
  {
    id: 'guides',
    name: 'Parent Guides',
    description: 'Tips & strategies for home',
    icon: BookOpen,
    color: '#8E6BBF',
    path: '/resources/guides',
  },
  {
    id: 'iep-goals',
    name: 'IEP Goal Bank',
    description: 'Sample goals & objectives',
    icon: GraduationCap,
    color: '#F5A623',
    path: '/resources/iep-goals',
  },
  {
    id: 'external-links',
    name: 'Helpful Links',
    description: 'Recommended websites',
    icon: LinkIcon,
    color: '#0891B2',
    path: '/resources/links',
  },
  {
    id: 'downloads',
    name: 'App Downloads',
    description: 'Recommended apps list',
    icon: Download,
    color: '#6366F1',
    path: '/resources/apps',
  },
  {
    id: 'faq',
    name: 'FAQ & Help',
    description: 'Common questions answered',
    icon: HelpCircle,
    color: '#EC4899',
    path: '/resources/faq',
  },
];

const ResourcesHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative overflow-hidden">
      <AnimatedBackground variant="resources" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#0891B2]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#0891B2] 
                       rounded-xl font-display font-bold text-[#0891B2] hover:bg-[#0891B2] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#0891B2] flex items-center gap-2">
              <BookOpen size={24} />
              Resources
            </h1>
            <p className="text-sm text-gray-500 font-crayon">Guides & information</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Featured: Therapy Materials Library (SLP Now style) */}
        <div className="mb-6 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Layers size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-display mb-2">Therapy Materials Library</h2>
              <p className="text-white/90 font-crayon text-sm mb-3">
                Access 6,000+ evidence-based, literacy-focused materials including Smart Decks, 
                worksheets, and caseload management tools designed by speech-language pathologists.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Smart Decks</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">IEP Goals</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Worksheets</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Data Tracking</span>
              </div>
              <button
                onClick={() => navigate('/resources/therapy-materials')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#10B981] 
                           rounded-xl font-display hover:bg-white/90 transition-colors"
              >
                <Library size={18} />
                Browse Materials
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid - Consistent AppHub-style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <button
                key={resource.id}
                onClick={() => navigate(resource.path)}
                className="bg-white rounded-2xl border-4 p-4 shadow-lg hover:scale-105 
                           transition-all duration-200 text-left group"
                style={{ borderColor: resource.color }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 
                             group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${resource.color}20` }}
                >
                  <Icon size={24} style={{ color: resource.color }} />
                </div>
                <h3 
                  className="font-display text-base mb-1"
                  style={{ color: resource.color }}
                >
                  {resource.name}
                </h3>
                <p className="text-xs text-gray-500 font-crayon line-clamp-2">
                  {resource.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* External Resources */}
        <div className="mt-6 bg-white rounded-2xl border-4 border-[#0891B2] p-4">
          <h3 className="font-display text-[#0891B2] mb-3 flex items-center gap-2">
            <ExternalLink size={18} />
            Recommended External Resources
          </h3>
          <div className="space-y-2">
            <a 
              href="https://slpnow.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SLP</span>
              </div>
              <div>
                <p className="font-crayon text-gray-800">SLP Now</p>
                <p className="text-xs text-gray-500">Evidence-based therapy materials</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            </a>
            <a 
              href="https://www.asha.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-[#4A9FD4] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ASHA</span>
              </div>
              <div>
                <p className="font-crayon text-gray-800">ASHA</p>
                <p className="text-xs text-gray-500">Speech-Language-Hearing Association</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
