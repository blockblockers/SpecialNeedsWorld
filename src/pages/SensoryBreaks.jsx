// SensoryBreaks.jsx - Sensory Break activities for ATLASassist
// UPDATED: Added ambient sounds from MusicSounds app
// UPDATED: Back button always goes to /wellness (only location)
// UPDATED: Better Visual Schedule integration with sound playback
// UPDATED: URL parameter support for notification deep links

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  X,
  Check,
  CalendarPlus,
  Bell,
  BellOff,
  Calendar,
  History,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  addMultipleActivitiesToSchedule,
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';
import { getAudioContext, createNoiseBuffer } from '../services/soundUtils';

const STORAGE_KEY = 'snw_sensory_breaks';

// Ambient sounds (same as MusicSounds app)
const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Rain', emoji: '🌧️', synth: 'rain', description: 'Gentle rainfall sounds' },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', synth: 'ocean', description: 'Rhythmic ocean waves' },
  { id: 'wind', name: 'Gentle Wind', emoji: '💨', synth: 'wind', description: 'Soft breeze sounds' },
  { id: 'stream', name: 'Stream', emoji: '🏞️', synth: 'stream', description: 'Babbling brook' },
  { id: 'drone', name: 'Deep Drone', emoji: '🎵', synth: 'drone', description: 'Calming low tones' },
  { id: 'shimmer', name: 'Shimmer', emoji: '⭐', synth: 'shimmer', description: 'Sparkly ambient tones' },
  { id: 'focus', name: 'Focus Tones', emoji: '🎯', synth: 'binaural-focus', description: 'Concentration helper' },
  { id: 'sleep', name: 'Sleep Waves', emoji: '😴', synth: 'binaural-sleep', description: 'Relaxation tones' },
];

// Sensory break categories
const BREAK_CATEGORIES = [
  {
    id: 'movement',
    name: 'Movement',
    emoji: '🏃',
    color: '#5CB85C',
    description: 'Get your body moving!',
    activities: [
      { id: 'jumping-jacks', name: 'Jumping Jacks', emoji: '⭐', duration: 60, description: 'Jump and spread arms and legs' },
      { id: 'march', name: 'March in Place', emoji: '🚶', duration: 60, description: 'Lift your knees high' },
      { id: 'stretch', name: 'Big Stretches', emoji: '🧘', duration: 45, description: 'Reach up high, then touch your toes' },
      { id: 'animal-walk', name: 'Animal Walks', emoji: '🐻', duration: 60, description: 'Walk like a bear, crab, or frog' },
      { id: 'shake', name: 'Shake It Out', emoji: '🎵', duration: 30, description: 'Shake your hands, feet, and whole body' },
    ],
  },
  {
    id: 'calming',
    name: 'Calming',
    emoji: '🧘',
    color: '#8E6BBF',
    description: 'Slow down and relax',
    activities: [
      { id: 'deep-breathing', name: 'Deep Breathing', emoji: '🌬️', duration: 60, description: 'Breathe in slowly, hold, breathe out' },
      { id: 'wall-push', name: 'Wall Push-Ups', emoji: '🧱', duration: 45, description: 'Push against the wall 10 times' },
      { id: 'self-hug', name: 'Self Hug', emoji: '🤗', duration: 30, description: 'Give yourself a big squeeze' },
      { id: 'quiet-sit', name: 'Quiet Sitting', emoji: '🪑', duration: 60, description: 'Sit still and listen to the quiet' },
      { id: 'progressive', name: 'Tense and Release', emoji: '💪', duration: 90, description: 'Squeeze muscles tight, then let go' },
    ],
  },
  {
    id: 'tactile',
    name: 'Touch',
    emoji: '✋',
    color: '#F5A623',
    description: 'Explore different textures',
    activities: [
      { id: 'fidget', name: 'Fidget Time', emoji: '🎯', duration: 120, description: 'Play with a fidget toy' },
      { id: 'playdough', name: 'Play-Dough', emoji: '🎨', duration: 180, description: 'Squish and shape play-dough' },
      { id: 'lotion', name: 'Lotion Rub', emoji: '🧴', duration: 60, description: 'Rub lotion on hands and arms' },
      { id: 'texture-box', name: 'Texture Hunt', emoji: '📦', duration: 120, description: 'Find different textures to touch' },
    ],
  },
  {
    id: 'visual',
    name: 'Visual',
    emoji: '👀',
    color: '#4A9FD4',
    description: 'Rest and refocus your eyes',
    activities: [
      { id: 'eye-rest', name: 'Eye Rest', emoji: '😌', duration: 60, description: 'Close eyes and rest in darkness' },
      { id: 'lava-lamp', name: 'Watch Something Flow', emoji: '🌊', duration: 120, description: 'Watch a lava lamp or timer' },
      { id: 'window-gaze', name: 'Window Gazing', emoji: '🪟', duration: 60, description: 'Look outside at far away things' },
      { id: 'dim-lights', name: 'Dim the Lights', emoji: '💡', duration: 120, description: 'Turn lights low and relax' },
    ],
  },
  {
    id: 'auditory',
    name: 'Sound',
    emoji: '🎵',
    color: '#E86B9A',
    description: 'Listen to calming sounds',
    activities: AMBIENT_SOUNDS.map(sound => ({
      id: sound.id,
      name: sound.name,
      emoji: sound.emoji,
      duration: 180,
      description: sound.description,
      isSound: true,
      synth: sound.synth,
    })),
  },
];

