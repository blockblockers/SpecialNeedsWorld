// ColoringBook.jsx - Interactive Coloring Book
// Browse and color pre-made or AI-generated coloring pages

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Palette,
  Eraser,
  RotateCcw,
  Save,
  Download,
  ChevronLeft,
  Loader2,
  Sparkles,
  Search,
  Grid3X3,
  Heart,
  Check
} from 'lucide-react';
import { useAuth } from '../App';
import {
  CATEGORIES,
  COLOR_PALETTE,
  getColoringPages,
  getColoringPageById,
  saveUserColoring,
  getUserColoring,
  generateColoringPage,
} from '../services/coloringBook';

// ============================================
// COLOR PICKER COMPONENT
// ============================================

const ColorPicker = ({ selectedColor, onSelectColor, onSelectEraser, isEraser }) => {
  return (
    <div className="bg-white rounded-2xl border-4 border-[#E63B2E] p-3 shadow-crayon">
      <div className="flex items-center gap-2 mb-2">
        <Palette size={20} className="text-[#E63B2E]" />
        <span className="font-crayon text-sm text-gray-600">Colors</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color.hex}
            onClick={() => onSelectColor(color.hex)}
            className={`w-8 h-8 rounded-lg border-2 transition-all ${
              selectedColor === color.hex && !isEraser
                ? 'border-gray-800 scale-110 shadow-md' 
                : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
      
      {/* Eraser */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={onSelectEraser}
          className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-crayon text-sm transition-all ${
            isEraser 
              ? 'bg-[#E63B2E] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eraser size={16} />
          Eraser
        </button>
      </div>
      
      {/* Current Color Preview */}
      {!isEraser && (
        <div className="mt-2 flex items-center gap-2">
          <span className="font-crayon text-xs text-gray-500">Selected:</span>
          <div 
            className="w-6 h-6 rounded border-2 border-gray-400"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// COLORING CANVAS COMPONENT
// ============================================

const ColoringCanvas = ({ 
  svgContent, 
  selectedColor, 
  isEraser,
  onSvgChange,
  coloredSvg 
}) => {
  const containerRef = useRef(null);
  const [currentSvg, setCurrentSvg] = useState(coloredSvg || svgContent);
  
  // Update when svg changes
  useEffect(() => {
    setCurrentSvg(coloredSvg || svgContent);
  }, [svgContent, coloredSvg]);
  
  // Handle click on SVG element
  const handleClick = useCallback((e) => {
    const target = e.target;
    
    // Check if the element is colorable
    if (target.hasAttribute('data-colorable')) {
      const newColor = isEraser ? 'white' : selectedColor;
      
      // Check if it's a stroke-colorable element (like rainbow arcs)
      if (target.hasAttribute('data-stroke-colorable')) {
        target.setAttribute('stroke', newColor);
      } else {
        target.setAttribute('fill', newColor);
      }
      
      // Get updated SVG
      const container = containerRef.current;
      if (container) {
        const svgEl = container.querySelector('svg');
        if (svgEl) {
          const newSvgContent = svgEl.outerHTML;
          setCurrentSvg(newSvgContent);
          onSvgChange(newSvgContent);
        }
      }
    }
  }, [selectedColor, isEraser, onSvgChange]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full aspect-square bg-white rounded-2xl border-4 border-gray-200 shadow-inner overflow-hidden cursor-pointer"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: currentSvg }}
      style={{
        // Make SVG fill container
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

// ============================================
// PAGE CARD COMPONENT
// ============================================

const PageCard = ({ page, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl border-4 border-gray-200 p-3 
               hover:border-[#E63B2E] hover:shadow-crayon transition-all
               hover:-translate-y-1"
  >
    <div 
      className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2"
      dangerouslySetInnerHTML={{ __html: page.svg_content }}
      style={{ pointerEvents: 'none' }}
    />
    <h3 className="font-display text-sm text-gray-800 truncate">{page.title}</h3>
    <p className="font-crayon text-xs text-gray-500">
      {page.difficulty} • {page.use_count || 0} colored
    </p>
  </button>
);

// ============================================
// MAIN COMPONENT
// ============================================

const ColoringBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // View state
  const [view, setView] = useState('browse'); // browse, coloring, generate
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Pages state
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);
  const [coloredSvg, setColoredSvg] = useState(null);
  
  // Coloring state
  const [selectedColor, setSelectedColor] = useState('#F44336');
  const [isEraser, setIsEraser] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Generate state
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Load pages on mount and category change
  useEffect(() => {
    loadPages();
  }, [selectedCategory]);
  
  const loadPages = async () => {
    setIsLoading(true);
    try {
      const data = await getColoringPages(selectedCategory);
      setPages(data);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open a coloring page
  const openPage = async (page) => {
    setCurrentPage(page);
    setView('coloring');
    setHasChanges(false);
    
    // Load any existing coloring
    const existing = await getUserColoring(user?.id, page.id);
    if (existing?.colored_svg) {
      setColoredSvg(existing.colored_svg);
    } else {
      setColoredSvg(null);
    }
  };
  
  // Handle color selection
  const handleSelectColor = (hex) => {
    setSelectedColor(hex);
    setIsEraser(false);
  };
  
  // Handle SVG change
  const handleSvgChange = (newSvg) => {
    setColoredSvg(newSvg);
    setHasChanges(true);
  };
  
  // Save coloring
  const handleSave = async () => {
    if (!currentPage || !coloredSvg) return;
    
    setIsSaving(true);
    try {
      await saveUserColoring(user?.id, currentPage.id, coloredSvg);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset coloring
  const handleReset = () => {
    if (!currentPage) return;
    setColoredSvg(currentPage.svg_content);
    setHasChanges(true);
  };
  
  // Download as image
  const handleDownload = () => {
    if (!coloredSvg) return;
    
    // Create a blob and download
    const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage?.title || 'coloring'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Generate new page
  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const newPage = await generateColoringPage(generatePrompt, {
        userId: user?.id,
        category: selectedCategory !== 'all' ? selectedCategory : 'general',
      });
      
      if (newPage) {
        // Open the new page
        openPage(newPage);
        setGeneratePrompt('');
      }
    } catch (error) {
      console.error('Error generating:', error);
      alert('Failed to generate coloring page. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Render browse view
  const renderBrowseView = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-crayon text-sm transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#E63B2E] text-white shadow-md'
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#E63B2E]'
            }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>
      
      {/* Generate Button */}
      <div className="bg-gradient-to-r from-[#8E6BBF] to-[#E63B2E] rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} />
          <span className="font-display">Create Your Own!</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={generatePrompt}
            onChange={(e) => setGeneratePrompt(e.target.value)}
            placeholder="e.g., A happy elephant, A birthday cake..."
            className="flex-1 px-4 py-2 rounded-xl text-gray-800 font-crayon text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={!generatePrompt.trim() || isGenerating}
            className="px-4 py-2 bg-white text-[#8E6BBF] rounded-xl font-crayon text-sm
                       disabled:opacity-50 flex items-center gap-1"
          >
            {isGenerating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            Create
          </button>
        </div>
      </div>
      
      {/* Pages Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-[#E63B2E] animate-spin" />
        </div>
      ) : pages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pages.map((page) => (
            <PageCard 
              key={page.id} 
              page={page} 
              onClick={() => openPage(page)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-crayon text-gray-500">No coloring pages found.</p>
          <p className="font-crayon text-sm text-gray-400 mt-1">Try creating one!</p>
        </div>
      )}
    </div>
  );
  
  // Render coloring view
  const renderColoringView = () => (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Canvas */}
      <div className="flex-1">
        <div className="bg-gray-100 rounded-3xl p-4">
          <h2 className="font-display text-lg text-gray-800 mb-3 text-center">
            {currentPage?.title}
          </h2>
          
          <ColoringCanvas
            svgContent={currentPage?.svg_content}
            coloredSvg={coloredSvg}
            selectedColor={selectedColor}
            isEraser={isEraser}
            onSvgChange={handleSvgChange}
          />
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl font-crayon text-sm flex items-center gap-1"
            >
              <RotateCcw size={16} /> Reset
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon text-sm flex items-center gap-1 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save
            </button>
            
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#4A9FD4] text-white rounded-xl font-crayon text-sm flex items-center gap-1"
            >
              <Download size={16} /> Download
            </button>
          </div>
        </div>
      </div>
      
      {/* Color Picker - Side panel on desktop, bottom on mobile */}
      <div className="lg:w-64">
        <ColorPicker
          selectedColor={selectedColor}
          onSelectColor={handleSelectColor}
          onSelectEraser={() => setIsEraser(true)}
          isEraser={isEraser}
        />
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-[#FFF3E0] rounded-xl border-2 border-[#F5A623]">
          <p className="font-crayon text-sm text-[#E65100]">
            💡 Tap on any shape to fill it with the selected color!
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (view === 'coloring') {
                setView('browse');
                setCurrentPage(null);
              } else {
                navigate('/activities');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E63B2E] 
                       rounded-xl font-display font-bold text-[#E63B2E] hover:bg-[#E63B2E] 
                       hover:text-white transition-all shadow-md"
          >
            <ChevronLeft size={16} />
            {view === 'coloring' ? 'Back' : 'Activities'}
          </button>
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <h1 className="text-xl sm:text-2xl font-display text-[#E63B2E] crayon-text flex items-center gap-2">
            🎨 Coloring Book
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === 'browse' && renderBrowseView()}
        {view === 'coloring' && currentPage && renderColoringView()}
      </main>
      
      {/* Generating Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-[#E63B2E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={32} className="text-[#E63B2E] animate-spin" />
            </div>
            <h3 className="font-display text-xl text-[#E63B2E] mb-2">Creating Your Page</h3>
            <p className="font-crayon text-gray-600">
              Drawing something special just for you...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColoringBook;
