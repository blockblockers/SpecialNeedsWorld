// PrintablesLibrary.jsx - Centralized Printable Resources Library
// Free downloadable charts, cards, and worksheets
// Part of the Resources & Research hub

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer,
  Download,
  Search,
  Filter,
  Star,
  Eye,
  X,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Grid3X3,
  List,
  Clock,
  FileText,
  Heart,
  Smile,
  Calendar,
  MessageCircle,
  Target,
  Award,
  Sparkles,
  Brain,
  Users,
  CheckSquare,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_printables';

// ============================================
// PRINTABLE CATEGORIES
// ============================================
const CATEGORIES = [
  { id: 'all', name: 'All', icon: Grid3X3, color: '#4A9FD4' },
  { id: 'emotions', name: 'Emotions', icon: Smile, color: '#F5A623' },
  { id: 'coping', name: 'Coping & Calm', icon: Heart, color: '#20B2AA' },
  { id: 'schedules', name: 'Schedules', icon: Calendar, color: '#E63B2E' },
  { id: 'communication', name: 'Communication', icon: MessageCircle, color: '#8E6BBF' },
  { id: 'behavior', name: 'Behavior', icon: Target, color: '#5CB85C' },
  { id: 'social', name: 'Social Skills', icon: Users, color: '#E86B9A' },
  { id: 'learning', name: 'Learning', icon: Brain, color: '#0891B2' },
];

