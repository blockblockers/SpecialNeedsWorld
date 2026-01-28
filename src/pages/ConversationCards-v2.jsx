// ConversationCards-v2.jsx - Enhanced conversation therapy with Tactus-inspired features
// 11 topic categories, photo scenes, communication strategies, multi-modal responses

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, MessageCircle, Shuffle, Heart,
  ChevronLeft, ChevronRight, Settings, Eye, EyeOff,
  Pencil, Hand, Mic, Image, Users, Lightbulb, Filter,
  Clock, Star, Home, Briefcase, Utensils, Plane, Tv,
  Activity, AlertTriangle, Smile, BookOpen
} from 'lucide-react';

// 11 Topic categories (inspired by Tactus Conversation Therapy)
const TOPIC_CATEGORIES = {
  family: {
    name: 'Family & Friends',
    icon: Users,
    color: '#E86B9A',
    ageFilter: 'all',
    questions: [
      { 
        question: 'Who is someone special in your family?',
        followUp: 'What do you like to do together?',
        level: 'easy',
      },
      { 
        question: 'Tell me about your best friend.',
        followUp: 'How did you meet them?',
        level: 'easy',
      },
      { 
        question: 'What family traditions do you have?',
        followUp: 'Why is this tradition important to you?',
        level: 'medium',
      },
      { 
        question: 'Describe your favorite family memory.',
        followUp: 'Who was there? What happened?',
        level: 'medium',
      },
      { 
        question: 'How do you stay in touch with faraway family?',
        followUp: 'What would you tell them today?',
        level: 'hard',
      },
    ],
  },
  home: {
    name: 'Home & Daily Life',
    icon: Home,
    color: '#5CB85C',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What is your favorite room in your home?',
        followUp: 'What do you like to do there?',
        level: 'easy',
      },
      { 
        question: 'Describe your morning routine.',
        followUp: 'What do you do first?',
        level: 'easy',
      },
      { 
        question: 'What chores do you help with at home?',
        followUp: 'Which one is easiest? Hardest?',
        level: 'medium',
      },
      { 
        question: 'If you could change one thing about your home, what would it be?',
        followUp: 'Why would that make it better?',
        level: 'medium',
      },
      { 
        question: 'What does a perfect weekend at home look like?',
        followUp: 'Who would you spend it with?',
        level: 'hard',
      },
    ],
  },
  food: {
    name: 'Food & Meals',
    icon: Utensils,
    color: '#F5A623',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What is your favorite food?',
        followUp: 'When do you like to eat it?',
        level: 'easy',
      },
      { 
        question: 'What did you eat for your last meal?',
        followUp: 'Did you like it? Why or why not?',
        level: 'easy',
      },
      { 
        question: 'If you could eat at any restaurant, where would you go?',
        followUp: 'What would you order?',
        level: 'medium',
      },
      { 
        question: 'Do you like to help in the kitchen?',
        followUp: 'What do you like to make?',
        level: 'medium',
      },
      { 
        question: 'Describe a memorable meal you had.',
        followUp: 'What made it special?',
        level: 'hard',
      },
    ],
  },
  work: {
    name: 'School & Work',
    icon: Briefcase,
    color: '#4A9FD4',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What is your favorite subject or activity?',
        followUp: 'What do you like about it?',
        level: 'easy',
      },
      { 
        question: 'Tell me about your teacher or boss.',
        followUp: 'What are they like?',
        level: 'easy',
      },
      { 
        question: 'What is something you learned recently?',
        followUp: 'How did you learn it?',
        level: 'medium',
      },
      { 
        question: 'What do you want to be when you grow up?',
        followUp: 'What interests you about that job?',
        level: 'medium',
      },
      { 
        question: 'Describe a project you worked hard on.',
        followUp: 'What challenges did you face?',
        level: 'hard',
      },
    ],
  },
  travel: {
    name: 'Travel & Places',
    icon: Plane,
    color: '#8E6BBF',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What is your favorite place to visit?',
        followUp: 'What do you do there?',
        level: 'easy',
      },
      { 
        question: 'Have you ever been on an airplane?',
        followUp: 'Where did you go? What was it like?',
        level: 'easy',
      },
      { 
        question: 'If you could go anywhere in the world, where would you go?',
        followUp: 'Why that place?',
        level: 'medium',
      },
      { 
        question: 'Describe a trip you took.',
        followUp: 'What was the best part?',
        level: 'medium',
      },
      { 
        question: 'What would you pack for your dream vacation?',
        followUp: 'Why are those items important?',
        level: 'hard',
      },
    ],
  },
  entertainment: {
    name: 'TV, Movies & Games',
    icon: Tv,
    color: '#E63B2E',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What is your favorite TV show or movie?',
        followUp: 'What do you like about it?',
        level: 'easy',
      },
      { 
        question: 'Do you have a favorite character?',
        followUp: 'Why do you like them?',
        level: 'easy',
      },
      { 
        question: 'What games do you like to play?',
        followUp: 'Who do you play with?',
        level: 'medium',
      },
      { 
        question: 'If you could be in any movie, which one?',
        followUp: 'What character would you be?',
        level: 'medium',
      },
      { 
        question: 'Describe the last thing you watched.',
        followUp: 'Would you recommend it? Why?',
        level: 'hard',
      },
    ],
  },
  health: {
    name: 'Health & Feelings',
    icon: Activity,
    color: '#17A2B8',
    ageFilter: 'all',
    questions: [
      { 
        question: 'How are you feeling today?',
        followUp: 'What made you feel that way?',
        level: 'easy',
      },
      { 
        question: 'What do you do to stay healthy?',
        followUp: 'Why is that important to you?',
        level: 'easy',
      },
      { 
        question: 'What helps you feel better when you\'re sad?',
        followUp: 'Who do you talk to?',
        level: 'medium',
      },
      { 
        question: 'What makes you feel proud of yourself?',
        followUp: 'Tell me more about that.',
        level: 'medium',
      },
      { 
        question: 'How do you handle stress or worry?',
        followUp: 'What strategies work best for you?',
        level: 'hard',
      },
    ],
  },
  hobbies: {
    name: 'Hobbies & Interests',
    icon: Star,
    color: '#FFC107',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What do you like to do for fun?',
        followUp: 'How often do you do it?',
        level: 'easy',
      },
      { 
        question: 'Do you have any collections?',
        followUp: 'What is your favorite item?',
        level: 'easy',
      },
      { 
        question: 'What sport or activity do you enjoy?',
        followUp: 'What do you like about it?',
        level: 'medium',
      },
      { 
        question: 'If you could learn a new skill, what would it be?',
        followUp: 'Why does that interest you?',
        level: 'medium',
      },
      { 
        question: 'Tell me about something you\'ve created or built.',
        followUp: 'What was the process like?',
        level: 'hard',
      },
    ],
  },
  opinions: {
    name: 'Opinions & Ideas',
    icon: Lightbulb,
    color: '#6F42C1',
    ageFilter: 'older',
    questions: [
      { 
        question: 'What is something you believe is important?',
        followUp: 'Why do you feel that way?',
        level: 'medium',
      },
      { 
        question: 'If you could change one rule, what would it be?',
        followUp: 'How would that make things better?',
        level: 'medium',
      },
      { 
        question: 'What advice would you give to a younger person?',
        followUp: 'Why is that advice valuable?',
        level: 'hard',
      },
      { 
        question: 'What issue do you care about?',
        followUp: 'What would you do to help?',
        level: 'hard',
      },
      { 
        question: 'How would you make your community better?',
        followUp: 'What steps would you take?',
        level: 'hard',
      },
    ],
  },
  memories: {
    name: 'Memories & Stories',
    icon: BookOpen,
    color: '#20C997',
    ageFilter: 'all',
    questions: [
      { 
        question: 'What is your earliest memory?',
        followUp: 'How old were you?',
        level: 'medium',
      },
      { 
        question: 'Tell me about a time you were really happy.',
        followUp: 'What happened?',
        level: 'easy',
      },
      { 
        question: 'What is something funny that happened to you?',
        followUp: 'Who was there?',
        level: 'medium',
      },
      { 
        question: 'Describe a challenge you overcame.',
        followUp: 'How did you do it?',
        level: 'hard',
      },
      { 
        question: 'What story do you love to tell people?',
        followUp: 'Why is it your favorite?',
        level: 'hard',
      },
    ],
  },
  safety: {
    name: 'Safety & Problems',
    icon: AlertTriangle,
    color: '#DC3545',
    ageFilter: 'all',
    questions: [
      { 
        question: 'Who do you call when you need help?',
        followUp: 'How do you reach them?',
        level: 'easy',
      },
      { 
        question: 'What would you do if you got lost?',
        followUp: 'Who would you ask for help?',
        level: 'easy',
      },
      { 
        question: 'How do you stay safe at home?',
        followUp: 'What rules are important?',
        level: 'medium',
      },
      { 
        question: 'What would you do in an emergency?',
        followUp: 'How would you get help?',
        level: 'medium',
      },
      { 
        question: 'Tell me about a time you solved a problem.',
        followUp: 'What did you do?',
        level: 'hard',
      },
    ],
  },
};

