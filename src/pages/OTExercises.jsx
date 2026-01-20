// OTExercises.jsx - Occupational Therapy exercises and stretches
// UPDATED: Added Visual Schedule integration
// Age-appropriate exercises for different muscle groups and disabilities

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  RotateCcw,
  ChevronRight,
  Clock,
  Star,
  Info,
  Heart,
  Target,
  Users,
  Filter,
  X,
  CalendarPlus,
  Calendar,
  Bell,
  BellOff,
  Check,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';

// ============================================
// AGE RANGES
// ============================================
const AGE_RANGES = [
  { id: 'toddler', label: '2-3 years', emoji: '👶' },
  { id: 'preschool', label: '3-5 years', emoji: '🧒' },
  { id: 'early-school', label: '5-8 years', emoji: '👧' },
  { id: 'school-age', label: '8-12 years', emoji: '🧑' },
  { id: 'teen', label: '12+ years', emoji: '🧑‍🦱' },
];

// ============================================
// MUSCLE GROUPS
// ============================================
const MUSCLE_GROUPS = [
  { id: 'hands', name: 'Hands & Fingers', emoji: '✋', color: '#E86B9A' },
  { id: 'arms', name: 'Arms & Shoulders', emoji: '💪', color: '#4A9FD4' },
  { id: 'core', name: 'Core & Trunk', emoji: '🎯', color: '#F5A623' },
  { id: 'legs', name: 'Legs & Feet', emoji: '🦵', color: '#5CB85C' },
  { id: 'neck', name: 'Head & Neck', emoji: '🙆', color: '#8E6BBF' },
  { id: 'full-body', name: 'Full Body', emoji: '🧘', color: '#E63B2E' },
];

// ============================================
// DISABILITY-SPECIFIC CATEGORIES
// ============================================
const DISABILITY_CATEGORIES = [
  { 
    id: 'autism', 
    name: 'Autism / Sensory',
    emoji: '🧩',
    color: '#4A9FD4',
    description: 'Sensory-friendly exercises with predictable patterns',
    tips: [
      'Use visual schedules for exercise routines',
      'Provide deep pressure before stretches',
      'Keep environment low-stimulation',
      'Use countdown timers for transitions',
      'Allow movement breaks during other activities',
    ],
  },
  { 
    id: 'adhd', 
    name: 'ADHD / Focus',
    emoji: '⚡',
    color: '#F5A623',
    description: 'Movement breaks to support focus and regulation',
    tips: [
      'Short bursts of intense movement help',
      'Heavy work activities improve focus',
      'Movement before seated tasks is beneficial',
      'Variety keeps engagement high',
      'Allow fidgeting during exercises',
    ],
  },
  { 
    id: 'hypotonia', 
    name: 'Low Muscle Tone',
    emoji: '🎈',
    color: '#8E6BBF',
    description: 'Strengthening exercises for low muscle tone',
    tips: [
      'Start with supported positions',
      'Focus on core strengthening',
      'Use resistance gradually',
      'Frequent short sessions work best',
      'Celebrate small improvements',
    ],
  },
  { 
    id: 'fine-motor', 
    name: 'Fine Motor Delays',
    emoji: '✏️',
    color: '#E86B9A',
    description: 'Hand and finger exercises for motor skills',
    tips: [
      'Warm up hands before fine motor tasks',
      'Use playdough for strengthening',
      'Practice with different textures',
      'Break tasks into small steps',
      'Make it fun with games',
    ],
  },
  { 
    id: 'coordination', 
    name: 'Coordination / DCD',
    emoji: '🎯',
    color: '#5CB85C',
    description: 'Exercises to improve coordination and balance',
    tips: [
      'Practice bilateral movements',
      'Use visual targets',
      'Start slow and build speed',
      'Obstacle courses are great',
      'Focus on process, not perfection',
    ],
  },
  { 
    id: 'cerebral-palsy', 
    name: 'Cerebral Palsy',
    emoji: '💜',
    color: '#9B59B6',
    description: 'Gentle stretches and range of motion exercises',
    tips: [
      'Always consult with PT/OT first',
      'Gentle passive stretching helps',
      'Focus on range of motion',
      'Positioning is key',
      'Water therapy can be beneficial',
    ],
  },
];

