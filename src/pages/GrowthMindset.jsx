// GrowthMindset.jsx - Growth Mindset Interactive Tool
// Teaches the difference between fixed and growth mindset
// Part of the Emotional Wellness hub

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Star,
  Trophy,
  Heart,
  ThumbsUp,
  Lightbulb,
  Target,
  Zap,
  Volume2,
  HelpCircle,
  Printer,
  Save,
  BookOpen
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_growth_mindset';

// ============================================
// GROWTH VS FIXED MINDSET COMPARISONS
// ============================================
const MINDSET_COMPARISONS = [
  {
    id: 1,
    fixed: "I can't do this",
    growth: "I can't do this YET",
    explanation: "Adding 'yet' reminds us that skills take time to develop!",
    icon: '🌱',
  },
  {
    id: 2,
    fixed: "I made a mistake",
    growth: "Mistakes help me learn",
    explanation: "Every mistake is a chance to learn something new.",
    icon: '📚',
  },
  {
    id: 3,
    fixed: "This is too hard",
    growth: "This may take time and effort",
    explanation: "Hard things become easier with practice.",
    icon: '💪',
  },
  {
    id: 4,
    fixed: "I'm not good at this",
    growth: "I'm still learning this",
    explanation: "Nobody is good at everything right away!",
    icon: '🎯',
  },
  {
    id: 5,
    fixed: "I give up",
    growth: "I'll try a different way",
    explanation: "There's usually more than one way to solve a problem.",
    icon: '🔄',
  },
  {
    id: 6,
    fixed: "She's better than me",
    growth: "I can learn from her",
    explanation: "Watching others succeed can teach us new strategies.",
    icon: '👀',
  },
  {
    id: 7,
    fixed: "I'll never be smart",
    growth: "I can train my brain",
    explanation: "Your brain grows stronger the more you use it!",
    icon: '🧠',
  },
  {
    id: 8,
    fixed: "I don't like challenges",
    growth: "Challenges help me grow",
    explanation: "Easy tasks don't help us improve as much.",
    icon: '⛰️',
  },
  {
    id: 9,
    fixed: "Feedback is criticism",
    growth: "Feedback helps me improve",
    explanation: "People who give us feedback want to help us succeed.",
    icon: '💬',
  },
  {
    id: 10,
    fixed: "If I fail, I'm a failure",
    growth: "If I fail, I'll try again",
    explanation: "Failing at something doesn't make YOU a failure.",
    icon: '🌟',
  },
];

// ============================================
// GROWTH MINDSET AFFIRMATIONS
// ============================================
const AFFIRMATIONS = [
  { text: "I am capable of learning new things", icon: '📖' },
  { text: "My effort matters more than being perfect", icon: '💪' },
  { text: "I embrace challenges", icon: '⛰️' },
  { text: "Mistakes are opportunities to grow", icon: '🌱' },
  { text: "I am proud of myself for trying", icon: '🌟' },
  { text: "I can do hard things", icon: '💎' },
  { text: "Every day I'm getting better", icon: '📈' },
  { text: "I believe in myself", icon: '❤️' },
  { text: "My brain is like a muscle - it gets stronger", icon: '🧠' },
  { text: "I am not afraid to ask for help", icon: '🤝' },
];

// ============================================
// PRACTICE SCENARIOS
// ============================================
const PRACTICE_SCENARIOS = [
  {
    id: 1,
    scenario: "You're learning to ride a bike and you keep falling",
    fixedResponse: "I'll never learn to ride a bike!",
    growthResponse: "Each time I try, I get a little better!",
    correctAnswer: 'growth',
  },
  {
    id: 2,
    scenario: "You got a lower grade than your friend on a test",
    fixedResponse: "I'm just not as smart as they are.",
    growthResponse: "I can study differently and improve next time.",
    correctAnswer: 'growth',
  },
  {
    id: 3,
    scenario: "You tried a new art project and it didn't turn out how you wanted",
    fixedResponse: "I'm terrible at art.",
    growthResponse: "This was practice - I'll try a different approach.",
    correctAnswer: 'growth',
  },
  {
    id: 4,
    scenario: "A puzzle is really challenging",
    fixedResponse: "This puzzle is impossible.",
    growthResponse: "This puzzle is making my brain stronger!",
    correctAnswer: 'growth',
  },
  {
    id: 5,
    scenario: "You're struggling to learn a new video game",
    fixedResponse: "I'm bad at games.",
    growthResponse: "I just need more practice to get better.",
    correctAnswer: 'growth',
  },
];

