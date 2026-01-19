// CalmDown.jsx - Calm Down techniques for ATLASassist
// UPDATED: Added Visual Schedule integration
// Schedule calming exercises and breathing techniques

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Wind,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Check,
  CalendarPlus,
  Bell,
  BellOff,
  Clock,
  Calendar,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';

// Breathing exercises
const BREATHING_EXERCISES = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    emoji: '📦',
    color: '#4A9FD4',
    description: 'Breathe in a square pattern for calm',
    instructions: 'Breathe in, hold, breathe out, hold - each for 4 counts',
    steps: [
      { action: 'Breathe In', duration: 4, color: '#4A9FD4' },
      { action: 'Hold', duration: 4, color: '#F5A623' },
      { action: 'Breathe Out', duration: 4, color: '#5CB85C' },
      { action: 'Hold', duration: 4, color: '#8E6BBF' },
    ],
    cycles: 4,
  },
  {
    id: 'star-breathing',
    name: 'Star Breathing',
    emoji: '⭐',
    color: '#F5A623',
    description: 'Trace a star while you breathe',
    instructions: 'Breathe in going up, breathe out going down each point',
    steps: [
      { action: 'Breathe In', duration: 3, color: '#F5A623' },
      { action: 'Breathe Out', duration: 3, color: '#F5A623' },
    ],
    cycles: 5,
  },
  {
    id: 'balloon-breathing',
    name: 'Balloon Breathing',
    emoji: '🎈',
    color: '#E63B2E',
    description: 'Imagine inflating a balloon',
    instructions: 'Take a big breath to fill your balloon, then slowly let the air out',
    steps: [
      { action: 'Fill Balloon', duration: 5, color: '#E63B2E' },
      { action: 'Let Air Out', duration: 7, color: '#E63B2E' },
    ],
    cycles: 5,
  },
  {
    id: 'flower-candle',
    name: 'Flower & Candle',
    emoji: '🌸',
    color: '#E86B9A',
    description: 'Smell a flower, blow out a candle',
    instructions: 'Breathe in like smelling a flower, breathe out like blowing a candle',
    steps: [
      { action: 'Smell Flower', duration: 4, color: '#E86B9A' },
      { action: 'Blow Candle', duration: 6, color: '#F5A623' },
    ],
    cycles: 5,
  },
  {
    id: 'bunny-breathing',
    name: 'Bunny Breathing',
    emoji: '🐰',
    color: '#8E6BBF',
    description: 'Quick sniffs like a bunny',
    instructions: 'Take 3 quick sniffs in, then one long breath out',
    steps: [
      { action: 'Sniff', duration: 1, color: '#8E6BBF' },
      { action: 'Sniff', duration: 1, color: '#8E6BBF' },
      { action: 'Sniff', duration: 1, color: '#8E6BBF' },
      { action: 'Breathe Out', duration: 4, color: '#5CB85C' },
    ],
    cycles: 5,
  },
];

// Calming activities
const CALMING_ACTIVITIES = [
  { id: 'counting', name: 'Count to 10', emoji: '🔢', duration: 30, description: 'Count slowly to 10, then back down' },
  { id: 'squeeze', name: 'Squeeze & Release', emoji: '✊', duration: 60, description: 'Squeeze your hands tight, then let go' },
  { id: 'grounding', name: '5-4-3-2-1', emoji: '🖐️', duration: 120, description: '5 things you see, 4 hear, 3 feel, 2 smell, 1 taste' },
  { id: 'butterfly-hug', name: 'Butterfly Hug', emoji: '🦋', duration: 60, description: 'Cross arms, tap shoulders like butterfly wings' },
  { id: 'safe-place', name: 'Safe Place', emoji: '🏠', duration: 120, description: 'Close eyes and imagine your calm, safe place' },
  { id: 'stretch', name: 'Gentle Stretch', emoji: '🧘', duration: 90, description: 'Stretch your body slowly and gently' },
];