// ============================================
// EXERCISES DATABASE
// ============================================
const EXERCISES = [
  // HANDS & FINGERS
  {
    id: 'finger-spread',
    name: 'Finger Spreads',
    muscleGroup: 'hands',
    emoji: '🖐️',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '10 times',
    disabilities: ['fine-motor', 'autism'],
    instructions: [
      'Make a tight fist',
      'Open hand wide, spreading fingers apart',
      'Hold for 3 seconds',
      'Make a fist again',
      'Repeat'
    ],
    benefits: 'Strengthens hand muscles and improves finger dexterity',
    tip: 'Pretend your fingers are a starfish!',
  },
  {
    id: 'playdough-squeeze',
    name: 'Playdough Squeeze',
    muscleGroup: 'hands',
    emoji: '🎨',
    ages: ['toddler', 'preschool', 'early-school'],
    duration: 120,
    reps: '2 minutes',
    disabilities: ['fine-motor', 'hypotonia', 'adhd'],
    instructions: [
      'Roll playdough into a ball',
      'Squeeze it with your whole hand',
      'Poke it with each finger',
      'Roll it into a snake',
      'Squish it flat with your palm'
    ],
    benefits: 'Builds hand strength and provides sensory input',
    tip: 'Use warm playdough for extra calming effect',
  },
  {
    id: 'finger-touches',
    name: 'Finger to Thumb Touches',
    muscleGroup: 'hands',
    emoji: '👌',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 times each hand',
    disabilities: ['fine-motor', 'coordination'],
    instructions: [
      'Touch thumb to pointer finger',
      'Then thumb to middle finger',
      'Then thumb to ring finger',
      'Then thumb to pinky',
      'Go back the other way'
    ],
    benefits: 'Improves fine motor control and coordination',
    tip: 'Try with eyes closed for an extra challenge!',
  },
  {
    id: 'wrist-circles',
    name: 'Wrist Circles',
    muscleGroup: 'hands',
    emoji: '🔄',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 45,
    reps: '10 circles each direction',
    disabilities: ['fine-motor', 'coordination'],
    instructions: [
      'Hold arm out straight',
      'Make a fist',
      'Slowly rotate wrist in circles',
      'Do 10 circles one way',
      'Then 10 circles the other way'
    ],
    benefits: 'Loosens wrist joints and improves writing endurance',
    tip: 'Great warm-up before writing or drawing!',
  },

  // ARMS & SHOULDERS
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    muscleGroup: 'arms',
    emoji: '⭕',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '10 circles each direction',
    disabilities: ['coordination', 'hypotonia', 'adhd'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Stretch arms out to the sides',
      'Make small circles forward',
      'Gradually make bigger circles',
      'Switch to backward circles'
    ],
    benefits: 'Improves shoulder mobility and body awareness',
    tip: 'Pretend you\'re drawing circles in the air!',
  },
  {
    id: 'wall-push-ups',
    name: 'Wall Push-Ups',
    muscleGroup: 'arms',
    emoji: '🧱',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 90,
    reps: '10 push-ups',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Stand facing a wall, arm\'s length away',
      'Place hands flat on wall, shoulder height',
      'Bend elbows and lean toward wall',
      'Push back to starting position',
      'Keep body straight like a plank'
    ],
    benefits: 'Builds arm and core strength safely',
    tip: 'Count out loud as you push!',
  },
  {
    id: 'shoulder-shrugs',
    name: 'Shoulder Shrugs',
    muscleGroup: 'arms',
    emoji: '🤷',
    ages: ['toddler', 'preschool', 'early-school', 'school-age', 'teen'],
    duration: 45,
    reps: '10 shrugs',
    disabilities: ['autism', 'adhd', 'hypotonia'],
    instructions: [
      'Let arms hang relaxed at sides',
      'Lift shoulders up toward ears',
      'Hold for 3 seconds',
      'Drop shoulders down',
      'Repeat slowly'
    ],
    benefits: 'Releases tension and improves body awareness',
    tip: 'Pretend you\'re saying "I don\'t know!"',
  },

  // CORE & TRUNK
  {
    id: 'superman',
    name: 'Superman Pose',
    muscleGroup: 'core',
    emoji: '🦸',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 holds, 5 seconds each',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Lie on tummy with arms stretched forward',
      'Lift arms and legs off the ground',
      'Hold like Superman flying',
      'Lower down slowly',
      'Rest and repeat'
    ],
    benefits: 'Strengthens back muscles and core',
    tip: 'Imagine you\'re flying through the clouds!',
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'core',
    emoji: '🪲',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 90,
    reps: '10 times each side',
    disabilities: ['coordination', 'hypotonia'],
    instructions: [
      'Lie on back with arms up and knees bent',
      'Lower right arm and left leg toward floor',
      'Keep back flat on floor',
      'Return to start',
      'Switch to left arm and right leg'
    ],
    benefits: 'Builds core stability and coordination',
    tip: 'Move slowly like a sleepy bug!',
  },
  {
    id: 'bridge',
    name: 'Bridge Pose',
    muscleGroup: 'core',
    emoji: '🌉',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 holds, 10 seconds each',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Lie on back with knees bent, feet flat',
      'Push through feet to lift hips up',
      'Make a bridge with your body',
      'Hold and squeeze your bottom',
      'Lower down slowly'
    ],
    benefits: 'Strengthens core, glutes, and back',
    tip: 'Drive a toy car under your bridge!',
  },

  // LEGS & FEET
  {
    id: 'toe-walking',
    name: 'Tip-Toe Walking',
    muscleGroup: 'legs',
    emoji: '🩰',
    ages: ['toddler', 'preschool', 'early-school', 'school-age'],
    duration: 60,
    reps: '20 steps',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Stand tall with good posture',
      'Rise up onto tip-toes',
      'Walk forward on tip-toes',
      'Keep balance and don\'t wobble',
      'Walk back to start'
    ],
    benefits: 'Strengthens calf muscles and improves balance',
    tip: 'Pretend you\'re a ballerina or sneaking quietly!',
  },
  {
    id: 'heel-walking',
    name: 'Heel Walking',
    muscleGroup: 'legs',
    emoji: '🦶',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '20 steps',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Stand with feet flat',
      'Lift toes up, balancing on heels',
      'Walk forward on heels only',
      'Keep arms out for balance',
      'Walk back to start'
    ],
    benefits: 'Strengthens shin muscles and improves balance',
    tip: 'It\'s tricky! Go slowly at first.',
  },
  {
    id: 'single-leg-stand',
    name: 'Flamingo Stand',
    muscleGroup: 'legs',
    emoji: '🦩',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '30 seconds each leg',
    disabilities: ['coordination', 'hypotonia', 'autism'],
    instructions: [
      'Stand on one foot',
      'Hold arms out for balance',
      'Try not to wobble',
      'Count to 30',
      'Switch legs'
    ],
    benefits: 'Improves balance and leg strength',
    tip: 'Stand near a wall if you need help!',
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    muscleGroup: 'legs',
    emoji: '⭐',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '20 jumps',
    disabilities: ['adhd', 'coordination'],
    instructions: [
      'Stand with feet together, arms at sides',
      'Jump and spread legs apart',
      'At same time, raise arms overhead',
      'Jump back to start',
      'Repeat in rhythm'
    ],
    benefits: 'Gets blood flowing and improves coordination',
    tip: 'Great for when you need to wake up your body!',
  },

  // HEAD & NECK
  {
    id: 'neck-rolls',
    name: 'Gentle Neck Rolls',
    muscleGroup: 'neck',
    emoji: '😌',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 circles each direction',
    disabilities: ['autism', 'adhd'],
    instructions: [
      'Sit or stand with good posture',
      'Drop chin to chest',
      'Slowly roll head to one side',
      'Continue rolling in a circle',
      'Reverse direction'
    ],
    benefits: 'Releases neck tension and improves mobility',
    tip: 'Move very slowly and stop if anything hurts',
  },
  {
    id: 'chin-tucks',
    name: 'Chin Tucks',
    muscleGroup: 'neck',
    emoji: '🐢',
    ages: ['school-age', 'teen'],
    duration: 45,
    reps: '10 tucks',
    disabilities: ['autism'],
    instructions: [
      'Sit tall with shoulders back',
      'Pull chin straight back (make a double chin)',
      'Hold for 5 seconds',
      'Return to normal',
      'Repeat'
    ],
    benefits: 'Strengthens neck and improves posture',
    tip: 'Pretend you\'re a turtle pulling into your shell!',
  },

  // FULL BODY
  {
    id: 'animal-walks',
    name: 'Animal Walks',
    muscleGroup: 'full-body',
    emoji: '🐻',
    ages: ['toddler', 'preschool', 'early-school', 'school-age'],
    duration: 180,
    reps: '3 minutes of different animals',
    disabilities: ['coordination', 'hypotonia', 'adhd', 'autism'],
    instructions: [
      'Bear Walk: hands and feet, bottom up',
      'Crab Walk: hands and feet, tummy up',
      'Frog Jumps: squat and jump forward',
      'Snake Slither: army crawl on tummy',
      'Penguin Walk: waddle with feet together'
    ],
    benefits: 'Full body workout that\'s fun and engaging',
    tip: 'Make animal sounds while you move!',
  },
  {
    id: 'starfish-stretch',
    name: 'Starfish Stretch',
    muscleGroup: 'full-body',
    emoji: '⭐',
    ages: ['toddler', 'preschool', 'early-school', 'school-age', 'teen'],
    duration: 45,
    reps: '5 holds, 10 seconds each',
    disabilities: ['autism', 'adhd', 'hypotonia'],
    instructions: [
      'Stand with feet wide apart',
      'Stretch arms out wide',
      'Spread fingers wide',
      'Stretch as big as you can',
      'Hold and breathe'
    ],
    benefits: 'Full body stretch and body awareness',
    tip: 'Try to take up as much space as possible!',
  },
  {
    id: 'wheelbarrow-walk',
    name: 'Wheelbarrow Walk',
    muscleGroup: 'full-body',
    emoji: '🛒',
    ages: ['preschool', 'early-school', 'school-age'],
    duration: 60,
    reps: '10 steps',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Child gets in push-up position',
      'Adult holds child\'s ankles or thighs',
      'Child walks forward on hands',
      'Keep body straight',
      'Walk 10 steps then rest'
    ],
    benefits: 'Builds upper body and core strength',
    tip: 'Start by holding higher on the legs for easier support',
  },
  {
    id: 'yoga-cat-cow',
    name: 'Cat-Cow Stretch',
    muscleGroup: 'full-body',
    emoji: '🐱',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '10 cycles',
    disabilities: ['autism', 'adhd', 'hypotonia'],
    instructions: [
      'Get on hands and knees',
      'Cow: drop tummy down, look up',
      'Cat: round back up, tuck chin',
      'Move slowly between poses',
      'Breathe in for cow, out for cat'
    ],
    benefits: 'Improves spine flexibility and body awareness',
    tip: 'Make "moo" and "meow" sounds!',
  },
  {
    id: 'balloon-breathing',
    name: 'Balloon Breathing',
    muscleGroup: 'full-body',
    emoji: '🎈',
    ages: ['toddler', 'preschool', 'early-school', 'school-age', 'teen'],
    duration: 120,
    reps: '5 breaths',
    disabilities: ['autism', 'adhd'],
    instructions: [
      'Stand or sit comfortably',
      'Put hands on tummy',
      'Breathe in deep - fill your balloon',
      'Feel tummy expand like a balloon',
      'Slowly let air out - deflate balloon'
    ],
    benefits: 'Calms the body and teaches deep breathing',
    tip: 'Great for when feeling overwhelmed!',
  },
];