// =====================================================
// SOUND SYNTHESIS FUNCTIONS (from MusicSounds)
// =====================================================
const activeNodes = new Map();

const stopSound = (soundId) => {
  const nodes = activeNodes.get(soundId);
  if (nodes) {
    nodes.oscillators?.forEach(osc => { try { osc.stop(); } catch (e) {} });
    nodes.sources?.forEach(src => { try { src.stop(); } catch (e) {} });
    if (nodes.interval) clearInterval(nodes.interval);
    activeNodes.delete(soundId);
  }
};

const stopAllSounds = () => {
  activeNodes.forEach((_, id) => stopSound(id));
};

const startSynthSound = (soundId, synthType, volume = 0.5) => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const nodes = { oscillators: [], gains: [], sources: [] };
  
  switch (synthType) {
    case 'rain': {
      const buffer = createNoiseBuffer(ctx, 2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.3, now);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      nodes.sources.push(source);
      nodes.gains.push(gain);
      break;
    }
    
    case 'ocean': {
      const buffer = createNoiseBuffer(ctx, 2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, now);
      lfoGain.gain.setValueAtTime(300, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, now);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      lfo.start();
      source.start();
      nodes.oscillators.push(lfo);
      nodes.sources.push(source);
      nodes.gains.push(gain);
      break;
    }
    
    case 'wind': {
      const buffer = createNoiseBuffer(ctx, 2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.05, now);
      lfoGain.gain.setValueAtTime(200, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.25, now);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      lfo.start();
      source.start();
      nodes.oscillators.push(lfo);
      nodes.sources.push(source);
      nodes.gains.push(gain);
      break;
    }
    
    case 'stream': {
      const buffer = createNoiseBuffer(ctx, 2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2000, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.2, now);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      nodes.sources.push(source);
      nodes.gains.push(gain);
      break;
    }
    
    case 'drone': {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);
      osc2.frequency.setValueAtTime(82.5, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.2, now);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      nodes.oscillators.push(osc1, osc2);
      nodes.gains.push(gain);
      break;
    }
    
    case 'shimmer': {
      const freqs = [523, 659, 784, 1047];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(volume * 0.08, now + i * 0.5);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.5 + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 4);
        nodes.oscillators.push(osc);
      });
      const shimmerInterval = setInterval(() => {
        const ctx2 = getAudioContext();
        const now2 = ctx2.currentTime;
        freqs.forEach((freq, i) => {
          const osc = ctx2.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now2);
          const gain = ctx2.createGain();
          gain.gain.setValueAtTime(0, now2);
          gain.gain.setValueAtTime(volume * 0.08, now2 + i * 0.5);
          gain.gain.linearRampToValueAtTime(0, now2 + i * 0.5 + 2);
          osc.connect(gain);
          gain.connect(ctx2.destination);
          osc.start();
          osc.stop(now2 + 4);
        });
      }, 4000);
      nodes.interval = shimmerInterval;
      break;
    }
    
    case 'binaural-focus': {
      const baseFreq = 200;
      const beatFreq = 14;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc2.frequency.setValueAtTime(baseFreq + beatFreq, now);
      const panL = ctx.createStereoPanner();
      const panR = ctx.createStereoPanner();
      panL.pan.setValueAtTime(-1, now);
      panR.pan.setValueAtTime(1, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.15, now);
      osc1.connect(panL);
      osc2.connect(panR);
      panL.connect(gain);
      panR.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      nodes.oscillators.push(osc1, osc2);
      nodes.gains.push(gain);
      break;
    }
    
    case 'binaural-sleep': {
      const baseFreq = 150;
      const beatFreq = 3;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc2.frequency.setValueAtTime(baseFreq + beatFreq, now);
      const panL = ctx.createStereoPanner();
      const panR = ctx.createStereoPanner();
      panL.pan.setValueAtTime(-1, now);
      panR.pan.setValueAtTime(1, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.12, now);
      osc1.connect(panL);
      osc2.connect(panR);
      panL.connect(gain);
      panR.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      nodes.oscillators.push(osc1, osc2);
      nodes.gains.push(gain);
      break;
    }
    
    default:
      return null;
  }
  
  activeNodes.set(soundId, nodes);
  return nodes;
};

