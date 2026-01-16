// EmotionChart.jsx - Interactive Emotion Identification Tool
// Part of the Emotional Wellness hub
// Uses ARASAAC pictograms for accessibility

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart,
  Volume2,
  Info,
  Printer,
  ChevronRight,
  X,
  Sparkles,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';
import { getPictogramUrl, ARASAAC_PICTOGRAM_IDS } from '../services/arasaac';

// ============================================
// EMOTION DATA with ARASAAC IDs
// ============================================
const EMOTIONS = [
  {
    id: 'happy',
    name: 'Happy',
    arasaacId: 26684,
    color: '#F8D14A',
    bgColor: '#FEF9E7',
    description: 'Feeling good, joyful, or pleased',
    bodyFeel: 'Warm inside, smiling, energetic',
    mightFeelWhen: [
      'Playing with friends',
      'Getting a hug',
      'Doing something fun',
      'Hearing good news',
    ],
    helpfulThings: [
      'Share your happiness with others',
      'Do more of what made you happy',
      'Say "I feel happy!"',
    ],
  },
  {
    id: 'sad',
    name: 'Sad',
    arasaacId: 11321,
    color: '#4A9FD4',
    bgColor: '#EBF5FB',
    description: 'Feeling unhappy, down, or upset',
    bodyFeel: 'Heavy, tired, might want to cry',
    mightFeelWhen: [
      'Missing someone',
      'Something didn\'t go as planned',
      'Feeling left out',
      'Losing something important',
    ],
    helpfulThings: [
      'Talk to someone you trust',
      'Have a good cry - it\'s okay!',
      'Hug a stuffed animal or pet',
      'Draw or write about your feelings',
    ],
  },
  {
    id: 'angry',
    name: 'Angry',
    arasaacId: 11318,
    color: '#E63B2E',
    bgColor: '#FDEDEC',
    description: 'Feeling mad, frustrated, or annoyed',
    bodyFeel: 'Hot, tense, clenched fists, fast heartbeat',
    mightFeelWhen: [
      'Something seems unfair',
      'Someone took your things',
      'Being told "no"',
      'Things aren\'t going your way',
    ],
    helpfulThings: [
      'Take deep breaths',
      'Count to 10 slowly',
      'Walk away to cool down',
      'Squeeze a stress ball',
      'Tell someone "I feel angry"',
    ],
  },
  {
    id: 'scared',
    name: 'Scared',
    arasaacId: 6459,
    color: '#8E6BBF',
    bgColor: '#F4ECF7',
    description: 'Feeling afraid, worried, or nervous',
    bodyFeel: 'Shaky, fast heartbeat, want to hide',
    mightFeelWhen: [
      'Trying something new',
      'Hearing loud noises',
      'Being in the dark',
      'Meeting new people',
    ],
    helpfulThings: [
      'Find a safe person to be with',
      'Take slow, deep breaths',
      'Hold something comforting',
      'Remember: "I am safe"',
    ],
  },
  {
    id: 'excited',
    name: 'Excited',
    arasaacId: 11319,
    color: '#E86B9A',
    bgColor: '#FDEBF0',
    description: 'Feeling eager, energetic, and can\'t wait!',
    bodyFeel: 'Jumpy, fast heartbeat, hard to sit still',
    mightFeelWhen: [
      'Waiting for something fun',
      'Birthday or holiday coming',
      'Going somewhere special',
      'Getting a surprise',
    ],
    helpfulThings: [
      'Jump or dance to let energy out',
      'Talk about what you\'re excited for',
      'Draw a picture about it',
      'Take deep breaths if too wiggly',
    ],
  },
  {
    id: 'calm',
    name: 'Calm',
    arasaacId: 28753,
    color: '#5CB85C',
    bgColor: '#EAFAF1',
    description: 'Feeling peaceful, relaxed, and at ease',
    bodyFeel: 'Relaxed body, slow breathing, comfortable',
    mightFeelWhen: [
      'After a nap or good sleep',
      'Doing something you enjoy quietly',
      'Being in a cozy place',
      'After taking deep breaths',
    ],
    helpfulThings: [
      'Notice how good calm feels',
      'Keep doing calming activities',
      'This is a great time to think',
      'Enjoy the peaceful moment',
    ],
  },
  {
    id: 'frustrated',
    name: 'Frustrated',
    arasaacId: 11323,
    color: '#F5A623',
    bgColor: '#FEF5E7',
    description: 'Feeling stuck, annoyed, or like giving up',
    bodyFeel: 'Tense, sighing, want to quit',
    mightFeelWhen: [
      'Something is too hard',
      'Can\'t figure something out',
      'Things keep going wrong',
      'Waiting too long',
    ],
    helpfulThings: [
      'Take a break and try again',
      'Ask for help',
      'Break the task into smaller steps',
      'Say "This is hard, but I can try"',
    ],
  },
  {
    id: 'worried',
    name: 'Worried',
    arasaacId: 11332,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Feeling unsure or thinking about bad things that might happen',
    bodyFeel: 'Tight tummy, can\'t stop thinking',
    mightFeelWhen: [
      'Before a test or new situation',
      'When someone is late',
      'Thinking about "what if"',
      'Not knowing what will happen',
    ],
    helpfulThings: [
      'Talk to someone about your worries',
      'Ask "Is this worry helpful?"',
      'Focus on what you CAN control',
      'Try the Circles of Control tool',
    ],
  },
  {
    id: 'tired',
    name: 'Tired',
    arasaacId: 11950,
    color: '#9CA3AF',
    bgColor: '#F9FAFB',
    description: 'Feeling sleepy, worn out, or low energy',
    bodyFeel: 'Heavy, yawning, hard to focus',
    mightFeelWhen: [
      'After a busy day',
      'Not enough sleep',
      'After lots of activity',
      'When you\'re getting sick',
    ],
    helpfulThings: [
      'Rest or take a nap',
      'Do something quiet',
      'Drink water',
      'Go to bed earlier tonight',
    ],
  },
  {
    id: 'confused',
    name: 'Confused',
    arasaacId: 11322,
    color: '#A78BFA',
    bgColor: '#F5F3FF',
    description: 'Not sure what\'s happening or what to do',
    bodyFeel: 'Head feels fuzzy, uncertain',
    mightFeelWhen: [
      'Learning something new',
      'Too many things happening',
      'Instructions aren\'t clear',
      'Plans changed suddenly',
    ],
    helpfulThings: [
      'Ask questions',
      'Say "I don\'t understand"',
      'Ask someone to explain again',
      'Take it one step at a time',
    ],
  },
  {
    id: 'proud',
    name: 'Proud',
    arasaacId: 11327,
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'Feeling good about something you did',
    bodyFeel: 'Standing tall, smiling, warm inside',
    mightFeelWhen: [
      'Finishing something hard',
      'Helping someone',
      'Learning something new',
      'Making a good choice',
    ],
    helpfulThings: [
      'Celebrate your success!',
      'Tell someone what you did',
      'Remember this feeling',
      'Keep trying hard things',
    ],
  },
  {
    id: 'lonely',
    name: 'Lonely',
    arasaacId: 11331,
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: 'Feeling alone or wanting to be with others',
    bodyFeel: 'Empty, sad, wanting connection',
    mightFeelWhen: [
      'Being by yourself',
      'Missing friends or family',
      'Feeling different from others',
      'When friends are busy',
    ],
    helpfulThings: [
      'Reach out to someone',
      'Do something you enjoy',
      'Hug a pet or stuffed animal',
      'Remember people who care about you',
    ],
  },
];

