// RecommendedProducts.jsx - Curated Product Recommendations
// Assistive technology, sensory tools, and helpful products
// Part of the Resources & Research hub

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag,
  Search,
  X,
  ExternalLink,
  Star,
  Heart,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Tag,
  Info,
  Sparkles,
  Volume2,
  Eye,
  Hand,
  Brain,
  BookOpen,
  Smartphone,
  Home,
  Shirt,
  Utensils,
  Car,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_product_favorites';

// ============================================
// PRODUCT CATEGORIES
// ============================================
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: ShoppingBag, color: '#4A9FD4' },
  { id: 'sensory', name: 'Sensory Tools', icon: Hand, color: '#8E6BBF' },
  { id: 'communication', name: 'Communication & AAC', icon: Volume2, color: '#F5A623' },
  { id: 'visual', name: 'Visual Supports', icon: Eye, color: '#5CB85C' },
  { id: 'fidgets', name: 'Fidgets & Calm', icon: Sparkles, color: '#E86B9A' },
  { id: 'learning', name: 'Learning & Education', icon: GraduationCap, color: '#20B2AA' },
  { id: 'daily-living', name: 'Daily Living', icon: Home, color: '#E63B2E' },
  { id: 'books', name: 'Books & Guides', icon: BookOpen, color: '#64748B' },
  { id: 'apps', name: 'Apps & Technology', icon: Smartphone, color: '#0891B2' },
];

// ============================================
// PRICE RANGES
// ============================================
const PRICE_RANGES = [
  { id: 'all', name: 'All Prices', min: 0, max: Infinity },
  { id: 'under-25', name: 'Under $25', min: 0, max: 25 },
  { id: '25-50', name: '$25 - $50', min: 25, max: 50 },
  { id: '50-100', name: '$50 - $100', min: 50, max: 100 },
  { id: 'over-100', name: 'Over $100', min: 100, max: Infinity },
];

