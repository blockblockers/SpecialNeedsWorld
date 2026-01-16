// EmotionChart.jsx - Interactive Emotion Identification Tool
// Part of the Emotional Wellness hub
// Uses ARASAAC pictograms for accessibility
// UPDATED: Added Visual Schedule integration using EXISTING scheduleHelper

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
  ThumbsUp,
  CalendarPlus,
  Clock,
  Bell,
  Check
} from 'lucide-react';
import { getPictogramUrl, ARASAAC_PICTOGRAM_IDS } from '../services/arasaac';
// Use EXISTING scheduleHelper exports only
import { 
  addActivityToSchedule,
  addMultipleActivities,
  getToday, 
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay,
  SCHEDULE_SOURCES,
  SOURCE_COLORS 
} from '../services/scheduleHelper';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_emotion_logs';

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
      'Tell a grown-up how you feel',
      'Take slow, deep breaths',
      'Hold something comforting',
      'Remember: "I am safe"',
    ],
  },
  {
    id: 'worried',
    name: 'Worried',
    arasaacId: 11332,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Feeling anxious about something',
    bodyFeel: 'Butterflies in tummy, can\'t focus',
    mightFeelWhen: [
      'Before a test or appointment',
      'When plans change suddenly',
      'Thinking about the future',
      'Not knowing what will happen',
    ],
    helpfulThings: [
      'Talk about your worries',
      'Make a plan for what you can control',
      'Focus on right now',
      'Ask "Will this matter tomorrow?"',
    ],
  },
  {
    id: 'excited',
    name: 'Excited',
    arasaacId: 11319,
    color: '#E86B9A',
    bgColor: '#FDEBF0',
    description: 'Feeling eager and full of energy',
    bodyFeel: 'Jumpy, can\'t sit still, big smile',
    mightFeelWhen: [
      'Before a fun event',
      'Getting a surprise',
      'Doing something you love',
      'Seeing someone special',
    ],
    helpfulThings: [
      'Channel energy into activity',
      'Take deep breaths to calm down',
      'Share your excitement safely',
      'Use your words to express it',
    ],
  },
  {
    id: 'frustrated',
    name: 'Frustrated',
    arasaacId: 11323,
    color: '#F5A623',
    bgColor: '#FEF5E7',
    description: 'Feeling stuck or annoyed',
    bodyFeel: 'Tense, sighing, want to give up',
    mightFeelWhen: [
      'Something is too hard',
      'You keep making mistakes',
      'Things take too long',
      'You can\'t do what you want',
    ],
    helpfulThings: [
      'Take a break and come back',
      'Ask for help',
      'Try a different way',
      'Say "This is hard, but I can try"',
    ],
  },
  {
    id: 'calm',
    name: 'Calm',
    arasaacId: 38221,
    color: '#20B2AA',
    bgColor: '#E6F7F5',
    description: 'Feeling peaceful and relaxed',
    bodyFeel: 'Relaxed muscles, slow breathing',
    mightFeelWhen: [
      'After resting',
      'In a comfortable place',
      'Doing something you enjoy quietly',
      'Feeling safe and content',
    ],
    helpfulThings: [
      'Enjoy the peaceful feeling',
      'Notice how your body feels',
      'Remember what helped you feel calm',
    ],
  },
  {
    id: 'tired',
    name: 'Tired',
    arasaacId: 11329,
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: 'Feeling sleepy or low energy',
    bodyFeel: 'Heavy eyes, yawning, slow',
    mightFeelWhen: [
      'After a busy day',
      'Not enough sleep',
      'Feeling sick',
      'After lots of thinking',
    ],
    helpfulThings: [
      'Rest or take a nap',
      'Have a healthy snack',
      'Do something quiet',
      'Go to bed early tonight',
    ],
  },
  {
    id: 'loved',
    name: 'Loved',
    arasaacId: 26684,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    description: 'Feeling cared for and special',
    bodyFeel: 'Warm, smiling, happy heart',
    mightFeelWhen: [
      'Getting a hug',
      'Someone says something kind',
      'Spending time with family',
      'A friend helps you',
    ],
    helpfulThings: [
      'Say "thank you"',
      'Share love with others',
      'Remember this feeling',
    ],
  },
  {
    id: 'confused',
    name: 'Confused',
    arasaacId: 11324,
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    description: 'Not understanding something',
    bodyFeel: 'Mind feels foggy, brow furrowed',
    mightFeelWhen: [
      'Instructions are unclear',
      'Too much is happening',
      'Learning something new',
      'People expect different things',
    ],
    helpfulThings: [
      'Ask questions',
      'Take it step by step',
      'Ask someone to explain',
      'It\'s okay to not know!',
    ],
  },
  {
    id: 'proud',
    name: 'Proud',
    arasaacId: 36814,
    color: '#10B981',
    bgColor: '#D1FAE5',
    description: 'Feeling good about something you did',
    bodyFeel: 'Standing tall, big smile, warm inside',
    mightFeelWhen: [
      'You worked hard and succeeded',
      'You helped someone',
      'You tried something difficult',
      'Someone said you did well',
    ],
    helpfulThings: [
      'Celebrate your success!',
      'Tell someone what you did',
      'Remember you CAN do hard things',
    ],
  },
];

