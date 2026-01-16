// ResourcesHub.jsx - Resources & Research hub for ATLASassist
// Contains: Laws & Rights, Research, Printables, Recommended Products
// Expanded from Knowledge hub in v2.0

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

// Resource sections
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
    ready: false,
    isNew: true,
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
    id: 'medical-id',
    name: 'Medical ID & Alert Systems',
    emoji: '🏥',
    description: 'Emergency medical identification',
    featured: {
      name: 'MedicAlert',
      description: 'The original medical ID service - bracelets, necklaces, and 24/7 emergency response',
      url: 'https://www.medicalert.org',
      priceRange: '$$',
      why: 'Recognized worldwide by first responders. 24/7 emergency hotline connects to your medical records. Non-profit organization.',
    },
    otherProducts: [
      { name: 'Road ID', priceRange: '$' },
      { name: 'American Medical ID', priceRange: '$' },
      { name: 'Lauren\'s Hope', priceRange: '$$' },
    ],
  },
  {
    id: 'sensory',
    name: 'Sensory Tools',
    emoji: '✨',
    description: 'Regulation and sensory support',
    products: [
      { name: 'Weighted Blankets', priceRange: '$$', popular: true },
      { name: 'Noise-Canceling Headphones', priceRange: '$$-$$$' },
      { name: 'Fidget Tools', priceRange: '$' },
      { name: 'Chewelry', priceRange: '$' },
      { name: 'Compression Clothing', priceRange: '$$' },
      { name: 'Sensory Swings', priceRange: '$$-$$$' },
    ],
  },
  {
    id: 'aac',
    name: 'AAC Devices & Apps',
    emoji: '💬',
    description: 'Communication tools',
    products: [
      { name: 'TouchChat (app)', priceRange: '$$' },
      { name: 'Proloquo2Go (app)', priceRange: '$$$' },
      { name: 'LAMP Words for Life', priceRange: '$$$' },
      { name: 'GoTalk Devices', priceRange: '$$$' },
      { name: 'Tobii Dynavox', priceRange: '$$$$' },
    ],
  },
  {
    id: 'adaptive',
    name: 'Adaptive Products',
    emoji: '👕',
    description: 'Clothing and daily living aids',
    products: [
      { name: 'Adaptive Clothing', priceRange: '$$' },
      { name: 'Seamless Socks', priceRange: '$' },
      { name: 'Tagless Clothing', priceRange: '$' },
      { name: 'Easy-Fasten Shoes', priceRange: '$$' },
      { name: 'Weighted Utensils', priceRange: '$' },
    ],
  },
];

// Research topics preview
const RESEARCH_TOPICS = [
  { name: 'Autism & Neurodiversity', emoji: '🧠' },
  { name: 'Communication & AAC', emoji: '💬' },
  { name: 'Behavior & Regulation', emoji: '🧘' },
  { name: 'Education & IEPs', emoji: '📚' },
  { name: 'Transition to Adulthood', emoji: '🎓' },
];