// =====================================================
// ADD EXERCISE TO SCHEDULE MODAL
// =====================================================
const AddExerciseToScheduleModal = ({ isOpen, onClose, exercise, muscleGroup, onAdd }) => {
  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [enableReminder, setEnableReminder] = useState(true);
  const [repeatDays, setRepeatDays] = useState(1); // How many days to add

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(getLocalToday());
      setSelectedTime('10:00');
      setEnableReminder(true);
      setRepeatDays(1);
    }
  }, [isOpen]);

  if (!isOpen || !exercise) return null;

  const handleAdd = () => {
    onAdd({
      exercise,
      muscleGroup,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
      repeatDays,
    });
  };

  const themeColor = muscleGroup?.color || '#E86B9A';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-white p-4 flex items-center gap-3" style={{ backgroundColor: themeColor }}>
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Exercise</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Exercise Preview */}
          <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
            <span className="text-3xl">{exercise.emoji}</span>
            <div className="flex-1">
              <p className="font-display text-gray-800">{exercise.name}</p>
              <p className="font-crayon text-sm text-gray-500">
                {muscleGroup?.emoji} {muscleGroup?.name} • {exercise.reps}
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Calendar size={16} className="inline mr-1" />
              When?
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getLocalToday()}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              {formatDateDisplay(selectedDate)}
            </p>
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
              {formatTimeDisplay(selectedTime)}
            </p>
          </div>

          {/* Repeat Days */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              Add to schedule for how many days?
            </label>
            <div className="flex gap-2">
              {[1, 3, 5, 7].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setRepeatDays(days)}
                  className={`flex-1 py-2 rounded-xl font-crayon text-sm transition-all
                    ${repeatDays === days 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-600'}`}
                  style={{ backgroundColor: repeatDays === days ? themeColor : undefined }}
                >
                  {days === 1 ? 'Just today' : `${days} days`}
                </button>
              ))}
            </div>
            {repeatDays > 1 && (
              <p className="font-crayon text-xs text-gray-400 mt-2">
                Will be added to {repeatDays} consecutive days starting {formatDateDisplay(selectedDate)}
              </p>
            )}
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder 
                ? 'border-current' 
                : 'bg-gray-50 border-gray-200'}`}
            style={{ 
              backgroundColor: enableReminder ? `${themeColor}20` : undefined,
              borderColor: enableReminder ? themeColor : undefined 
            }}
          >
            <div className={`p-2 rounded-full ${enableReminder ? '' : 'bg-gray-300'}`}
              style={{ backgroundColor: enableReminder ? themeColor : undefined }}>
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminders enabled' : 'No reminders'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 text-white rounded-xl font-crayon flex items-center justify-center gap-2"
            style={{ backgroundColor: themeColor }}
          >
            <Check size={20} />
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const OTExercises = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [view, setView] = useState('categories'); // categories, muscle, disability, exercise
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedDisability, setSelectedDisability] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snw_ot_favorites')) || [];
    } catch {
      return [];
    }
  });
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Filter exercises
  const getFilteredExercises = () => {
    let filtered = EXERCISES;
    
    if (selectedMuscle) {
      filtered = filtered.filter(e => e.muscleGroup === selectedMuscle);
    }
    
    if (selectedDisability) {
      filtered = filtered.filter(e => e.disabilities.includes(selectedDisability));
    }
    
    if (selectedAge) {
      filtered = filtered.filter(e => e.ages.includes(selectedAge));
    }
    
    return filtered;
  };

  // Toggle favorite
  const toggleFavorite = (exerciseId) => {
    const newFavorites = favorites.includes(exerciseId)
      ? favorites.filter(id => id !== exerciseId)
      : [...favorites, exerciseId];
    setFavorites(newFavorites);
    localStorage.setItem('snw_ot_favorites', JSON.stringify(newFavorites));
  };

  // Timer controls
  const startTimer = (duration) => {
    setTimerSeconds(duration);
    setIsTimerActive(true);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerSeconds(selectedExercise?.duration || 0);
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
      // Could add celebration here
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle add to schedule - with try/catch error handling
  const handleAddToSchedule = ({ exercise, muscleGroup, date, time, reminder, repeatDays }) => {
    try {
      let successCount = 0;
      let errorMsg = null;

      // Add for each day requested
      for (let i = 0; i < repeatDays; i++) {
        const targetDate = new Date(date);
        targetDate.setDate(targetDate.getDate() + i);
        const dateStr = targetDate.toISOString().split('T')[0];

        const result = addActivityToSchedule({
          date: dateStr,
          name: `${exercise.emoji} ${exercise.name}`,
          time: time,
          emoji: exercise.emoji,
          color: SOURCE_COLORS?.[SCHEDULE_SOURCES?.OT_EXERCISE] || muscleGroup?.color || '#E86B9A',
          source: SCHEDULE_SOURCES?.OT_EXERCISE || 'ot_exercise',
          notify: reminder,
          metadata: {
            exerciseId: exercise.id,
            muscleGroup: muscleGroup?.id,
            duration: exercise.duration,
            reps: exercise.reps,
          },
        });

        if (result && result.success) {
          successCount++;
        } else {
          errorMsg = result?.error || 'Could not add to schedule.';
        }
      }

      setShowScheduleModal(false);

      if (successCount > 0) {
        if (repeatDays === 1) {
          toast.schedule(
            'Exercise Scheduled!',
            `"${exercise.name}" added to ${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
          );
        } else {
          toast.schedule(
            'Exercises Scheduled!',
            `"${exercise.name}" added for ${successCount} days starting ${formatDateDisplay(date)}`
          );
        }
      } else {
        toast.error('Oops!', errorMsg || 'Could not add to schedule. Please try again.');
      }
    } catch (error) {
      console.error('Error adding exercise to schedule:', error);
      toast.error('Oops!', 'Something went wrong. Please try again.');
      setShowScheduleModal(false);
    }
  };

  // ============================================
  // EXERCISE DETAIL VIEW
  // ============================================
  if (selectedExercise) {
    const isFavorite = favorites.includes(selectedExercise.id);
    const muscleGroup = MUSCLE_GROUPS.find(m => m.id === selectedExercise.muscleGroup);

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" 
          style={{ borderColor: muscleGroup?.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedExercise(null)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl 
                       font-display font-bold transition-all shadow-md hover:scale-105"
              style={{ borderColor: muscleGroup?.color, color: muscleGroup?.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display truncate" style={{ color: muscleGroup?.color }}>
                {selectedExercise.emoji} {selectedExercise.name}
              </h1>
            </div>
            <button
              onClick={() => toggleFavorite(selectedExercise.id)}
              className="p-2"
            >
              <Star 
                size={24} 
                className={isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
              />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Timer Card */}
          <div className="bg-white rounded-2xl border-4 p-6 mb-6 shadow-crayon text-center"
            style={{ borderColor: muscleGroup?.color }}>
            <div className="text-6xl mb-4">{selectedExercise.emoji}</div>
            
            <div className="text-5xl font-display mb-2" style={{ color: muscleGroup?.color }}>
              {formatTime(timerSeconds)}
            </div>
            
            <p className="font-crayon text-gray-500 mb-4">{selectedExercise.reps}</p>
            
            <div className="flex justify-center gap-3">
              {!isTimerActive ? (
                <button
                  onClick={() => startTimer(selectedExercise.duration)}
                  className="px-6 py-3 text-white rounded-xl font-crayon flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ backgroundColor: muscleGroup?.color }}
                >
                  <Play size={20} />
                  Start Timer
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsTimerActive(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon flex items-center gap-2"
                  >
                    <Pause size={20} />
                    Pause
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-6 py-3 bg-orange-100 text-orange-600 rounded-xl font-crayon flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Add to Schedule Button */}
          <button
            onClick={() => setShowScheduleModal(true)}
            className="w-full mb-4 py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all hover:bg-opacity-10"
            style={{ 
              borderColor: muscleGroup?.color, 
              color: muscleGroup?.color,
              backgroundColor: `${muscleGroup?.color}10`
            }}
          >
            <CalendarPlus size={20} />
            <span className="font-crayon">Add to Visual Schedule</span>
          </button>

          {/* Instructions */}
          <div className="bg-white rounded-2xl border-3 border-gray-200 p-4 mb-4">
            <h3 className="font-display text-gray-800 mb-3 flex items-center gap-2">
              <Target size={18} style={{ color: muscleGroup?.color }} />
              How To Do It
            </h3>
            <ol className="space-y-2">
              {selectedExercise.instructions.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-display flex-shrink-0"
                    style={{ backgroundColor: muscleGroup?.color }}
                  >
                    {index + 1}
                  </span>
                  <span className="font-crayon text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 rounded-2xl border-3 border-green-200 p-4 mb-4">
            <h3 className="font-display text-green-700 mb-2 flex items-center gap-2">
              <Heart size={18} />
              Benefits
            </h3>
            <p className="font-crayon text-green-600">{selectedExercise.benefits}</p>
          </div>

          {/* Tip */}
          <div className="bg-yellow-50 rounded-2xl border-3 border-yellow-200 p-4">
            <h3 className="font-display text-yellow-700 mb-2 flex items-center gap-2">
              <Info size={18} />
              Helpful Tip
            </h3>
            <p className="font-crayon text-yellow-600">{selectedExercise.tip}</p>
          </div>

          {/* Age/Disability tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-crayon text-gray-600 flex items-center gap-1">
              <Clock size={12} />
              {Math.ceil(selectedExercise.duration / 60)} min
            </span>
            {selectedExercise.ages.map(age => {
              const ageInfo = AGE_RANGES.find(a => a.id === age);
              return (
                <span key={age} className="px-3 py-1 bg-blue-100 rounded-full text-xs font-crayon text-blue-600">
                  {ageInfo?.emoji} {ageInfo?.label}
                </span>
              );
            })}
          </div>
        </main>

        {/* Schedule Modal */}
        <AddExerciseToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          exercise={selectedExercise}
          muscleGroup={muscleGroup}
          onAdd={handleAddToSchedule}
        />
      </div>
    );
  }

  // ============================================
  // DISABILITY INFO VIEW
  // ============================================
  if (selectedDisability && view === 'disability') {
    const disability = DISABILITY_CATEGORIES.find(d => d.id === selectedDisability);
    const exercises = getFilteredExercises();

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
          style={{ borderColor: disability?.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedDisability(null);
                setView('categories');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl 
                       font-display font-bold transition-all shadow-md"
              style={{ borderColor: disability?.color, color: disability?.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-lg font-display" style={{ color: disability?.color }}>
              {disability?.emoji} {disability?.name}
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Info Card */}
          <div className="bg-white rounded-2xl border-4 p-4 mb-6 shadow-crayon"
            style={{ borderColor: disability?.color }}>
            <p className="font-crayon text-gray-700 mb-4">{disability?.description}</p>
            
            <h3 className="font-display text-gray-800 mb-2 flex items-center gap-2">
              <Info size={18} style={{ color: disability?.color }} />
              Best Practices
            </h3>
            <ul className="space-y-2">
              {disability?.tips.map((tip, i) => (
                <li key={i} className="font-crayon text-sm text-gray-600 flex items-start gap-2">
                  <span style={{ color: disability?.color }}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Age Filter */}
          <div className="mb-4">
            <p className="font-crayon text-sm text-gray-600 mb-2">Filter by age:</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedAge(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-crayon transition-all
                  ${!selectedAge ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All Ages
              </button>
              {AGE_RANGES.map(age => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(selectedAge === age.id ? null : age.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-crayon transition-all
                    ${selectedAge === age.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  {age.emoji} {age.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <h3 className="font-display text-gray-800 mb-3">
            Recommended Exercises ({exercises.length})
          </h3>
          <div className="space-y-3">
            {exercises.map(exercise => {
              const muscle = MUSCLE_GROUPS.find(m => m.id === exercise.muscleGroup);
              return (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full bg-white rounded-xl border-3 border-gray-200 p-4 text-left
                           hover:border-gray-400 transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">{exercise.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-display text-gray-800">{exercise.name}</h4>
                    <p className="font-crayon text-xs text-gray-500 flex items-center gap-2">
                      <span style={{ color: muscle?.color }}>{muscle?.emoji} {muscle?.name}</span>
                      <span>• {exercise.reps}</span>
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // MUSCLE GROUP VIEW
  // ============================================
  if (selectedMuscle && view === 'muscle') {
    const muscle = MUSCLE_GROUPS.find(m => m.id === selectedMuscle);
    const exercises = getFilteredExercises();

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
          style={{ borderColor: muscle?.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedMuscle(null);
                setView('categories');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl 
                       font-display font-bold transition-all shadow-md"
              style={{ borderColor: muscle?.color, color: muscle?.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-lg font-display" style={{ color: muscle?.color }}>
              {muscle?.emoji} {muscle?.name}
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Age Filter */}
          <div className="mb-4">
            <p className="font-crayon text-sm text-gray-600 mb-2">Filter by age:</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedAge(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-crayon transition-all
                  ${!selectedAge ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                style={{ backgroundColor: !selectedAge ? muscle?.color : undefined }}
              >
                All Ages
              </button>
              {AGE_RANGES.map(age => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(selectedAge === age.id ? null : age.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-crayon transition-all
                    ${selectedAge === age.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                  style={{ backgroundColor: selectedAge === age.id ? muscle?.color : undefined }}
                >
                  {age.emoji} {age.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <h3 className="font-display text-gray-800 mb-3">
            {muscle?.name} Exercises ({exercises.length})
          </h3>
          <div className="space-y-3">
            {exercises.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className="w-full bg-white rounded-xl border-3 p-4 text-left transition-all flex items-center gap-3"
                style={{ borderColor: `${muscle?.color}40`, }}
              >
                <span className="text-3xl">{exercise.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-display text-gray-800">{exercise.name}</h4>
                  <p className="font-crayon text-xs text-gray-500">
                    {exercise.reps} • {Math.ceil(exercise.duration / 60)} min
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // MAIN CATEGORIES VIEW
  // ============================================
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#20B2AA]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#20B2AA] 
                     rounded-xl font-display font-bold text-[#20B2AA] hover:bg-[#20B2AA] 
                     hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#20B2AA] crayon-text">
              🧘 OT Exercises
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border-3 border-teal-200 p-4 mb-6">
          <p className="font-crayon text-teal-700 text-center">
            Stretches and exercises designed by occupational therapists. 
            Choose by muscle group or find exercises for specific needs.
          </p>
        </div>

        {/* Schedule Integration Info */}
        <div className="bg-[#E86B9A]/10 rounded-2xl border-3 border-[#E86B9A]/30 p-4 mb-6">
          <div className="flex items-center gap-3">
            <CalendarPlus size={24} className="text-[#E86B9A]" />
            <div>
              <h3 className="font-display text-[#E86B9A]">Visual Schedule Integration</h3>
              <p className="font-crayon text-sm text-gray-600">
                Add exercises to your Visual Schedule with reminders!
              </p>
            </div>
          </div>
        </div>

        {/* Browse by Muscle Group */}
        <h2 className="font-display text-gray-800 mb-3 flex items-center gap-2">
          💪 By Muscle Group
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {MUSCLE_GROUPS.map(muscle => {
            const count = EXERCISES.filter(e => e.muscleGroup === muscle.id).length;
            return (
              <button
                key={muscle.id}
                onClick={() => {
                  setSelectedMuscle(muscle.id);
                  setView('muscle');
                }}
                className="bg-white rounded-xl border-3 p-4 text-left transition-all hover:scale-[1.02]"
                style={{ borderColor: muscle.color }}
              >
                <span className="text-3xl">{muscle.emoji}</span>
                <h3 className="font-display text-gray-800 mt-1">{muscle.name}</h3>
                <p className="font-crayon text-xs text-gray-500">{count} exercises</p>
              </button>
            );
          })}
        </div>

        {/* Browse by Special Need */}
        <h2 className="font-display text-gray-800 mb-3 flex items-center gap-2">
          🧩 By Special Need
        </h2>
        <div className="space-y-3 mb-6">
          {DISABILITY_CATEGORIES.map(disability => {
            const count = EXERCISES.filter(e => e.disabilities.includes(disability.id)).length;
            return (
              <button
                key={disability.id}
                onClick={() => {
                  setSelectedDisability(disability.id);
                  setView('disability');
                }}
                className="w-full bg-white rounded-xl border-3 p-4 text-left transition-all hover:scale-[1.01] flex items-center gap-3"
                style={{ borderColor: `${disability.color}60` }}
              >
                <span className="text-3xl">{disability.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-display text-gray-800">{disability.name}</h3>
                  <p className="font-crayon text-xs text-gray-500">{disability.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg" style={{ color: disability.color }}>
                    {count}
                  </span>
                  <p className="font-crayon text-xs text-gray-400">exercises</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <>
            <h2 className="font-display text-gray-800 mb-3 flex items-center gap-2">
              ⭐ Your Favorites
            </h2>
            <div className="space-y-2 mb-6">
              {favorites.map(favId => {
                const exercise = EXERCISES.find(e => e.id === favId);
                if (!exercise) return null;
                const muscle = MUSCLE_GROUPS.find(m => m.id === exercise.muscleGroup);
                return (
                  <button
                    key={favId}
                    onClick={() => setSelectedExercise(exercise)}
                    className="w-full bg-yellow-50 rounded-xl border-2 border-yellow-200 p-3 text-left flex items-center gap-3"
                  >
                    <span className="text-2xl">{exercise.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-crayon text-gray-800">{exercise.name}</h4>
                      <p className="font-crayon text-xs" style={{ color: muscle?.color }}>
                        {muscle?.emoji} {muscle?.name}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="p-4 bg-orange-50 rounded-2xl border-3 border-orange-200">
          <h3 className="font-display text-orange-700 mb-2 flex items-center gap-2">
            <Info size={18} />
            Important Note
          </h3>
          <p className="font-crayon text-sm text-orange-600">
            These exercises are general guidelines. Always consult with your child's 
            occupational therapist, physical therapist, or doctor before starting 
            any new exercise routine. Stop any exercise that causes pain.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OTExercises;