// ============================================
// BODY AREAS for body map
// ============================================
const BODY_AREAS = [
  { id: 'head', name: 'Head', top: '5%', left: '50%' },
  { id: 'chest', name: 'Chest', top: '30%', left: '50%' },
  { id: 'stomach', name: 'Stomach', top: '45%', left: '50%' },
  { id: 'hands', name: 'Hands', top: '50%', left: '20%' },
  { id: 'legs', name: 'Legs', top: '70%', left: '50%' },
];

// ============================================
// SPEAK FUNCTION
// ============================================
const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};

// ============================================
// EMOTION CARD COMPONENT
// ============================================
const EmotionCard = ({ emotion, onClick, size = 'normal' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeClasses = {
    small: 'p-2',
    normal: 'p-3 sm:p-4',
    large: 'p-4 sm:p-6',
  };
  
  const imageSizes = {
    small: 'w-10 h-10',
    normal: 'w-14 h-14 sm:w-16 sm:h-16',
    large: 'w-20 h-20 sm:w-24 sm:h-24',
  };
  
  return (
    <button
      onClick={() => onClick(emotion)}
      className={`flex flex-col items-center gap-2 rounded-2xl border-3 
                 transition-all hover:scale-105 active:scale-95 ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: emotion.bgColor,
        borderColor: emotion.color,
      }}
    >
      <div className={`relative ${imageSizes[size]}`}>
        <img
          src={getPictogramUrl(emotion.arasaacId)}
          alt={emotion.name}
          className="w-full h-full object-contain"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
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
// SCHEDULE CHECK-IN MODAL
// ============================================
const ScheduleCheckinModal = ({ isOpen, onClose }) => {
  const [scheduleType, setScheduleType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [dailyTimes, setDailyTimes] = useState(['09:00', '12:00', '15:00', '18:00']);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  if (!isOpen) return null;
  
  // Use existing addActivityToSchedule for single check-in
  const handleAddSingleCheckin = () => {
    const result = addActivityToSchedule({
      date: selectedDate,
      time: selectedTime,
      name: 'How am I feeling?',
      emoji: '💚',
      color: '#F5A623',
      source: SCHEDULE_SOURCES?.MANUAL || 'manual',
      notify: true,
      metadata: { type: 'emotion-checkin' },
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error);
    }
  };
  
  // Use existing addMultipleActivities for daily check-ins
  const handleAddDailyCheckins = () => {
    const activities = dailyTimes.map(time => ({
      date: selectedDate,
      time,
      name: 'How am I feeling?',
      emoji: '💚',
      color: '#F5A623',
      source: SCHEDULE_SOURCES?.MANUAL || 'manual',
      notify: true,
      metadata: { type: 'emotion-checkin' },
    }));
    
    const result = addMultipleActivities(activities);
    
    if (result.success || result.count > 0) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } else {
      setError('Failed to add check-ins');
    }
  };
  
  const toggleDailyTime = (time) => {
    setDailyTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time].sort()
    );
  };
  
  const timeOptions = [
    { time: '07:00', label: '7:00 AM' },
    { time: '09:00', label: '9:00 AM' },
    { time: '10:00', label: '10:00 AM' },
    { time: '12:00', label: '12:00 PM' },
    { time: '14:00', label: '2:00 PM' },
    { time: '15:00', label: '3:00 PM' },
    { time: '17:00', label: '5:00 PM' },
    { time: '18:00', label: '6:00 PM' },
    { time: '20:00', label: '8:00 PM' },
  ];
  
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="font-display text-xl text-green-600">Added to Schedule!</h3>
          <p className="font-crayon text-gray-500 mt-2">
            Check your Visual Schedule for emotion check-in reminders
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#F5A623] text-white p-4 flex items-center gap-3 rounded-t-2xl">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Emotion Check-ins</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setScheduleType('single')}
              className={`flex-1 py-3 rounded-xl font-display text-sm border-2 transition-all
                        ${scheduleType === 'single' 
                          ? 'bg-[#F5A623] text-white border-[#F5A623]' 
                          : 'bg-white text-gray-600 border-gray-200'}`}
            >
              One Check-in
            </button>
            <button
              onClick={() => setScheduleType('daily')}
              className={`flex-1 py-3 rounded-xl font-display text-sm border-2 transition-all
                        ${scheduleType === 'daily' 
                          ? 'bg-[#F5A623] text-white border-[#F5A623]' 
                          : 'bg-white text-gray-600 border-gray-200'}`}
            >
              Daily Check-ins
            </button>
          </div>
          
          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">Which day?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'bg-[#F5A623]/20 border-[#F5A623] text-[#F5A623]' 
                            : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'bg-[#F5A623]/20 border-[#F5A623] text-[#F5A623]' 
                            : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Tomorrow
              </button>
            </div>
          </div>
          
          {/* Time Selection */}
          {scheduleType === 'single' ? (
            <div>
              <label className="block font-crayon text-gray-600 mb-2">What time?</label>
              <div className="grid grid-cols-3 gap-2">
                {timeOptions.map(opt => (
                  <button
                    key={opt.time}
                    onClick={() => setSelectedTime(opt.time)}
                    className={`py-2 rounded-xl font-crayon text-sm border-2 transition-all
                              ${selectedTime === opt.time 
                                ? 'bg-[#F5A623]/20 border-[#F5A623] text-[#F5A623]' 
                                : 'bg-white border-gray-200 text-gray-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-crayon text-gray-600 mb-2">
                Check in at these times (tap to toggle):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeOptions.map(opt => (
                  <button
                    key={opt.time}
                    onClick={() => toggleDailyTime(opt.time)}
                    className={`py-2 rounded-xl font-crayon text-sm border-2 transition-all
                              ${dailyTimes.includes(opt.time) 
                                ? 'bg-[#F5A623]/20 border-[#F5A623] text-[#F5A623]' 
                                : 'bg-white border-gray-200 text-gray-600'}`}
                  >
                    {dailyTimes.includes(opt.time) && <Check size={12} className="inline mr-1" />}
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="font-crayon text-xs text-gray-400 mt-2">
                {dailyTimes.length} check-ins selected
              </p>
            </div>
          )}
          
          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-crayon text-sm text-gray-600">
              <Bell size={14} className="inline mr-1 text-[#F5A623]" />
              {scheduleType === 'single' 
                ? `You'll get a reminder at ${formatTimeDisplay(selectedTime)} on ${formatDateDisplay(selectedDate)} to check how you're feeling.`
                : `You'll get ${dailyTimes.length} reminders on ${formatDateDisplay(selectedDate)} to check how you're feeling throughout the day.`
              }
            </p>
          </div>
          
          {error && (
            <p className="text-red-500 font-crayon text-sm text-center">{error}</p>
          )}
          
          {/* Add Button */}
          <button
            onClick={scheduleType === 'single' ? handleAddSingleCheckin : handleAddDailyCheckins}
            disabled={scheduleType === 'daily' && dailyTimes.length === 0}
            className="w-full py-3 bg-[#F5A623] text-white rounded-xl font-display
                     hover:bg-[#E5961A] transition-colors disabled:opacity-50"
          >
            <CalendarPlus size={18} className="inline mr-2" />
            Add to Visual Schedule
          </button>
        </div>
      </div>
    </div>
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
                    className={`px-3 py-1.5 rounded-full text-sm font-crayon border-2 transition-all
                              ${selectedBodyAreas.includes(area.id)
                                ? 'text-white'
                                : 'bg-white text-gray-600 border-gray-200'}`}
                    style={{
                      backgroundColor: selectedBodyAreas.includes(area.id) ? emotion.color : undefined,
                      borderColor: selectedBodyAreas.includes(area.id) ? emotion.color : undefined,
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
              <span className="text-lg">💭</span> You might feel this when...
            </h3>
            <ul className="space-y-1">
              {emotion.mightFeelWhen.map((item, i) => (
                <li key={i} className="font-crayon text-gray-600 flex items-start gap-2">
                  <ChevronRight size={16} className="flex-shrink-0 mt-1" style={{ color: emotion.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Helpful Things */}
          <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
            <h3 className="font-display text-green-700 mb-2 flex items-center gap-2">
              <ThumbsUp size={18} />
              Things that can help
            </h3>
            <ul className="space-y-1">
              {emotion.helpfulThings.map((item, i) => (
                <li key={i} className="font-crayon text-green-700 flex items-start gap-2">
                  <Sparkles size={14} className="flex-shrink-0 mt-1" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Intensity Slider */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-display text-gray-700 mb-3">
              How strong is this feeling? (1-5)
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-crayon text-sm text-gray-500">A little</span>
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`flex-1 py-2 rounded-lg font-display transition-all
                              ${intensity >= level ? 'text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
                    style={{
                      backgroundColor: intensity >= level ? emotion.color : undefined,
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <span className="font-crayon text-sm text-gray-500">A lot</span>
            </div>
          </div>
          
          {/* Log Button */}
          <button
            onClick={handleLogFeeling}
            className="w-full py-4 rounded-2xl font-display text-white text-lg
                     hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: emotion.color }}
          >
            <Heart size={20} />
            I'm feeling {emotion.name}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// INFO MODAL
// ============================================
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-[#F5A623]">How to Use</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4 font-crayon text-gray-600">
          <div className="flex items-start gap-3">
            <span className="text-2xl">1️⃣</span>
            <p>Tap an emotion card to learn more about that feeling</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">2️⃣</span>
            <p>Read about when you might feel this way and what can help</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">3️⃣</span>
            <p>Mark how strong the feeling is (1-5)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">4️⃣</span>
            <p>Tap "I'm feeling..." to log your emotion</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <p><strong>NEW!</strong> Use "Schedule Check-ins" to add reminders to your Visual Schedule</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#F5A623] text-white rounded-xl font-display"
        >
          Got it!
        </button>
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
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Load recent logs
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const logs = JSON.parse(saved);
        setRecentLogs(logs.slice(-10));
      } catch (e) {
        console.error('Error loading emotion logs:', e);
      }
    }
  }, []);
  
  const handleLogFeeling = (logData) => {
    const logs = [...recentLogs, logData];
    setRecentLogs(logs.slice(-10));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    setSelectedEmotion(null);
  };
  
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
            onClick={() => setShowScheduleModal(true)}
            className="p-2 rounded-full hover:bg-[#F5A623]/10 transition-colors"
            title="Schedule check-ins"
          >
            <CalendarPlus size={22} className="text-[#F5A623]" />
          </button>
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
        
        {/* Schedule Check-ins Card */}
        <div className="p-4 bg-gradient-to-r from-[#F5A623]/20 to-[#E86B9A]/20 rounded-2xl border-3 border-[#F5A623]/30 mb-6">
          <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
            <CalendarPlus size={18} className="text-[#F5A623]" />
            Schedule Emotion Check-ins
          </h3>
          <p className="font-crayon text-sm text-gray-600 mb-3">
            Add reminders to your Visual Schedule to check in with your feelings throughout the day!
          </p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-[#F5A623] text-white rounded-xl font-display text-sm
                     hover:bg-[#E5961A] transition-colors"
          >
            <CalendarPlus size={16} className="inline mr-2" />
            Add to Schedule
          </button>
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
                    <span className="text-xs opacity-60">({log.intensity}/5)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedEmotion && (
        <EmotionDetailModal
          emotion={selectedEmotion}
          onClose={() => setSelectedEmotion(null)}
          onLogFeeling={handleLogFeeling}
        />
      )}
      
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      
      <ScheduleCheckinModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
};

export default EmotionChart;
