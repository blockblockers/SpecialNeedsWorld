// ResearchHub.jsx - Evidence-Based Research for ATLASassist
// Features: 
// - Google Scholar / PubMed search integration
// - Curated research summaries by category
// - Links to research databases
// - Recent articles from various topics

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  Microscope,
  Lightbulb,
  Globe,
  RefreshCw
} from 'lucide-react';

// Research categories with curated summaries
const RESEARCH_CATEGORIES = {
  autism: {
    name: 'Autism Spectrum',
    emoji: '🧩',
    color: '#4A9FD4',
    searchTerms: 'autism spectrum disorder intervention',
    articles: [
      {
        title: 'Early Intervention Effectiveness',
        summary: 'Research consistently shows that early intervention (before age 3) leads to significantly better outcomes in communication, social skills, and adaptive behavior.',
        keyFindings: [
          'Children who receive early intervention show 47% greater improvement in cognitive skills',
          'Speech therapy before age 3 has the highest impact on language development',
          'Parent-mediated interventions are as effective as professional-only approaches'
        ],
        sources: ['Journal of Autism and Developmental Disorders', 'Pediatrics', 'JAMA Pediatrics'],
        year: '2020-2024'
      },
      {
        title: 'Applied Behavior Analysis (ABA)',
        summary: 'ABA remains the most researched intervention for autism, though modern approaches emphasize naturalistic and play-based methods.',
        keyFindings: [
          'Naturalistic Developmental Behavioral Interventions (NDBIs) show strong evidence',
          'Quality of ABA therapy matters more than hours received',
          'Family involvement significantly improves outcomes'
        ],
        sources: ['Cochrane Database of Systematic Reviews', 'Journal of Applied Behavior Analysis'],
        year: '2021-2024'
      },
      {
        title: 'Sensory Processing Research',
        summary: 'Studies confirm that sensory differences are core features of autism, not just associated symptoms.',
        keyFindings: [
          'Up to 90% of autistic individuals experience sensory processing differences',
          'Sensory accommodations significantly reduce anxiety and meltdowns',
          'Occupational therapy for sensory issues shows strong evidence base'
        ],
        sources: ['American Journal of Occupational Therapy', 'Autism Research'],
        year: '2022-2024'
      },
    ]
  },
  adhd: {
    name: 'ADHD',
    emoji: '⚡',
    color: '#F5A623',
    searchTerms: 'ADHD attention deficit treatment children',
    articles: [
      {
        title: 'Multimodal Treatment',
        summary: 'The MTA study and follow-ups show that combined treatment (medication + behavioral therapy) produces the best outcomes.',
        keyFindings: [
          'Combined treatment outperforms medication-only or therapy-only approaches',
          'Behavioral parent training is essential for young children',
          'School-based interventions significantly improve academic outcomes'
        ],
        sources: ['NIMH MTA Study', 'Journal of the American Academy of Child & Adolescent Psychiatry'],
        year: '2019-2024'
      },
      {
        title: 'Executive Function Interventions',
        summary: 'Targeted executive function training can improve planning, organization, and self-regulation.',
        keyFindings: [
          'Cognitive behavioral therapy adapted for ADHD shows significant benefits',
          'External supports (visual schedules, timers) are highly effective',
          'Physical exercise improves attention and executive function'
        ],
        sources: ['Neuropsychology Review', 'Child Neuropsychology'],
        year: '2021-2024'
      },
    ]
  },
  learning: {
    name: 'Learning Differences',
    emoji: '📚',
    color: '#5CB85C',
    searchTerms: 'learning disability dyslexia intervention evidence',
    articles: [
      {
        title: 'Dyslexia Interventions',
        summary: 'Structured literacy approaches (Orton-Gillingham based) have the strongest evidence for reading intervention.',
        keyFindings: [
          'Explicit, systematic phonics instruction is essential',
          'Multi-sensory approaches improve retention',
          'Early identification and intervention prevent secondary issues'
        ],
        sources: ['International Dyslexia Association', 'Reading Research Quarterly'],
        year: '2020-2024'
      },
      {
        title: 'Universal Design for Learning (UDL)',
        summary: 'UDL principles benefit all students, not just those with disabilities.',
        keyFindings: [
          'Multiple means of engagement increase motivation',
          'Flexible assessment methods improve demonstration of knowledge',
          'Technology can provide essential accessibility supports'
        ],
        sources: ['CAST Research', 'Journal of Special Education Technology'],
        year: '2021-2024'
      },
    ]
  },
  family: {
    name: 'Family & Caregiver',
    emoji: '👨‍👩‍👧',
    color: '#E86B9A',
    searchTerms: 'caregiver support special needs family wellbeing',
    articles: [
      {
        title: 'Caregiver Wellbeing',
        summary: 'Supporting caregiver mental health directly improves outcomes for children with disabilities.',
        keyFindings: [
          'Respite care significantly reduces caregiver burnout',
          'Parent support groups improve coping and reduce isolation',
          'Self-care is essential, not optional, for effective caregiving'
        ],
        sources: ['Journal of Family Psychology', 'Research in Developmental Disabilities'],
        year: '2022-2024'
      },
      {
        title: 'Sibling Support',
        summary: 'Siblings of children with disabilities benefit from targeted support programs.',
        keyFindings: [
          'Sibling support groups reduce feelings of isolation',
          'Open family communication improves sibling adjustment',
          'Siblings often develop increased empathy and resilience'
        ],
        sources: ['Journal of Autism and Developmental Disorders', 'Sibling Support Project Research'],
        year: '2021-2024'
      },
    ]
  },
};

