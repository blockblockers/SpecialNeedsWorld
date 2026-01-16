// RecommendedProducts.jsx - Curated Product Recommendations
// FIXED: Removed image placeholder section from cards for cleaner look
// Assistive technology, sensory tools, and helpful products

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
    description: 'Provides constant deep pressure throughout the day. Discreet under clothing.',
    price: 35,
    priceRange: '$25-50',
    rating: 4.5,
    reviewCount: 900,
    tags: ['deep pressure', 'wearable', 'school'],
    ageRange: 'Ages 3+',
    amazonSearch: 'compression vest kids sensory autism',
    whyWeRecommend: 'Great for ongoing regulation during school or activities.',
  },
  {
    id: 'chew-necklace',
    name: 'Sensory Chew Necklace',
    category: 'sensory',
    description: 'Safe, non-toxic silicone chew for oral sensory seekers. Multiple textures available.',
    price: 12,
    priceRange: '$8-15',
    rating: 4.6,
    reviewCount: 3500,
    tags: ['oral', 'chewing', 'discreet'],
    ageRange: 'Ages 3+',
    amazonSearch: 'sensory chew necklace kids',
    featured: true,
    whyWeRecommend: 'Redirects chewing to a safe, appropriate outlet.',
  },
  
  // FIDGETS & CALM
  {
    id: 'fidget-cube',
    name: 'Fidget Cube',
    category: 'fidgets',
    description: 'Six-sided cube with different tactile activities. Quiet, classroom-friendly.',
    price: 10,
    priceRange: '$8-15',
    rating: 4.5,
    reviewCount: 12000,
    tags: ['tactile', 'quiet', 'classroom'],
    ageRange: 'Ages 5+',
    amazonSearch: 'fidget cube sensory',
    whyWeRecommend: 'Multiple sensory inputs in one discreet package.',
  },
  {
    id: 'liquid-motion-timer',
    name: 'Liquid Motion Timer',
    category: 'fidgets',
    description: 'Mesmerizing visual timer with colored liquid. Great for calm-down corners.',
    price: 12,
    priceRange: '$10-20',
    rating: 4.7,
    reviewCount: 2200,
    tags: ['visual', 'calming', 'timer'],
    ageRange: 'All ages',
    amazonSearch: 'liquid motion timer sensory',
    whyWeRecommend: 'Combines visual stimulation with natural timing for transitions.',
  },
  {
    id: 'pop-it-fidget',
    name: 'Pop It Fidget Toy',
    category: 'fidgets',
    description: 'Satisfying bubble-popping sensation. Available in many shapes and sizes.',
    price: 8,
    priceRange: '$5-15',
    rating: 4.6,
    reviewCount: 25000,
    tags: ['tactile', 'auditory', 'popular'],
    ageRange: 'Ages 3+',
    amazonSearch: 'pop it fidget toy',
    featured: true,
    whyWeRecommend: 'Affordable, effective, and loved by kids.',
  },
  
  // VISUAL SUPPORTS
  {
    id: 'visual-timer',
    name: 'Time Timer Visual Timer',
    category: 'visual',
    description: 'Shows time passing with a red disk. Makes abstract time concrete and visible.',
    price: 35,
    priceRange: '$30-45',
    rating: 4.8,
    reviewCount: 5000,
    tags: ['time', 'transitions', 'visual'],
    ageRange: 'All ages',
    amazonSearch: 'time timer visual',
    featured: true,
    whyWeRecommend: 'The gold standard for visual time management. Reduces transition anxiety.',
  },
  {
    id: 'picture-schedule-cards',
    name: 'Visual Schedule Picture Cards',
    category: 'visual',
    description: 'Laminated cards with daily routine images. Velcro-compatible.',
    price: 20,
    priceRange: '$15-30',
    rating: 4.6,
    reviewCount: 1500,
    tags: ['schedule', 'routine', 'pictures'],
    ageRange: 'Ages 2+',
    amazonSearch: 'visual schedule cards autism',
    whyWeRecommend: 'Essential for establishing predictable routines.',
  },
  
  // COMMUNICATION & AAC
  {
    id: 'communication-buttons',
    name: 'Recordable Communication Buttons',
    category: 'communication',
    description: 'Set of 4 buttons to record custom messages. Great for choice-making.',
    price: 25,
    priceRange: '$20-35',
    rating: 4.5,
    reviewCount: 800,
    tags: ['AAC', 'choices', 'recording'],
    ageRange: 'All ages',
    amazonSearch: 'recordable buttons communication',
    whyWeRecommend: 'Affordable way to introduce AAC concepts.',
  },
  {
    id: 'pecs-starter-kit',
    name: 'PECS Communication Kit',
    category: 'communication',
    description: 'Picture Exchange Communication System starter set with common symbols.',
    price: 45,
    priceRange: '$35-60',
    rating: 4.7,
    reviewCount: 600,
    tags: ['PECS', 'pictures', 'exchange'],
    ageRange: 'Ages 2+',
    amazonSearch: 'PECS communication kit',
    featured: true,
    whyWeRecommend: 'Evidence-based AAC system with decades of research support.',
  },
  
  // LEARNING & EDUCATION
  {
    id: 'social-skills-game',
    name: 'Social Skills Board Game',
    category: 'learning',
    description: 'Fun game teaching conversation, empathy, and social problem-solving.',
    price: 30,
    priceRange: '$25-40',
    rating: 4.6,
    reviewCount: 1200,
    tags: ['social', 'game', 'learning'],
    ageRange: 'Ages 6+',
    amazonSearch: 'social skills board game kids',
    whyWeRecommend: 'Learning through play is the most effective approach.',
  },
  {
    id: 'emotion-flashcards',
    name: 'Emotion Recognition Flashcards',
    category: 'learning',
    description: 'Photo cards showing real facial expressions. Includes discussion prompts.',
    price: 18,
    priceRange: '$15-25',
    rating: 4.7,
    reviewCount: 900,
    tags: ['emotions', 'faces', 'recognition'],
    ageRange: 'Ages 3+',
    amazonSearch: 'emotion flashcards kids autism',
    whyWeRecommend: 'Real photos help with generalization to real-world faces.',
  },
  
  // DAILY LIVING
  {
    id: 'weighted-lap-pad',
    name: 'Weighted Lap Pad',
    category: 'daily-living',
    description: 'Provides calming pressure during seated activities. Great for homework time.',
    price: 25,
    priceRange: '$20-35',
    rating: 4.6,
    reviewCount: 1100,
    tags: ['weighted', 'focus', 'school'],
    ageRange: 'Ages 3+',
    amazonSearch: 'weighted lap pad kids',
    whyWeRecommend: 'Helps with focus and body awareness during seated tasks.',
  },
  {
    id: 'seamless-socks',
    name: 'Seamless Sensory Socks',
    category: 'daily-living',
    description: 'No irritating seams. Soft, tag-free design for sensitive feet.',
    price: 15,
    priceRange: '$12-20',
    rating: 4.8,
    reviewCount: 3000,
    tags: ['clothing', 'tactile', 'comfort'],
    ageRange: 'All ages',
    amazonSearch: 'seamless socks sensory kids',
    featured: true,
    whyWeRecommend: 'Small change that makes a big difference in daily comfort.',
  },
  
  // BOOKS & GUIDES
  {
    id: 'zones-regulation-book',
    name: 'The Zones of Regulation',
    category: 'books',
    description: 'Curriculum for self-regulation. Teaches identification and management of feelings.',
    price: 50,
    priceRange: '$45-60',
    rating: 4.9,
    reviewCount: 2000,
    tags: ['curriculum', 'regulation', 'school'],
    ageRange: 'Ages 4+',
    amazonSearch: 'zones of regulation book',
    featured: true,
    whyWeRecommend: 'Widely used evidence-based curriculum for emotional regulation.',
  },
  {
    id: 'social-thinking-book',
    name: 'Social Thinking Books',
    category: 'books',
    description: 'Series teaching social awareness and flexible thinking skills.',
    price: 25,
    priceRange: '$20-35',
    rating: 4.7,
    reviewCount: 800,
    tags: ['social', 'thinking', 'skills'],
    ageRange: 'Ages 5+',
    amazonSearch: 'social thinking michelle garcia winner',
    whyWeRecommend: 'Excellent framework for understanding social expectations.',
  },
  
  // APPS & TECHNOLOGY
  {
    id: 'proloquo2go',
    name: 'Proloquo2Go (AAC App)',
    category: 'apps',
    description: 'Comprehensive AAC app for iPad. Highly customizable symbol-based communication.',
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
];

