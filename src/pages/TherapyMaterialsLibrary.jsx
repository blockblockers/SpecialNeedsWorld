// TherapyMaterialsLibrary.jsx - Evidence-based therapy materials
// SLP Now-inspired feature with Smart Decks, worksheets, and data tracking
// For speech-language pathologists and caregivers

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, Download, Star, Clock,
  Layers, FileText, Target, BookOpen, BarChart3,
  Mic, MessageCircle, Brain, Sparkles, ChevronRight,
  Grid3X3, List
} from 'lucide-react';

// Material categories
const CATEGORIES = [
  { id: 'all', name: 'All Materials', icon: Grid3X3, count: 156 },
  { id: 'articulation', name: 'Articulation', icon: Mic, count: 42 },
  { id: 'language', name: 'Language', icon: MessageCircle, count: 38 },
  { id: 'fluency', name: 'Fluency', icon: Sparkles, count: 18 },
  { id: 'social', name: 'Social Skills', icon: Brain, count: 28 },
  { id: 'literacy', name: 'Literacy', icon: BookOpen, count: 30 },
];

// Material types
const MATERIAL_TYPES = [
  { id: 'smart-deck', name: 'Smart Decks', icon: Layers, color: '#10B981' },
  { id: 'worksheet', name: 'Worksheets', icon: FileText, color: '#4A9FD4' },
  { id: 'goals', name: 'IEP Goals', icon: Target, color: '#F5A623' },
  { id: 'data-sheet', name: 'Data Sheets', icon: BarChart3, color: '#8E6BBF' },
];

// Sample materials (in a real app, these would come from a database)
const SAMPLE_MATERIALS = [
  {
    id: 1,
    title: 'R Sound Practice Deck',
    type: 'smart-deck',
    category: 'articulation',
    description: 'Interactive flashcards for /r/ sound practice in all positions',
    downloads: 1234,
    rating: 4.8,
    isNew: true,
  },
  {
    id: 2,
    title: 'Following Directions Worksheet',
    type: 'worksheet',
    category: 'language',
    description: '1-2 step directions with visual supports',
    downloads: 856,
    rating: 4.6,
  },
  {
    id: 3,
    title: 'Social Story Templates',
    type: 'worksheet',
    category: 'social',
    description: 'Customizable templates for common situations',
    downloads: 2341,
    rating: 4.9,
    isFeatured: true,
  },
  {
    id: 4,
    title: 'Articulation Goals Bank',
    type: 'goals',
    category: 'articulation',
    description: 'Evidence-based IEP goals for all speech sounds',
    downloads: 1567,
    rating: 4.7,
  },
  {
    id: 5,
    title: 'Fluency Data Tracking',
    type: 'data-sheet',
    category: 'fluency',
    description: 'Track stuttering frequency and types',
    downloads: 432,
    rating: 4.5,
  },
  {
    id: 6,
    title: 'Vocabulary Smart Deck',
    type: 'smart-deck',
    category: 'language',
    description: 'Tier 2 vocabulary with context sentences',
    downloads: 987,
    rating: 4.8,
    isNew: true,
  },
  {
    id: 7,
    title: 'Phonological Awareness Activities',
    type: 'worksheet',
    category: 'literacy',
    description: 'Rhyming, segmenting, and blending tasks',
    downloads: 1123,
    rating: 4.6,
  },
  {
    id: 8,
    title: 'Conversation Skills Deck',
    type: 'smart-deck',
    category: 'social',
    description: 'Turn-taking, topic maintenance, and repair strategies',
    downloads: 765,
    rating: 4.7,
  },
];

const TherapyMaterialsLibrary = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [materials, setMaterials] = useState(SAMPLE_MATERIALS);

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesType = !selectedType || material.type === selectedType;
    const matchesSearch = !searchQuery || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  // Get type info
  const getTypeInfo = (typeId) => MATERIAL_TYPES.find(t => t.id === typeId);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#10B981]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#10B981] 
                       rounded-xl font-display font-bold text-[#10B981] hover:bg-[#10B981] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#10B981] flex items-center gap-2">
              <Layers size={24} />
              Therapy Materials
            </h1>
            <p className="text-sm text-gray-500 font-crayon">Evidence-based resources</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border-4 border-[#10B981] p-4 mb-6 shadow-lg">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-crayon
                         focus:border-[#10B981] focus:outline-none"
            />
          </div>

          {/* Material Type filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1.5 rounded-full font-crayon text-sm transition-all
                ${!selectedType 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Types
            </button>
            {MATERIAL_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  className={`px-3 py-1.5 rounded-full font-crayon text-sm flex items-center gap-1.5 transition-all
                    ${selectedType === type.id 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={selectedType === type.id ? { backgroundColor: type.color } : {}}
                >
                  <Icon size={14} />
                  {type.name}
                </button>
              );
            })}
          </div>

          {/* Category tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
            {CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-crayon text-sm transition-all
                    ${selectedCategory === category.id 
                      ? 'bg-[#10B981]/10 text-[#10B981] border-2 border-[#10B981]' 
                      : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'}`}
                >
                  <Icon size={16} />
                  {category.name}
                  <span className="text-xs opacity-60">({category.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-crayon text-gray-600">
            {filteredMaterials.length} materials found
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Materials Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' 
          : 'space-y-3'
        }>
          {filteredMaterials.map(material => {
            const typeInfo = getTypeInfo(material.type);
            const TypeIcon = typeInfo?.icon || FileText;

            return (
              <div
                key={material.id}
                className={`bg-white rounded-2xl border-3 p-4 shadow-md hover:shadow-lg 
                           transition-all cursor-pointer group ${
                             viewMode === 'list' ? 'flex items-center gap-4' : ''
                           }`}
                style={{ borderColor: typeInfo?.color || '#ccc' }}
              >
                {/* Icon */}
                <div 
                  className={`rounded-xl flex items-center justify-center ${
                    viewMode === 'grid' ? 'w-12 h-12 mb-3' : 'w-14 h-14 flex-shrink-0'
                  }`}
                  style={{ backgroundColor: `${typeInfo?.color}20` }}
                >
                  <TypeIcon size={viewMode === 'grid' ? 24 : 28} style={{ color: typeInfo?.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-display text-gray-800 truncate">{material.title}</h3>
                    {material.isNew && (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">New</span>
                    )}
                    {material.isFeatured && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">⭐ Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-crayon line-clamp-2 mb-2">
                    {material.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      {material.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={12} />
                      {material.downloads.toLocaleString()}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${typeInfo?.color}20`, color: typeInfo?.color }}
                    >
                      {typeInfo?.name}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <ChevronRight 
                  size={20} 
                  className="text-gray-300 group-hover:text-[#10B981] transition-colors flex-shrink-0" 
                />
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-crayon text-gray-500">No materials found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        )}

        {/* Smart Decks promo */}
        <div className="mt-8 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Layers size={28} />
            <h3 className="text-xl font-display">Try Smart Decks</h3>
          </div>
          <p className="font-crayon text-white/90 mb-4">
            Interactive digital flashcards that adapt to your student's needs. 
            Track progress automatically and share with caregivers.
          </p>
          <button className="px-4 py-2 bg-white text-[#10B981] rounded-xl font-display 
                             hover:bg-white/90 transition-colors">
            Explore Smart Decks
          </button>
        </div>
      </main>
    </div>
  );
};

export default TherapyMaterialsLibrary;
