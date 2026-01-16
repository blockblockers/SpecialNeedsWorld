// ResearchHub.jsx - Evidence-Based Research Library
// Reads from database (weekly auto-fetch) with manual refresh option
// Part of the Resources & Research hub

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { 
  ArrowLeft, 
  BookOpen,
  Search,
  X,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  FileText,
  Brain,
  Heart,
  MessageCircle,
  Users,
  GraduationCap,
  Sparkles,
  Shield,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Globe,
  Loader2,
  Calendar
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_research_bookmarks';

// ============================================
// RESEARCH CATEGORIES
// ============================================
const CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: BookOpen, color: '#4A9FD4' },
  { id: 'autism', name: 'Autism & Neurodiversity', icon: Brain, color: '#8E6BBF' },
  { id: 'behavior', name: 'Behavior & Regulation', icon: Heart, color: '#E63B2E' },
  { id: 'communication', name: 'Communication & AAC', icon: MessageCircle, color: '#F5A623' },
  { id: 'education', name: 'Education & IEPs', icon: GraduationCap, color: '#5CB85C' },
  { id: 'therapies', name: 'Therapies & Interventions', icon: Sparkles, color: '#20B2AA' },
  { id: 'transition', name: 'Transition & Adulthood', icon: TrendingUp, color: '#E86B9A' },
  { id: 'family', name: 'Family & Caregiving', icon: Users, color: '#0891B2' },
];

// ============================================
// CURATED (STATIC) ARTICLES - Fallback when database is empty
// ============================================
const CURATED_ARTICLES = [
  {
    id: 'autism-strengths',
    title: 'Autism as Difference, Not Deficit',
    category: 'autism',
    summary: 'Research increasingly supports viewing autism as a neurological difference rather than a disorder, with unique strengths including pattern recognition, attention to detail, and deep focus.',
    ai_summary: 'New research shows autism is a different way of thinking, not a deficiency. Autistic people often have amazing abilities in pattern recognition and focus. Supporting strengths leads to better outcomes than trying to "fix" differences.',
    source_name: 'Nature Neuroscience, Autism Research',
    url: 'https://www.nature.com/subjects/autism-spectrum-disorder',
    publication_date: '2024-01-01',
    is_featured: true,
  },
  {
    id: 'aac-myths',
    title: 'AAC Does NOT Delay Speech',
    category: 'communication',
    summary: 'Research consistently shows that AAC supports speech development rather than replacing it. Early AAC access is crucial for communication development.',
    ai_summary: 'Good news for families considering AAC! Studies show that using AAC devices actually helps speech develop - it doesn\'t replace it. The earlier you start AAC, the better the communication outcomes.',
    source_name: 'ASHA, AAC Journal',
    url: 'https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/',
    publication_date: '2024-02-15',
    is_featured: true,
  },
  {
    id: 'behavior-communication',
    title: 'Behavior is Communication',
    category: 'behavior',
    summary: 'Modern understanding views challenging behaviors as communication of unmet needs. Understanding the function leads to more effective support.',
    ai_summary: 'When a child acts out, they\'re trying to tell us something. Understanding WHY the behavior happens (escape, attention, sensory needs) helps us teach better ways to communicate those needs.',
    source_name: 'Journal of Applied Behavior Analysis',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1286067/',
    publication_date: '2024-01-20',
    is_featured: true,
  },
  {
    id: 'caregiver-wellbeing',
    title: 'Caregiver Wellbeing Matters',
    category: 'family',
    summary: 'Research confirms that supporting caregiver wellbeing benefits the whole family. Self-care isn\'t selfish - it\'s necessary.',
    ai_summary: 'Parents of special needs children face extra stress. Research shows that when caregivers take care of themselves, the whole family does better. Getting support and taking breaks isn\'t selfish - it\'s essential.',
    source_name: 'Research in Autism Spectrum Disorders',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4442948/',
    publication_date: '2024-03-01',
    is_featured: true,
  },
  {
    id: 'evidence-based-practices',
    title: 'Evidence-Based Practices for Autism',
    category: 'therapies',
    summary: 'The National Clearinghouse on Autism Evidence and Practice identifies 28 evidence-based practices for supporting autistic individuals.',
    ai_summary: 'Not all therapies are equal! Scientists have identified 28 approaches that actually work for autism support. Visual supports, naturalistic teaching, and social stories are among the best-studied.',
    source_name: 'NCAEP, NIH',
    url: 'https://ncaep.fpg.unc.edu/',
    publication_date: '2024-01-10',
    is_featured: true,
  },
];

