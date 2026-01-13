// OTExercises.jsx - Occupational Therapy exercises and stretches
// Age-appropriate exercises for different muscle groups and disabilities

import { useState } from 'react';
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
  Filter
} from 'lucide-react';

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
      'Stand with arms out to sides',
      'Make small circles forward',
      'Make circles bigger',
      'Then reverse direction',
      'Let arms rest at sides'
    ],
    benefits: 'Warms up shoulders and improves range of motion',
    tip: 'Pretend you are drawing circles in the air!',
  },
  {
    id: 'wall-pushups',
    name: 'Wall Push-Ups',
    muscleGroup: 'arms',
    emoji: '🧱',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 90,
    reps: '10 push-ups',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Stand arm length from wall',
      'Put hands flat on wall',
      'Bend elbows and lean toward wall',
      'Push back to start',
      'Keep body straight'
    ],
    benefits: 'Builds upper body and core strength',
    tip: 'Step further from wall to make it harder',
  },
  {
    id: 'shoulder-shrugs',
    name: 'Shoulder Shrugs',
    muscleGroup: 'arms',
    emoji: '🤷',
    ages: ['toddler', 'preschool', 'early-school', 'school-age', 'teen'],
    duration: 30,
    reps: '10 shrugs',
    disabilities: ['autism', 'adhd', 'hypotonia'],
    instructions: [
      'Stand or sit up tall',
      'Lift shoulders up to ears',
      'Hold for 3 seconds',
      'Drop shoulders down',
      'Repeat'
    ],
    benefits: 'Releases tension and increases body awareness',
    tip: 'Squeeze shoulders up tight like a turtle hiding!',
  },
  {
    id: 'arm-stretches',
    name: 'Cross-Body Arm Stretch',
    muscleGroup: 'arms',
    emoji: '💪',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '15 seconds each arm',
    disabilities: ['coordination', 'cerebral-palsy'],
    instructions: [
      'Bring right arm across chest',
      'Use left hand to gently pull',
      'Hold for 15 seconds',
      'Switch arms',
      'Breathe deeply'
    ],
    benefits: 'Stretches shoulder muscles and improves flexibility',
    tip: 'Don\'t bounce - hold the stretch steady',
  },

  // CORE & TRUNK
  {
    id: 'superman',
    name: 'Superman Pose',
    muscleGroup: 'core',
    emoji: '🦸',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 holds of 10 seconds',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Lie on tummy',
      'Stretch arms out in front',
      'Lift arms, chest, and legs off floor',
      'Hold like Superman flying!',
      'Lower and rest'
    ],
    benefits: 'Strengthens back and core muscles',
    tip: 'Make a swooshing sound like flying!',
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'core',
    emoji: '🐛',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 90,
    reps: '10 times each side',
    disabilities: ['coordination', 'hypotonia'],
    instructions: [
      'Lie on back',
      'Raise arms and legs to ceiling',
      'Slowly lower right arm and left leg',
      'Return to start',
      'Switch sides'
    ],
    benefits: 'Builds core strength and coordination',
    tip: 'Keep your back flat on the floor!',
  },
  {
    id: 'seated-twist',
    name: 'Seated Twist',
    muscleGroup: 'core',
    emoji: '🔄',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '10 twists each side',
    disabilities: ['autism', 'adhd'],
    instructions: [
      'Sit cross-legged',
      'Put hands on shoulders',
      'Twist body to look behind you',
      'Come back to center',
      'Twist the other way'
    ],
    benefits: 'Stretches spine and improves trunk rotation',
    tip: 'Move slowly and smoothly',
  },
  {
    id: 'bridge',
    name: 'Bridge Pose',
    muscleGroup: 'core',
    emoji: '🌉',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 holds of 10 seconds',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Lie on back with knees bent',
      'Feet flat on floor',
      'Push hips up toward ceiling',
      'Make a bridge with your body',
      'Hold, then lower down'
    ],
    benefits: 'Strengthens glutes and core',
    tip: 'Squeeze your bottom at the top!',
  },

  // LEGS & FEET
  {
    id: 'heel-walks',
    name: 'Heel Walking',
    muscleGroup: 'legs',
    emoji: '🚶',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '20 steps',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Stand up tall',
      'Lift toes off the ground',
      'Walk on just your heels',
      'Take 20 steps forward',
      'Then walk back normally'
    ],
    benefits: 'Strengthens shins and improves balance',
    tip: 'Keep your arms out for balance!',
  },
  {
    id: 'toe-walks',
    name: 'Tip-Toe Walking',
    muscleGroup: 'legs',
    emoji: '🩰',
    ages: ['toddler', 'preschool', 'early-school', 'school-age'],
    duration: 60,
    reps: '20 steps',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Stand up tall',
      'Rise up on your tip-toes',
      'Walk forward on tip-toes',
      'Take 20 steps',
      'Lower heels and rest'
    ],
    benefits: 'Strengthens calves and improves balance',
    tip: 'Pretend you are a ballerina!',
  },
  {
    id: 'squats',
    name: 'Frog Squats',
    muscleGroup: 'legs',
    emoji: '🐸',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '10 squats',
    disabilities: ['hypotonia', 'coordination', 'adhd'],
    instructions: [
      'Stand with feet apart',
      'Bend knees and squat down',
      'Touch the floor like a frog',
      'Jump up (or stand up)',
      'Land softly and repeat'
    ],
    benefits: 'Strengthens leg muscles',
    tip: 'Ribbit like a frog when you jump!',
  },
  {
    id: 'calf-stretch',
    name: 'Calf Stretch',
    muscleGroup: 'legs',
    emoji: '🦵',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '15 seconds each leg',
    disabilities: ['cerebral-palsy', 'coordination'],
    instructions: [
      'Face a wall, hands on wall',
      'Step one foot back',
      'Keep back heel on floor',
      'Lean forward until you feel stretch',
      'Switch legs'
    ],
    benefits: 'Stretches calf muscles and Achilles tendon',
    tip: 'Don\'t let your back heel lift up!',
  },

  // HEAD & NECK
  {
    id: 'neck-rolls',
    name: 'Gentle Neck Rolls',
    muscleGroup: 'neck',
    emoji: '😌',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '5 rolls each direction',
    disabilities: ['autism', 'adhd'],
    instructions: [
      'Sit up tall',
      'Drop chin to chest',
      'Slowly roll head to right',
      'Continue rolling back and to left',
      'Return to start, reverse direction'
    ],
    benefits: 'Releases neck tension',
    tip: 'Move slowly and gently - never force it',
  },
  {
    id: 'chin-tucks',
    name: 'Chin Tucks',
    muscleGroup: 'neck',
    emoji: '🐢',
    ages: ['early-school', 'school-age', 'teen'],
    duration: 45,
    reps: '10 tucks',
    disabilities: ['hypotonia', 'coordination'],
    instructions: [
      'Sit or stand tall',
      'Look straight ahead',
      'Pull chin back (make a double chin)',
      'Hold for 5 seconds',
      'Release and repeat'
    ],
    benefits: 'Strengthens neck muscles and improves posture',
    tip: 'Pretend you are a turtle going into your shell!',
  },

  // FULL BODY
  {
    id: 'animal-walks',
    name: 'Animal Walks',
    muscleGroup: 'full-body',
    emoji: '🐻',
    ages: ['toddler', 'preschool', 'early-school', 'school-age'],
    duration: 120,
    reps: '2 minutes',
    disabilities: ['adhd', 'coordination', 'hypotonia', 'autism'],
    instructions: [
      'Bear walk: hands and feet, bottom up',
      'Crab walk: on back, hands and feet',
      'Frog jump: squat and hop',
      'Snake slither: slide on tummy',
      'Do each for 30 seconds!'
    ],
    benefits: 'Full body strengthening and coordination',
    tip: 'Make the animal sounds while moving!',
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    muscleGroup: 'full-body',
    emoji: '⭐',
    ages: ['preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '20 jumps',
    disabilities: ['adhd', 'coordination'],
    instructions: [
      'Stand with feet together',
      'Jump and spread legs wide',
      'At same time, raise arms above head',
      'Jump back to start position',
      'Repeat with rhythm'
    ],
    benefits: 'Cardio and coordination',
    tip: 'Clap your hands at the top!',
  },
  {
    id: 'yoga-child-pose',
    name: 'Child\'s Pose',
    muscleGroup: 'full-body',
    emoji: '🧘',
    ages: ['toddler', 'preschool', 'early-school', 'school-age', 'teen'],
    duration: 60,
    reps: '30-60 seconds',
    disabilities: ['autism', 'adhd', 'cerebral-palsy'],
    instructions: [
      'Kneel on floor',
      'Sit back on heels',
      'Fold forward, forehead to floor',
      'Arms can be forward or by sides',
      'Breathe deeply and relax'
    ],
    benefits: 'Calming and stretches back',
    tip: 'This is a great calming pose anytime!',
  },
  {
    id: 'starfish-stretch',
    name: 'Starfish Stretch',
    muscleGroup: 'full-body',
    emoji: '⭐',
    ages: ['toddler', 'preschool', 'early-school', 'school-age'],
    duration: 45,
    reps: '3 stretches of 10 seconds',
    disabilities: ['autism', 'hypotonia'],
    instructions: [
      'Lie on back',
      'Spread arms and legs wide',
      'Make yourself as big as possible',
      'Stretch every finger and toe',
      'Then curl into a tiny ball'
    ],
    benefits: 'Full body stretch and body awareness',
    tip: 'Go from big starfish to tiny ball!',
  },
];

// ============================================
// COMPONENT
// ============================================
const OTExercises = () => {
  const navigate = useNavigate();
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

  // Timer countdown
  useState(() => {
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
