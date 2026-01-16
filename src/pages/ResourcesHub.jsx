// ResourcesHub.jsx - Resources & Research hub for ATLASassist
// Contains: Laws & Rights, Research, Printables, Recommended Products
// FIXED: All items are now ready (no coming soon)

import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Library,
  Scale,
  BookOpen,
  Printer,
  ShoppingBag,
  ExternalLink,
  Search,
  Star,
  Heart,
  Info,
  AlertCircle
} from 'lucide-react';

// Resource sections - ALL READY
const resourceSections = [
  {
    id: 'laws',
    name: 'US & State Resources',
    description: 'Laws, rights & advocacy info',
    icon: Scale,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-500',
    path: '/resources/laws',
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

// Printables preview categories
const PRINTABLES_PREVIEW = [
  { name: 'Visual Schedules', count: 12, emoji: '📅' },
  { name: 'Emotion Charts', count: 8, emoji: '😊' },
  { name: 'Coping Cards', count: 15, emoji: '🧘' },
  { name: 'Social Stories', count: 10, emoji: '📖' },
  { name: 'Token Boards', count: 6, emoji: '⭐' },
  { name: 'First-Then Boards', count: 8, emoji: '➡️' },
];

// Recommended Products Categories - Based on user's preferences
const PRODUCT_CATEGORIES = [
  {
    id: 'gps-safety',
    name: 'GPS & Safety Devices',
    emoji: '📍',
    description: 'Location tracking and safety tools',
    featured: {
      name: 'AngelSense',
      description: 'GPS tracker designed for special needs - includes voice monitoring, safe zones, and 24/7 support',
      url: 'https://www.angelsense.com',
      priceRange: '$$$',
      why: 'Specifically designed for individuals with autism and special needs. Features like voice monitoring and runner prevention alerts.',
    },
    otherProducts: [
      { name: 'Jiobit', priceRange: '$$' },
      { name: 'Apple AirTag', priceRange: '$' },
      { name: 'Tile Pro', priceRange: '$' },
    ],
  },
  {
    id: 'therapy-materials',
    name: 'Therapy & Educational Materials',
    emoji: '📚',
    description: 'Speech, language, and learning resources',
    featured: {
      name: 'Super Duper Publications',
      description: 'Award-winning educational materials for speech-language pathologists, teachers, and parents',
      url: 'https://www.superduperinc.com',
      priceRange: '$$',
      why: 'Trusted by therapists for decades. High-quality materials designed by SLPs. Great articulation cards, language games, and social skills resources.',
    },
    otherProducts: [
      { name: 'LinguiSystems', priceRange: '$$' },
      { name: 'Pro-Ed', priceRange: '$$$' },
      { name: 'Teachers Pay Teachers', priceRange: '$' },
    ],
  },
  {
    id: 'sensory-tools',
    name: 'Sensory Tools & Fidgets',
    emoji: '🧸',
    description: 'Calming and focusing aids',
    featured: {
      name: 'National Autism Resources',
      description: 'Comprehensive autism therapy store with sensory products, educational materials, and daily living aids',
      url: 'https://www.nationalautismresources.com',
      priceRange: '$$',
      why: 'Curated specifically for the autism community. Wide variety of sensory products, weighted items, chewables, and more.',
    },
    otherProducts: [
      { name: 'Fun and Function', priceRange: '$$' },
      { name: 'ARK Therapeutic', priceRange: '$' },
      { name: 'Stimtastic', priceRange: '$' },
    ],
  },
  {
    id: 'communication',
    name: 'AAC & Communication',
    emoji: '💬',
    description: 'Augmentative communication devices',
    featured: {
      name: 'TouchChat',
      description: 'Full-featured AAC app with core word vocabulary and customizable boards',
      url: 'https://touchchatapp.com',
      priceRange: '$$',
      why: 'Widely used by SLPs. Symbol-supported communication with natural voices. Great for building language skills.',
    },
    otherProducts: [
      { name: 'LAMP Words for Life', priceRange: '$$' },
      { name: 'Proloquo2Go', priceRange: '$$$' },
      { name: 'GoTalk Devices', priceRange: '$$$' },
    ],
  },
];

// Featured external resources
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
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
              <Library size={24} />
              Resources & Research
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          📚 Knowledge, tools, and resources to support your journey
        </p>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {resourceSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                disabled={!section.ready}
                className={`
                  relative p-4 rounded-2xl border-4 ${section.borderColor}
                  ${section.color} text-white
                  transition-all duration-200 shadow-crayon
                  ${section.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed grayscale-[30%]'
                  }
                `}
                style={{
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Emoji */}
                <div className="text-3xl mb-2">{section.emoji}</div>

                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <IconComponent size={32} strokeWidth={2.5} />
                </div>

                {/* Name */}
                <h3 className="font-display text-lg crayon-text">
                  {section.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-90 font-crayon mt-1">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Featured External Resources */}
        <div className="mb-8">
          <h2 className="font-display text-lg text-[#8E6BBF] mb-4 flex items-center gap-2">
            <Star size={20} className="text-[#F8D14A]" />
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

        {/* Printables Preview */}
        <div className="mb-8 p-4 bg-orange-50 rounded-2xl border-3 border-[#F5A623]">
          <h2 className="font-display text-[#F5A623] mb-3 flex items-center gap-2">
            <Printer size={20} />
            Printables Library Preview
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {PRINTABLES_PREVIEW.map((item) => (
              <div
                key={item.name}
                className="p-2 bg-white rounded-lg text-center"
              >
                <span className="text-xl">{item.emoji}</span>
                <p className="font-crayon text-xs text-gray-600 mt-1">{item.name}</p>
                <p className="font-display text-sm text-[#F5A623]">{item.count}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/resources/printables')}
            className="mt-3 w-full py-2 bg-[#F5A623] text-white rounded-lg font-crayon text-sm
                     hover:bg-orange-500 transition-colors"
          >
            View All Printables →
          </button>
        </div>

        {/* Products Preview */}
        <div className="p-4 bg-purple-50 rounded-2xl border-3 border-[#8E6BBF]">
          <h2 className="font-display text-[#8E6BBF] mb-3 flex items-center gap-2">
            <ShoppingBag size={20} />
            Recommended Products
          </h2>
          <div className="space-y-2">
            {PRODUCT_CATEGORIES.slice(0, 3).map((cat) => (
              <div
                key={cat.id}
                className="p-2 bg-white rounded-lg flex items-center gap-3"
              >
                <span className="text-xl">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="font-crayon text-sm text-gray-700">{cat.name}</p>
                  <p className="font-crayon text-xs text-gray-500">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/resources/products')}
            className="mt-3 w-full py-2 bg-[#8E6BBF] text-white rounded-lg font-crayon text-sm
                     hover:bg-purple-600 transition-colors"
          >
            View All Products →
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
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