// ============================================
// PRINTABLES DATA
// ============================================
const PRINTABLES = [
  // EMOTIONS CATEGORY
  {
    id: 'emotion-faces-chart',
    name: 'Emotion Faces Chart',
    description: 'Grid of 12 emotion faces with labels - great for identification practice',
    category: 'emotions',
    tags: ['feelings', 'identification', 'visual support'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'emotion-faces',
  },
  {
    id: 'feelings-thermometer',
    name: 'Feelings Thermometer',
    description: 'Visual scale from calm to very upset - helps identify intensity',
    category: 'emotions',
    tags: ['intensity', 'regulation', 'self-awareness'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'thermometer',
  },
  {
    id: 'emotion-body-map',
    name: 'Where Do I Feel It? Body Map',
    description: 'Outline of body to mark where emotions are felt physically',
    category: 'emotions',
    tags: ['body awareness', 'interoception', 'feelings'],
    difficulty: 'Easy',
    ageRange: 'Ages 5+',
    pages: 1,
    printContent: 'body-map',
  },
  {
    id: 'mood-tracker-weekly',
    name: 'Weekly Mood Tracker',
    description: 'Track daily moods for a week with space for notes',
    category: 'emotions',
    tags: ['tracking', 'journal', 'patterns'],
    difficulty: 'Easy',
    ageRange: 'Ages 6+',
    pages: 1,
    printContent: 'mood-tracker',
  },
  
  // COPING CATEGORY
  {
    id: 'calm-down-cards',
    name: 'Calm Down Strategy Cards',
    description: '16 printable cards with calming strategies and visuals',
    category: 'coping',
    tags: ['regulation', 'strategies', 'cards'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 2,
    popular: true,
    printContent: 'calm-cards',
  },
  {
    id: 'breathing-exercises',
    name: 'Breathing Exercise Posters',
    description: '4 visual breathing techniques: box breathing, star breathing, etc.',
    category: 'coping',
    tags: ['breathing', 'calm', 'visual'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 4,
    popular: true,
    printContent: 'breathing',
  },
  {
    id: 'coping-skills-menu',
    name: 'My Coping Skills Menu',
    description: 'Customizable chart to list personal coping strategies',
    category: 'coping',
    tags: ['personalized', 'strategies', 'chart'],
    difficulty: 'Easy',
    ageRange: 'Ages 5+',
    pages: 1,
    printContent: 'coping-menu',
  },
  {
    id: 'sensory-diet-checklist',
    name: 'Sensory Diet Checklist',
    description: 'Daily checklist for sensory activities and regulation',
    category: 'coping',
    tags: ['sensory', 'OT', 'daily'],
    difficulty: 'Medium',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'sensory-checklist',
  },
  {
    id: 'grounding-54321',
    name: '5-4-3-2-1 Grounding Poster',
    description: 'Visual guide for the 5 senses grounding technique',
    category: 'coping',
    tags: ['grounding', 'anxiety', 'mindfulness'],
    difficulty: 'Easy',
    ageRange: 'Ages 6+',
    pages: 1,
    printContent: 'grounding',
  },
  {
    id: 'worry-jar',
    name: 'Worry Jar Worksheet',
    description: 'Write worries on slips to put in a "worry jar" - externalize anxiety',
    category: 'coping',
    tags: ['anxiety', 'worry', 'activity'],
    difficulty: 'Easy',
    ageRange: 'Ages 5+',
    pages: 1,
    printContent: 'worry-jar',
  },
  
  // SCHEDULES CATEGORY
  {
    id: 'visual-schedule-daily',
    name: 'Daily Visual Schedule Template',
    description: 'Blank daily schedule with time slots and picture spaces',
    category: 'schedules',
    tags: ['routine', 'daily', 'template'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'daily-schedule',
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine Chart',
    description: 'Visual checklist for morning tasks with checkboxes',
    category: 'schedules',
    tags: ['morning', 'routine', 'checklist'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'morning-routine',
  },
  {
    id: 'bedtime-routine',
    name: 'Bedtime Routine Chart',
    description: 'Visual checklist for evening/bedtime tasks',
    category: 'schedules',
    tags: ['bedtime', 'routine', 'checklist'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'bedtime-routine',
  },
  {
    id: 'first-then-board',
    name: 'First-Then Board',
    description: 'Classic first-then template with spaces for pictures',
    category: 'schedules',
    tags: ['first-then', 'motivation', 'sequence'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'first-then',
  },
  {
    id: 'weekly-schedule',
    name: 'Weekly Schedule Grid',
    description: 'Week at a glance with morning/afternoon/evening sections',
    category: 'schedules',
    tags: ['weekly', 'planning', 'overview'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'weekly-schedule',
  },
  {
    id: 'task-breakdown',
    name: 'Task Breakdown Sheet',
    description: 'Break big tasks into smaller steps with checkboxes',
    category: 'schedules',
    tags: ['tasks', 'steps', 'executive function'],
    difficulty: 'Medium',
    ageRange: 'Ages 6+',
    pages: 1,
    printContent: 'task-breakdown',
  },
  
  // COMMUNICATION CATEGORY
  {
    id: 'basic-needs-board',
    name: 'Basic Needs Communication Board',
    description: '12 essential needs icons: hungry, thirsty, bathroom, help, etc.',
    category: 'communication',
    tags: ['AAC', 'basic needs', 'core words'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'needs-board',
  },
  {
    id: 'feelings-board',
    name: 'Feelings Communication Board',
    description: '12 emotion icons for pointing/communication',
    category: 'communication',
    tags: ['AAC', 'feelings', 'expression'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'feelings-board',
  },
  {
    id: 'pain-scale',
    name: 'Pain Scale Chart',
    description: 'Visual pain scale from 0-10 with faces and descriptions',
    category: 'communication',
    tags: ['pain', 'medical', 'communication'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'pain-scale',
  },
  {
    id: 'choice-board-blank',
    name: 'Blank Choice Board',
    description: '4 and 6 option choice board templates',
    category: 'communication',
    tags: ['choices', 'AAC', 'template'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'choice-board',
  },
  
  // BEHAVIOR CATEGORY
  {
    id: 'token-board-10',
    name: '10-Token Board',
    description: 'Token economy board with 10 spaces and reward section',
    category: 'behavior',
    tags: ['tokens', 'rewards', 'motivation'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'token-board',
  },
  {
    id: 'token-board-5',
    name: '5-Token Board',
    description: 'Simpler token board with 5 spaces - great for beginners',
    category: 'behavior',
    tags: ['tokens', 'rewards', 'beginner'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'token-board-5',
  },
  {
    id: 'behavior-chart-weekly',
    name: 'Weekly Behavior Chart',
    description: 'Track behaviors/goals across the week with sticker spaces',
    category: 'behavior',
    tags: ['tracking', 'goals', 'weekly'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'behavior-chart',
  },
  {
    id: 'reward-menu',
    name: 'Reward Menu',
    description: 'Customizable menu of rewards with point values',
    category: 'behavior',
    tags: ['rewards', 'motivation', 'choices'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    printContent: 'reward-menu',
  },
  {
    id: 'expected-unexpected',
    name: 'Expected vs Unexpected Behaviors',
    description: 'T-chart for sorting expected and unexpected behaviors',
    category: 'behavior',
    tags: ['social thinking', 'behavior', 'sorting'],
    difficulty: 'Medium',
    ageRange: 'Ages 5+',
    pages: 1,
    printContent: 'expected-unexpected',
  },
  
  // SOCIAL SKILLS CATEGORY
  {
    id: 'social-story-template',
    name: 'Social Story Template',
    description: 'Blank template for writing custom social stories',
    category: 'social',
    tags: ['social stories', 'template', 'custom'],
    difficulty: 'Medium',
    ageRange: 'All ages',
    pages: 2,
    printContent: 'social-story-template',
  },
  {
    id: 'conversation-starters',
    name: 'Conversation Starter Cards',
    description: '20 conversation starter prompts for social practice',
    category: 'social',
    tags: ['conversation', 'social skills', 'cards'],
    difficulty: 'Medium',
    ageRange: 'Ages 6+',
    pages: 2,
    printContent: 'conversation-cards',
  },
  {
    id: 'friendship-skills',
    name: 'Friendship Skills Checklist',
    description: 'Visual checklist of friendship behaviors',
    category: 'social',
    tags: ['friendship', 'skills', 'checklist'],
    difficulty: 'Medium',
    ageRange: 'Ages 5+',
    pages: 1,
    printContent: 'friendship-checklist',
  },
  {
    id: 'size-of-problem',
    name: 'Size of the Problem Scale',
    description: 'Visual scale for rating problem size and appropriate reactions',
    category: 'social',
    tags: ['problem solving', 'perspective', 'regulation'],
    difficulty: 'Medium',
    ageRange: 'Ages 6+',
    pages: 1,
    printContent: 'size-problem',
  },
  
  // LEARNING CATEGORY
  {
    id: 'growth-mindset-poster',
    name: 'Growth Mindset Poster',
    description: '"I can\'t do this YET" and other growth mindset phrases',
    category: 'learning',
    tags: ['growth mindset', 'motivation', 'poster'],
    difficulty: 'Easy',
    ageRange: 'All ages',
    pages: 1,
    popular: true,
    printContent: 'growth-mindset',
  },
  {
    id: 'goal-setting-sheet',
    name: 'My Goals Worksheet',
    description: 'Set goals, break into steps, track progress',
    category: 'learning',
    tags: ['goals', 'planning', 'motivation'],
    difficulty: 'Medium',
    ageRange: 'Ages 6+',
    pages: 1,
    printContent: 'goals-sheet',
  },
  {
    id: 'self-reflection',
    name: 'Self-Reflection Sheet',
    description: 'Questions for reflecting on learning and behavior',
    category: 'learning',
    tags: ['reflection', 'self-awareness', 'learning'],
    difficulty: 'Medium',
    ageRange: 'Ages 7+',
    pages: 1,
    printContent: 'self-reflection',
  },
  {
    id: 'iep-meeting-prep',
    name: 'IEP Meeting Prep Worksheet',
    description: 'Prepare for IEP meetings with guided questions',
    category: 'learning',
    tags: ['IEP', 'advocacy', 'preparation'],
    difficulty: 'Advanced',
    ageRange: 'Parents/Educators',
    pages: 2,
    printContent: 'iep-prep',
  },
];

// ============================================
// PRINTABLE CARD COMPONENT
// ============================================
const PrintableCard = ({ printable, isSaved, onToggleSave, onPreview }) => {
  const category = CATEGORIES.find(c => c.id === printable.category);
  
  return (
    <div className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Preview Area */}
      <div 
        className="h-32 flex items-center justify-center cursor-pointer relative"
        style={{ backgroundColor: `${category?.color}15` }}
        onClick={() => onPreview(printable)}
      >
        <FileText size={48} style={{ color: category?.color }} className="opacity-50" />
        
        {/* Popular Badge */}
        {printable.popular && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 
                         text-xs font-display rounded-full flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Popular
          </span>
        )}
        
        {/* Pages Badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/80 text-gray-600 
                       text-xs font-crayon rounded-full">
          {printable.pages} page{printable.pages > 1 ? 's' : ''}
        </span>
        
        {/* Preview Icon */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors 
                      flex items-center justify-center opacity-0 hover:opacity-100">
          <Eye size={24} className="text-gray-700" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-display text-sm text-gray-800 mb-1 line-clamp-1">
          {printable.name}
        </h3>
        <p className="font-crayon text-xs text-gray-500 mb-2 line-clamp-2">
          {printable.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-crayon text-white"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-crayon text-gray-600">
            {printable.ageRange}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(printable)}
            className="flex-1 py-2 bg-gray-100 rounded-lg font-crayon text-xs text-gray-600 
                     hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => onToggleSave(printable.id)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-gray-100 text-gray-400 hover:text-yellow-500'
            }`}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRINTABLE PREVIEW MODAL
// ============================================
const PrintablePreviewModal = ({ printable, onClose }) => {
  if (!printable) return null;
  
  const category = CATEGORIES.find(c => c.id === printable.category);
  
  // Generate preview content based on printable type
  const renderPreviewContent = () => {
    switch (printable.printContent) {
      case 'emotion-faces':
        return (
          <div className="grid grid-cols-4 gap-4 p-6">
            {['😊 Happy', '😢 Sad', '😠 Angry', '😨 Scared', '😮 Surprised', '😴 Tired', 
              '🤩 Excited', '😌 Calm', '😤 Frustrated', '😕 Confused', '😊 Proud', '🥰 Loved'].map((emotion, i) => (
              <div key={i} className="text-center p-3 border-2 border-gray-200 rounded-xl">
                <span className="text-4xl block mb-2">{emotion.split(' ')[0]}</span>
                <span className="font-display text-sm">{emotion.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        );
      
      case 'thermometer':
        return (
          <div className="p-6 flex justify-center">
            <div className="w-24">
              {[5, 4, 3, 2, 1].map((level) => (
                <div key={level} className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ 
                      backgroundColor: level === 5 ? '#E63B2E' : 
                                       level === 4 ? '#F5A623' : 
                                       level === 3 ? '#F8D14A' : 
                                       level === 2 ? '#87CEEB' : '#5CB85C' 
                    }}
                  >
                    {level}
                  </div>
                  <span className="font-crayon text-sm">
                    {level === 5 ? 'Very Upset' : 
                     level === 4 ? 'Upset' : 
                     level === 3 ? 'A Little Upset' : 
                     level === 2 ? 'Okay' : 'Calm'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'first-then':
        return (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="border-4 border-[#4A9FD4] rounded-2xl p-4">
                <h3 className="text-center font-display text-xl text-[#4A9FD4] mb-4">FIRST</h3>
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 font-crayon">Add picture</span>
                </div>
              </div>
              <div className="border-4 border-[#5CB85C] rounded-2xl p-4">
                <h3 className="text-center font-display text-xl text-[#5CB85C] mb-4">THEN</h3>
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 font-crayon">Add picture</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'token-board':
        return (
          <div className="p-6">
            <h3 className="text-center font-display text-lg mb-4">I am working for:</h3>
            <div className="w-32 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-6">
              <span className="text-gray-400 font-crayon text-sm">Reward</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square border-3 border-[#F8D14A] rounded-full flex items-center justify-center">
                  <Star size={24} className="text-gray-200" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'needs-board':
        return (
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3">
              {['🥤 Drink', '🍎 Hungry', '🚽 Bathroom', '🆘 Help',
                '⏹️ Stop', '⏳ Wait', '✅ Yes', '❌ No',
                '😴 Tired', '🤕 Hurt', '🎮 Play', '🏠 Home'].map((item, i) => (
                <div key={i} className="text-center p-2 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <span className="text-2xl block mb-1">{item.split(' ')[0]}</span>
                  <span className="font-display text-xs">{item.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'calm-cards':
        return (
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {['🌬️ Breathe', '🚶 Walk', '🧸 Hug', '🎵 Music',
                '💧 Water', '🔢 Count', '🖍️ Draw', '💪 Squeeze'].map((item, i) => (
                <div key={i} className="text-center p-3 border-2 border-[#20B2AA] rounded-xl bg-[#20B2AA]/10">
                  <span className="text-2xl block mb-1">{item.split(' ')[0]}</span>
                  <span className="font-crayon text-xs">{item.split(' ')[1]}</span>
                </div>
              ))}
            </div>
            <p className="text-center font-crayon text-xs text-gray-400 mt-3">
              Preview shows 8 of 16 cards
            </p>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="font-crayon text-gray-500">
              Full preview available when you print
            </p>
          </div>
        );
    }
  };
  
  const handlePrint = () => {
    // In a real implementation, this would open a print-optimized version
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: `${category?.color}15` }}>
          <div>
            <h2 className="font-display text-lg" style={{ color: category?.color }}>
              {printable.name}
            </h2>
            <p className="font-crayon text-sm text-gray-500">{printable.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        {/* Preview Content */}
        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
          <div className="bg-white border-2 border-gray-200 m-4 rounded-xl" id="print-preview">
            {renderPreviewContent()}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-display text-gray-600
                     hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl font-display text-white flex items-center justify-center gap-2
                     hover:opacity-90 transition-opacity"
            style={{ backgroundColor: category?.color }}
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const PrintablesLibrary = () => {
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedPrintables, setSavedPrintables] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [previewPrintable, setPreviewPrintable] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showInfo, setShowInfo] = useState(false);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSavedPrintables(data.saved || []);
        setRecentlyViewed(data.recent || []);
      } catch (e) {
        console.error('Error loading printables data:', e);
      }
    }
  }, []);
  
  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      saved: savedPrintables,
      recent: recentlyViewed,
    }));
  }, [savedPrintables, recentlyViewed]);
  
  // Toggle save
  const toggleSave = (printableId) => {
    setSavedPrintables(prev => 
      prev.includes(printableId)
        ? prev.filter(id => id !== printableId)
        : [...prev, printableId]
    );
  };
  
  // Handle preview
  const handlePreview = (printable) => {
    setPreviewPrintable(printable);
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== printable.id);
      return [printable.id, ...filtered].slice(0, 10);
    });
  };
  
  // Filter printables
  const filteredPrintables = PRINTABLES.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // Get saved printables objects
  const savedPrintableObjects = PRINTABLES.filter(p => savedPrintables.includes(p.id));
  
  // Get popular printables
  const popularPrintables = PRINTABLES.filter(p => p.popular);

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
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
              <Printer size={24} />
              Printables Library
            </h1>
          </div>
          
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HelpCircle size={22} className="text-gray-400" />
          </button>
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
            placeholder="Search printables..."
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
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-crayon text-sm whitespace-nowrap
                        transition-all ${
                          selectedCategory === cat.id
                            ? 'text-white shadow-md'
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? cat.color : undefined
              }}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>
        
        {/* Saved Printables */}
        {savedPrintableObjects.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <BookmarkCheck size={18} className="text-yellow-500" />
              My Saved Printables
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {savedPrintableObjects.slice(0, 5).map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePreview(p)}
                  className="flex-shrink-0 w-32 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl
                           hover:bg-yellow-100 transition-colors text-left"
                >
                  <FileText size={24} className="text-yellow-500 mb-2" />
                  <p className="font-display text-xs text-gray-700 line-clamp-2">{p.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular Printables */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" fill="currentColor" />
              Popular Printables
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {popularPrintables.slice(0, 6).map(p => {
                const cat = CATEGORIES.find(c => c.id === p.category);
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePreview(p)}
                    className="flex-shrink-0 w-36 p-3 bg-white border-2 rounded-xl
                             hover:shadow-md transition-all text-left"
                    style={{ borderColor: cat?.color }}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${cat?.color}20` }}
                    >
                      <FileText size={16} style={{ color: cat?.color }} />
                    </div>
                    <p className="font-display text-xs text-gray-700 line-clamp-2">{p.name}</p>
                    <p className="font-crayon text-xs text-gray-400 mt-1">{p.pages} page{p.pages > 1 ? 's' : ''}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-crayon text-sm text-gray-500">
            {filteredPrintables.length} printable{filteredPrintables.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#F5A623] text-white' : 'bg-gray-100'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#F5A623] text-white' : 'bg-gray-100'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {/* Printables Grid */}
        {filteredPrintables.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredPrintables.map(printable => (
              <PrintableCard
                key={printable.id}
                printable={printable}
                isSaved={savedPrintables.includes(printable.id)}
                onToggleSave={toggleSave}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-crayon text-gray-500">No printables found</p>
            <p className="font-crayon text-sm text-gray-400">Try a different search or category</p>
          </div>
        )}
        
        {/* Attribution */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-center">
          <p className="font-crayon text-xs text-gray-400">
            All printables are free for personal and educational use.<br/>
            Some visuals use ARASAAC pictograms (CC BY-NC-SA)
          </p>
        </div>
      </main>

      {/* Preview Modal */}
      {previewPrintable && (
        <PrintablePreviewModal
          printable={previewPrintable}
          onClose={() => setPreviewPrintable(null)}
        />
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#F5A623]">About Printables</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What's here?</strong> Free visual supports, charts, and worksheets you can 
                print at home or school.
              </p>
              <p>
                <strong>How to use:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
                <li>Browse by category or search</li>
                <li>Preview before printing</li>
                <li>Save favorites for quick access</li>
                <li>Print on cardstock for durability</li>
                <li>Laminate for reuse</li>
              </ul>
              <p>
                <strong>Tips:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
                <li>Use velcro dots for moveable pieces</li>
                <li>Personalize with photos when possible</li>
                <li>Start simple, add complexity later</li>
              </ul>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#F5A623] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintablesLibrary;
