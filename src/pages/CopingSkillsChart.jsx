// CopingSkillsChart.jsx - Visual coping strategies chart
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Volume2, Printer, X, HelpCircle, Check, Calendar } from 'lucide-react';
import AddToScheduleModal from '../components/AddToScheduleModal';
import { addCopingStrategyToSchedule } from '../services/scheduleHelper';

// Coping strategies organized by type
const COPING_STRATEGIES = {
  breathing: {
    name: 'Breathing',
    emoji: '🌬️',
    color: '#4A9FD4',
    description: 'Calm your body with breath',
    strategies: [
      { id: 'balloon', name: 'Balloon Breathing', emoji: '🎈', steps: ['Breathe in slowly (count to 4)', 'Hold (count to 4)', 'Breathe out slowly (count to 4)', 'Repeat 3 times'] },
      { id: 'square', name: 'Square Breathing', emoji: '⬛', steps: ['Breathe in (4 counts)', 'Hold (4 counts)', 'Breathe out (4 counts)', 'Hold (4 counts)', 'Repeat'] },
      { id: 'flower', name: 'Smell the Flower', emoji: '🌸', steps: ['Pretend to smell a flower', 'Breathe in through your nose', 'Pretend to blow out a candle', 'Breathe out through mouth'] },
    ]
  },
  movement: {
    name: 'Movement',
    emoji: '🏃',
    color: '#5CB85C',
    description: 'Move your body',
    strategies: [
      { id: 'stretch', name: 'Stretch It Out', emoji: '🧘', steps: ['Reach up high', 'Touch your toes', 'Twist side to side', 'Shake your whole body'] },
      { id: 'walk', name: 'Take a Walk', emoji: '🚶', steps: ['Walk around the room', 'Focus on your steps', 'Notice what you see', 'Take deep breaths'] },
      { id: 'jump', name: 'Jump It Out', emoji: '🦘', steps: ['Do 10 jumping jacks', 'Jump up and down', 'Shake out your arms', 'Take deep breaths'] },
    ]
  },
  sensory: {
    name: 'Sensory',
    emoji: '🖐️',
    color: '#8E6BBF',
    description: 'Use your senses',
    strategies: [
      { id: 'grounding', name: '5-4-3-2-1', emoji: '🔢', steps: ['See 5 things', 'Touch 4 things', 'Hear 3 things', 'Smell 2 things', 'Taste 1 thing'] },
      { id: 'squeeze', name: 'Squeeze & Release', emoji: '✊', steps: ['Squeeze your hands tight', 'Count to 5', 'Let go and relax', 'Feel the difference'] },
      { id: 'cold', name: 'Cold Water', emoji: '💧', steps: ['Splash cold water on face', 'Hold ice cube', 'Drink cold water', 'Feel the coolness'] },
    ]
  },
  thinking: {
    name: 'Thinking',
    emoji: '💭',
    color: '#F5A623',
    description: 'Calm your thoughts',
    strategies: [
      { id: 'positive', name: 'Positive Self-Talk', emoji: '💪', steps: ['"I can handle this"', '"I am safe"', '"This feeling will pass"', '"I\'ve done hard things before"'] },
      { id: 'distract', name: 'Change Focus', emoji: '🎯', steps: ['Count backwards from 10', 'Name 5 animals', 'Think of your happy place', 'Remember a fun memory'] },
      { id: 'problem', name: 'Problem Solve', emoji: '🧩', steps: ['What\'s the problem?', 'What can I try?', 'Pick one thing to do', 'Try it and see'] },
    ]
  },
  comfort: {
    name: 'Comfort',
    emoji: '🧸',
    color: '#E86B9A',
    description: 'Find comfort',
    strategies: [
      { id: 'hug', name: 'Self-Hug', emoji: '🤗', steps: ['Cross arms over chest', 'Give yourself a squeeze', 'Pat your shoulders', 'Say "I\'m okay"'] },
      { id: 'cozy', name: 'Get Cozy', emoji: '🛋️', steps: ['Find a quiet spot', 'Wrap in a blanket', 'Hug a stuffed animal', 'Rest for a minute'] },
      { id: 'talk', name: 'Talk to Someone', emoji: '💬', steps: ['Find a trusted person', 'Tell them how you feel', 'Ask for help', 'Listen to their advice'] },
    ]
  },
};

// Strategy Card
const StrategyCard = ({ strategy, color, onSelect, isSelected, onAddToSchedule }) => (
  <button
    onClick={() => onSelect(strategy)}
    className={`w-full p-4 rounded-xl text-left transition-all ${
      isSelected ? 'bg-white shadow-lg scale-[1.02]' : 'bg-white/50 hover:bg-white hover:shadow-md'
    }`}
    style={{ border: isSelected ? `3px solid ${color}` : '2px solid transparent' }}
  >
    <div className="flex items-center gap-3">
      <span className="text-3xl">{strategy.emoji}</span>
      <div className="flex-1">
        <h4 className="font-display text-gray-800">{strategy.name}</h4>
        <p className="text-xs text-gray-500 font-crayon">{strategy.steps.length} steps</p>
      </div>
      {isSelected && (
        <button
          onClick={(e) => { e.stopPropagation(); onAddToSchedule(strategy); }}
          className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
          title="Add to schedule"
        >
          <Calendar size={16} className="text-blue-600" />
        </button>
      )}
    </div>
  </button>
);