// =====================================================
// ADD TO SCHEDULE MODAL
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, activity, type, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen || !activity) return null;

  const handleAdd = () => {
    onAdd({
      activity,
      type,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  const isBreathing = type === 'breathing';
  const color = isBreathing ? activity.color : '#20B2AA';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-white p-4 flex items-center gap-3" style={{ backgroundColor: color }}>
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">
            Schedule {isBreathing ? 'Breathing Exercise' : 'Calming Activity'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 rounded-xl border-2" style={{ backgroundColor: `${color}10`, borderColor: `${color}40` }}>
            <p className="font-crayon text-sm" style={{ color: color }}>
              🧘 <strong>Why schedule calming time?</strong> Regular practice of calming techniques 
              helps build self-regulation skills. Schedule a reminder to practice 
              {isBreathing ? ' this breathing exercise' : ' calming activities'} daily, 
              especially before potentially stressful times!
            </p>
          </div>

          {/* Activity Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <span className="text-2xl">{activity.emoji}</span>
            </div>
            <div>
              <p className="font-display text-gray-800">{isBreathing ? 'Breathing: ' : ''}{activity.name}</p>
              <p className="font-crayon text-sm text-gray-500">{activity.description}</p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Calendar size={16} className="inline mr-1" />
              When?
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'bg-gray-100' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={selectedDate === getToday() ? { borderColor: color, color: color } : {}}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'bg-gray-100' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={selectedDate === getTomorrow() ? { borderColor: color, color: color } : {}}
              >
                Tomorrow
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Clock size={16} className="inline mr-1" />
              What time?
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              Tip: Schedule before transitions or potentially stressful times
            </p>
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder ? 'bg-gray-50' : 'bg-gray-50 border-gray-200'}`}
            style={enableReminder ? { borderColor: color } : {}}
          >
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: enableReminder ? color : '#9CA3AF' }}
            >
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminder on' : 'No reminder'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Breathing Exercise Component
const BreathingExercise = ({ exercise, onComplete, onSchedule }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  // Get current step data
  const stepData = exercise.steps[currentStep];

  // Timer logic
  useEffect(() => {
    if (isRunning && !isComplete) {
      setCountdown(stepData.duration);
      
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Move to next step
            const nextStep = currentStep + 1;
            if (nextStep >= exercise.steps.length) {
              // Completed a cycle
              const nextCycle = currentCycle + 1;
              if (nextCycle >= exercise.cycles) {
                // All cycles complete
                setIsComplete(true);
                setIsRunning(false);
                return 0;
              }
              setCurrentCycle(nextCycle);
              setCurrentStep(0);
              return exercise.steps[0].duration;
            } else {
              setCurrentStep(nextStep);
              return exercise.steps[nextStep].duration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, currentStep, currentCycle, exercise, isComplete]);

  const startExercise = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCurrentCycle(0);
    setCountdown(exercise.steps[0].duration);
    setIsComplete(false);
  };

  const pauseExercise = () => {
    setIsRunning(false);
  };

  const resetExercise = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setCurrentCycle(0);
    setCountdown(exercise.steps[0].duration);
    setIsComplete(false);
  };

  // Calculate progress
  const totalSteps = exercise.steps.length * exercise.cycles;
  const completedSteps = currentCycle * exercise.steps.length + currentStep;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white rounded-3xl border-4 shadow-crayon overflow-hidden" style={{ borderColor: exercise.color }}>
      {/* Header */}
      <div className="p-4 text-center text-white" style={{ backgroundColor: exercise.color }}>
        <span className="text-4xl block mb-2">{exercise.emoji}</span>
        <h2 className="font-display text-2xl">{exercise.name}</h2>
        <p className="font-crayon text-sm opacity-90">{exercise.instructions}</p>
      </div>

      {/* Main Display */}
      <div className="p-8">
        {!isComplete ? (
          <>
            {/* Breathing Circle */}
            <div 
              className="w-48 h-48 mx-auto rounded-full flex items-center justify-center mb-6
                         transition-all duration-1000"
              style={{ 
                backgroundColor: `${stepData.color}20`,
                border: `8px solid ${stepData.color}`,
                transform: stepData.action.includes('In') || stepData.action.includes('Fill') || stepData.action === 'Sniff' 
                  ? 'scale(1.1)' 
                  : 'scale(0.9)'
              }}
            >
              <div className="text-center">
                <p className="font-display text-xl" style={{ color: stepData.color }}>
                  {stepData.action}
                </p>
                <p className="text-5xl font-display" style={{ color: stepData.color }}>
                  {countdown}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-crayon text-gray-500 mb-1">
                <span>Cycle {currentCycle + 1} of {exercise.cycles}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%`, backgroundColor: exercise.color }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <button
                  onClick={startExercise}
                  className="p-4 rounded-full text-white"
                  style={{ backgroundColor: exercise.color }}
                >
                  <Play size={32} />
                </button>
              ) : (
                <button
                  onClick={pauseExercise}
                  className="p-4 rounded-full text-white"
                  style={{ backgroundColor: exercise.color }}
                >
                  <Pause size={32} />
                </button>
              )}
              <button
                onClick={resetExercise}
                className="p-4 rounded-full bg-gray-200 text-gray-600"
              >
                <RotateCcw size={32} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-bounce" style={{ color: exercise.color }} />
            <h3 className="font-display text-2xl text-gray-800 mb-2">Great Job! 🎉</h3>
            <p className="font-crayon text-gray-600 mb-4">You completed {exercise.cycles} cycles!</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={resetExercise}
                className="px-4 py-2 bg-white border-2 rounded-xl font-crayon"
                style={{ borderColor: exercise.color, color: exercise.color }}
              >
                <RotateCcw size={16} className="inline mr-2" />
                Again
              </button>
              <button
                onClick={() => onSchedule(exercise)}
                className="px-4 py-2 rounded-xl font-crayon text-white"
                style={{ backgroundColor: exercise.color }}
              >
                <CalendarPlus size={16} className="inline mr-2" />
                Schedule
              </button>
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Button */}
      {!isComplete && (
        <div className="px-4 pb-4 text-center">
          <button
            onClick={() => onSchedule(exercise)}
            className="px-4 py-2 bg-gray-100 rounded-xl font-crayon text-gray-600 hover:bg-gray-200 transition-all"
          >
            <CalendarPlus size={16} className="inline mr-2" />
            Schedule this exercise
          </button>
        </div>
      )}
    </div>
  );
};

// Main Component
const CalmDown = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTab, setActiveTab] = useState('breathing'); // breathing or activities
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activityToSchedule, setActivityToSchedule] = useState(null);
  const [scheduleType, setScheduleType] = useState('breathing');

  // Handle schedule button click
  const handleScheduleClick = (activity, type) => {
    setActivityToSchedule(activity);
    setScheduleType(type);
    setShowScheduleModal(true);
  };

  // Handle add to schedule
  const handleAddToSchedule = ({ activity, type, date, time, reminder }) => {
    const isBreathing = type === 'breathing';
    
    const result = addActivityToSchedule({
      date: date,
      name: isBreathing ? `Breathing: ${activity.name}` : `Calm: ${activity.name}`,
      time: time,
      emoji: activity.emoji,
      color: isBreathing ? activity.color : '#20B2AA',
      source: SCHEDULE_SOURCES.SENSORY_BREAK, // Using sensory break source
      notify: reminder,
      metadata: {
        activityId: activity.id,
        type: type,
        duration: activity.duration || (activity.cycles ? activity.cycles * 30 : 60),
      },
    });

    setShowScheduleModal(false);
    setActivityToSchedule(null);

    if (result && result.success) {
      toast.schedule(
        'Calm Time Scheduled!',
        `"${activity.name}" is on your Visual Schedule for ${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
      );
    } else {
      toast.error('Oops!', 'Could not add to schedule. Please try again.');
    }
  };

  // If exercise selected
  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4" style={{ borderColor: selectedExercise.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedExercise(null)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl 
                         font-display font-bold transition-all shadow-md"
              style={{ borderColor: selectedExercise.color, color: selectedExercise.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display" style={{ color: selectedExercise.color }}>
                {selectedExercise.emoji} {selectedExercise.name}
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <BreathingExercise 
            exercise={selectedExercise} 
            onComplete={() => setSelectedExercise(null)}
            onSchedule={(ex) => handleScheduleClick(ex, 'breathing')}
          />
        </main>

        {/* Schedule Modal */}
        <AddToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setActivityToSchedule(null);
          }}
          activity={activityToSchedule}
          type={scheduleType}
          onAdd={handleAddToSchedule}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/emotional-wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              🧘 Calm Down
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              activeTab === 'breathing'
                ? 'bg-[#8E6BBF] text-white'
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Wind size={18} className="inline mr-2" />
            Breathing
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              activeTab === 'activities'
                ? 'bg-[#20B2AA] text-white'
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Heart size={18} className="inline mr-2" />
            Activities
          </button>
        </div>

        {/* Breathing Exercises */}
        {activeTab === 'breathing' && (
          <div className="space-y-4">
            <p className="font-crayon text-gray-600 text-center mb-4">
              Choose a breathing exercise to calm your body and mind
            </p>
            {BREATHING_EXERCISES.map(exercise => (
              <div
                key={exercise.id}
                className="bg-white rounded-2xl border-3 overflow-hidden shadow-sm"
                style={{ borderColor: exercise.color }}
              >
                <div className="p-4 flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${exercise.color}20` }}
                  >
                    <span className="text-4xl">{exercise.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-gray-800">{exercise.name}</h3>
                    <p className="font-crayon text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => setSelectedExercise(exercise)}
                    className="flex-1 py-2 rounded-xl font-crayon text-white"
                    style={{ backgroundColor: exercise.color }}
                  >
                    <Play size={16} className="inline mr-1" />
                    Start
                  </button>
                  <button
                    onClick={() => handleScheduleClick(exercise, 'breathing')}
                    className="py-2 px-3 rounded-xl font-crayon text-gray-600 border-2 border-gray-200"
                  >
                    <CalendarPlus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calming Activities */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <p className="font-crayon text-gray-600 text-center mb-4">
              Quick activities to help you feel calm
            </p>
            <div className="grid grid-cols-2 gap-4">
              {CALMING_ACTIVITIES.map(activity => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl border-3 border-[#20B2AA] p-4 text-center"
                >
                  <span className="text-4xl block mb-2">{activity.emoji}</span>
                  <h3 className="font-display text-gray-800 text-sm">{activity.name}</h3>
                  <p className="font-crayon text-xs text-gray-500 mb-3">{activity.description}</p>
                  <button
                    onClick={() => handleScheduleClick(activity, 'activity')}
                    className="w-full py-2 rounded-xl font-crayon text-sm text-[#20B2AA] border-2 border-[#20B2AA]
                             hover:bg-[#20B2AA] hover:text-white transition-all"
                  >
                    <CalendarPlus size={14} className="inline mr-1" />
                    Schedule
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
          <h3 className="font-display text-[#8E6BBF] mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            Calming Tips
          </h3>
          <ul className="font-crayon text-sm text-purple-700 space-y-1">
            <li>• Practice when calm to build the skill</li>
            <li>• Schedule calming time before stressful events</li>
            <li>• Find what works best for you</li>
            <li>• Even 1 minute of breathing helps!</li>
          </ul>
        </div>
      </main>

      {/* Schedule Modal */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setActivityToSchedule(null);
        }}
        activity={activityToSchedule}
        type={scheduleType}
        onAdd={handleAddToSchedule}
      />
    </div>
  );
};

export default CalmDown;