// Intensity levels
const INTENSITY_LEVELS = [
  { level: 1, label: 'A little', emoji: '😐' },
  { level: 2, label: 'Some', emoji: '🙂' },
  { level: 3, label: 'A lot', emoji: '😊' },
  { level: 4, label: 'Very much', emoji: '😄' },
  { level: 5, label: 'SO much!', emoji: '🤩' },
];

// Body map areas (simplified)
const BODY_AREAS = [
  { id: 'head', name: 'Head', top: '5%', left: '50%' },
  { id: 'chest', name: 'Chest', top: '30%', left: '50%' },
  { id: 'tummy', name: 'Tummy', top: '45%', left: '50%' },
  { id: 'hands', name: 'Hands', top: '50%', left: '20%' },
  { id: 'legs', name: 'Legs', top: '75%', left: '50%' },
];

// ============================================
// SPEAK FUNCTION
// ============================================
const speak = (text) => {
  if (!('speechSynthesis' in window)) return;
  
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
};

// ============================================
// EMOTION CARD COMPONENT
// ============================================
const EmotionCard = ({ emotion, onClick, size = 'normal' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeClasses = {
    small: 'w-20 h-24 p-2',
    normal: 'w-28 h-32 p-3',
    large: 'w-36 h-40 p-4',
  };
  
  const imgSize = {
    small: 40,
    normal: 56,
    large: 72,
  };
  
  return (
    <button
      onClick={() => onClick(emotion)}
      className={`${sizeClasses[size]} rounded-2xl border-4 transition-all 
                 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                 flex flex-col items-center justify-center gap-1`}
      style={{ 
        backgroundColor: emotion.bgColor,
        borderColor: emotion.color,
      }}
    >
      <div 
        className="relative rounded-xl overflow-hidden bg-white/50"
        style={{ width: imgSize[size], height: imgSize[size] }}
      >
        <img
          src={getPictogramUrl(emotion.arasaacId)}
          alt={emotion.name}
          className={`w-full h-full object-contain transition-opacity ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
        )}
      </div>
      <span 
        className="font-display text-sm leading-tight"
        style={{ color: emotion.color }}
      >
        {emotion.name}
      </span>
    </button>
  );
};

// ============================================
// EMOTION DETAIL MODAL
// ============================================
const EmotionDetailModal = ({ emotion, onClose, onLogFeeling }) => {
  const [intensity, setIntensity] = useState(3);
  const [selectedBodyAreas, setSelectedBodyAreas] = useState([]);
  const [showBodyMap, setShowBodyMap] = useState(false);
  
  if (!emotion) return null;
  
  const toggleBodyArea = (areaId) => {
    setSelectedBodyAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };
  
  const handleLogFeeling = () => {
    onLogFeeling({
      emotion: emotion.id,
      emotionName: emotion.name,
      intensity,
      bodyAreas: selectedBodyAreas,
      timestamp: new Date().toISOString(),
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ borderTop: `6px solid ${emotion.color}` }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={getPictogramUrl(emotion.arasaacId)}
              alt={emotion.name}
              className="w-12 h-12 object-contain bg-white rounded-xl p-1"
              style={{ border: `2px solid ${emotion.color}` }}
            />
            <div>
              <h2 className="font-display text-xl" style={{ color: emotion.color }}>
                {emotion.name}
              </h2>
              <p className="font-crayon text-sm text-gray-500">{emotion.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Speak Button */}
          <button
            onClick={() => speak(`${emotion.name}. ${emotion.description}`)}
            className="w-full py-3 rounded-xl border-2 flex items-center justify-center gap-2
                     hover:bg-gray-50 transition-colors"
            style={{ borderColor: emotion.color, color: emotion.color }}
          >
            <Volume2 size={20} />
            <span className="font-display">Hear it</span>
          </button>
          
          {/* Body Feel Section */}
          <div className="p-4 rounded-2xl" style={{ backgroundColor: emotion.bgColor }}>
            <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">🫀</span> How it feels in your body
            </h3>
            <p className="font-crayon text-gray-600">{emotion.bodyFeel}</p>
            
            {/* Simple Body Map Toggle */}
            <button
              onClick={() => setShowBodyMap(!showBodyMap)}
              className="mt-3 text-sm font-crayon underline"
              style={{ color: emotion.color }}
            >
              {showBodyMap ? 'Hide body map' : 'Where do YOU feel it?'}
            </button>
            
            {showBodyMap && (
              <div className="mt-3 flex flex-wrap gap-2">
                {BODY_AREAS.map(area => (
                  <button
                    key={area.id}
                    onClick={() => toggleBodyArea(area.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-crayon transition-all
                              ${selectedBodyAreas.includes(area.id)
                                ? 'text-white'
                                : 'bg-white text-gray-600'
                              }`}
                    style={{
                      backgroundColor: selectedBodyAreas.includes(area.id) 
                        ? emotion.color 
                        : undefined,
                      border: `2px solid ${emotion.color}`,
                    }}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* When You Might Feel This */}
          <div>
            <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">💭</span> You might feel {emotion.name.toLowerCase()} when...
            </h3>
            <ul className="space-y-1.5">
              {emotion.mightFeelWhen.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: emotion.color }}>•</span>
                  <span className="font-crayon text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Things That Might Help */}
          <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-200">
            <h3 className="font-display text-green-700 mb-2 flex items-center gap-2">
              <ThumbsUp size={18} />
              Things that might help
            </h3>
            <ul className="space-y-1.5">
              {emotion.helpfulThings.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="font-crayon text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Intensity Slider */}
          <div>
            <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-lg">📊</span> How strong is this feeling?
            </h3>
            <div className="flex justify-between mb-2">
              {INTENSITY_LEVELS.map(level => (
                <button
                  key={level.level}
                  onClick={() => setIntensity(level.level)}
                  className={`w-12 h-12 rounded-full text-xl transition-all
                            ${intensity === level.level 
                              ? 'scale-125 shadow-lg' 
                              : 'opacity-50 hover:opacity-75'
                            }`}
                  style={{
                    backgroundColor: intensity === level.level ? emotion.bgColor : '#f3f4f6',
                    border: intensity === level.level ? `3px solid ${emotion.color}` : '2px solid #e5e7eb',
                  }}
                >
                  {level.emoji}
                </button>
              ))}
            </div>
            <p className="text-center font-crayon text-gray-500">
              {INTENSITY_LEVELS[intensity - 1]?.label}
            </p>
          </div>
          
          {/* Log Feeling Button */}
          <button
            onClick={handleLogFeeling}
            className="w-full py-4 rounded-xl text-white font-display text-lg
                     shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: emotion.color }}
          >
            Log This Feeling
          </button>
        </div>
        
        {/* Attribution */}
        <div className="p-3 border-t text-center">
          <a 
            href="https://arasaac.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Pictograms by ARASAAC (CC BY-NC-SA)
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const EmotionChart = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  
  // Load recent logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snw_emotion_logs');
    if (saved) {
      try {
        const logs = JSON.parse(saved);
        setRecentLogs(logs.slice(-10)); // Keep last 10
      } catch (e) {
        console.error('Error loading emotion logs:', e);
      }
    }
  }, []);
  
  // Handle logging a feeling
  const handleLogFeeling = (logData) => {
    const newLogs = [...recentLogs, logData].slice(-50); // Keep last 50
    setRecentLogs(newLogs);
    localStorage.setItem('snw_emotion_logs', JSON.stringify(newLogs));
    
    // Close modal and show confirmation
    setSelectedEmotion(null);
    
    // Optional: Navigate to feelings tracker
    // navigate('/wellness/feelings');
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
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
              😊 Emotion Chart
            </h1>
          </div>
          
          {/* Action Buttons */}
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="How to use"
          >
            <HelpCircle size={22} className="text-gray-400" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors print:hidden"
            title="Print chart"
          >
            <Printer size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="font-crayon text-gray-600">
            How are you feeling? Tap an emotion to learn more about it.
          </p>
        </div>
        
        {/* Emotion Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {EMOTIONS.map(emotion => (
            <EmotionCard
              key={emotion.id}
              emotion={emotion}
              onClick={setSelectedEmotion}
              size="normal"
            />
          ))}
        </div>
        
        {/* Quick Check-In */}
        <div className="p-4 bg-gradient-to-r from-[#F5A623]/20 to-[#E86B9A]/20 rounded-2xl border-3 border-[#F5A623]/30 mb-6">
          <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-[#F5A623]" />
            Quick Check-In
          </h3>
          <p className="font-crayon text-sm text-gray-600 mb-3">
            Sometimes we feel more than one emotion at once. That's normal! 
            You can tap multiple emotions to explore them.
          </p>
        </div>
        
        {/* Recent Emotion Logs */}
        {recentLogs.length > 0 && (
          <div className="p-4 bg-white rounded-2xl border-3 border-gray-200 shadow-sm">
            <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Heart size={18} className="text-[#E86B9A]" />
              Your Recent Feelings
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentLogs.slice(-5).reverse().map((log, i) => {
                const emotion = EMOTIONS.find(e => e.id === log.emotion);
                if (!emotion) return null;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                    style={{ backgroundColor: emotion.bgColor, color: emotion.color }}
                  >
                    <img
                      src={getPictogramUrl(emotion.arasaacId)}
                      alt={emotion.name}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="font-crayon">{emotion.name}</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => navigate('/wellness/feelings')}
              className="mt-3 text-sm font-crayon text-[#4A9FD4] hover:underline flex items-center gap-1"
            >
              See all in Feelings Tracker <ChevronRight size={14} />
            </button>
          </div>
        )}
        
        {/* Attribution */}
        <div className="mt-6 text-center">
          <a 
            href="https://arasaac.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Pictograms by ARASAAC (CC BY-NC-SA)
          </a>
        </div>
      </main>
      
      {/* Emotion Detail Modal */}
      {selectedEmotion && (
        <EmotionDetailModal
          emotion={selectedEmotion}
          onClose={() => setSelectedEmotion(null)}
          onLogFeeling={handleLogFeeling}
        />
      )}
      
      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#F5A623]">How to Use</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>1. Find your feeling:</strong> Look at the faces and find one that matches how you feel right now.
              </p>
              <p>
                <strong>2. Learn about it:</strong> Tap the emotion to learn what it means and how it feels in your body.
              </p>
              <p>
                <strong>3. Get help:</strong> Each emotion shows things that might help you feel better or manage the feeling.
              </p>
              <p>
                <strong>4. Track it:</strong> Use the "Log This Feeling" button to remember how you felt.
              </p>
              <p className="text-sm text-gray-400 italic">
                Tip: It's okay to feel many emotions at once! You can explore as many as you want.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#F5A623] text-white rounded-xl font-display
                       hover:bg-orange-500 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      {/* Print Styles */}
      <style>{`
        @media print {
          header, button, .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EmotionChart;