// ============================================
// PRODUCT CARD COMPONENT - NO IMAGE SECTION
// ============================================
const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const category = CATEGORIES.find(c => c.id === product.category);
  
  const handleBuyClick = () => {
    const searchUrl = product.link || 
      `https://www.amazon.com/s?k=${encodeURIComponent(product.amazonSearch)}`;
    window.open(searchUrl, '_blank');
  };
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden hover:shadow-md transition-all p-4">
      {/* Header with Category & Favorite */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="px-2 py-1 rounded-lg text-xs font-crayon text-white flex items-center gap-1"
            style={{ backgroundColor: category?.color }}
          >
            {(() => {
              const Icon = category?.icon || ShoppingBag;
              return <Icon size={12} />;
            })()}
            {category?.name}
          </span>
          {product.featured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-crayon rounded-lg flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className={`p-2 rounded-full transition-colors ${
            isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      {/* Product Name */}
      <h3 className="font-display text-base text-gray-800 leading-tight mb-2">
        {product.name}
      </h3>
      
      {/* Description */}
      <p className="font-crayon text-sm text-gray-500 mb-3 line-clamp-2">
        {product.description}
      </p>
      
      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1 text-sm font-crayon text-yellow-600">
          <Star size={14} fill="currentColor" />
          {product.rating}
        </span>
        <span className="text-sm font-crayon text-gray-400">
          ({product.reviewCount.toLocaleString()} reviews)
        </span>
      </div>
      
      {/* Why We Recommend */}
      {product.whyWeRecommend && (
        <p className="text-xs font-crayon text-gray-600 italic mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
          💡 {product.whyWeRecommend}
        </p>
      )}
      
      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
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
              <ShoppingBag size={24} />
              Recommended Products
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#8E6BBF] 
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

        {/* Filter Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                      flex items-center gap-2
                      ${showFilters 
                        ? 'bg-[#8E6BBF] border-[#8E6BBF] text-white' 
                        : 'bg-white border-gray-200 text-gray-600'
                      }`}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                      flex items-center gap-2
                      ${showFavoritesOnly 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-600'
                      }`}
          >
            <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            Favorites ({favorites.length})
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border-3 border-gray-200 p-4 mb-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="font-display text-sm text-gray-700 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full font-crayon text-xs transition-all
                              ${selectedCategory === cat.id 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-600'
                              }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Filter */}
            <div>
              <label className="font-display text-sm text-gray-700 mb-2 block">Price Range</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={`px-3 py-1.5 rounded-full font-crayon text-xs transition-all
                              ${selectedPriceRange === range.id 
                                ? 'bg-[#5CB85C] text-white' 
                                : 'bg-gray-100 text-gray-600'
                              }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="font-crayon text-sm text-gray-500 mb-4">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-crayon text-gray-500">No products match your filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPriceRange('all');
                setShowFavoritesOnly(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg font-crayon text-sm text-gray-600
                       hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
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
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex gap-2">
            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-crayon text-xs text-gray-500">
                <strong>Disclaimer:</strong> Product recommendations are based on research and community feedback. 
                ATLASassist does not receive compensation for product mentions. 
                Prices and availability may vary. Always consult with healthcare providers before making purchases.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendedProducts;
