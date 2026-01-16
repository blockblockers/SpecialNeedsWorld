// CirclesOfControl.jsx - Visual tool for understanding control
// Helps users identify what they can and cannot control
// Part of the Emotional Wellness hub

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Circle,
  Plus,
  X,
  Save,
  Printer,
  HelpCircle,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Volume2,
  Check,
  Sparkles,
  Heart,
  Cloud,
  Users,
  Calendar,
  Brain,
  Home,
  School,
  Frown
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_circles_of_control';

// ============================================
// CIRCLE DEFINITIONS
// ============================================
const CIRCLES = [
  {
    id: 'control',
    name: 'Things I CAN Control',
    color: '#5CB85C',
    bgColor: '#5CB85C20',
    borderColor: '#5CB85C',
    icon: '✅',
    description: 'These are things you have power over. You can make choices about these!',
    examples: [
      'My words',
      'My actions',
      'My effort',
      'My attitude',
      'How I treat others',
      'What I practice',
      'Asking for help',
      'Taking deep breaths',
      'Being kind',
      'Trying my best',
      'My reactions',
      'What I focus on',
    ],
  },
  {
    id: 'influence',
    name: 'Things I Can INFLUENCE',
    color: '#F5A623',
    bgColor: '#F5A62320',
    borderColor: '#F5A623',
    icon: '🤝',
    description: 'You can\'t fully control these, but your actions can make a difference.',
    examples: [
      'Friendships',
      'How others feel',
      'Getting better at things',
      'My grades',
      'Being included',
      'My health',
      'Family mood',
      'Team success',
    ],
  },
  {
    id: 'no-control',
    name: 'Things I CANNOT Control',
    color: '#E63B2E',
    bgColor: '#E63B2E15',
    borderColor: '#E63B2E',
    icon: '🚫',
    description: 'These are outside your control. It\'s okay to let go of worry about these.',
    examples: [
      'The weather',
      'Other people\'s choices',
      'The past',
      'What others think of me',
      'How others act',
      'Traffic',
      'Rules at school',
      'My height',
      'Other people\'s feelings',
      'Changes in plans',
      'News events',
      'Other people\'s opinions',
    ],
  },
];

// ============================================
// SCENARIO PROMPTS
// ============================================
const SCENARIOS = [
  {
    id: 'friend-mad',
    prompt: 'My friend is mad at me',
    category: 'social',
    suggestions: {
      control: ['How I respond', 'Saying sorry if needed', 'Giving them space'],
      influence: ['Working things out', 'The friendship'],
      'no-control': ['Their feelings', 'If they forgive me'],
    },
  },
  {
    id: 'bad-grade',
    prompt: 'I got a bad grade on a test',
    category: 'school',
    suggestions: {
      control: ['Studying more next time', 'Asking for help', 'My effort'],
      influence: ['Future grades', 'Understanding the subject'],
      'no-control': ['The grade I already got', 'How hard the test was'],
    },
  },
  {
    id: 'plans-changed',
    prompt: 'Our plans got cancelled',
    category: 'life',
    suggestions: {
      control: ['My attitude', 'Finding something else to do', 'How I react'],
      influence: ['Making new plans', 'Having fun anyway'],
      'no-control': ['Why plans changed', 'Other people\'s schedules'],
    },
  },
  {
    id: 'left-out',
    prompt: 'I feel left out',
    category: 'social',
    suggestions: {
      control: ['Talking to someone', 'Finding activities I enjoy', 'Being friendly'],
      influence: ['Making new friends', 'Being included next time'],
      'no-control': ['Who others invite', 'Other people\'s choices'],
    },
  },
  {
    id: 'worried',
    prompt: 'I\'m worried about something',
    category: 'feelings',
    suggestions: {
      control: ['Taking deep breaths', 'Talking about it', 'Focusing on now'],
      influence: ['How big the worry feels', 'Preparing for things'],
      'no-control': ['The future', 'What might happen'],
    },
  },
];