// Strategy Detail Modal
const StrategyDetailModal = ({ strategy, category, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < strategy.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(strategy);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl" style={{ borderTop: `6px solid ${category.color}` }}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{strategy.emoji}</span>
            <h2 className="font-display text-xl" style={{ color: category.color }}>{strategy.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Steps */}
          <div className="space-y-3 mb-6">
            {strategy.steps.map((step, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl transition-all ${
                  currentStep === i ? 'ring-4 ring-offset-2' : ''
                } ${completedSteps.includes(i) ? 'bg-green-100' : 'bg-gray-50'}`}
                style={{ ringColor: currentStep === i ? category.color : undefined }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-white ${
                    completedSteps.includes(i) ? 'bg-green-500' : ''
                  }`} style={{ backgroundColor: !completedSteps.includes(i) ? category.color : undefined }}>
                    {completedSteps.includes(i) ? <Check size={16} /> : i + 1}
                  </div>
                  <p className="font-crayon text-gray-700 flex-1">{step}</p>
                  {currentStep === i && (
                    <button onClick={() => speak(step)} className="p-2 hover:bg-gray-200 rounded-full">
                      <Volume2 size={18} style={{ color: category.color }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Action Button */}
          <button
            onClick={completeStep}
            className="w-full py-4 rounded-xl text-white font-display text-lg shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: category.color }}
          >
            {currentStep < strategy.steps.length - 1 ? 'Done! Next Step →' : '✓ All Done!'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CopingSkillsChart = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [usedStrategies, setUsedStrategies] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [strategyToSchedule, setStrategyToSchedule] = useState(null);

  // Load used strategies
  useEffect(() => {
    const saved = localStorage.getItem('snw_coping_used');
    if (saved) {
      try {
        setUsedStrategies(JSON.parse(saved).slice(-50));
      } catch (e) {
        console.error('Error loading:', e);
      }
    }
  }, []);

  const handleComplete = (strategy) => {
    const newUsed = [...usedStrategies, { id: strategy.id, timestamp: new Date().toISOString() }].slice(-50);
    setUsedStrategies(newUsed);
    localStorage.setItem('snw_coping_used', JSON.stringify(newUsed));
    setShowDetail(false);
    setSelectedStrategy(null);
  };

  const handleAddToSchedule = (strategy) => {
    setStrategyToSchedule(strategy);
    setShowScheduleModal(true);
  };

  const handleScheduleSave = ({ date, time }) => {
    if (strategyToSchedule) {
      addCopingStrategyToSchedule(strategyToSchedule.name, time, date);
      setShowScheduleModal(false);
      setStrategyToSchedule(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              🛠️ Coping Skills
            </h1>
          </div>
          <button onClick={() => window.print()} className="p-2 rounded-full hover:bg-gray-100 print:hidden">
            <Printer size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <p className="text-center font-crayon text-gray-600">
          {selectedCategory ? 'Pick a strategy to try!' : 'What kind of help do you need?'}
        </p>

        {/* Category Selection */}
        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(COPING_STRATEGIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className="p-6 rounded-2xl text-white text-center transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-4xl block mb-2">{cat.emoji}</span>
                <h3 className="font-display text-lg">{cat.name}</h3>
                <p className="text-xs opacity-90 font-crayon mt-1">{cat.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => { setSelectedCategory(null); setSelectedStrategy(null); }}
              className="text-sm font-crayon text-gray-500 hover:text-gray-700"
            >
              ← Choose different type
            </button>

            <div className="p-4 rounded-2xl space-y-3" style={{ backgroundColor: `${COPING_STRATEGIES[selectedCategory].color}10` }}>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{COPING_STRATEGIES[selectedCategory].emoji}</span>
                <h2 className="font-display text-xl" style={{ color: COPING_STRATEGIES[selectedCategory].color }}>
                  {COPING_STRATEGIES[selectedCategory].name}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {COPING_STRATEGIES[selectedCategory].strategies.map(strategy => (
                  <StrategyCard
                    key={strategy.id}
                    strategy={strategy}
                    color={COPING_STRATEGIES[selectedCategory].color}
                    onSelect={(s) => { setSelectedStrategy(s); setShowDetail(true); }}
                    isSelected={selectedStrategy?.id === strategy.id}
                    onAddToSchedule={handleAddToSchedule}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stars earned */}
        {usedStrategies.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="font-display text-gray-700">Strategies Used Today</span>
            </div>
            <p className="font-crayon text-gray-600">
              You've used {usedStrategies.filter(s => {
                const today = new Date().toDateString();
                return new Date(s.timestamp).toDateString() === today;
              }).length} coping strategies today! ⭐
            </p>
          </div>
        )}
      </main>

      {/* Strategy Detail Modal */}
      {showDetail && selectedStrategy && selectedCategory && (
        <StrategyDetailModal
          strategy={selectedStrategy}
          category={COPING_STRATEGIES[selectedCategory]}
          onClose={() => { setShowDetail(false); setSelectedStrategy(null); }}
          onComplete={handleComplete}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <AddToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => { setShowScheduleModal(false); setStrategyToSchedule(null); }}
          onSave={handleScheduleSave}
          itemName={strategyToSchedule?.name || 'Coping Strategy'}
          itemType="wellness"
        />
      )}
    </div>
  );
};

export default CopingSkillsChart;