// =====================================================
// ADD TO SCHEDULE MODAL - Single Break
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, activity, category, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen || !activity) return null;

  const handleAdd = () => {
    onAdd({
      activity,
      category,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-white p-4 flex items-center gap-3" style={{ backgroundColor: category?.color || '#8E6BBF' }}>
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Break</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="font-crayon text-sm text-gray-700">
              {activity.isSound ? (
                <>🎵 <strong>Schedule a sound break!</strong> You'll receive a notification at this time. 
                Tap it to open the sound and start relaxing.</>
              ) : (
                <>🧘 <strong>Why schedule sensory breaks?</strong> Regular breaks help with 
                self-regulation, focus, and preventing overwhelm.</>
              )}
            </p>
          </div>

          {/* Activity Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: category?.color || '#8E6BBF' }}
            >
              <span className="text-2xl">{activity.emoji}</span>
            </div>
            <div>
              <p className="font-display text-gray-800">
                {activity.isSound ? 'Sound Break' : 'Sensory Break'}: {activity.name}
              </p>
              <p className="font-crayon text-sm text-gray-500">
                {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')} min
              </p>
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
                style={selectedDate === getToday() ? { borderColor: category?.color, color: category?.color } : {}}
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
                style={selectedDate === getTomorrow() ? { borderColor: category?.color, color: category?.color } : {}}
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
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder ? 'bg-gray-50' : 'bg-gray-50 border-gray-200'}`}
            style={enableReminder ? { borderColor: category?.color } : {}}
          >
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: enableReminder ? category?.color : '#9CA3AF' }}
            >
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminder notification on' : 'No reminder'}
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

// =====================================================
// ACTIVE BREAK TIMER COMPONENT
// =====================================================
const ActiveBreakTimer = ({ activity, category, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(activity.duration);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Start sound if this is a sound activity
  useEffect(() => {
    if (activity.isSound && activity.synth) {
      startSynthSound(activity.id, activity.synth, 0.5);
      setIsPlaying(true);
    }
    return () => {
      if (activity.isSound) {
        stopSound(activity.id);
      }
    };
  }, [activity]);

  // Timer countdown
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft]);

  // Auto-complete when timer ends
  useEffect(() => {
    if (timeLeft === 0) {
      if (activity.isSound) {
        stopSound(activity.id);
      }
      onComplete();
    }
  }, [timeLeft]);

  const togglePause = () => setIsPaused(!isPaused);
  
  const toggleSound = () => {
    if (isPlaying) {
      stopSound(activity.id);
      setIsPlaying(false);
    } else {
      startSynthSound(activity.id, activity.synth, 0.5);
      setIsPlaying(true);
    }
  };

  const reset = () => {
    setTimeLeft(activity.duration);
    setIsPaused(false);
  };

  const handleCancel = () => {
    if (activity.isSound) {
      stopSound(activity.id);
    }
    onCancel();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((activity.duration - timeLeft) / activity.duration) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Colored Header */}
        <div 
          className="p-6 text-white text-center relative"
          style={{ backgroundColor: category.color }}
        >
          <button 
            onClick={handleCancel}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
          >
            <X size={24} />
          </button>
          <span className="text-6xl block mb-2">{activity.emoji}</span>
          <h2 className="font-display text-2xl">{activity.name}</h2>
          <p className="font-crayon text-white/80 mt-1">{activity.description}</p>
        </div>

        {/* Timer Display */}
        <div className="p-8 text-center">
          {/* Progress Ring */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke={category.color}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl text-gray-800">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={togglePause}
              className="p-4 rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: category.color }}
            >
              {isPaused ? (
                <Play size={32} className="text-white" />
              ) : (
                <Pause size={32} className="text-white" />
              )}
            </button>
            <button
              onClick={reset}
              className="p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-all hover:scale-110"
            >
              <RotateCcw size={32} className="text-gray-600" />
            </button>
            {activity.isSound && (
              <button
                onClick={toggleSound}
                className="p-4 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: isPlaying ? category.color : '#9CA3AF' }}
              >
                {isPlaying ? (
                  <Volume2 size={32} className="text-white" />
                ) : (
                  <VolumeX size={32} className="text-white" />
                )}
              </button>
            )}
          </div>

          {/* Complete Early Button */}
          <button
            onClick={() => {
              if (activity.isSound) stopSound(activity.id);
              onComplete();
            }}
            className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-crayon
                       hover:bg-green-600 transition-all flex items-center gap-2 mx-auto"
          >
            <Check size={20} />
            Done Early
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================
const SensoryBreaks = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [breakHistory, setBreakHistory] = useState([]);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activityToSchedule, setActivityToSchedule] = useState(null);
  const [categoryForSchedule, setCategoryForSchedule] = useState(null);

  // Handle URL parameters for deep linking from notifications
  useEffect(() => {
    const soundId = searchParams.get('sound');
    const breakId = searchParams.get('break');
    const categoryId = searchParams.get('category');
    
    if (soundId || breakId) {
      // Find the activity
      for (const cat of BREAK_CATEGORIES) {
        const activity = cat.activities.find(a => a.id === (soundId || breakId));
        if (activity) {
          setSelectedCategory(cat.id);
          // Small delay to let the UI render
          setTimeout(() => {
            setActiveBreak({ activity, category: cat });
          }, 100);
          break;
        }
      }
    } else if (categoryId) {
      const cat = BREAK_CATEGORIES.find(c => c.id === categoryId);
      if (cat) {
        setSelectedCategory(categoryId);
      }
    }
  }, [searchParams]);

  // Load break history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBreakHistory(JSON.parse(saved));
      } catch (e) {}
    }
    
    // Cleanup sounds on unmount
    return () => stopAllSounds();
  }, []);

  // Save break to history
  const saveBreakToHistory = (activity, category) => {
    const entry = {
      id: Date.now(),
      activity: activity.name,
      category: category.name,
      emoji: activity.emoji,
      duration: activity.duration,
      completedAt: new Date().toISOString(),
    };
    const newHistory = [entry, ...breakHistory].slice(0, 50);
    setBreakHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Start a break
  const startBreak = (activity, category) => {
    setActiveBreak({ activity, category });
  };

  // Complete a break
  const completeBreak = () => {
    if (activeBreak) {
      saveBreakToHistory(activeBreak.activity, activeBreak.category);
      toast.success(`Great job completing ${activeBreak.activity.name}! 🌟`);
    }
    setActiveBreak(null);
  };

  // Cancel a break
  const cancelBreak = () => {
    setActiveBreak(null);
  };

  // Open schedule modal
  const openScheduleModal = (activity, category) => {
    setActivityToSchedule(activity);
    setCategoryForSchedule(category);
    setShowScheduleModal(true);
  };

  // Add to visual schedule
  const handleAddToSchedule = ({ activity, category, date, time, reminder }) => {
    // Create schedule entry with deep link
    const deepLink = activity.isSound 
      ? `/wellness/sensory-breaks?sound=${activity.id}`
      : `/wellness/sensory-breaks?break=${activity.id}`;
    
    const scheduleEntry = {
      id: `sensory-${Date.now()}`,
      title: `${activity.isSound ? '🎵' : '🧘'} ${activity.name}`,
      time: time,
      duration: activity.duration,
      type: 'sensory-break',
      source: SCHEDULE_SOURCES.SENSORY_BREAK,
      color: category.color,
      emoji: activity.emoji,
      completed: false,
      reminder: reminder,
      deepLink: deepLink,
      metadata: {
        activityId: activity.id,
        categoryId: category.id,
        isSound: activity.isSound,
        synth: activity.synth,
      },
    };
    
    const success = addActivityToSchedule(date, scheduleEntry);
    
    if (success) {
      toast.success(`${activity.name} added to schedule for ${formatTimeDisplay(time)}!`);
      setShowScheduleModal(false);
      setActivityToSchedule(null);
      setCategoryForSchedule(null);
    } else {
      toast.error('Failed to add to schedule');
    }
  };

  // Get current category
  const currentCategory = selectedCategory 
    ? BREAK_CATEGORIES.find(c => c.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#20B2AA]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedCategory) {
                setSelectedCategory(null);
              } else {
                navigate('/wellness');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#20B2AA] 
                       rounded-xl font-display font-bold text-[#20B2AA] hover:bg-[#20B2AA] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#20B2AA] crayon-text">
              🧘 Sensory Breaks
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!selectedCategory ? (
          <>
            {/* Category Selection */}
            <p className="text-center font-crayon text-gray-600 mb-6">
              What kind of break do you need?
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {BREAK_CATEGORIES.map((cat, index) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-4 rounded-2xl border-4 text-center transition-all duration-200 shadow-crayon
                           hover:scale-105 hover:-rotate-1 active:scale-95"
                  style={{
                    backgroundColor: cat.color + '20',
                    borderColor: cat.color,
                    borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                    style={{ border: `2px solid ${cat.color}` }}
                  >
                    <span className="text-3xl">{cat.emoji}</span>
                  </div>
                  <h3 className="font-display text-gray-800 text-sm leading-tight">{cat.name}</h3>
                  <p className="font-crayon text-xs text-gray-500 mt-1">{cat.description}</p>
                </button>
              ))}
            </div>

            {/* Recent History */}
            {breakHistory.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
                  <History size={20} />
                  Recent Breaks
                </h2>
                <div className="space-y-2">
                  {breakHistory.slice(0, 5).map(entry => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div className="flex-1">
                        <p className="font-crayon text-gray-800">{entry.activity}</p>
                        <p className="font-crayon text-xs text-gray-500">{entry.category}</p>
                      </div>
                      <p className="font-crayon text-xs text-gray-400">
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Activities List */}
            <div 
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: currentCategory.color + '15' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{currentCategory.emoji}</span>
                <div>
                  <h2 className="font-display text-xl" style={{ color: currentCategory.color }}>
                    {currentCategory.name} Breaks
                  </h2>
                  <p className="font-crayon text-gray-600">{currentCategory.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {currentCategory.activities.map(activity => (
                  <div 
                    key={activity.id}
                    className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activity.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-display text-gray-800">{activity.name}</h3>
                        <p className="font-crayon text-sm text-gray-500">{activity.description}</p>
                        <p className="font-crayon text-xs text-gray-400 mt-1">
                          <Clock size={12} className="inline mr-1" />
                          {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')} min
                          {activity.isSound && <span className="ml-2">🔊 With sound</span>}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => startBreak(activity, currentCategory)}
                          className="p-2 rounded-full hover:scale-110 transition-all"
                          style={{ backgroundColor: currentCategory.color }}
                          title="Start now"
                        >
                          <Play size={20} className="text-white" />
                        </button>
                        <button
                          onClick={() => openScheduleModal(activity, currentCategory)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 hover:scale-110 transition-all"
                          title="Schedule for later"
                        >
                          <CalendarPlus size={20} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Active Break Timer */}
      {activeBreak && (
        <ActiveBreakTimer
          activity={activeBreak.activity}
          category={activeBreak.category}
          onComplete={completeBreak}
          onCancel={cancelBreak}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && activityToSchedule && categoryForSchedule && (
        <AddToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setActivityToSchedule(null);
            setCategoryForSchedule(null);
          }}
          activity={activityToSchedule}
          category={categoryForSchedule}
          onAdd={handleAddToSchedule}
        />
      )}
    </div>
  );
};

export default SensoryBreaks;