// Research databases for direct searching
const RESEARCH_DATABASES = [
  {
    name: 'PubMed',
    description: 'NIH database of biomedical literature',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    searchUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=',
    emoji: '🔬'
  },
  {
    name: 'Google Scholar',
    description: 'Search scholarly articles across disciplines',
    url: 'https://scholar.google.com/',
    searchUrl: 'https://scholar.google.com/scholar?q=',
    emoji: '🎓'
  },
  {
    name: 'ERIC',
    description: 'Education research database',
    url: 'https://eric.ed.gov/',
    searchUrl: 'https://eric.ed.gov/?q=',
    emoji: '📖'
  },
  {
    name: 'Cochrane Library',
    description: 'Systematic reviews of healthcare interventions',
    url: 'https://www.cochranelibrary.com/',
    searchUrl: 'https://www.cochranelibrary.com/search?q=',
    emoji: '📊'
  },
  {
    name: 'What Works Clearinghouse',
    description: 'Education intervention effectiveness reviews',
    url: 'https://ies.ed.gov/ncee/wwc/',
    emoji: '✅'
  },
];

// Quick search suggestions
const SEARCH_SUGGESTIONS = [
  'autism early intervention',
  'ADHD behavioral therapy',
  'dyslexia reading intervention',
  'sensory processing disorder',
  'IEP best practices',
  'visual supports autism',
  'executive function ADHD',
  'parent training special needs',
];