// ============================================
// MINDSET CARD COMPONENT
// ============================================
const MindsetCard = ({ comparison, showGrowth, onFlip }) => {
  return (
    <div 
      onClick={onFlip}
      className={`relative h-64 cursor-pointer perspective-1000`}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d
                    ${showGrowth ? 'rotate-y-180' : ''}`}>
        {/* Fixed Mindset Side */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="h-full p-6 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl border-4 border-red-300
                        flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-4xl mb-3">😟</span>
            <span className="font-crayon text-xs text-red-400 mb-2">Fixed Mindset</span>
            <p className="font-display text-xl text-red-700">"{comparison.fixed}"</p>
            <p className="font-crayon text-sm text-gray-500 mt-4">Tap to flip →</p>
          </div>
        </div>
        
        {/* Growth Mindset Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="h-full p-6 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl border-4 border-green-300
                        flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-4xl mb-3">{comparison.icon}</span>
            <span className="font-crayon text-xs text-green-600 mb-2">Growth Mindset</span>
            <p className="font-display text-xl text-green-700">"{comparison.growth}"</p>
            <p className="font-crayon text-sm text-gray-600 mt-3 italic">{comparison.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRACTICE QUIZ COMPONENT
// ============================================
const PracticeQuiz = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const scenario = PRACTICE_SCENARIOS[currentQ];
  
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === scenario.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQ < PRACTICE_SCENARIOS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      onComplete(score + (selectedAnswer === scenario.correctAnswer ? 1 : 0));
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-crayon text-sm text-gray-500">
          Question {currentQ + 1} of {PRACTICE_SCENARIOS.length}
        </span>
        <span className="font-display text-sm text-[#5CB85C]">
          Score: {score}/{currentQ}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#8E6BBF] transition-all duration-300"
          style={{ width: `${((currentQ + 1) / PRACTICE_SCENARIOS.length) * 100}%` }}
        />
      </div>
      
      {/* Scenario */}
      <div className="p-4 bg-[#8E6BBF]/10 rounded-2xl border-2 border-[#8E6BBF]/30">
        <p className="font-display text-gray-700">{scenario.scenario}</p>
      </div>
      
      {/* Question */}
      <p className="font-crayon text-gray-600 text-center">
        Which response shows a Growth Mindset?
      </p>
      
      {/* Answer Options */}
      <div className="space-y-3">
        <button
          onClick={() => !answered && handleAnswer('fixed')}
          disabled={answered}
          className={`w-full p-4 rounded-xl text-left transition-all border-3 ${
            answered
              ? selectedAnswer === 'fixed'
                ? scenario.correctAnswer === 'fixed'
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-red-100 border-red-500 text-red-800'
                : 'bg-gray-50 border-gray-200 text-gray-400'
              : 'bg-white border-gray-200 hover:border-[#8E6BBF]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">😟</span>
            <p className="font-crayon">{scenario.fixedResponse}</p>
          </div>
        </button>
        
        <button
          onClick={() => !answered && handleAnswer('growth')}
          disabled={answered}
          className={`w-full p-4 rounded-xl text-left transition-all border-3 ${
            answered
              ? selectedAnswer === 'growth'
                ? scenario.correctAnswer === 'growth'
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-red-100 border-red-500 text-red-800'
                : scenario.correctAnswer === 'growth'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              : 'bg-white border-gray-200 hover:border-[#8E6BBF]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🌱</span>
            <p className="font-crayon">{scenario.growthResponse}</p>
          </div>
        </button>
      </div>
      
      {/* Feedback & Next */}
      {answered && (
        <div className="space-y-3">
          <div className={`p-3 rounded-xl ${
            selectedAnswer === scenario.correctAnswer
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            <p className="font-crayon text-sm">
              {selectedAnswer === scenario.correctAnswer
                ? '🎉 Great job! That\'s the growth mindset!'
                : '💡 The growth mindset response helps us keep trying and learning!'}
            </p>
          </div>
          
          <button
            onClick={handleNext}
            className="w-full py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                     hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            {currentQ < PRACTICE_SCENARIOS.length - 1 ? (
              <>Next Question <ChevronRight size={18} /></>
            ) : (
              <>See Results <Trophy size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// QUIZ RESULTS COMPONENT
// ============================================
const QuizResults = ({ score, total, onRestart, onBackToLearn }) => {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <div className="text-center space-y-4">
      <div className="w-24 h-24 mx-auto bg-[#F8D14A] rounded-full flex items-center justify-center">
        <Trophy size={48} className="text-white" />
      </div>
      
      <h2 className="font-display text-2xl text-gray-800">Quiz Complete!</h2>
      
      <div className="p-4 bg-gradient-to-br from-[#8E6BBF]/20 to-[#8E6BBF]/5 rounded-2xl">
        <p className="font-display text-4xl text-[#8E6BBF]">{score}/{total}</p>
        <p className="font-crayon text-gray-600">questions correct</p>
      </div>
      
      <div className="p-4 bg-green-50 rounded-xl">
        <p className="font-crayon text-green-700">
          {percentage >= 80 
            ? '🌟 Amazing! You really understand growth mindset!' 
            : percentage >= 60
              ? '👏 Good job! Keep practicing growth mindset thinking!'
              : '💪 Great effort! Remember: Learning takes time - that\'s growth mindset!'}
        </p>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onBackToLearn}
          className="flex-1 py-3 border-2 border-[#8E6BBF] text-[#8E6BBF] rounded-xl font-display
                   hover:bg-[#8E6BBF]/10 transition-colors"
        >
          Learn More
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                   hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const GrowthMindset = () => {
  const navigate = useNavigate();
  
  // State
  const [view, setView] = useState('learn'); // learn, practice, affirmations
  const [currentCard, setCurrentCard] = useState(0);
  const [showGrowth, setShowGrowth] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [dailyAffirmation, setDailyAffirmation] = useState(null);
  
  // Get daily affirmation
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(STORAGE_KEY);
    let data = {};
    
    if (saved) {
      try {
        data = JSON.parse(saved);
      } catch (e) {}
    }
    
    if (data.affirmationDate !== today) {
      const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      data.affirmationDate = today;
      data.affirmationIndex = randomIndex;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setDailyAffirmation(AFFIRMATIONS[randomIndex]);
    } else {
      setDailyAffirmation(AFFIRMATIONS[data.affirmationIndex]);
    }
  }, []);
  
  // Navigation
  const nextCard = () => {
    setShowGrowth(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % MINDSET_COMPARISONS.length);
    }, 100);
  };
  
  const prevCard = () => {
    setShowGrowth(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev - 1 + MINDSET_COMPARISONS.length) % MINDSET_COMPARISONS.length);
    }, 100);
  };
  
  const handleQuizComplete = (score) => {
    setQuizScore(score);
  };

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
              <Brain size={24} />
              Growth Mindset
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
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Daily Affirmation */}
        {dailyAffirmation && view === 'learn' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F8D14A]/30 to-[#F5A623]/20 rounded-2xl border-3 border-[#F8D14A]/50">
            <p className="font-crayon text-xs text-[#D4A200] mb-1">🌟 Today's Affirmation</p>
            <p className="font-display text-lg text-gray-800 flex items-center gap-2">
              <span className="text-2xl">{dailyAffirmation.icon}</span>
              {dailyAffirmation.text}
            </p>
          </div>
        )}
        
        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setView('learn'); setQuizScore(null); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'learn' 
                ? 'bg-[#8E6BBF] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <BookOpen size={18} className="inline mr-2" />
            Learn
          </button>
          <button
            onClick={() => { setView('practice'); setQuizScore(null); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'practice' 
                ? 'bg-[#8E6BBF] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Target size={18} className="inline mr-2" />
            Practice
          </button>
          <button
            onClick={() => setView('affirmations')}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'affirmations' 
                ? 'bg-[#8E6BBF] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Star size={18} className="inline mr-2" />
            Affirmations
          </button>
        </div>

        {/* ============================================ */}
        {/* LEARN VIEW */}
        {/* ============================================ */}
        {view === 'learn' && (
          <div>
            <p className="text-center font-crayon text-sm text-gray-600 mb-4">
              Tap the card to see the growth mindset way of thinking
            </p>
            
            {/* Card Counter */}
            <div className="text-center font-crayon text-sm text-gray-400 mb-2">
              {currentCard + 1} of {MINDSET_COMPARISONS.length}
            </div>
            
            {/* Mindset Card */}
            <MindsetCard
              comparison={MINDSET_COMPARISONS[currentCard]}
              showGrowth={showGrowth}
              onFlip={() => setShowGrowth(!showGrowth)}
            />
            
            {/* Navigation */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={prevCard}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-display text-gray-600
                         hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={nextCard}
                className="flex-1 py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                         hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center gap-1 mt-4">
              {MINDSET_COMPARISONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setShowGrowth(false); setCurrentCard(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentCard ? 'bg-[#8E6BBF]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {/* Ready to Practice? */}
            <div className="mt-6 p-4 bg-[#5CB85C]/10 rounded-2xl border-2 border-[#5CB85C]/30 text-center">
              <p className="font-crayon text-sm text-gray-600 mb-2">
                Ready to test your knowledge?
              </p>
              <button
                onClick={() => { setView('practice'); setQuizScore(null); }}
                className="px-6 py-2 bg-[#5CB85C] text-white rounded-xl font-display
                         hover:bg-green-600 transition-colors"
              >
                Take the Quiz →
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* PRACTICE VIEW */}
        {/* ============================================ */}
        {view === 'practice' && (
          <div>
            {quizScore === null ? (
              <PracticeQuiz onComplete={handleQuizComplete} />
            ) : (
              <QuizResults 
                score={quizScore} 
                total={PRACTICE_SCENARIOS.length}
                onRestart={() => setQuizScore(null)}
                onBackToLearn={() => { setView('learn'); setQuizScore(null); }}
              />
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* AFFIRMATIONS VIEW */}
        {/* ============================================ */}
        {view === 'affirmations' && (
          <div>
            <p className="text-center font-crayon text-sm text-gray-600 mb-4">
              Positive statements to remind yourself every day
            </p>
            
            <div className="grid gap-3">
              {AFFIRMATIONS.map((affirmation, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-xl border-3 border-gray-200 hover:border-[#8E6BBF]
                           transition-colors flex items-center gap-3"
                >
                  <span className="text-2xl">{affirmation.icon}</span>
                  <p className="font-display text-gray-700">{affirmation.text}</p>
                </div>
              ))}
            </div>
            
            {/* Print Affirmations */}
            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-3 border-2 border-[#8E6BBF] text-[#8E6BBF] rounded-xl font-display
                       hover:bg-[#8E6BBF]/10 transition-colors flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              Print Affirmations
            </button>
          </div>
        )}
        
        {/* Key Concept */}
        <div className="mt-6 p-4 bg-[#4A9FD4]/10 rounded-2xl border-3 border-[#4A9FD4]/30">
          <h3 className="font-display text-[#4A9FD4] mb-2 flex items-center gap-2">
            <Lightbulb size={18} />
            Remember
          </h3>
          <p className="font-crayon text-sm text-gray-600">
            Your brain is like a muscle - it grows stronger when you work it! 
            With a <strong>growth mindset</strong>, you believe you can improve through effort and practice. 
            Challenges and mistakes aren't failures - they're opportunities to learn!
          </p>
        </div>
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#8E6BBF]">About Growth Mindset</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What is Growth Mindset?</strong> The belief that abilities and intelligence 
                can be developed through dedication and hard work.
              </p>
              <p>
                <strong>Fixed Mindset vs Growth Mindset:</strong>
              </p>
              <ul className="space-y-2 ml-2">
                <li>
                  <span className="text-red-500 font-bold">Fixed:</span> "I'm either good at it or not"
                </li>
                <li>
                  <span className="text-green-500 font-bold">Growth:</span> "I can improve with practice"
                </li>
              </ul>
              <p>
                <strong>Benefits:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>More resilience when facing challenges</li>
                <li>Better ability to handle criticism</li>
                <li>Greater motivation to learn</li>
                <li>Higher achievement over time</li>
              </ul>
              <p>
                <strong>How to Build It:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Add "yet" to "I can't" statements</li>
                <li>Celebrate effort, not just results</li>
                <li>View challenges as opportunities</li>
                <li>Learn from mistakes instead of hiding them</li>
              </ul>
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

      {/* Custom CSS for card flip */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default GrowthMindset;