// External resources
const EXTERNAL_RESOURCES = [
  { name: 'Understood.org', url: 'https://understood.org', description: 'Learning differences resources' },
  { name: 'Autism Speaks', url: 'https://autismspeaks.org', description: 'Autism resources & toolkits' },
  { name: 'ASAN', url: 'https://autisticadvocacy.org', description: 'Autistic Self Advocacy Network' },
  { name: 'Wrightslaw', url: 'https://wrightslaw.com', description: 'Special education law' },
  { name: 'ARASAAC', url: 'https://arasaac.org', description: 'Free AAC pictograms' },
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
          📚 Knowledge, tools & trusted resources for your journey
        </p>

        {/* Section Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {resourceSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              disabled={!section.ready}
              className={`relative ${section.color} ${section.borderColor} border-4 rounded-2xl p-4 
                         shadow-crayon transition-all duration-200 
                         flex flex-col items-center gap-3 text-white
                         ${section.ready 
                           ? 'hover:shadow-crayon-lg hover:scale-105 active:scale-95' 
                           : 'opacity-70 cursor-not-allowed'}`}
              style={{
                borderRadius: '20px 40px 20px 40px / 40px 20px 40px 20px',
              }}
            >
              {/* NEW Badge */}
              {section.isNew && (
                <span className="absolute -top-2 -right-2 bg-[#E63B2E] text-white text-xs font-display 
                                 px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  NEW
                </span>
              )}
              
              {/* Coming Soon Badge */}
              {!section.ready && (
                <span className="absolute -top-2 left-2 bg-gray-500 text-white text-xs font-display 
                                 px-2 py-0.5 rounded-full shadow-md">
                  Soon
                </span>
              )}

              {/* Icon */}
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{section.emoji}</span>
              </div>
              
              {/* Text */}
              <div className="text-center">
                <h3 className="font-display text-base leading-tight">
                  {section.name}
                </h3>
                <p className="font-crayon text-xs text-white/80 mt-1">
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Printables Preview */}
        <div className="p-4 bg-[#F5A623]/10 rounded-2xl border-3 border-[#F5A623]/30 mb-6">
          <h3 className="font-display text-[#F5A623] mb-3 flex items-center gap-2">
            <Printer size={18} />
            Printables Library Preview
          </h3>
          <p className="font-crayon text-sm text-gray-600 mb-3">
            Coming soon: Free downloadable resources you can print at home!
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PRINTABLES_PREVIEW.map((cat, i) => (
              <div 
                key={i}
                className="p-2 bg-white rounded-xl text-center"
              >
                <span className="text-xl">{cat.emoji}</span>
                <p className="font-crayon text-xs text-gray-600 mt-1">{cat.name}</p>
                <p className="font-crayon text-xs text-[#F5A623]">{cat.count} items</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Products Preview */}
        <div className="p-4 bg-[#8E6BBF]/10 rounded-2xl border-3 border-[#8E6BBF]/30 mb-6">
          <h3 className="font-display text-[#8E6BBF] mb-3 flex items-center gap-2">
            <ShoppingBag size={18} />
            Recommended Products Preview
          </h3>
          
          {/* FTC Disclosure */}
          <div className="p-2 bg-amber-50 rounded-lg mb-3 flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-amber-700">
              <strong>Disclosure:</strong> Some links may be affiliate links. We only recommend products we believe in. 
              Purchases help support ATLASassist at no extra cost to you.
            </p>
          </div>

          {/* Featured Products */}
          <div className="space-y-3">
            {PRODUCT_CATEGORIES.slice(0, 3).map((category) => (
              <div key={category.id} className="p-3 bg-white rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{category.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-display text-sm text-gray-800">{category.name}</h4>
                    {category.featured && (
                      <>
                        <p className="font-crayon text-xs text-gray-500 mt-1">
                          Featured: <span className="text-[#8E6BBF] font-bold">{category.featured.name}</span>
                        </p>
                        <p className="font-crayon text-xs text-gray-400 mt-0.5">
                          {category.featured.description.substring(0, 80)}...
                        </p>
                        <a 
                          href={category.featured.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 font-crayon text-xs text-[#4A9FD4] hover:underline"
                        >
                          Learn more <ExternalLink size={10} />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Categories Coming */}
          <div className="mt-3 flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.slice(3).map((category) => (
              <span 
                key={category.id}
                className="px-3 py-1 bg-white rounded-full text-xs font-crayon text-gray-500"
              >
                {category.emoji} {category.name}
              </span>
            ))}
          </div>
        </div>

        {/* Research Topics Preview */}
        <div className="p-4 bg-[#5CB85C]/10 rounded-2xl border-3 border-[#5CB85C]/30 mb-6">
          <h3 className="font-display text-[#5CB85C] mb-3 flex items-center gap-2">
            <BookOpen size={18} />
            Research Topics Coming Soon
          </h3>
          <p className="font-crayon text-sm text-gray-600 mb-3">
            Evidence-based articles and summaries in plain language
          </p>
          <div className="flex flex-wrap gap-2">
            {RESEARCH_TOPICS.map((topic, i) => (
              <span 
                key={i}
                className="px-3 py-1.5 bg-white rounded-full text-sm font-crayon text-gray-600"
              >
                {topic.emoji} {topic.name}
              </span>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div className="p-4 bg-white rounded-2xl border-3 border-gray-200 shadow-sm">
          <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
            <ExternalLink size={18} className="text-[#4A9FD4]" />
            Trusted External Resources
          </h3>
          <div className="space-y-2">
            {EXTERNAL_RESOURCES.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-display text-sm text-[#4A9FD4]">{resource.name}</p>
                  <p className="font-crayon text-xs text-gray-500">{resource.description}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesHub;