// ============================================
// ARTICLE CARD COMPONENT
// ============================================
const ArticleCard = ({ article, isBookmarked, onToggleBookmark, onRead }) => {
  const category = CATEGORIES.find(c => c.id === article.category) || CATEGORIES[0];
  const isFromDatabase = !!article.fetched_at;
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div 
        className="p-4"
        style={{ backgroundColor: `${category?.color}15` }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {article.is_featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 
                             rounded-full text-xs font-crayon">
                  <Star size={10} fill="currentColor" /> Featured
                </span>
              )}
              {isFromDatabase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 
                             rounded-full text-xs font-crayon">
                  <Globe size={10} /> Latest
                </span>
              )}
            </div>
            <h3 className="font-display text-gray-800 leading-tight">{article.title}</h3>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(article.id); }}
            className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
              isBookmarked 
                ? 'text-[#F5A623] bg-[#F5A623]/10' 
                : 'text-gray-400 hover:text-[#F5A623] hover:bg-gray-100'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </div>
        
        {/* Meta */}
        <div className="flex items-center gap-2 mt-2 text-xs font-crayon text-gray-500 flex-wrap">
          <span 
            className="px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
          {article.source_name && (
            <span className="truncate max-w-[150px]">{article.source_name}</span>
          )}
          {article.publication_date && (
            <span>{new Date(article.publication_date).getFullYear()}</span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="font-crayon text-sm text-gray-600 mb-3 line-clamp-3">
          {article.ai_summary || article.summary || 'Click to read the full article from the original source.'}
        </p>
        
        <div className="flex gap-2">
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 border-2 rounded-xl font-display text-sm
                       hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              style={{ borderColor: category?.color, color: category?.color }}
            >
              Read Article
              <ExternalLink size={14} />
            </a>
          )}
          {!article.url && (
            <button
              onClick={() => onRead(article)}
              className="flex-1 py-2 border-2 rounded-xl font-display text-sm
                       hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              style={{ borderColor: category?.color, color: category?.color }}
            >
              View Summary
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ARTICLE DETAIL MODAL
// ============================================
const ArticleDetail = ({ article, onClose }) => {
  const category = CATEGORIES.find(c => c.id === article.category) || CATEGORIES[0];
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div 
          className="p-4 flex items-start justify-between"
          style={{ backgroundColor: `${category?.color}15` }}
        >
          <div>
            <span 
              className="px-2 py-0.5 rounded-full text-white text-xs font-crayon"
              style={{ backgroundColor: category?.color }}
            >
              {category?.name}
            </span>
            <h2 className="font-display text-xl text-gray-800 mt-2">{article.title}</h2>
            {article.source_name && (
              <p className="font-crayon text-sm text-gray-500 mt-1">
                Source: {article.source_name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Family-Friendly Summary */}
          {article.ai_summary && (
            <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <h3 className="font-display text-sm text-green-700 mb-2 flex items-center gap-2">
                <Lightbulb size={16} />
                What This Means for Families
              </h3>
              <p className="font-crayon text-gray-700">{article.ai_summary}</p>
            </div>
          )}
          
          {/* Original Summary */}
          <div className="mb-4">
            <h3 className="font-display text-sm text-gray-600 mb-2">Research Summary</h3>
            <p className="font-crayon text-gray-700">{article.summary}</p>
          </div>
          
          {/* Link to Original */}
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-crayon text-sm"
            >
              <ExternalLink size={14} />
              Read the full article
            </a>
          )}
          
          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <p className="font-crayon text-xs text-amber-700 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              This is a simplified summary. Research is always evolving. 
              Consult qualified professionals for individual guidance.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-display text-white"
            style={{ backgroundColor: category?.color }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const ResearchHub = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Database articles state
  const [dbArticles, setDbArticles] = useState([]);
  const [fetchLog, setFetchLog] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    }
  }, []);
  
  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // Load articles from database
  useEffect(() => {
    loadArticles();
    loadFetchLog();
  }, []);
  
  const loadArticles = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('research_articles')
        .select('*')
        .eq('is_active', true)
        .order('fetched_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setDbArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadFetchLog = async () => {
    if (!isSupabaseConfigured()) return;
    
    try {
      const { data, error } = await supabase
        .from('research_fetch_log')
        .select('*');
      
      if (error) throw error;
      
      // Convert to object keyed by category
      const logMap = (data || []).reduce((acc, item) => {
        acc[item.category] = item;
        return acc;
      }, {});
      
      setFetchLog(logMap);
    } catch (error) {
      console.error('Error loading fetch log:', error);
    }
  };
  
  // Manual refresh (calls the Edge Function)
  const handleManualRefresh = async (category = null) => {
    setRefreshing(true);
    
    try {
      const response = await supabase.functions.invoke('fetch-research', {
        body: category ? { category } : {}
      });
      
      if (response.error) throw response.error;
      
      // Reload articles
      await loadArticles();
      await loadFetchLog();
      
    } catch (error) {
      console.error('Error refreshing:', error);
      alert('Unable to refresh articles. The weekly auto-refresh will try again later.');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Toggle bookmark
  const toggleBookmark = (articleId) => {
    setBookmarks(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };
  
  // Combine database articles with curated fallbacks
  const allArticles = [...dbArticles, ...CURATED_ARTICLES.filter(
    curated => !dbArticles.some(db => db.id === curated.id || db.title === curated.title)
  )];
  
  // Filter articles
  const filteredArticles = allArticles.filter(article => {
    if (showBookmarksOnly && !bookmarks.includes(article.id)) return false;
    if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        article.title?.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query) ||
        article.ai_summary?.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  // Get featured articles
  const featuredArticles = allArticles.filter(a => a.is_featured);
  
  // Format last fetched date
  const formatLastFetched = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
              <BookOpen size={24} />
              Research Library
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Intro */}
        <div className="mb-6 p-4 bg-[#5CB85C]/10 rounded-2xl border-3 border-[#5CB85C]/30">
          <p className="font-crayon text-gray-600">
            📚 Research articles from trusted sources like NIH, PubMed, ASHA, and CDC. 
            Updated weekly to keep you informed with the latest findings.
          </p>
        </div>
        
        {/* Last Updated Info */}
        {isSupabaseConfigured() && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-crayon text-gray-500">
              <Calendar size={14} />
              <span>
                Articles updated: {
                  Object.values(fetchLog).length > 0 
                    ? formatLastFetched(
                        Math.max(...Object.values(fetchLog).map(f => new Date(f.last_fetched_at)))
                      )
                    : 'Weekly auto-refresh enabled'
                }
              </span>
            </div>
            <button
              onClick={() => handleManualRefresh()}
              disabled={refreshing}
              className="flex items-center gap-1 px-3 py-1 text-sm font-crayon text-green-600 
                       hover:bg-green-50 rounded-lg disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>
        )}
        
        {/* Search */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research articles..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#5CB85C] 
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
        
        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          {/* Category Pills */}
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
          
          {/* Bookmarks Toggle */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-crayon text-sm whitespace-nowrap
                      ${showBookmarksOnly 
                        ? 'bg-[#F5A623] text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-600'
                      }`}
          >
            <Bookmark size={14} />
            Saved ({bookmarks.length})
          </button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 size={32} className="animate-spin text-green-500 mx-auto mb-2" />
            <p className="font-crayon text-sm text-gray-500">Loading research articles...</p>
          </div>
        )}
        
        {/* Featured Section (only when not searching/filtering) */}
        {!loading && !searchQuery && selectedCategory === 'all' && !showBookmarksOnly && featuredArticles.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" fill="currentColor" />
              Featured Research
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredArticles.slice(0, 4).map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isBookmarked={bookmarks.includes(article.id)}
                  onToggleBookmark={toggleBookmark}
                  onRead={setSelectedArticle}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* All Articles */}
        {!loading && (
          <div>
            <h2 className="font-display text-gray-700 mb-3">
              {showBookmarksOnly ? 'Saved Articles' : 
               selectedCategory === 'all' ? 'All Research' : 
               CATEGORIES.find(c => c.id === selectedCategory)?.name}
              <span className="font-crayon text-sm text-gray-400 ml-2">
                ({filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'})
              </span>
            </h2>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isBookmarked={bookmarks.includes(article.id)}
                    onToggleBookmark={toggleBookmark}
                    onRead={setSelectedArticle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="font-crayon text-gray-500">No articles found</p>
                <p className="font-crayon text-sm text-gray-400">Try a different search or category</p>
              </div>
            )}
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <h3 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            About This Research Library
          </h3>
          <p className="font-crayon text-xs text-gray-500">
            Articles are automatically fetched weekly from trusted sources including NIH, NCBI/PubMed, 
            ASHA, CDC, and peer-reviewed journals via Google Custom Search. 
            Research evolves - always consult qualified professionals for individual guidance.
          </p>
        </div>
      </main>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default ResearchHub;