// Communication strategies
const COMMUNICATION_STRATEGIES = [
  { name: 'Gestures', icon: Hand, description: 'Point, wave, or act it out' },
  { name: 'Writing', icon: Pencil, description: 'Write or draw your answer' },
  { name: 'Speaking', icon: Mic, description: 'Say your answer out loud' },
  { name: 'Pictures', icon: Image, description: 'Use pictures to help' },
];

// Tips for communication partners
const PARTNER_TIPS = [
  'Give plenty of wait time for responses',
  'Accept all forms of communication',
  'Ask follow-up questions to expand',
  'Model complete sentences when helpful',
  'Celebrate all attempts to communicate',
  'Use the person\'s interests',
  'Keep a relaxed, supportive tone',
];

const ConversationCardsV2 = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // Settings
  const [ageFilter, setAgeFilter] = useState('all'); // all, younger, older
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all, easy, medium, hard
  const [hiddenCategories, setHiddenCategories] = useState([]);

  // Text to speech
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Get filtered questions
  const getFilteredQuestions = (category) => {
    let questions = TOPIC_CATEGORIES[category].questions;
    
    if (difficultyFilter !== 'all') {
      questions = questions.filter(q => q.level === difficultyFilter);
    }
    
    return questions;
  };

  // Get visible categories
  const getVisibleCategories = () => {
    return Object.entries(TOPIC_CATEGORIES).filter(([key, cat]) => {
      if (hiddenCategories.includes(key)) return false;
      if (ageFilter === 'younger' && cat.ageFilter === 'older') return false;
      return true;
    });
  };

  // Navigation
  const currentQuestions = selectedCategory ? getFilteredQuestions(selectedCategory) : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const categoryData = selectedCategory ? TOPIC_CATEGORIES[selectedCategory] : null;

  const nextQuestion = () => {
    setShowFollowUp(false);
    setShowQuestion(true);
    setCurrentQuestionIndex((prev) => (prev + 1) % currentQuestions.length);
  };

  const prevQuestion = () => {
    setShowFollowUp(false);
    setShowQuestion(true);
    setCurrentQuestionIndex((prev) => (prev - 1 + currentQuestions.length) % currentQuestions.length);
  };

  const shuffleQuestion = () => {
    setShowFollowUp(false);
    setShowQuestion(true);
    setCurrentQuestionIndex(Math.floor(Math.random() * currentQuestions.length));
  };

  // Toggle favorite
  const toggleFavorite = () => {
    const questionId = `${selectedCategory}-${currentQuestionIndex}`;
    if (favoriteQuestions.includes(questionId)) {
      setFavoriteQuestions(favoriteQuestions.filter(id => id !== questionId));
    } else {
      setFavoriteQuestions([...favoriteQuestions, questionId]);
    }
  };

  const isFavorite = selectedCategory && favoriteQuestions.includes(`${selectedCategory}-${currentQuestionIndex}`);

  // Category selection screen
  if (!selectedCategory) {
    const visibleCategories = getVisibleCategories();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                         rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#E86B9A] flex items-center gap-2">
                💬 Conversation Therapy
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Practice meaningful conversations</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white border-3 border-gray-300 rounded-xl"
            >
              <Settings size={20} className="text-gray-500" />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white rounded-2xl border-4 border-gray-200 p-5 mb-6 shadow-lg">
              <h3 className="font-display text-gray-700 mb-4">Settings</h3>
              
              {/* Age Filter */}
              <div className="mb-4">
                <p className="font-crayon text-gray-600 mb-2">Age Appropriateness:</p>
                <div className="flex gap-2">
                  {['all', 'younger', 'older'].map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeFilter(age)}
                      className={`px-4 py-2 rounded-xl font-crayon text-sm transition-all
                                 ${ageFilter === age 
                                   ? 'bg-[#E86B9A] text-white' 
                                   : 'bg-gray-100 text-gray-600'}`}
                    >
                      {age === 'all' ? 'All Ages' : age === 'younger' ? 'Children' : 'Teens/Adults'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Difficulty Filter */}
              <div className="mb-4">
                <p className="font-crayon text-gray-600 mb-2">Question Difficulty:</p>
                <div className="flex gap-2">
                  {['all', 'easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-3 py-2 rounded-xl font-crayon text-sm transition-all
                                 ${difficultyFilter === diff 
                                   ? 'bg-[#E86B9A] text-white' 
                                   : 'bg-gray-100 text-gray-600'}`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Category visibility */}
              <div>
                <p className="font-crayon text-gray-600 mb-2">Show/Hide Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TOPIC_CATEGORIES).map(([key, cat]) => {
                    const Icon = cat.icon;
                    const isHidden = hiddenCategories.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          if (isHidden) {
                            setHiddenCategories(hiddenCategories.filter(c => c !== key));
                          } else {
                            setHiddenCategories([...hiddenCategories, key]);
                          }
                        }}
                        className={`px-3 py-2 rounded-lg font-crayon text-xs flex items-center gap-1
                                   transition-all ${isHidden ? 'bg-gray-100 text-gray-400' : ''}`}
                        style={{ 
                          backgroundColor: !isHidden ? `${cat.color}20` : undefined,
                          color: !isHidden ? cat.color : undefined,
                        }}
                      >
                        <Icon size={14} />
                        {cat.name}
                        {isHidden && <EyeOff size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#E86B9A] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#E86B9A] mb-2 flex items-center gap-2">
              <MessageCircle size={24} />
              Real Conversations Matter
            </h2>
            <p className="font-crayon text-gray-600 mb-3">
              Practice having meaningful conversations about topics that matter. 
              These questions can't be answered with just "yes" or "no"!
            </p>
            <button
              onClick={() => setShowTips(true)}
              className="text-sm font-crayon text-[#E86B9A] flex items-center gap-1"
            >
              <Lightbulb size={16} /> View Partner Tips
            </button>
          </div>

          {/* Communication Strategies */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
            <h3 className="font-display text-gray-700 mb-2">Ways to Respond:</h3>
            <div className="flex flex-wrap gap-2">
              {COMMUNICATION_STRATEGIES.map((strategy) => {
                const Icon = strategy.icon;
                return (
                  <div key={strategy.name} 
                       className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                    <Icon size={16} className="text-[#E86B9A]" />
                    <span className="font-crayon text-sm text-gray-600">{strategy.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Grid */}
          <h3 className="font-display text-gray-700 mb-3">Choose a Topic ({visibleCategories.length} topics)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visibleCategories.map(([key, category]) => {
              const Icon = category.icon;
              const questionCount = getFilteredQuestions(key).length;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setCurrentQuestionIndex(0);
                    setShowFollowUp(false);
                  }}
                  disabled={questionCount === 0}
                  className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all
                             flex flex-col items-center gap-2 text-center
                             ${questionCount > 0 ? 'hover:scale-105' : 'opacity-50'}`}
                  style={{ borderColor: category.color }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: `${category.color}20` }}>
                    <Icon size={24} style={{ color: category.color }} />
                  </div>
                  <span className="font-display text-sm" style={{ color: category.color }}>
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-400 font-crayon">
                    {questionCount} questions
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        {/* Partner Tips Modal */}
        {showTips && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-4 border-[#E86B9A] p-6 max-w-md shadow-2xl">
              <h2 className="text-xl font-display text-[#E86B9A] mb-4 flex items-center gap-2">
                <Users size={24} />
                Tips for Communication Partners
              </h2>
              <div className="space-y-3 mb-6">
                {PARTNER_TIPS.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#E86B9A]">✓</span>
                    <p className="font-crayon text-gray-600 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="w-full py-3 bg-[#E86B9A] text-white font-display rounded-xl"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Question view
  const Icon = categoryData.icon;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: categoryData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 
                       rounded-xl font-display font-bold transition-all shadow-md"
            style={{ borderColor: categoryData.color, color: categoryData.color }}
          >
            <ArrowLeft size={16} />
            Topics
          </button>
          <div className="flex-1 text-center">
            <span className="font-display flex items-center justify-center gap-2" 
                  style={{ color: categoryData.color }}>
              <Icon size={20} />
              {categoryData.name}
            </span>
          </div>
          <button
            onClick={shuffleQuestion}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: categoryData.color }}
          >
            <Shuffle size={20} style={{ color: categoryData.color }} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-crayon text-gray-500">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </span>
          <span className={`text-xs font-crayon px-2 py-1 rounded-full
                          ${currentQuestion.level === 'easy' ? 'bg-green-100 text-green-700' :
                            currentQuestion.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}>
            {currentQuestion.level}
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border-4 shadow-xl overflow-hidden mb-6"
             style={{ borderColor: categoryData.color }}>
          {/* Card Header */}
          <div className="p-4 flex items-center justify-between"
               style={{ backgroundColor: categoryData.color }}>
            <Icon size={24} className="text-white" />
            <button
              onClick={toggleFavorite}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Heart 
                size={24} 
                className={`text-white ${isFavorite ? 'fill-white' : ''}`}
              />
            </button>
          </div>

          {/* Question Content */}
          <div className="p-6">
            {/* Main Question */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xl font-crayon text-gray-800 leading-relaxed flex-1">
                  {showQuestion ? currentQuestion.question : '• • •'}
                </p>
                <button
                  onClick={() => setShowQuestion(!showQuestion)}
                  className="p-2 hover:bg-gray-100 rounded-lg ml-2"
                >
                  {showQuestion ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              
              {showQuestion && (
                <button
                  onClick={() => speak(currentQuestion.question)}
                  className="flex items-center gap-2 text-sm font-crayon px-3 py-1.5 
                             rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: categoryData.color }}
                >
                  <Volume2 size={16} />
                  Listen
                </button>
              )}
            </div>

            {/* Follow-up Question */}
            {!showFollowUp ? (
              <button
                onClick={() => setShowFollowUp(true)}
                className="w-full py-4 rounded-xl font-display flex items-center 
                           justify-center gap-2 transition-colors"
                style={{ 
                  backgroundColor: `${categoryData.color}20`,
                  color: categoryData.color,
                }}
              >
                <Lightbulb size={20} />
                Show Follow-Up Question
              </button>
            ) : (
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${categoryData.color}10` }}>
                <p className="text-sm font-crayon mb-1" style={{ color: categoryData.color }}>
                  Follow-up:
                </p>
                <p className="font-crayon text-gray-700">{currentQuestion.followUp}</p>
                <button
                  onClick={() => speak(currentQuestion.followUp)}
                  className="mt-2 flex items-center gap-1 text-sm font-crayon"
                  style={{ color: categoryData.color }}
                >
                  <Volume2 size={14} />
                  Listen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Communication Strategy Reminder */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="font-crayon text-gray-500 text-sm text-center mb-2">
            Respond using any method:
          </p>
          <div className="flex justify-center gap-4">
            {COMMUNICATION_STRATEGIES.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <div key={strategy.name} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                    <Icon size={18} style={{ color: categoryData.color }} />
                  </div>
                  <span className="text-xs font-crayon text-gray-500">{strategy.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            className="p-3 bg-white border-3 rounded-xl hover:scale-110 transition-transform shadow"
            style={{ borderColor: categoryData.color }}
          >
            <ChevronLeft size={24} style={{ color: categoryData.color }} />
          </button>
          
          <div className="flex gap-1">
            {currentQuestions.slice(0, 10).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setShowFollowUp(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentQuestionIndex ? 'w-6' : ''
                }`}
                style={{ 
                  backgroundColor: idx === currentQuestionIndex ? categoryData.color : '#E5E7EB' 
                }}
              />
            ))}
            {currentQuestions.length > 10 && (
              <span className="text-xs text-gray-400 ml-1">+{currentQuestions.length - 10}</span>
            )}
          </div>

          <button
            onClick={nextQuestion}
            className="p-3 bg-white border-3 rounded-xl hover:scale-110 transition-transform shadow"
            style={{ borderColor: categoryData.color }}
          >
            <ChevronRight size={24} style={{ color: categoryData.color }} />
          </button>
        </div>

        {/* Quick tip */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 font-crayon">
            💡 Tap the eye icon to hide the question for the communication partner to model
          </p>
        </div>
      </main>
    </div>
  );
};

export default ConversationCardsV2;
