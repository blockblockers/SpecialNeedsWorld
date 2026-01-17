// EmotionChart.jsx - Interactive Emotion Identification Tool
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart,
  Volume2,
  Printer,
  ChevronRight,
  X,
  Sparkles,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

// Emotion data
const EMOTIONS = [
  {
    id: 'happy', name: 'Happy', emoji: '😊',
    color: '#F8D14A', bgColor: '#FEF9E7',
    description: 'Feeling good, joyful, or pleased',
    bodyFeel: 'Warm inside, smiling, energetic',
    mightFeelWhen: ['Playing with friends', 'Getting a hug', 'Doing something fun', 'Hearing good news'],
    helpfulThings: ['Share your happiness with others', 'Do more of what made you happy', 'Say "I feel happy!"'],
  },
  {
    id: 'sad', name: 'Sad', emoji: '😢',
    color: '#4A9FD4', bgColor: '#EBF5FB',
    description: 'Feeling unhappy, down, or upset',
    bodyFeel: 'Heavy, tired, might want to cry',
    mightFeelWhen: ['Missing someone', 'Something didn\'t go as planned', 'Feeling left out'],
    helpfulThings: ['Talk to someone you trust', 'Have a good cry - it\'s okay!', 'Hug a stuffed animal'],
  },
  {
    id: 'angry', name: 'Angry', emoji: '😠',
    color: '#E63B2E', bgColor: '#FDEDEC',
    description: 'Feeling mad, frustrated, or annoyed',
    bodyFeel: 'Hot, tense, clenched fists, fast heartbeat',
    mightFeelWhen: ['Something seems unfair', 'Someone took your things', 'Being told "no"'],
    helpfulThings: ['Take deep breaths', 'Count to 10 slowly', 'Walk away to cool down'],
  },
  {
    id: 'scared', name: 'Scared', emoji: '😨',
    color: '#8E6BBF', bgColor: '#F4ECF7',
    description: 'Feeling afraid, worried, or nervous',
    bodyFeel: 'Shaky, fast heartbeat, want to hide',
    mightFeelWhen: ['Trying something new', 'Hearing loud noises', 'Being in the dark'],
    helpfulThings: ['Find a safe person', 'Take slow breaths', 'Remember: "I am safe"'],
  },
  {
    id: 'excited', name: 'Excited', emoji: '🤩',
    color: '#E86B9A', bgColor: '#FDEBF0',
    description: 'Feeling eager, energetic, can\'t wait!',
    bodyFeel: 'Jumpy, fast heartbeat, hard to sit still',
    mightFeelWhen: ['Waiting for something fun', 'Birthday coming', 'Getting a surprise'],
    helpfulThings: ['Jump or dance', 'Talk about what you\'re excited for', 'Take deep breaths if too wiggly'],
  },
  {
    id: 'calm', name: 'Calm', emoji: '😌',
    color: '#5CB85C', bgColor: '#EAFAF1',
    description: 'Feeling peaceful, relaxed, at ease',
    bodyFeel: 'Relaxed body, slow breathing, comfortable',
    mightFeelWhen: ['After a nap', 'Doing something quiet', 'Being in a cozy place'],
    helpfulThings: ['Notice how good calm feels', 'Keep doing calming activities', 'Enjoy the peace'],
  },
  {
    id: 'frustrated', name: 'Frustrated', emoji: '😤',
    color: '#F5A623', bgColor: '#FEF5E7',
    description: 'Feeling stuck, annoyed, like giving up',
    bodyFeel: 'Tense, sighing, want to quit',
    mightFeelWhen: ['Something is too hard', 'Can\'t figure something out', 'Things keep going wrong'],
    helpfulThings: ['Take a break', 'Ask for help', 'Break into smaller steps'],
  },
  {
    id: 'worried', name: 'Worried', emoji: '😟',
    color: '#6B7280', bgColor: '#F3F4F6',
    description: 'Thinking about bad things that might happen',
    bodyFeel: 'Tight tummy, can\'t stop thinking',
    mightFeelWhen: ['Before a test', 'When someone is late', 'Thinking "what if"'],
    helpfulThings: ['Talk about your worries', 'Focus on what you CAN control', 'Take deep breaths'],
  },
  {
    id: 'tired', name: 'Tired', emoji: '😴',
    color: '#9CA3AF', bgColor: '#F9FAFB',
    description: 'Feeling sleepy, worn out, low energy',
    bodyFeel: 'Heavy, yawning, hard to focus',
    mightFeelWhen: ['After a busy day', 'Not enough sleep', 'After lots of activity'],
    helpfulThings: ['Rest or take a nap', 'Do something quiet', 'Drink water'],
  },
  {
    id: 'confused', name: 'Confused', emoji: '😕',
    color: '#A78BFA', bgColor: '#F5F3FF',
    description: 'Not sure what\'s happening or what to do',
    bodyFeel: 'Head feels fuzzy, uncertain',
    mightFeelWhen: ['Learning something new', 'Too many things happening', 'Instructions aren\'t clear'],
    helpfulThings: ['Ask questions', 'Say "I don\'t understand"', 'Take it one step at a time'],
  },
  {
    id: 'proud', name: 'Proud', emoji: '🥳',
    color: '#10B981', bgColor: '#ECFDF5',
    description: 'Feeling good about something you did',
    bodyFeel: 'Standing tall, smiling, warm inside',
    mightFeelWhen: ['Finishing something hard', 'Helping someone', 'Learning something new'],
    helpfulThings: ['Celebrate!', 'Tell someone what you did', 'Keep trying hard things'],
  },
  {
    id: 'lonely', name: 'Lonely', emoji: '🥺',
    color: '#64748B', bgColor: '#F1F5F9',
    description: 'Feeling alone or wanting to be with others',
    bodyFeel: 'Empty, sad, wanting connection',
    mightFeelWhen: ['Being by yourself', 'Missing friends', 'Feeling different'],
    helpfulThings: ['Reach out to someone', 'Do something you enjoy', 'Remember people who care'],
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

// Speak function
const speak = (text) => {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
};

// Emotion Card
const EmotionCard = ({ emotion, onClick }) => (
  <button
    onClick={() => onClick(emotion)}
    className="w-full p-4 rounded-2xl border-4 transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex flex-col items-center justify-center gap-2"
    style={{ backgroundColor: emotion.bgColor, borderColor: emotion.color }}
  >
    <span className="text-4xl">{emotion.emoji}</span>
    <span className="font-display text-sm" style={{ color: emotion.color }}>{emotion.name}</span>
  </button>
);

// Emotion Detail Modal
const EmotionDetailModal = ({ emotion, onClose, onLogFeeling }) => {
  const [intensity, setIntensity] = useState(3);
  
  if (!emotion) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ borderTop: `6px solid ${emotion.color}` }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emotion.emoji}</span>
            <div>
              <h2 className="font-display text-xl" style={{ color: emotion.color }}>{emotion.name}</h2>
              <p className="font-crayon text-sm text-gray-500">{emotion.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Speak Button */}
          <button
            onClick={() => speak(`${emotion.name}. ${emotion.description}`)}
            className="w-full py-3 rounded-xl border-2 flex items-center justify-center gap-2 hover:bg-gray-50"
            style={{ borderColor: emotion.color, color: emotion.color }}
          >
            <Volume2 size={20} />
            <span className="font-display">Hear it</span>
          </button>
          
          {/* Body Feel */}
          <div className="p-4 rounded-2xl" style={{ backgroundColor: emotion.bgColor }}>
            <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
              <span>🫀</span> How it feels in your body
            </h3>
            <p className="font-crayon text-gray-600">{emotion.bodyFeel}</p>
          </div>
          
          {/* When You Might Feel This */}
          <div>
            <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
              <span>💭</span> You might feel {emotion.name.toLowerCase()} when...
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
          
          {/* Intensity */}
          <div>
            <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <span>📊</span> How strong is this feeling?
            </h3>
            <div className="flex justify-between mb-2">
              {INTENSITY_LEVELS.map(level => (
                <button
                  key={level.level}
                  onClick={() => setIntensity(level.level)}
                  className={`w-12 h-12 rounded-full text-xl transition-all ${
                    intensity === level.level ? 'scale-125 shadow-lg' : 'opacity-50 hover:opacity-75'
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
            <p className="text-center font-crayon text-gray-500">{INTENSITY_LEVELS[intensity - 1]?.label}</p>
          </div>
          
          {/* Log Button */}
          <button
            onClick={() => {
              onLogFeeling({ emotion: emotion.id, intensity, timestamp: new Date().toISOString() });
              onClose();
            }}
            className="w-full py-4 rounded-xl text-white font-display text-lg shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: emotion.color }}
          >
            Log This Feeling
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const EmotionChart = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  
  // Load logs
  useEffect(() => {
    const saved = localStorage.getItem('snw_emotion_logs');
    if (saved) {
      try {
        setRecentLogs(JSON.parse(saved).slice(-10));
      } catch (e) {
        console.error('Error loading:', e);
      }
    }
  }, []);
  
  // Log feeling
  const handleLogFeeling = (logData) => {
    const newLogs = [...recentLogs, logData].slice(-50);
    setRecentLogs(newLogs);
    localStorage.setItem('snw_emotion_logs', JSON.stringify(newLogs));
    setSelectedEmotion(null);
  };
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text">
              😊 Emotion Chart
            </h1>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HelpCircle size={22} className="text-gray-400" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-full hover:bg-gray-100 print:hidden"
          >
            <Printer size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center font-crayon text-gray-600 mb-6">
          How are you feeling? Tap an emotion to learn more.
        </p>
        
        {/* Emotion Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {EMOTIONS.map(emotion => (
            <EmotionCard key={emotion.id} emotion={emotion} onClick={setSelectedEmotion} />
          ))}
        </div>
        
        {/* Quick Check-In */}
        <div className="p-4 bg-gradient-to-r from-[#F5A623]/20 to-[#E86B9A]/20 rounded-2xl border-3 border-[#F5A623]/30 mb-6">
          <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-[#F5A623]" />
            Quick Check-In
          </h3>
          <p className="font-crayon text-sm text-gray-600">
            Sometimes we feel more than one emotion at once. That's normal!
          </p>
        </div>
        
        {/* Recent Logs */}
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
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                    style={{ backgroundColor: emotion.bgColor, color: emotion.color }}>
                    <span>{emotion.emoji}</span>
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
      </main>
      
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
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p><strong>1. Find your feeling:</strong> Look at the faces and find one that matches.</p>
              <p><strong>2. Learn about it:</strong> Tap to learn what it means and how it feels.</p>
              <p><strong>3. Get help:</strong> See things that might help you feel better.</p>
              <p><strong>4. Track it:</strong> Use "Log This Feeling" to remember how you felt.</p>
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

export default EmotionChart;
