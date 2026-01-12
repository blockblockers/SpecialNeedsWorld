// Knowledge.jsx - Knowledge Resources hub
// Browse federal and state-specific special needs information

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Search,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Flag,
  AlertTriangle,
  ExternalLink,
  FileText,
  Scale,
  GraduationCap,
  Heart,
  Phone,
  DollarSign,
  Target,
  Building
} from 'lucide-react';
import {
  getRegions,
  getActiveRegions,
  getRegionById,
  getCategories,
  getArticlesByRegion,
  getArticleBySlug,
  searchKnowledge,
  REGIONS,
  CATEGORIES,
} from '../services/knowledgeResources';

// ============================================
// MARKDOWN RENDERER (Simple)
// ============================================

const MarkdownContent = ({ content }) => {
  // Very simple markdown to HTML conversion
  const renderMarkdown = (md) => {
    if (!md) return '';
    
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-display text-gray-800 mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-display text-gray-800 mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-display text-gray-800 mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#4A9FD4] underline hover:text-[#3A8FC4]">$1</a>')
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Tables (simple)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return ''; // Skip separator row
        }
        const row = cells.map(c => `<td class="border px-3 py-2">${c.trim()}</td>`).join('');
        return `<tr>${row}</tr>`;
      })
      // Warning boxes
      .replace(/⚠️ \*\*(.*?)\*\*/g, '<div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-4"><strong class="text-yellow-800">⚠️ $1</strong></div>')
      // Checkmarks and X marks
      .replace(/✅/g, '<span class="text-green-600">✅</span>')
      .replace(/❌/g, '<span class="text-red-600">❌</span>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Line breaks
      .replace(/\n/g, '<br/>');
    
    return `<p class="mb-4">${html}</p>`;
  };
  
  return (
    <div 
      className="prose prose-sm max-w-none font-crayon text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

// ============================================
// CATEGORY ICON MAPPER
// ============================================

const getCategoryIcon = (categoryId) => {
  const icons = {
    'laws': Scale,
    'services': Building,
    'education': GraduationCap,
    'rights': Heart,
    'resources': Phone,
    'funding': DollarSign,
    'transition': Target,
  };
  return icons[categoryId] || FileText;
};

// ============================================
// REGION CARD COMPONENT
// ============================================

const RegionCard = ({ region, onClick }) => {
  const isFederal = region.type === 'federal';
  
  return (
    <button
      onClick={onClick}
      disabled={!region.is_active}
      className={`
        p-4 rounded-2xl border-4 text-left transition-all
        ${region.is_active 
          ? 'hover:-translate-y-1 hover:shadow-crayon cursor-pointer' 
          : 'opacity-50 cursor-not-allowed'
        }
        ${isFederal 
          ? 'bg-[#4A9FD4] border-[#3A8FC4] text-white' 
          : 'bg-white border-gray-200 hover:border-[#5CB85C]'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{region.emoji}</span>
        <div className="flex-1">
          <h3 className={`font-display ${isFederal ? 'text-white' : 'text-gray-800'}`}>
            {region.name}
          </h3>
          {isFederal && (
            <p className="text-xs text-white/80 font-crayon">Federal laws apply to all states</p>
          )}
          {!region.is_active && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-crayon text-gray-500">
              Coming Soon
            </span>
          )}
        </div>
        {region.is_active && (
          <ChevronRight size={20} className={isFederal ? 'text-white/70' : 'text-gray-400'} />
        )}
      </div>
    </button>
  );
};

// ============================================
// ARTICLE CARD COMPONENT
// ============================================

const ArticleCard = ({ article, category, onClick }) => {
  const IconComponent = getCategoryIcon(article.category_id);
  const cat = category || CATEGORIES.find(c => c.id === article.category_id);
  
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-xl border-3 border-gray-200 text-left
                 hover:border-[#4A9FD4] hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${cat?.color}20` }}
        >
          <IconComponent size={20} style={{ color: cat?.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-gray-800 text-sm">{article.title}</h3>
          {article.summary && (
            <p className="font-crayon text-xs text-gray-500 mt-1 line-clamp-2">
              {article.summary}
            </p>
          )}
          {article.has_state_differences && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-yellow-100 rounded-full text-xs font-crayon text-yellow-700">
              <AlertTriangle size={12} /> State-specific info
            </span>
          )}
        </div>
        <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Knowledge = () => {
  const navigate = useNavigate();
  const { regionId, slug } = useParams();
  
  // State
  const [view, setView] = useState('regions'); // regions, articles, article
  const [regions, setRegions] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);
  
  // Handle URL params
  useEffect(() => {
    if (regionId) {
      loadRegion(regionId);
      if (slug) {
        loadArticle(regionId, slug);
      } else {
        setView('articles');
      }
    } else {
      setView('regions');
      setCurrentRegion(null);
      setCurrentArticle(null);
    }
  }, [regionId, slug]);
  
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [regionsData, categoriesData] = await Promise.all([
        getRegions(),
        getCategories(),
      ]);
      setRegions(regionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setRegions(REGIONS);
      setCategories(CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadRegion = async (id) => {
    const region = await getRegionById(id);
    setCurrentRegion(region);
    const articlesData = await getArticlesByRegion(id);
    setArticles(articlesData);
  };
  
  const loadArticle = async (regionId, articleSlug) => {
    const article = await getArticleBySlug(regionId, articleSlug);
    setCurrentArticle(article);
    setView('article');
  };
  
  const handleRegionSelect = (region) => {
    navigate(`/knowledge/${region.id}`);
  };
  
  const handleArticleSelect = (article) => {
    navigate(`/knowledge/${currentRegion.id}/${article.slug}`);
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const results = await searchKnowledge(searchQuery, currentRegion?.id);
    setSearchResults(results);
  };
  
  const handleBack = () => {
    if (view === 'article') {
      navigate(`/knowledge/${currentRegion.id}`);
    } else if (view === 'articles') {
      navigate('/knowledge');
    } else {
      navigate('/hub');
    }
  };
  
  // Filter articles by category
  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category_id === selectedCategory)
    : articles;
  
  // Group articles by category
  const articlesByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = articles.filter(a => a.category_id === cat.id);
    return acc;
  }, {});
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#4A9FD4] 
                       rounded-full font-crayon text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text truncate">
              📚 {currentRegion ? currentRegion.name : 'Knowledge Resources'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* REGIONS VIEW */}
        {view === 'regions' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl text-gray-800 mb-2">
                Special Needs Resources
              </h2>
              <p className="font-crayon text-gray-600">
                Federal laws and state-specific information about services, rights, and programs
              </p>
            </div>
            
            {/* Federal Section */}
            <section>
              <h3 className="font-display text-lg text-gray-700 flex items-center gap-2 mb-3">
                <Flag size={20} className="text-[#4A9FD4]" />
                Federal Laws
              </h3>
              <div className="grid gap-3">
                {regions.filter(r => r.type === 'federal').map(region => (
                  <RegionCard 
                    key={region.id} 
                    region={region} 
                    onClick={() => handleRegionSelect(region)}
                  />
                ))}
              </div>
            </section>
            
            {/* States Section */}
            <section>
              <h3 className="font-display text-lg text-gray-700 flex items-center gap-2 mb-3">
                <MapPin size={20} className="text-[#5CB85C]" />
                State Resources
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {regions.filter(r => r.type === 'state').map(region => (
                  <RegionCard 
                    key={region.id} 
                    region={region} 
                    onClick={() => handleRegionSelect(region)}
                  />
                ))}
              </div>
            </section>
            
            {/* Info Box */}
            <div className="bg-[#E5F6FF] rounded-2xl p-4 border-3 border-[#4A9FD4]/30">
              <h4 className="font-display text-[#4A9FD4] mb-2">💡 How to Use</h4>
              <p className="font-crayon text-sm text-gray-600">
                Start with <strong>Federal Laws</strong> to understand your baseline rights under IDEA, 
                Section 504, and ADA. Then select your <strong>state</strong> to see state-specific 
                programs, services, and any differences from federal law.
              </p>
            </div>
          </div>
        )}
        
        {/* ARTICLES VIEW */}
        {view === 'articles' && currentRegion && (
          <div className="space-y-6">
            {/* Region Header */}
            <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] p-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentRegion.emoji}</span>
                <div>
                  <h2 className="font-display text-xl text-gray-800">{currentRegion.name}</h2>
                  <p className="font-crayon text-sm text-gray-500">
                    {currentRegion.type === 'federal' 
                      ? 'These laws apply to all U.S. states'
                      : `State-specific resources for ${currentRegion.name}`
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-crayon text-sm transition-all ${
                  !selectedCategory
                    ? 'bg-[#4A9FD4] text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-600'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full font-crayon text-sm transition-all ${
                    selectedCategory === cat.id
                      ? 'text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600'
                  }`}
                  style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
            
            {/* Articles List */}
            {selectedCategory ? (
              <div className="space-y-3">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={article}
                      onClick={() => handleArticleSelect(article)}
                    />
                  ))
                ) : (
                  <p className="text-center font-crayon text-gray-500 py-8">
                    No articles in this category yet.
                  </p>
                )}
              </div>
            ) : (
              // Group by category when no filter
              <div className="space-y-6">
                {categories.map(cat => {
                  const catArticles = articlesByCategory[cat.id] || [];
                  if (catArticles.length === 0) return null;
                  
                  return (
                    <section key={cat.id}>
                      <h3 className="font-display text-base text-gray-700 flex items-center gap-2 mb-3"
                          style={{ color: cat.color }}>
                        {cat.emoji} {cat.name}
                      </h3>
                      <div className="space-y-2">
                        {catArticles.map(article => (
                          <ArticleCard 
                            key={article.id} 
                            article={article}
                            category={cat}
                            onClick={() => handleArticleSelect(article)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
            
            {articles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="font-crayon text-gray-500">
                  No articles available yet for this region.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* ARTICLE VIEW */}
        {view === 'article' && currentArticle && (
          <div className="space-y-4">
            {/* Article Header */}
            <div className="bg-white rounded-2xl border-4 border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                {currentRegion && (
                  <span className="text-2xl">{currentRegion.emoji}</span>
                )}
                <div className="flex-1">
                  <h1 className="font-display text-xl text-gray-800 mb-2">
                    {currentArticle.title}
                  </h1>
                  {currentArticle.summary && (
                    <p className="font-crayon text-gray-600">
                      {currentArticle.summary}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {currentArticle.tags && currentArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentArticle.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs font-crayon text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* State Differences Warning */}
              {currentArticle.has_state_differences && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <p className="font-crayon text-sm text-yellow-800">
                    <AlertTriangle size={16} className="inline mr-1" />
                    <strong>Note:</strong> This article contains state-specific information that 
                    may differ from or add to federal requirements.
                  </p>
                </div>
              )}
            </div>
            
            {/* Article Content */}
            <div className="bg-white rounded-2xl border-4 border-gray-200 p-6">
              <MarkdownContent content={currentArticle.content} />
              
              {/* Sources */}
              {currentArticle.source_urls && currentArticle.source_urls.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h4 className="font-display text-sm text-gray-700 mb-2">Sources & Resources</h4>
                  <ul className="space-y-1">
                    {currentArticle.source_urls.map((url, i) => (
                      <li key={i}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-crayon text-sm text-[#4A9FD4] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Last Verified */}
              {currentArticle.last_verified_at && (
                <p className="mt-4 font-crayon text-xs text-gray-400">
                  Last verified: {new Date(currentArticle.last_verified_at).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {/* Disclaimer */}
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="font-crayon text-xs text-gray-500">
                <strong>Disclaimer:</strong> This information is provided for educational purposes only 
                and does not constitute legal advice. Laws and regulations change frequently. 
                Always consult with qualified professionals or official sources for specific situations.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Knowledge;