// Article Card Component
const ArticleCard = ({ article, color, isExpanded, onToggle }) => {
  return (
    <div 
      className="bg-white rounded-xl border-2 overflow-hidden transition-all"
      style={{ borderColor: isExpanded ? color : '#E5E7EB' }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <div 
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: color + '20' }}
        >
          <FileText size={20} style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-gray-800">{article.title}</h3>
          <p className="font-crayon text-sm text-gray-500 mt-1">{article.year}</p>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="font-crayon text-gray-700 mt-3 mb-4">{article.summary}</p>
          
          <div className="mb-4">
            <h4 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Lightbulb size={14} />
              Key Findings
            </h4>
            <ul className="space-y-2">
              {article.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-crayon text-gray-600">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {finding}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-xs font-crayon text-gray-400">
            Sources: {article.sources.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

const ResearchHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'search'

  // Filter articles based on search
  const getFilteredArticles = () => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const results = [];
    
    Object.entries(RESEARCH_CATEGORIES).forEach(([catId, category]) => {
      category.articles.forEach((article, index) => {
        if (
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.keyFindings.some(f => f.toLowerCase().includes(query))
        ) {
          results.push({ ...article, categoryId: catId, categoryColor: category.color, id: `${catId}-${index}` });
        }
      });
    });
    
    return results;
  };

  const filteredArticles = getFilteredArticles();

  // Handle external search
  const handleExternalSearch = (database) => {
    const query = encodeURIComponent(searchQuery || 'special needs disability intervention');
    if (database.searchUrl) {
      window.open(database.searchUrl + query, '_blank');
    } else {
      window.open(database.url, '_blank');
    }
  };

  // Handle category search
  const handleCategorySearch = (category) => {
    const query = encodeURIComponent(category.searchTerms);
    window.open(`https://scholar.google.com/scholar?q=${query}&as_ylo=2022`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
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
          <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
            <Microscope size={22} />
            Research
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                      ${activeTab === 'browse' 
                        ? 'bg-[#5CB85C] text-white border-[#5CB85C]' 
                        : 'border-gray-200 text-gray-600 hover:border-[#5CB85C]'}`}
          >
            📖 Browse Summaries
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                      ${activeTab === 'search' 
                        ? 'bg-[#5CB85C] text-white border-[#5CB85C]' 
                        : 'border-gray-200 text-gray-600 hover:border-[#5CB85C]'}`}
          >
            🔍 Search Articles
          </button>
        </div>

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <>
            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search research topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 
                           font-crayon focus:border-[#5CB85C] focus:outline-none"
                />
              </div>
              
              {/* Search Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.slice(0, 4).map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 bg-gray-100 rounded-full font-crayon text-xs text-gray-600 
                             hover:bg-[#5CB85C]/20 hover:text-[#5CB85C] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Databases */}
            <div className="mb-6">
              <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
                <Globe size={18} />
                Search Research Databases
              </h2>
              <p className="font-crayon text-sm text-gray-500 mb-3">
                Click to search "{searchQuery || 'your topic'}" in these databases:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {RESEARCH_DATABASES.slice(0, 4).map(db => (
                  <button
                    key={db.name}
                    onClick={() => handleExternalSearch(db)}
                    className="flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-gray-200 
                             hover:border-[#5CB85C] hover:bg-green-50 transition-colors text-left"
                  >
                    <span className="text-xl">{db.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-gray-800 text-sm truncate">{db.name}</h3>
                      <p className="font-crayon text-xs text-gray-500 truncate">{db.description}</p>
                    </div>
                    <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Search within our summaries */}
            {searchQuery && filteredArticles.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display text-gray-700 mb-3">
                  From Our Summaries ({filteredArticles.length})
                </h2>
                <div className="space-y-3">
                  {filteredArticles.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      color={article.categoryColor}
                      isExpanded={expandedArticle === article.id}
                      onToggle={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* BROWSE TAB */}
        {activeTab === 'browse' && (
          <>
            {/* Intro */}
            <p className="text-center text-gray-600 font-crayon mb-6">
              Curated research summaries and key findings
            </p>

            {/* Category Grid */}
            {!selectedCategory && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {Object.entries(RESEARCH_CATEGORIES).map(([catId, category]) => (
                    <button
                      key={catId}
                      onClick={() => setSelectedCategory(catId)}
                      className="p-4 rounded-2xl border-4 text-left hover:scale-105 transition-transform"
                      style={{ 
                        backgroundColor: category.color + '20',
                        borderColor: category.color 
                      }}
                    >
                      <span className="text-3xl block mb-2">{category.emoji}</span>
                      <h3 className="font-display text-gray-800 text-sm">{category.name}</h3>
                      <p className="font-crayon text-xs text-gray-500 mt-1">
                        {category.articles.length} summaries
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategorySearch(category);
                        }}
                        className="mt-2 text-xs font-crayon flex items-center gap-1 hover:underline"
                        style={{ color: category.color }}
                      >
                        <RefreshCw size={12} />
                        Find new articles
                      </button>
                    </button>
                  ))}
                </div>

                {/* All Research Databases */}
                <div className="mb-8">
                  <h2 className="font-display text-lg text-[#5CB85C] mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Research Databases
                  </h2>
                  <div className="space-y-2">
                    {RESEARCH_DATABASES.map(db => (
                      <a
                        key={db.name}
                        href={db.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 
                                 hover:border-[#5CB85C] hover:bg-green-50 transition-colors"
                      >
                        <span className="text-2xl">{db.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-display text-gray-800 text-sm">{db.name}</h3>
                          <p className="font-crayon text-xs text-gray-500">{db.description}</p>
                        </div>
                        <ExternalLink size={16} className="text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Selected Category */}
            {selectedCategory && RESEARCH_CATEGORIES[selectedCategory] && (
              <div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 font-crayon text-gray-600 mb-4 hover:text-gray-800"
                >
                  <ArrowLeft size={16} />
                  All Categories
                </button>
                
                <div 
                  className="p-4 rounded-2xl mb-4 flex items-center justify-between"
                  style={{ backgroundColor: RESEARCH_CATEGORIES[selectedCategory].color + '20' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{RESEARCH_CATEGORIES[selectedCategory].emoji}</span>
                    <h2 className="font-display text-xl text-gray-800">
                      {RESEARCH_CATEGORIES[selectedCategory].name}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCategorySearch(RESEARCH_CATEGORIES[selectedCategory])}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg font-crayon text-sm
                             border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: RESEARCH_CATEGORIES[selectedCategory].color, color: RESEARCH_CATEGORIES[selectedCategory].color }}
                  >
                    <RefreshCw size={14} />
                    Find New
                  </button>
                </div>
                
                <div className="space-y-3">
                  {RESEARCH_CATEGORIES[selectedCategory].articles.map((article, i) => (
                    <ArticleCard
                      key={i}
                      article={article}
                      color={RESEARCH_CATEGORIES[selectedCategory].color}
                      isExpanded={expandedArticle === `${selectedCategory}-${i}`}
                      onToggle={() => setExpandedArticle(
                        expandedArticle === `${selectedCategory}-${i}` 
                          ? null 
                          : `${selectedCategory}-${i}`
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex gap-2">
            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-gray-500">
              These summaries are for informational purposes only. Research findings may evolve, 
              and individual circumstances vary. Always consult with qualified professionals 
              for advice specific to your situation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResearchHub;