// ============================================
// PRODUCTS DATA
// ============================================
const PRODUCTS = [
  // SENSORY TOOLS
  {
    id: 'weighted-blanket',
    name: 'Weighted Blanket for Kids',
    category: 'sensory',
    description: 'Provides deep pressure input for calming. Great for sleep and relaxation. Choose weight based on 10% of body weight.',
    price: 45,
    priceRange: '$40-60',
    rating: 4.8,
    reviewCount: 2500,
    tags: ['calming', 'sleep', 'deep pressure'],
    ageRange: 'Ages 3+',
    amazonSearch: 'weighted blanket kids autism',
    featured: true,
    whyWeRecommend: 'Deep pressure has strong research support for calming the nervous system.',
  },
  {
    id: 'noise-canceling-headphones',
    name: 'Kids Noise-Canceling Headphones',
    category: 'sensory',
    description: 'Reduces overwhelming sounds in loud environments. Adjustable, comfortable for extended wear.',
    price: 50,
    priceRange: '$30-80',
    rating: 4.7,
    reviewCount: 1800,
    tags: ['auditory', 'noise reduction', 'school'],
    ageRange: 'Ages 2+',
    amazonSearch: 'noise canceling headphones kids sensory',
    featured: true,
    whyWeRecommend: 'Essential for managing auditory sensitivities in school, stores, and events.',
  },
  {
    id: 'compression-vest',
    name: 'Compression Vest',
    category: 'sensory',
    description: 'Provides proprioceptive input throughout the day. Can be worn under clothing.',
    price: 35,
    priceRange: '$25-50',
    rating: 4.5,
    reviewCount: 800,
    tags: ['proprioceptive', 'calming', 'wearable'],
    ageRange: 'Ages 3+',
    amazonSearch: 'compression vest kids autism sensory',
    whyWeRecommend: 'Helps with body awareness and staying regulated during activities.',
  },
  {
    id: 'sensory-swing',
    name: 'Indoor Sensory Swing',
    category: 'sensory',
    description: 'Provides vestibular input and a cozy retreat. Can hang from doorway or ceiling mount.',
    price: 40,
    priceRange: '$30-70',
    rating: 4.7,
    reviewCount: 3200,
    tags: ['vestibular', 'calming', 'movement'],
    ageRange: 'Ages 3+',
    amazonSearch: 'sensory swing indoor kids autism',
    featured: true,
    whyWeRecommend: 'Swinging provides powerful vestibular input that helps with regulation.',
  },
  {
    id: 'chewelry',
    name: 'Chewable Sensory Necklace',
    category: 'sensory',
    description: 'Safe, food-grade silicone for oral sensory seekers. Reduces chewing on clothes/objects.',
    price: 12,
    priceRange: '$8-15',
    rating: 4.6,
    reviewCount: 1500,
    tags: ['oral sensory', 'chewing', 'wearable'],
    ageRange: 'Ages 3+',
    amazonSearch: 'chew necklace sensory kids',
    whyWeRecommend: 'Provides appropriate oral input for children who need to chew.',
  },
  {
    id: 'body-sock',
    name: 'Sensory Body Sock',
    category: 'sensory',
    description: 'Stretchy fabric provides full-body proprioceptive input. Great for movement activities.',
    price: 25,
    priceRange: '$15-35',
    rating: 4.6,
    reviewCount: 900,
    tags: ['proprioceptive', 'movement', 'play'],
    ageRange: 'Ages 3-12',
    amazonSearch: 'sensory body sock kids',
    whyWeRecommend: 'Combines deep pressure with movement for regulating activities.',
  },
  
  // FIDGETS & CALM
  {
    id: 'fidget-cube',
    name: 'Fidget Cube',
    category: 'fidgets',
    description: 'Six sides of quiet fidgeting options. Great for focus during class or homework.',
    price: 10,
    priceRange: '$8-15',
    rating: 4.5,
    reviewCount: 5000,
    tags: ['focus', 'quiet', 'portable'],
    ageRange: 'Ages 5+',
    amazonSearch: 'fidget cube autism',
    whyWeRecommend: 'Quiet fidgeting can help with focus and self-regulation.',
  },
  {
    id: 'stress-balls',
    name: 'Sensory Stress Ball Set',
    category: 'fidgets',
    description: 'Variety pack with different textures and resistance levels for hand strengthening and calming.',
    price: 15,
    priceRange: '$10-20',
    rating: 4.6,
    reviewCount: 2200,
    tags: ['stress relief', 'hand strength', 'variety'],
    ageRange: 'Ages 3+',
    amazonSearch: 'stress balls sensory kids variety',
    whyWeRecommend: 'Squeezing provides proprioceptive input to hands and helps release tension.',
  },
  {
    id: 'liquid-motion-timer',
    name: 'Liquid Motion Bubbler Timer',
    category: 'fidgets',
    description: 'Mesmerizing visual timer for calming. Great for transitions and waiting.',
    price: 12,
    priceRange: '$8-20',
    rating: 4.7,
    reviewCount: 1800,
    tags: ['visual', 'calming', 'timer'],
    ageRange: 'Ages 3+',
    amazonSearch: 'liquid motion bubbler timer sensory',
    featured: true,
    whyWeRecommend: 'Visual timers help with transitions and the slow motion is calming.',
  },
  {
    id: 'pop-it',
    name: 'Push Pop Fidget Toy',
    category: 'fidgets',
    description: 'Silicone bubble popping toy. Satisfying tactile and auditory feedback.',
    price: 8,
    priceRange: '$5-15',
    rating: 4.7,
    reviewCount: 15000,
    tags: ['tactile', 'portable', 'popular'],
    ageRange: 'Ages 3+',
    amazonSearch: 'pop it fidget toy silicone',
    whyWeRecommend: 'The popping provides satisfying sensory feedback without being distracting.',
  },
  {
    id: 'calm-down-jar',
    name: 'Calm Down Glitter Jar',
    category: 'fidgets',
    description: 'Shake and watch glitter settle. Visual meditation tool for calming.',
    price: 15,
    priceRange: '$10-25',
    rating: 4.5,
    reviewCount: 600,
    tags: ['visual', 'calming', 'mindfulness'],
    ageRange: 'Ages 3+',
    amazonSearch: 'calm down jar glitter sensory',
    whyWeRecommend: 'Watching glitter settle can help slow breathing and calm the mind.',
  },
  
  // COMMUNICATION & AAC
  {
    id: 'aac-device-basic',
    name: 'GoTalk Communication Device',
    category: 'communication',
    description: 'Durable AAC device with customizable buttons. Records messages for communication.',
    price: 150,
    priceRange: '$100-200',
    rating: 4.6,
    reviewCount: 400,
    tags: ['AAC', 'speech', 'durable'],
    ageRange: 'Ages 2+',
    amazonSearch: 'gotalk aac communication device',
    featured: true,
    whyWeRecommend: 'Dedicated AAC devices are durable and always available for communication.',
  },
  {
    id: 'pecs-starter',
    name: 'PECS Communication Book Starter Kit',
    category: 'communication',
    description: 'Picture Exchange Communication System starter materials. Includes binder and starter pictures.',
    price: 40,
    priceRange: '$30-60',
    rating: 4.5,
    reviewCount: 300,
    tags: ['PECS', 'pictures', 'exchange'],
    ageRange: 'Ages 2+',
    amazonSearch: 'PECS communication book autism',
    whyWeRecommend: 'PECS is an evidence-based approach for building communication skills.',
  },
  {
    id: 'core-board',
    name: 'Core Vocabulary Communication Board',
    category: 'communication',
    description: 'Low-tech communication board with core words. Laminated for durability.',
    price: 20,
    priceRange: '$15-30',
    rating: 4.4,
    reviewCount: 200,
    tags: ['core words', 'low-tech', 'portable'],
    ageRange: 'Ages 2+',
    amazonSearch: 'core vocabulary board AAC',
    whyWeRecommend: 'Core vocabulary boards are a great backup and learning tool for AAC.',
  },
  {
    id: 'talking-buttons',
    name: 'Recordable Talking Buttons (4-pack)',
    category: 'communication',
    description: 'Record custom messages. Great for choice-making and simple communication.',
    price: 25,
    priceRange: '$20-35',
    rating: 4.6,
    reviewCount: 800,
    tags: ['recordable', 'choices', 'simple'],
    ageRange: 'Ages 1+',
    amazonSearch: 'recordable talking buttons communication',
    whyWeRecommend: 'Simple way to offer choices and practice communication.',
  },
  
  // VISUAL SUPPORTS
  {
    id: 'visual-schedule-kit',
    name: 'Visual Schedule Kit with Velcro',
    category: 'visual',
    description: 'Magnetic or velcro visual schedule board with picture cards for daily routines.',
    price: 30,
    priceRange: '$20-45',
    rating: 4.7,
    reviewCount: 1200,
    tags: ['schedule', 'routine', 'pictures'],
    ageRange: 'Ages 2+',
    amazonSearch: 'visual schedule board autism velcro',
    featured: true,
    whyWeRecommend: 'Visual schedules are one of the most effective supports for predictability.',
  },
  {
    id: 'time-timer',
    name: 'Time Timer Visual Timer',
    category: 'visual',
    description: 'Shows time remaining as disappearing red disk. Helps with transitions and time awareness.',
    price: 35,
    priceRange: '$25-45',
    rating: 4.8,
    reviewCount: 3500,
    tags: ['timer', 'transitions', 'time'],
    ageRange: 'Ages 3+',
    amazonSearch: 'time timer visual',
    featured: true,
    whyWeRecommend: 'Visual representation of time passing helps with transitions and waiting.',
  },
  {
    id: 'first-then-board',
    name: 'First-Then Board',
    category: 'visual',
    description: 'Portable first-then board for motivation and sequencing. Includes blank cards.',
    price: 18,
    priceRange: '$12-25',
    rating: 4.5,
    reviewCount: 500,
    tags: ['first-then', 'motivation', 'sequence'],
    ageRange: 'Ages 2+',
    amazonSearch: 'first then board autism visual',
    whyWeRecommend: 'First-then boards are simple but powerful for motivation and compliance.',
  },
  {
    id: 'emotion-cards',
    name: 'Emotion Picture Cards Set',
    category: 'visual',
    description: 'Real photo emotion cards for identifying and discussing feelings.',
    price: 20,
    priceRange: '$15-30',
    rating: 4.6,
    reviewCount: 700,
    tags: ['emotions', 'feelings', 'photos'],
    ageRange: 'Ages 3+',
    amazonSearch: 'emotion cards autism feelings pictures',
    whyWeRecommend: 'Visual emotion cards help with emotional literacy and communication.',
  },
  {
    id: 'token-board',
    name: 'Token Board Reward System',
    category: 'visual',
    description: 'Visual token economy board with stars/tokens. Great for motivation.',
    price: 15,
    priceRange: '$10-25',
    rating: 4.5,
    reviewCount: 400,
    tags: ['rewards', 'motivation', 'behavior'],
    ageRange: 'Ages 3+',
    amazonSearch: 'token board autism reward system',
    whyWeRecommend: 'Token economies are evidence-based for building motivation and skills.',
  },
  
  // DAILY LIVING
  {
    id: 'weighted-utensils',
    name: 'Weighted Utensils for Kids',
    category: 'daily-living',
    description: 'Heavier utensils provide proprioceptive feedback. Helps with grip and control.',
    price: 25,
    priceRange: '$20-35',
    rating: 4.4,
    reviewCount: 300,
    tags: ['eating', 'proprioceptive', 'fine motor'],
    ageRange: 'Ages 3+',
    amazonSearch: 'weighted utensils kids sensory',
    whyWeRecommend: 'Weight provides better awareness and can improve mealtime skills.',
  },
  {
    id: 'adaptive-clothing',
    name: 'Sensory-Friendly Clothing (Tagless)',
    category: 'daily-living',
    description: 'Seamless, tagless clothing for tactile sensitivity. Soft fabrics, flat seams.',
    price: 25,
    priceRange: '$15-40',
    rating: 4.6,
    reviewCount: 900,
    tags: ['clothing', 'tactile', 'comfort'],
    ageRange: 'All ages',
    amazonSearch: 'sensory friendly clothing kids tagless seamless',
    whyWeRecommend: 'Clothing issues can cause major daily struggles - these help!',
  },
  {
    id: 'potty-watch',
    name: 'Potty Training Watch',
    category: 'daily-living',
    description: 'Vibrating reminder watch for toilet training. Music and lights as prompts.',
    price: 20,
    priceRange: '$15-30',
    rating: 4.3,
    reviewCount: 1500,
    tags: ['potty training', 'reminder', 'timer'],
    ageRange: 'Ages 2+',
    amazonSearch: 'potty training watch timer kids',
    whyWeRecommend: 'Consistent prompts are key for toilet training success.',
  },
  {
    id: 'visual-task-cards',
    name: 'Self-Care Visual Task Cards',
    category: 'daily-living',
    description: 'Step-by-step picture cards for brushing teeth, washing hands, getting dressed.',
    price: 18,
    priceRange: '$12-25',
    rating: 4.7,
    reviewCount: 600,
    tags: ['self-care', 'routine', 'independence'],
    ageRange: 'Ages 2+',
    amazonSearch: 'visual task cards self care autism',
    whyWeRecommend: 'Breaking tasks into steps builds independence.',
  },
  
  // LEARNING & EDUCATION
  {
    id: 'social-skills-games',
    name: 'Social Skills Board Games Bundle',
    category: 'learning',
    description: 'Games that teach turn-taking, emotions, perspective-taking in fun way.',
    price: 35,
    priceRange: '$25-50',
    rating: 4.6,
    reviewCount: 800,
    tags: ['social skills', 'games', 'fun'],
    ageRange: 'Ages 4+',
    amazonSearch: 'social skills board games autism kids',
    featured: true,
    whyWeRecommend: 'Learning social skills through play is engaging and effective.',
  },
  {
    id: 'zones-curriculum',
    name: 'Zones of Regulation Curriculum',
    category: 'learning',
    description: 'Complete curriculum for teaching emotional regulation. Used in schools worldwide.',
    price: 50,
    priceRange: '$40-60',
    rating: 4.8,
    reviewCount: 500,
    tags: ['regulation', 'curriculum', 'emotions'],
    ageRange: 'Ages 4+',
    amazonSearch: 'zones of regulation curriculum book',
    whyWeRecommend: 'Evidence-based program used by thousands of schools and therapists.',
  },
  {
    id: 'social-stories-book',
    name: 'Social Stories Book Collection',
    category: 'learning',
    description: 'Ready-made social stories for common situations. By Carol Gray.',
    price: 30,
    priceRange: '$20-40',
    rating: 4.7,
    reviewCount: 400,
    tags: ['social stories', 'book', 'situations'],
    ageRange: 'Ages 3+',
    amazonSearch: 'social stories book autism carol gray',
    whyWeRecommend: 'Social stories are an evidence-based practice for teaching expectations.',
  },
  {
    id: 'handwriting-program',
    name: 'Handwriting Without Tears Kit',
    category: 'learning',
    description: 'Multi-sensory handwriting program. Includes workbook and manipulatives.',
    price: 40,
    priceRange: '$30-50',
    rating: 4.7,
    reviewCount: 2000,
    tags: ['handwriting', 'fine motor', 'multi-sensory'],
    ageRange: 'Ages 4+',
    amazonSearch: 'handwriting without tears kit',
    whyWeRecommend: 'Multi-sensory approach works well for different learning styles.',
  },
  
  // BOOKS & GUIDES
  {
    id: 'uniquely-human',
    name: 'Uniquely Human by Barry Prizant',
    category: 'books',
    description: 'A different way of seeing autism. Compassionate, strength-based approach.',
    price: 18,
    priceRange: '$15-20',
    rating: 4.8,
    reviewCount: 2500,
    tags: ['autism', 'understanding', 'strengths'],
    ageRange: 'Parents/Educators',
    amazonSearch: 'uniquely human barry prizant book',
    featured: true,
    whyWeRecommend: 'Essential reading for understanding autism from a neurodiversity perspective.',
  },
  {
    id: 'thinking-in-pictures',
    name: 'Thinking in Pictures by Temple Grandin',
    category: 'books',
    description: 'Autobiography by Temple Grandin explaining how she thinks and perceives.',
    price: 16,
    priceRange: '$12-18',
    rating: 4.7,
    reviewCount: 3000,
    tags: ['autism', 'autobiography', 'understanding'],
    ageRange: 'Teens/Adults',
    amazonSearch: 'thinking in pictures temple grandin',
    whyWeRecommend: 'First-hand perspective from a successful autistic adult.',
  },
  {
    id: 'raising-human-beings',
    name: 'Raising Human Beings by Ross Greene',
    category: 'books',
    description: 'Collaborative problem-solving approach to parenting. Works for all kids.',
    price: 17,
    priceRange: '$14-20',
    rating: 4.8,
    reviewCount: 1500,
    tags: ['parenting', 'behavior', 'collaborative'],
    ageRange: 'Parents',
    amazonSearch: 'raising human beings ross greene',
    whyWeRecommend: 'Collaborative Problem Solving is an evidence-based approach to behavior.',
  },
  {
    id: 'neurotribes',
    name: 'NeuroTribes by Steve Silberman',
    category: 'books',
    description: 'History of autism and the neurodiversity movement. Pulitzer Prize-worthy.',
    price: 18,
    priceRange: '$15-20',
    rating: 4.8,
    reviewCount: 4000,
    tags: ['autism', 'history', 'neurodiversity'],
    ageRange: 'Adults',
    amazonSearch: 'neurotribes steve silberman',
    whyWeRecommend: 'Understanding the history helps understand the present.',
  },
  
  // APPS & TECHNOLOGY
  {
    id: 'proloquo2go',
    name: 'Proloquo2Go (AAC App)',
    category: 'apps',
    description: 'Symbol-based AAC app for iPad/iPhone. Industry-leading with customization.',
    price: 250,
    priceRange: '$250',
    rating: 4.7,
    reviewCount: 1200,
    tags: ['AAC', 'iPad', 'communication'],
    ageRange: 'Ages 2+',
    link: 'https://www.assistiveware.com/products/proloquo2go',
    whyWeRecommend: 'Gold standard AAC app with robust vocabulary and customization.',
  },
  {
    id: 'touchchat',
    name: 'TouchChat (AAC App)',
    category: 'apps',
    description: 'Full-featured AAC app with multiple vocabulary options. iOS and Android.',
    price: 300,
    priceRange: '$150-300',
    rating: 4.6,
    reviewCount: 500,
    tags: ['AAC', 'communication', 'vocabulary'],
    ageRange: 'Ages 2+',
    link: 'https://touchchatapp.com/',
    whyWeRecommend: 'Excellent AAC option with WordPower vocabulary.',
  },
  {
    id: 'choiceworks',
    name: 'Choiceworks (Schedule App)',
    category: 'apps',
    description: 'Visual schedule and waiting app. Customizable with your own photos.',
    price: 7,
    priceRange: '$7',
    rating: 4.5,
    reviewCount: 800,
    tags: ['schedule', 'waiting', 'visual'],
    ageRange: 'Ages 2+',
    link: 'https://apps.apple.com/app/choiceworks/id486210964',
    whyWeRecommend: 'Affordable, easy-to-use visual schedule app.',
  },
  {
    id: 'calm-app',
    name: 'Calm (Meditation App)',
    category: 'apps',
    description: 'Guided meditations and sleep stories. Kids section available.',
    price: 70,
    priceRange: '$70/year',
    rating: 4.8,
    reviewCount: 50000,
    tags: ['calm', 'meditation', 'sleep'],
    ageRange: 'Ages 6+',
    link: 'https://www.calm.com/',
    whyWeRecommend: 'Great for teaching calming and mindfulness skills.',
  },
];

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const category = CATEGORIES.find(c => c.id === product.category);
  
  const handleBuyClick = () => {
    // Generate Amazon search URL
    const searchUrl = product.link || 
      `https://www.amazon.com/s?k=${encodeURIComponent(product.amazonSearch)}`;
    window.open(searchUrl, '_blank');
  };
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden hover:shadow-md transition-all">
      {/* Image Placeholder / Category Color Block */}
      <div 
        className="h-32 flex items-center justify-center relative"
        style={{ backgroundColor: `${category?.color}15` }}
      >
        {(() => {
          const Icon = category?.icon || ShoppingBag;
          return <Icon size={48} style={{ color: category?.color }} className="opacity-40" />;
        })()}
        
        {/* Featured Badge */}
        {product.featured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 
                         text-xs font-display rounded-full flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 transition-colors ${
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-sm text-gray-800 leading-tight">
            {product.name}
          </h3>
        </div>
        
        <p className="font-crayon text-xs text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-crayon text-white"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
          <span className="flex items-center gap-0.5 text-xs font-crayon text-yellow-600">
            <Star size={12} fill="currentColor" />
            {product.rating}
          </span>
          <span className="text-xs font-crayon text-gray-400">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>
        
        {/* Why We Recommend */}
        {product.whyWeRecommend && (
          <p className="text-xs font-crayon text-gray-600 italic mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
            💡 {product.whyWeRecommend}
          </p>
        )}
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-lg text-gray-800">{product.priceRange}</span>
            <span className="font-crayon text-xs text-gray-400 block">{product.ageRange}</span>
          </div>
          <button
            onClick={handleBuyClick}
            className="px-4 py-2 rounded-xl font-display text-sm text-white
                     hover:opacity-90 transition-opacity flex items-center gap-1"
            style={{ backgroundColor: category?.color }}
          >
            View <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const RecommendedProducts = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);
  
  // Save favorites
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);
  
  // Toggle favorite
  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  // Filter products
  const filteredProducts = PRODUCTS.filter(product => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    
    // Price filter
    const priceRange = PRICE_RANGES.find(p => p.id === selectedPriceRange);
    if (priceRange && (product.price < priceRange.min || product.price > priceRange.max)) return false;
    
    // Favorites filter
    if (showFavoritesOnly && !favorites.includes(product.id)) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Get featured products
  const featuredProducts = PRODUCTS.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
              <ShoppingBag size={24} />
              Recommended Products
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Affiliate Disclosure */}
        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-start gap-3">
          <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-crayon text-sm text-blue-800">
              <strong>Affiliate Disclosure:</strong> Some links may be affiliate links. 
              This means we may earn a small commission if you purchase through our links, 
              at no extra cost to you. This helps support ATLASassist. We only recommend 
              products we genuinely believe in.
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#F5A623] 
                     outline-none font-crayon transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Filter Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Category Pills - Scrollable */}
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-crayon text-sm whitespace-nowrap
                          transition-all ${
                            selectedCategory === cat.id 
                              ? 'text-white shadow-md' 
                              : 'bg-white border-2 border-gray-200 text-gray-600'
                          }`}
                style={{
                  backgroundColor: selectedCategory === cat.id ? cat.color : undefined
                }}
              >
                {(() => {
                  const Icon = cat.icon;
                  return <Icon size={14} />;
                })()}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Secondary Filters */}
        <div className="flex items-center gap-2 mb-4">
          {/* Price Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-xl font-crayon text-sm"
            >
              <DollarSign size={14} />
              {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.name}
              <ChevronDown size={14} />
            </button>
            
            {showFilters && (
              <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 py-1">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.id}
                    onClick={() => { setSelectedPriceRange(range.id); setShowFilters(false); }}
                    className={`w-full px-4 py-2 text-left font-crayon text-sm hover:bg-gray-50 ${
                      selectedPriceRange === range.id ? 'text-[#F5A623]' : 'text-gray-600'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-crayon text-sm transition-colors ${
              showFavoritesOnly 
                ? 'bg-red-100 text-red-600 border-2 border-red-300' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Heart size={14} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            Favorites ({favorites.length})
          </button>
        </div>
        
        {/* Featured Products (only when not filtering) */}
        {!searchQuery && selectedCategory === 'all' && !showFavoritesOnly && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" fill="currentColor" />
              Staff Picks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Product Grid */}
        <div>
          <h2 className="font-display text-gray-700 mb-3">
            {showFavoritesOnly ? 'My Favorites' : 
             selectedCategory === 'all' ? 'All Products' : 
             CATEGORIES.find(c => c.id === selectedCategory)?.name}
            <span className="font-crayon text-sm text-gray-400 ml-2">
              ({filteredProducts.length} products)
            </span>
          </h2>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-crayon text-gray-500">No products found</p>
              <p className="font-crayon text-sm text-gray-400">Try a different search or filter</p>
            </div>
          )}
        </div>
        
        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <h3 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Product Recommendations Disclaimer
          </h3>
          <p className="font-crayon text-xs text-gray-500">
            These recommendations are based on research, user reviews, and professional input. 
            However, every individual is different. What works for one person may not work for another. 
            Always consult with therapists and professionals for personalized recommendations. 
            Prices and availability may vary.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RecommendedProducts;