// ============================================
// DRAGGABLE ITEM COMPONENT
// ============================================
const DraggableItem = ({ item, onRemove, circleColor }) => {
  return (
    <div 
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-crayon
               bg-white border-2 shadow-sm group"
      style={{ borderColor: circleColor }}
    >
      <span>{item.text}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full 
                 hover:bg-gray-100 text-gray-400 hover:text-red-500"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ============================================
// CIRCLE ZONE COMPONENT
// ============================================
const CircleZone = ({ circle, items, onAddItem, onRemoveItem, isActive, onActivate }) => {
  const [newItemText, setNewItemText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  
  const handleAdd = () => {
    if (newItemText.trim()) {
      onAddItem(circle.id, newItemText.trim());
      setNewItemText('');
    }
  };
  
  const handleExampleClick = (example) => {
    onAddItem(circle.id, example);
  };

  return (
    <div 
      className={`rounded-2xl border-4 p-4 transition-all cursor-pointer ${
        isActive ? 'ring-4 ring-offset-2' : ''
      }`}
      style={{ 
        backgroundColor: circle.bgColor,
        borderColor: circle.borderColor,
        ringColor: circle.color,
      }}
      onClick={onActivate}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{circle.icon}</span>
        <h3 className="font-display text-lg" style={{ color: circle.color }}>
          {circle.name}
        </h3>
      </div>
      
      {/* Description */}
      <p className="font-crayon text-sm text-gray-600 mb-3">
        {circle.description}
      </p>
      
      {/* Items */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
        {items.map(item => (
          <DraggableItem 
            key={item.id} 
            item={item} 
            onRemove={() => onRemoveItem(circle.id, item.id)}
            circleColor={circle.color}
          />
        ))}
        {items.length === 0 && (
          <span className="font-crayon text-sm text-gray-400 italic">
            Tap to add items here...
          </span>
        )}
      </div>
      
      {/* Add Item Input (shown when active) */}
      {isActive && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Type something..."
              className="flex-1 px-3 py-2 rounded-xl border-2 font-crayon text-sm outline-none"
              style={{ borderColor: circle.color }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleAdd(); }}
              className="px-3 py-2 rounded-xl text-white font-display text-sm"
              style={{ backgroundColor: circle.color }}
            >
              <Plus size={18} />
            </button>
          </div>
          
          {/* Examples Toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowExamples(!showExamples); }}
            className="flex items-center gap-1 font-crayon text-sm text-gray-500 hover:text-gray-700"
          >
            {showExamples ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showExamples ? 'Hide' : 'Show'} example ideas
          </button>
          
          {/* Examples */}
          {showExamples && (
            <div className="flex flex-wrap gap-1 p-2 bg-white/50 rounded-xl">
              {circle.examples.map((example, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); handleExampleClick(example); }}
                  className="px-2 py-1 text-xs font-crayon rounded-full border hover:bg-white transition-colors"
                  style={{ borderColor: circle.color, color: circle.color }}
                >
                  + {example}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// SCENARIO CARD COMPONENT
// ============================================
const ScenarioCard = ({ scenario, onSelect, isSelected }) => {
  const categoryIcons = {
    social: <Users size={16} />,
    school: <School size={16} />,
    life: <Calendar size={16} />,
    feelings: <Heart size={16} />,
  };
  
  return (
    <button
      onClick={() => onSelect(scenario)}
      className={`p-3 rounded-xl text-left transition-all ${
        isSelected 
          ? 'bg-[#4A9FD4] text-white ring-2 ring-[#4A9FD4] ring-offset-2' 
          : 'bg-white border-2 border-gray-200 hover:border-[#4A9FD4]'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={isSelected ? 'text-white' : 'text-gray-400'}>
          {categoryIcons[scenario.category]}
        </span>
        <span className={`font-crayon text-xs ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
          {scenario.category}
        </span>
      </div>
      <p className="font-display text-sm">{scenario.prompt}</p>
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const CirclesOfControl = () => {
  const navigate = useNavigate();
  
  // State
  const [items, setItems] = useState({
    control: [],
    influence: [],
    'no-control': [],
  });
  const [activeCircle, setActiveCircle] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showScenarios, setShowScenarios] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  
  const printRef = useRef(null);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSavedSessions(data.sessions || []);
      } catch (e) {
        console.error('Error loading circles data:', e);
      }
    }
  }, []);
  
  // Add item to circle
  const addItem = (circleId, text) => {
    setItems(prev => ({
      ...prev,
      [circleId]: [...prev[circleId], { id: Date.now(), text }],
    }));
  };
  
  // Remove item from circle
  const removeItem = (circleId, itemId) => {
    setItems(prev => ({
      ...prev,
      [circleId]: prev[circleId].filter(item => item.id !== itemId),
    }));
  };
  
  // Handle scenario selection
  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setShowScenarios(false);
    
    // Optionally pre-populate with suggestions
    // For now, just set the scenario and let user fill in
  };
  
  // Clear all items
  const clearAll = () => {
    if (confirm('Clear all items? This cannot be undone.')) {
      setItems({ control: [], influence: [], 'no-control': [] });
      setSelectedScenario(null);
      setShowScenarios(true);
    }
  };
  
  // Save current session
  const saveSession = () => {
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      scenario: selectedScenario?.prompt || 'Custom',
      items: { ...items },
    };
    
    const newSessions = [session, ...savedSessions].slice(0, 20);
    setSavedSessions(newSessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions: newSessions }));
    
    alert('Session saved!');
  };
  
  // Print
  const handlePrint = () => {
    window.print();
  };
  
  // Count total items
  const totalItems = Object.values(items).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
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
              <Circle size={24} />
              Circles of Control
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
      <main className="max-w-2xl mx-auto px-4 py-6" ref={printRef}>
        {/* Scenario Selection */}
        {showScenarios && (
          <div className="mb-6 p-4 bg-white rounded-2xl border-3 border-gray-200">
            <h2 className="font-display text-gray-700 mb-2">What's on your mind?</h2>
            <p className="font-crayon text-sm text-gray-500 mb-3">
              Choose a situation, or start from scratch
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {SCENARIOS.map(scenario => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={handleScenarioSelect}
                  isSelected={selectedScenario?.id === scenario.id}
                />
              ))}
            </div>
            
            <button
              onClick={() => setShowScenarios(false)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl
                       font-crayon text-sm text-gray-500 hover:border-[#8E6BBF] hover:text-[#8E6BBF]
                       transition-colors"
            >
              Or just start sorting...
            </button>
          </div>
        )}
        
        {/* Selected Scenario Banner */}
        {selectedScenario && !showScenarios && (
          <div className="mb-4 p-3 bg-[#8E6BBF]/10 rounded-xl border-2 border-[#8E6BBF]/30 flex items-center justify-between">
            <div>
              <span className="font-crayon text-xs text-gray-500">Thinking about:</span>
              <p className="font-display text-[#8E6BBF]">{selectedScenario.prompt}</p>
            </div>
            <button
              onClick={() => setShowScenarios(true)}
              className="font-crayon text-sm text-[#8E6BBF] hover:underline"
            >
              Change
            </button>
          </div>
        )}
        
        {/* Instructions */}
        {!showScenarios && (
          <p className="text-center font-crayon text-sm text-gray-500 mb-4">
            Tap a circle to add things. What can you control? What can't you?
          </p>
        )}
        
        {/* Circles */}
        {!showScenarios && (
          <div className="space-y-4" id="circles-print">
            {CIRCLES.map(circle => (
              <CircleZone
                key={circle.id}
                circle={circle}
                items={items[circle.id]}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                isActive={activeCircle === circle.id}
                onActivate={() => setActiveCircle(activeCircle === circle.id ? null : circle.id)}
              />
            ))}
          </div>
        )}
        
        {/* Action Buttons */}
        {!showScenarios && totalItems > 0 && (
          <div className="mt-6 flex gap-3 print:hidden">
            <button
              onClick={clearAll}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-display text-gray-600
                       hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Start Over
            </button>
            <button
              onClick={saveSession}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                       hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                       hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
        )}
        
        {/* Key Insight */}
        {!showScenarios && (
          <div className="mt-6 p-4 bg-[#F8D14A]/20 rounded-2xl border-3 border-[#F8D14A]/50">
            <h3 className="font-display text-[#D4A200] mb-2 flex items-center gap-2">
              <Sparkles size={18} />
              Remember
            </h3>
            <p className="font-crayon text-sm text-gray-600">
              Focusing on what we <strong>can</strong> control helps us feel less worried and more powerful. 
              It's okay to let go of things outside our control – that's not giving up, it's being smart!
            </p>
          </div>
        )}
        
        {/* Past Sessions */}
        {savedSessions.length > 0 && !showScenarios && (
          <div className="mt-6">
            <h3 className="font-display text-gray-700 mb-2 print:hidden">Past Sessions</h3>
            <div className="space-y-2 print:hidden">
              {savedSessions.slice(0, 3).map(session => (
                <div
                  key={session.id}
                  className="p-3 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-display text-sm text-gray-700">{session.scenario}</p>
                    <p className="font-crayon text-xs text-gray-400">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setItems(session.items);
                      setSelectedScenario({ prompt: session.scenario });
                      setShowScenarios(false);
                    }}
                    className="px-3 py-1 text-sm font-crayon text-[#8E6BBF] hover:bg-[#8E6BBF]/10 rounded-lg"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#8E6BBF]">About Circles of Control</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What is it?</strong> A tool to help sort thoughts and worries into 
                what we can and can't control.
              </p>
              <p>
                <strong>Why use it?</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Reduces anxiety about things outside our control</li>
                <li>Helps focus energy on what we CAN change</li>
                <li>Builds problem-solving skills</li>
                <li>Teaches healthy coping</li>
              </ul>
              <p>
                <strong>The Three Circles:</strong>
              </p>
              <ul className="space-y-2 ml-2">
                <li>
                  <span className="text-[#5CB85C] font-bold">✅ CAN Control:</span> Things 
                  you have direct power over (your words, actions, effort)
                </li>
                <li>
                  <span className="text-[#F5A623] font-bold">🤝 Can INFLUENCE:</span> Things 
                  you can affect but not fully control (friendships, grades)
                </li>
                <li>
                  <span className="text-[#E63B2E] font-bold">🚫 CANNOT Control:</span> Things 
                  outside your power (weather, others' choices)
                </li>
              </ul>
              <p>
                <strong>Tips:</strong> Start with a specific situation. Be honest about 
                what's really in your control. Remember – focusing on what you can control 
                is empowering!
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#8E6BBF] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #circles-print, #circles-print * {
            visibility: visible;
          }
          #circles-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          header, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CirclesOfControl;
