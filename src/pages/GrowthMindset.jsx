// GrowthMindset.jsx - Learn about growth mindset concepts
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Star, Volume2, ChevronRight, X, HelpCircle, Sparkles, Check } from 'lucide-react';

// Growth mindset concepts
const MINDSET_CONCEPTS = [
  {
    id: 'mistakes',
    title: 'Mistakes Help Me Learn',
    emoji: '🎯',
    color: '#E63B2E',
    fixed: "I made a mistake, I'm not good at this.",
    growth: "I made a mistake! Now I know what to try differently.",
    tip: 'Every mistake teaches you something new!',
    activities: ['Try again with a new approach', 'Ask "What can I learn from this?"', 'Remember times mistakes helped you'],
  },
  {
    id: 'yet',
    title: 'The Power of "Yet"',
    emoji: '🌱',
    color: '#5CB85C',
    fixed: "I can't do this.",
    growth: "I can't do this YET.",
    tip: 'Adding "yet" reminds you that you can grow!',
    activities: ['Add "yet" to any "I can\'t" statement', 'Make a list of things you couldn\'t do before but can now', 'Celebrate small progress'],
  },
  {
    id: 'effort',
    title: 'Effort Makes Me Stronger',
    emoji: '💪',
    color: '#4A9FD4',
    fixed: "This is too hard, I give up.",
    growth: "This is hard, which means my brain is growing!",
    tip: 'Hard work is like exercise for your brain!',
    activities: ['Take breaks but don\'t quit', 'Break big tasks into small steps', 'Notice how effort feels'],
  },
  {
    id: 'others',
    title: 'Others\' Success Inspires Me',
    emoji: '🤝',
    color: '#8E6BBF',
    fixed: "They're better than me. I'll never be that good.",
    growth: "They worked hard! I can learn from them.",
    tip: 'Everyone had to start somewhere!',
    activities: ['Ask "How did you learn that?"', 'Celebrate others\' successes', 'Find someone to learn with'],
  },
  {
    id: 'feedback',
    title: 'Feedback Helps Me Improve',
    emoji: '📝',
    color: '#F5A623',
    fixed: "They're criticizing me. I must be bad at this.",
    growth: "They're giving me tips to get better!",
    tip: 'Feedback is a gift that helps you grow!',
    activities: ['Say "Thank you for the feedback"', 'Ask questions to understand', 'Try one suggestion at a time'],
  },
  {
    id: 'challenges',
    title: 'Challenges Make Me Brave',
    emoji: '🦸',
    color: '#E86B9A',
    fixed: "I'm scared to try new things.",
    growth: "Trying new things is how I become braver!",
    tip: 'Every challenge you face makes you stronger!',
    activities: ['Try one small new thing today', 'Remember past challenges you overcame', 'Celebrate being brave'],
  },
];

// Concept Card
const ConceptCard = ({ concept, onClick, isCompleted }) => (
  <button
    onClick={() => onClick(concept)}
    className={`w-full p-4 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-md hover:shadow-lg ${
      isCompleted ? 'ring-2 ring-green-400 ring-offset-2' : ''
    }`}
    style={{ backgroundColor: `${concept.color}20`, borderLeft: `4px solid ${concept.color}` }}
  >
    <div className="flex items-center gap-3">
      <span className="text-3xl">{concept.emoji}</span>
      <div className="flex-1">
        <h3 className="font-display text-gray-800">{concept.title}</h3>
        {isCompleted && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <Check size={12} /> Explored!
          </span>
        )}
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  </button>
);

// Concept Detail Modal
const ConceptDetailModal = ({ concept, onClose, onComplete }) => {
  const [showGrowth, setShowGrowth] = useState(false);
  const [activityDone, setActivityDone] = useState([]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  if (!concept) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ borderTop: `6px solid ${concept.color}` }}>
        
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{concept.emoji}</span>
            <h2 className="font-display text-lg" style={{ color: concept.color }}>{concept.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Fixed vs Growth comparison */}
          <div className="space-y-3">
            {/* Fixed Mindset */}
            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🛑</span>
                <span className="font-display text-red-700 text-sm">Fixed Mindset Says:</span>
              </div>
              <p className="font-crayon text-gray-700 italic">"{concept.fixed}"</p>
              <button onClick={() => speak(concept.fixed)} className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <Volume2 size={12} /> Hear this
              </button>
            </div>

            {/* Arrow */}
            <div className="text-center">
              <button
                onClick={() => setShowGrowth(true)}
                className={`px-4 py-2 rounded-xl font-display transition-all ${
                  showGrowth ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {showGrowth ? '✓ Changed my thinking!' : '↓ Change to Growth Mindset'}
              </button>
            </div>

            {/* Growth Mindset */}
            <div className={`p-4 bg-green-50 rounded-xl border-2 border-green-200 transition-all ${
              showGrowth ? 'ring-4 ring-green-300 ring-offset-2' : 'opacity-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌱</span>
                <span className="font-display text-green-700 text-sm">Growth Mindset Says:</span>
              </div>
              <p className="font-crayon text-gray-700 italic">"{concept.growth}"</p>
              <button onClick={() => speak(concept.growth)} className="mt-2 text-xs text-green-500 flex items-center gap-1">
                <Volume2 size={12} /> Hear this
              </button>
            </div>
          </div>

          {/* Tip */}
          <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-600" />
              <span className="font-display text-yellow-700">Remember:</span>
            </div>
            <p className="font-crayon text-gray-700 mt-1">{concept.tip}</p>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Star size={18} className="text-orange-500" />
              Try These:
            </h3>
            <div className="space-y-2">
              {concept.activities.map((activity, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!activityDone.includes(i)) {
                      setActivityDone([...activityDone, i]);
                    }
                  }}
                  className={`w-full p-3 rounded-xl text-left font-crayon transition-all flex items-center gap-2 ${
                    activityDone.includes(i)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {activityDone.includes(i) ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={() => {
              onComplete(concept.id);
              onClose();
            }}
            className="w-full py-4 rounded-xl text-white font-display text-lg shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: concept.color }}
          >
            ✓ I Practiced This!
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const GrowthMindset = () => {
  const navigate = useNavigate();
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [completedConcepts, setCompletedConcepts] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  // Load completed
  useEffect(() => {
    const saved = localStorage.getItem('snw_growth_mindset');
    if (saved) {
      try {
        setCompletedConcepts(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading:', e);
      }
    }
  }, []);

  const handleComplete = (conceptId) => {
    if (!completedConcepts.includes(conceptId)) {
      const updated = [...completedConcepts, conceptId];
      setCompletedConcepts(updated);
      localStorage.setItem('snw_growth_mindset', JSON.stringify(updated));
    }
    setSelectedConcept(null);
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
              🌱 Growth Mindset
            </h1>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 rounded-full hover:bg-gray-100">
            <HelpCircle size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="bg-green-50 rounded-2xl p-4 border-3 border-green-200">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-green-600" />
            <div className="flex-1">
              <p className="font-display text-green-700">Your Brain is Growing!</p>
              <p className="font-crayon text-sm text-green-600">
                {completedConcepts.length} of {MINDSET_CONCEPTS.length} concepts explored
              </p>
            </div>
            <div className="flex gap-1">
              {MINDSET_CONCEPTS.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < completedConcepts.length ? 'bg-green-500' : 'bg-green-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center font-crayon text-gray-600">
          Tap a topic to learn how to think with a growth mindset!
        </p>

        {/* Concept Grid */}
        <div className="space-y-3">
          {MINDSET_CONCEPTS.map(concept => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              onClick={setSelectedConcept}
              isCompleted={completedConcepts.includes(concept.id)}
            />
          ))}
        </div>

        {/* Encouragement */}
        {completedConcepts.length === MINDSET_CONCEPTS.length && (
          <div className="p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl text-white text-center">
            <span className="text-4xl block mb-2">🏆</span>
            <h3 className="font-display text-xl">Amazing Growth Mindset!</h3>
            <p className="font-crayon mt-1">You've explored all the concepts!</p>
          </div>
        )}
      </main>

      {/* Concept Detail Modal */}
      {selectedConcept && (
        <ConceptDetailModal
          concept={selectedConcept}
          onClose={() => setSelectedConcept(null)}
          onComplete={handleComplete}
        />
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#5CB85C]">What is Growth Mindset?</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p><strong>Fixed Mindset:</strong> Believing your abilities can't change. "I'm not good at this."</p>
              <p><strong>Growth Mindset:</strong> Believing you can improve with effort. "I can learn this!"</p>
              <p>🧠 Your brain can grow and change! Learning new things creates new connections.</p>
              <p>💪 Challenges and mistakes help your brain grow stronger!</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#5CB85C] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthMindset;
