// ArticulationStation-v2.jsx - Enhanced articulation practice with professional SLP features
// Inspired by Little Bee Speech's Articulation Station - multi-level practice from isolation to conversation

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Mic, MicOff, Play, Pause, RotateCcw, 
  Check, X, Star, Trophy, ChevronLeft, ChevronRight, Shuffle,
  BarChart2, Settings, BookOpen, MessageCircle, Sparkles,
  RefreshCw, HelpCircle, Target, Zap
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Practice levels from isolation to conversation (like Articulation Station)
const PRACTICE_LEVELS = {
  isolation: { name: 'Isolation', icon: '🎯', description: 'Practice the sound alone' },
  syllables: { name: 'Syllables', icon: '🔤', description: 'Sound in syllable combinations' },
  words: { name: 'Words', icon: '📝', description: 'Sound in single words' },
  phrases: { name: 'Phrases', icon: '💬', description: 'Sound in short phrases' },
  sentences: { name: 'Sentences', icon: '📖', description: 'Sound in full sentences' },
  stories: { name: 'Stories', icon: '📚', description: 'Sound in reading passages' },
  conversation: { name: 'Conversation', icon: '🗣️', description: 'Spontaneous speech practice' },
};

// Comprehensive sound data with multiple levels
const SOUNDS_DATA = {
  s: {
    name: 'S Sound',
    color: '#4A9FD4',
    cue: 'Keep your tongue behind your teeth and blow air like a snake: sssss',
    funnyCharacter: '🐍 Sammy Snake',
    isolation: ['s', 'sss', 'ssssss'],
    syllables: ['sa', 'se', 'si', 'so', 'su', 'as', 'es', 'is', 'os', 'us', 'asa', 'ese', 'isi'],
    words: {
      initial: [
        { word: 'sun', arasaacId: 2802 },
        { word: 'sock', arasaacId: 2795 },
        { word: 'soap', arasaacId: 2794 },
        { word: 'sand', arasaacId: 2736 },
        { word: 'soup', arasaacId: 2799 },
        { word: 'seven', arasaacId: 36591 },
        { word: 'seal', arasaacId: 2744 },
        { word: 'seed', arasaacId: 2745 },
      ],
      medial: [
        { word: 'dinosaur', arasaacId: 2538 },
        { word: 'pencil', arasaacId: 2726 },
        { word: 'basket', arasaacId: 2487 },
        { word: 'baseball', arasaacId: 2486 },
        { word: 'glasses', arasaacId: 2561 },
        { word: 'icing', arasaacId: null },
      ],
      final: [
        { word: 'bus', arasaacId: 2510 },
        { word: 'house', arasaacId: 2563 },
        { word: 'mouse', arasaacId: 2673 },
        { word: 'dress', arasaacId: 2544 },
        { word: 'grass', arasaacId: 2719 },
        { word: 'horse', arasaacId: 2566 },
      ],
    },
    phrases: [
      { leadWords: ['my', 'the', 'a', 'big', 'small'], targetWord: 'sun' },
      { leadWords: ['my', 'the', 'a', 'red', 'blue'], targetWord: 'sock' },
      { leadWords: ['the', 'yummy', 'hot', 'cold'], targetWord: 'soup' },
    ],
    sentences: [
      'The sun is shining in the sky.',
      'I see a silly seal swimming.',
      'Sam has seven socks in his sock drawer.',
      'The soup is super hot, so sip it slowly.',
      'Sally saw a snake slither on the sand.',
    ],
    stories: [
      {
        title: 'Sammy the Seal',
        text: 'Sammy the seal loves to swim in the sea. One sunny day, Sammy saw something special in the sand. It was a seashell! Sammy was so happy. He swam back to show his sister Sue. "What a super seashell!" said Sue. The sun was setting as they swam home together.',
        questions: [
          { q: 'What did Sammy find?', a: 'A seashell' },
          { q: 'Who is Sue?', a: "Sammy's sister" },
          { q: 'What was the weather like?', a: 'Sunny' },
        ],
      },
    ],
    conversation: [
      { type: 'wouldYouRather', prompt: 'Would you rather swim in the sea or play in the sand?' },
      { type: 'haveYouEver', prompt: 'Have you ever seen a seal at the zoo?' },
      { type: 'tellMeAbout', prompt: 'Tell me about something you saw outside today.' },
      { type: 'whatIf', prompt: 'What if you found a secret treasure in the sand?' },
    ],
  },
  r: {
    name: 'R Sound',
    color: '#E63B2E',
    cue: 'Pull your tongue back like a growling lion: rrrr',
    funnyCharacter: '🦁 Roaring Ryan',
    isolation: ['r', 'rrr', 'rrrrrr'],
    syllables: ['ra', 're', 'ri', 'ro', 'ru', 'ar', 'er', 'ir', 'or', 'ur', 'ara', 'ere', 'iri'],
    words: {
      initial: [
        { word: 'rain', arasaacId: 2738 },
        { word: 'rabbit', arasaacId: 2735 },
        { word: 'rainbow', arasaacId: 2739 },
        { word: 'rocket', arasaacId: 2757 },
        { word: 'robot', arasaacId: 2758 },
        { word: 'ring', arasaacId: 2755 },
        { word: 'run', arasaacId: 6002 },
        { word: 'red', arasaacId: 2743 },
      ],
      medial: [
        { word: 'carrot', arasaacId: 2512 },
        { word: 'arrow', arasaacId: null },
        { word: 'mirror', arasaacId: null },
        { word: 'parrot', arasaacId: 2722 },
        { word: 'cereal', arasaacId: 6011 },
      ],
      final: [
        { word: 'car', arasaacId: 2511 },
        { word: 'star', arasaacId: 2800 },
        { word: 'door', arasaacId: 2541 },
        { word: 'floor', arasaacId: null },
        { word: 'dinosaur', arasaacId: 2538 },
        { word: 'guitar', arasaacId: null },
      ],
    },
    phrases: [
      { leadWords: ['my', 'the', 'a', 'red', 'fast'], targetWord: 'rocket' },
      { leadWords: ['the', 'a', 'cute', 'brown'], targetWord: 'rabbit' },
      { leadWords: ['the', 'pretty', 'big', 'bright'], targetWord: 'rainbow' },
    ],
    sentences: [
      'The red rabbit runs really fast.',
      'I see a rainbow after the rain.',
      'The robot rides in the rocket.',
      'Roger has a room full of robots.',
      'The roaring lion ran around the rocks.',
    ],
    stories: [
      {
        title: 'Ruby the Rabbit',
        text: 'Ruby the rabbit ran through the rain to reach her friend Roger. Roger was a robot who lived near the river. Ruby brought Roger a red rose and a ripe raspberry. "What a remarkable gift!" said Roger. They watched the rainbow appear over the river. Ruby and Roger agreed it was a really great day.',
        questions: [
          { q: 'Who is Ruby?', a: 'A rabbit' },
          { q: 'What did Ruby bring?', a: 'A red rose and raspberry' },
          { q: 'What did they see?', a: 'A rainbow' },
        ],
      },
    ],
    conversation: [
      { type: 'wouldYouRather', prompt: 'Would you rather ride a rocket or run a race?' },
      { type: 'haveYouEver', prompt: 'Have you ever seen a real rainbow?' },
      { type: 'tellMeAbout', prompt: 'Tell me about your favorite red thing.' },
      { type: 'whatIf', prompt: 'What if you had a robot friend?' },
    ],
  },
  l: {
    name: 'L Sound',
    color: '#5CB85C',
    cue: 'Put your tongue tip up behind your top teeth: llll',
    funnyCharacter: '🦎 Lizzy Lizard',
    isolation: ['l', 'lll', 'llllll'],
    syllables: ['la', 'le', 'li', 'lo', 'lu', 'al', 'el', 'il', 'ol', 'ul', 'ala', 'ele', 'ili'],
    words: {
      initial: [
        { word: 'lion', arasaacId: 2596 },
        { word: 'lamp', arasaacId: 2585 },
        { word: 'leaf', arasaacId: 2588 },
        { word: 'lemon', arasaacId: 2589 },
        { word: 'ladder', arasaacId: 2583 },
        { word: 'lollipop', arasaacId: 2602 },
        { word: 'lizard', arasaacId: 2600 },
        { word: 'lake', arasaacId: 2584 },
      ],
      medial: [
        { word: 'balloon', arasaacId: 2484 },
        { word: 'jelly', arasaacId: 6014 },
        { word: 'yellow', arasaacId: 2890 },
        { word: 'pillow', arasaacId: 2729 },
        { word: 'elephant', arasaacId: 2548 },
      ],
      final: [
        { word: 'ball', arasaacId: 2483 },
        { word: 'bell', arasaacId: 2497 },
        { word: 'shell', arasaacId: 2765 },
        { word: 'wheel', arasaacId: 2885 },
        { word: 'owl', arasaacId: 2717 },
        { word: 'pool', arasaacId: null },
      ],
    },
    phrases: [
      { leadWords: ['my', 'the', 'a', 'big', 'loud'], targetWord: 'lion' },
      { leadWords: ['the', 'a', 'green', 'little'], targetWord: 'leaf' },
      { leadWords: ['the', 'red', 'blue', 'yellow'], targetWord: 'balloon' },
    ],
    sentences: [
      'The lazy lion lays under the tree.',
      'Lucy loves her yellow lollipop.',
      'The little lamb leaped over the log.',
      'Look at the lovely leaves on the lake.',
      'The lamp lights up the living room.',
    ],
    stories: [
      {
        title: 'Leo the Lion',
        text: 'Leo the lion lived by a lovely lake. Leo liked to lay in the leaves and look at the clouds. One day, Leo found a lost little lamb. "Hello little lamb," said Leo. "Let me help you find your family." Leo led the lamb to the lovely meadow where its family lived. The lamb was so lucky!',
        questions: [
          { q: 'Where did Leo live?', a: 'By a lake' },
          { q: 'What did Leo find?', a: 'A lost lamb' },
          { q: 'Where did the lamb\'s family live?', a: 'In the meadow' },
        ],
      },
    ],
    conversation: [
      { type: 'wouldYouRather', prompt: 'Would you rather lick a lollipop or blow up a balloon?' },
      { type: 'haveYouEver', prompt: 'Have you ever held a leaf up to the light?' },
      { type: 'tellMeAbout', prompt: 'Tell me about something little that you love.' },
      { type: 'whatIf', prompt: 'What if you could talk to a lion?' },
    ],
  },
  th: {
    name: 'TH Sound',
    color: '#8E6BBF',
    cue: 'Stick your tongue out between your teeth and blow: thhhh',
    funnyCharacter: '👅 Theo Tongue',
    isolation: ['th', 'thh', 'thhhh'],
    syllables: ['tha', 'the', 'thi', 'tho', 'thu', 'ath', 'eth', 'ith', 'oth', 'uth'],
    words: {
      initial: [
        { word: 'thumb', arasaacId: 36472 },
        { word: 'three', arasaacId: 36590 },
        { word: 'think', arasaacId: 9041 },
        { word: 'throw', arasaacId: null },
        { word: 'thunder', arasaacId: null },
        { word: 'thick', arasaacId: null },
        { word: 'thank', arasaacId: 9044 },
        { word: 'thirsty', arasaacId: 2867 },
      ],
      medial: [
        { word: 'bathtub', arasaacId: 2491 },
        { word: 'toothbrush', arasaacId: 6056 },
        { word: 'birthday', arasaacId: 2503 },
        { word: 'something', arasaacId: null },
        { word: 'nothing', arasaacId: null },
      ],
      final: [
        { word: 'mouth', arasaacId: 2671 },
        { word: 'tooth', arasaacId: 2869 },
        { word: 'bath', arasaacId: 2490 },
        { word: 'math', arasaacId: null },
        { word: 'path', arasaacId: null },
        { word: 'with', arasaacId: null },
      ],
    },
    phrases: [
      { leadWords: ['my', 'your', 'his', 'her'], targetWord: 'thumb' },
      { leadWords: ['one', 'two', 'the'], targetWord: 'three' },
      { leadWords: ['say', 'please'], targetWord: 'thank you' },
    ],
    sentences: [
      'I think there are three things on the table.',
      'Theodore gave a thumbs up.',
      'The birthday cake was thick and yummy.',
      'My tooth fell out in the bathtub!',
      'Thank you for thinking of me.',
    ],
    stories: [
      {
        title: 'Theo\'s Birthday',
        text: 'It was Theo\'s third birthday! Theo thought about what he wanted. "I think I want a bathtub for my toy boat," said Theo. His mother and father threw a party. There were three cakes. Theo thanked everyone. Then he made a wish and blew out the candles. What a thoughtful birthday!',
        questions: [
          { q: 'How old was Theo?', a: 'Three' },
          { q: 'What did Theo want?', a: 'A bathtub for his toy boat' },
          { q: 'How many cakes were there?', a: 'Three' },
        ],
      },
    ],
    conversation: [
      { type: 'wouldYouRather', prompt: 'Would you rather think of three wishes or throw a ball?' },
      { type: 'haveYouEver', prompt: 'Have you ever lost a tooth?' },
      { type: 'tellMeAbout', prompt: 'Tell me about something you are thankful for.' },
      { type: 'whatIf', prompt: 'What if you could be three years old again?' },
    ],
  },
};

// Storage keys
const STORAGE_KEY = 'atlasassist_articulation_data';

const ArticulationStationV2 = () => {
  const navigate = useNavigate();
  
  // Core state
  const [selectedSound, setSelectedSound] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [position, setPosition] = useState('initial'); // initial, medial, final
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCue, setShowCue] = useState(false);
  
  // Phrase spinner state
  const [spinnerLeadWord, setSpinnerLeadWord] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  
  // Data tracking
  const [sessionData, setSessionData] = useState({
    correct: 0,
    incorrect: 0,
    approximate: 0,
    trials: [],
  });
  const [showDataPanel, setShowDataPanel] = useState(false);
  
  // Story state
  const [showStoryQuestions, setShowStoryQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Could restore previous session data here
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Save session data
  const saveProgress = useCallback(() => {
    const data = {
      lastSession: new Date().toISOString(),
      sessions: sessionData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [sessionData]);

  // Text to speech
  const speak = useCallback((text, rate = 0.8) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording failed:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Score a trial
  const scoreTrial = (score) => {
    const soundData = SOUNDS_DATA[selectedSound];
    let currentItem = '';
    
    if (currentLevel === 'isolation') {
      currentItem = soundData.isolation[currentIndex];
    } else if (currentLevel === 'syllables') {
      currentItem = soundData.syllables[currentIndex];
    } else if (currentLevel === 'words') {
      currentItem = soundData.words[position][currentIndex]?.word;
    }
    
    setSessionData(prev => ({
      ...prev,
      [score]: prev[score] + 1,
      trials: [...prev.trials, { item: currentItem, score, timestamp: Date.now() }],
    }));
    
    // Auto-advance to next
    nextItem();
  };

  // Navigation
  const nextItem = () => {
    const soundData = SOUNDS_DATA[selectedSound];
    let maxIndex = 0;
    
    if (currentLevel === 'isolation') {
      maxIndex = soundData.isolation.length - 1;
    } else if (currentLevel === 'syllables') {
      maxIndex = soundData.syllables.length - 1;
    } else if (currentLevel === 'words') {
      maxIndex = soundData.words[position].length - 1;
    } else if (currentLevel === 'phrases') {
      maxIndex = soundData.phrases.length - 1;
    } else if (currentLevel === 'sentences') {
      maxIndex = soundData.sentences.length - 1;
    }
    
    setCurrentIndex(prev => prev < maxIndex ? prev + 1 : 0);
    setAudioURL(null);
  };

  const prevItem = () => {
    const soundData = SOUNDS_DATA[selectedSound];
    let maxIndex = 0;
    
    if (currentLevel === 'isolation') {
      maxIndex = soundData.isolation.length - 1;
    } else if (currentLevel === 'syllables') {
      maxIndex = soundData.syllables.length - 1;
    } else if (currentLevel === 'words') {
      maxIndex = soundData.words[position].length - 1;
    } else if (currentLevel === 'phrases') {
      maxIndex = soundData.phrases.length - 1;
    } else if (currentLevel === 'sentences') {
      maxIndex = soundData.sentences.length - 1;
    }
    
    setCurrentIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    setAudioURL(null);
  };

  // Spin the phrase wheel (like Articulation Station's rotating sentences)
  const spinPhrase = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    const soundData = SOUNDS_DATA[selectedSound];
    const phrase = soundData.phrases[currentIndex];
    const maxLeadWord = phrase.leadWords.length;
    
    let spins = 0;
    const interval = setInterval(() => {
      setSpinnerLeadWord(Math.floor(Math.random() * maxLeadWord));
      spins++;
      if (spins > 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const soundData = selectedSound ? SOUNDS_DATA[selectedSound] : null;

  // Calculate session stats
  const totalTrials = sessionData.correct + sessionData.incorrect + sessionData.approximate;
  const accuracy = totalTrials > 0 ? Math.round((sessionData.correct / totalTrials) * 100) : 0;

  // Sound selection screen
  if (!selectedSound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                         rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#4A9FD4] flex items-center gap-2">
                🎯 Articulation Station
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Practice speech sounds</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#4A9FD4] mb-2 flex items-center gap-2">
              <Target size={24} />
              Practice Your Sounds
            </h2>
            <p className="font-crayon text-gray-600">
              Work through 7 levels from simple sounds all the way to conversation!
              Record yourself and track your progress.
            </p>
          </div>

          {/* Sound Selection */}
          <h3 className="font-display text-gray-700 mb-3">Choose a Sound</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(SOUNDS_DATA).map(([key, sound]) => (
              <button
                key={key}
                onClick={() => setSelectedSound(key)}
                className="bg-white rounded-2xl border-4 p-5 shadow-lg hover:scale-105 
                           transition-all text-center"
                style={{ borderColor: sound.color }}
              >
                <div className="text-4xl mb-2">{sound.funnyCharacter.split(' ')[0]}</div>
                <h3 className="font-display text-xl" style={{ color: sound.color }}>
                  {sound.name}
                </h3>
                <p className="text-sm text-gray-500 font-crayon mt-1">
                  {sound.funnyCharacter.split(' ').slice(1).join(' ')}
                </p>
              </button>
            ))}
          </div>

          {/* Practice Levels Preview */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
            <h3 className="font-display text-gray-700 mb-3">7 Practice Levels</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRACTICE_LEVELS).map(([key, level]) => (
                <span 
                  key={key}
                  className="px-3 py-1 bg-white rounded-full text-sm font-crayon text-gray-600 
                             border border-gray-200"
                >
                  {level.icon} {level.name}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Level selection screen
  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: soundData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedSound(null)}
              className="p-2 bg-white border-3 rounded-xl"
              style={{ borderColor: soundData.color }}
            >
              <ArrowLeft size={20} style={{ color: soundData.color }} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display flex items-center gap-2" 
                  style={{ color: soundData.color }}>
                {soundData.funnyCharacter.split(' ')[0]} {soundData.name}
              </h1>
            </div>
            <button
              onClick={() => setShowCue(!showCue)}
              className="p-2 bg-yellow-100 border-3 border-yellow-400 rounded-xl"
            >
              <HelpCircle size={20} className="text-yellow-600" />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Sound Cue */}
          {showCue && (
            <div className="bg-yellow-50 rounded-xl border-2 border-yellow-300 p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{soundData.funnyCharacter.split(' ')[0]}</span>
                <div>
                  <h3 className="font-display text-yellow-700">How to make this sound:</h3>
                  <p className="font-crayon text-yellow-600">{soundData.cue}</p>
                  <button
                    onClick={() => speak(soundData.cue)}
                    className="mt-2 px-3 py-1 bg-yellow-200 rounded-lg text-yellow-700 text-sm 
                               font-crayon flex items-center gap-1"
                  >
                    <Volume2 size={14} /> Listen
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Level Selection */}
          <h3 className="font-display text-gray-700 mb-3">Choose Practice Level</h3>
          <div className="space-y-3">
            {Object.entries(PRACTICE_LEVELS).map(([key, level], idx) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentLevel(key);
                  setCurrentIndex(0);
                  setSessionData({ correct: 0, incorrect: 0, approximate: 0, trials: [] });
                }}
                className="w-full bg-white rounded-xl border-4 p-4 shadow-lg hover:scale-102 
                           transition-all flex items-center gap-4 text-left"
                style={{ borderColor: soundData.color }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style={{ backgroundColor: `${soundData.color}20` }}>
                  {level.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-sm font-display 
                                   flex items-center justify-center"
                          style={{ backgroundColor: soundData.color }}>
                      {idx + 1}
                    </span>
                    <h4 className="font-display" style={{ color: soundData.color }}>
                      {level.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-500 font-crayon">{level.description}</p>
                </div>
                <ChevronRight size={20} style={{ color: soundData.color }} />
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Practice screens based on level
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: soundData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              saveProgress();
              setCurrentLevel(null);
            }}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: soundData.color }}
          >
            <ArrowLeft size={20} style={{ color: soundData.color }} />
          </button>
          
          <div className="flex-1 text-center">
            <span className="font-display" style={{ color: soundData.color }}>
              {PRACTICE_LEVELS[currentLevel].icon} {PRACTICE_LEVELS[currentLevel].name}
            </span>
          </div>
          
          <button
            onClick={() => setShowDataPanel(!showDataPanel)}
            className="p-2 bg-white border-3 rounded-xl relative"
            style={{ borderColor: soundData.color }}
          >
            <BarChart2 size={20} style={{ color: soundData.color }} />
            {totalTrials > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs 
                             rounded-full flex items-center justify-center font-display">
                {totalTrials}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Data Panel */}
      {showDataPanel && (
        <div className="bg-white border-b-2 border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-gray-700">Session Data</span>
              <span className="font-display text-lg" style={{ color: soundData.color }}>
                {accuracy}% Accuracy
              </span>
            </div>
            <div className="flex gap-4 text-sm font-crayon">
              <span className="text-green-600">✓ Correct: {sessionData.correct}</span>
              <span className="text-yellow-600">≈ Approximate: {sessionData.approximate}</span>
              <span className="text-red-600">✗ Incorrect: {sessionData.incorrect}</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${totalTrials > 0 ? (sessionData.correct / totalTrials) * 100 : 0}%` }}
              />
              <div 
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${totalTrials > 0 ? (sessionData.approximate / totalTrials) * 100 : 0}%` }}
              />
              <div 
                className="h-full bg-red-500 transition-all"
                style={{ width: `${totalTrials > 0 ? (sessionData.incorrect / totalTrials) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 py-6">
        {/* ISOLATION LEVEL */}
        {currentLevel === 'isolation' && (
          <div className="text-center">
            <p className="font-crayon text-gray-500 mb-4">Practice the sound by itself:</p>
            
            <div className="bg-white rounded-3xl border-4 shadow-xl p-8 mb-6"
                 style={{ borderColor: soundData.color }}>
              <div className="text-8xl font-display mb-4" style={{ color: soundData.color }}>
                {soundData.isolation[currentIndex]}
              </div>
              <button
                onClick={() => speak(soundData.isolation[currentIndex], 0.5)}
                className="px-6 py-3 rounded-xl text-white font-display flex items-center 
                           gap-2 mx-auto"
                style={{ backgroundColor: soundData.color }}
              >
                <Volume2 size={20} /> Listen
              </button>
            </div>

            {/* Sound cue reminder */}
            <div className="bg-yellow-50 rounded-xl p-3 mb-6 text-sm">
              <p className="font-crayon text-yellow-700">
                💡 {soundData.cue}
              </p>
            </div>
          </div>
        )}

        {/* SYLLABLES LEVEL */}
        {currentLevel === 'syllables' && (
          <div className="text-center">
            <p className="font-crayon text-gray-500 mb-4">Practice the sound in syllables:</p>
            
            {/* Syllable slider visualization */}
            <div className="bg-white rounded-3xl border-4 shadow-xl p-8 mb-6"
                 style={{ borderColor: soundData.color }}>
              <div className="text-6xl font-display mb-4" style={{ color: soundData.color }}>
                {soundData.syllables[currentIndex]}
              </div>
              
              {/* Visual syllable breakdown */}
              <div className="flex justify-center gap-2 mb-4">
                {soundData.syllables[currentIndex].split('').map((char, i) => (
                  <span 
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-display
                               ${char === selectedSound[0] || char === 'h' && selectedSound === 'th' 
                                 ? 'bg-yellow-200 text-yellow-700' 
                                 : 'bg-gray-100 text-gray-600'}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              
              <button
                onClick={() => speak(soundData.syllables[currentIndex], 0.6)}
                className="px-6 py-3 rounded-xl text-white font-display flex items-center 
                           gap-2 mx-auto"
                style={{ backgroundColor: soundData.color }}
              >
                <Volume2 size={20} /> Listen
              </button>
            </div>
          </div>
        )}

        {/* WORDS LEVEL */}
        {currentLevel === 'words' && (
          <div className="text-center">
            {/* Position selector */}
            <div className="flex justify-center gap-2 mb-4">
              {['initial', 'medial', 'final'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => {
                    setPosition(pos);
                    setCurrentIndex(0);
                  }}
                  className={`px-4 py-2 rounded-xl font-display text-sm transition-all
                             ${position === pos 
                               ? 'text-white' 
                               : 'bg-white border-2'}`}
                  style={{ 
                    backgroundColor: position === pos ? soundData.color : undefined,
                    borderColor: soundData.color,
                    color: position !== pos ? soundData.color : undefined,
                  }}
                >
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </button>
              ))}
            </div>
            
            {soundData.words[position][currentIndex] && (
              <div className="bg-white rounded-3xl border-4 shadow-xl p-6 mb-6"
                   style={{ borderColor: soundData.color }}>
                {/* Image */}
                {soundData.words[position][currentIndex].arasaacId && (
                  <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={getPictogramUrl(soundData.words[position][currentIndex].arasaacId)}
                      alt={soundData.words[position][currentIndex].word}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Word with highlighted sound */}
                <div className="text-3xl font-display mb-4">
                  {soundData.words[position][currentIndex].word.split('').map((char, i) => {
                    const isTarget = (
                      (position === 'initial' && i === 0) ||
                      (position === 'final' && i === soundData.words[position][currentIndex].word.length - 1)
                    );
                    return (
                      <span 
                        key={i} 
                        style={{ color: isTarget ? soundData.color : '#374151' }}
                        className={isTarget ? 'font-bold underline' : ''}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => speak(soundData.words[position][currentIndex].word)}
                  className="px-6 py-3 rounded-xl text-white font-display flex items-center 
                             gap-2 mx-auto"
                  style={{ backgroundColor: soundData.color }}
                >
                  <Volume2 size={20} /> Listen
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHRASES LEVEL - Spinning Phrases like Articulation Station */}
        {currentLevel === 'phrases' && soundData.phrases[currentIndex] && (
          <div className="text-center">
            <p className="font-crayon text-gray-500 mb-4">Spin to create silly phrases!</p>
            
            <div className="bg-white rounded-3xl border-4 shadow-xl p-6 mb-6"
                 style={{ borderColor: soundData.color }}>
              {/* Phrase display */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {/* Lead word spinner */}
                <div className={`px-4 py-3 rounded-xl border-3 font-display text-xl
                               ${isSpinning ? 'animate-pulse' : ''}`}
                     style={{ borderColor: soundData.color, color: soundData.color }}>
                  {soundData.phrases[currentIndex].leadWords[spinnerLeadWord]}
                </div>
                
                {/* Target word */}
                <div className="px-4 py-3 rounded-xl text-white font-display text-xl"
                     style={{ backgroundColor: soundData.color }}>
                  {soundData.phrases[currentIndex].targetWord}
                </div>
              </div>
              
              {/* Spin button */}
              <button
                onClick={spinPhrase}
                disabled={isSpinning}
                className="px-8 py-4 rounded-full text-white font-display text-lg 
                           shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto
                           disabled:opacity-50"
                style={{ backgroundColor: soundData.color }}
              >
                <RefreshCw size={24} className={isSpinning ? 'animate-spin' : ''} />
                {isSpinning ? 'Spinning...' : 'Spin!'}
              </button>
              
              {/* Listen button */}
              <button
                onClick={() => speak(`${soundData.phrases[currentIndex].leadWords[spinnerLeadWord]} ${soundData.phrases[currentIndex].targetWord}`)}
                className="mt-4 px-4 py-2 rounded-xl border-2 font-crayon flex items-center 
                           gap-2 mx-auto"
                style={{ borderColor: soundData.color, color: soundData.color }}
              >
                <Volume2 size={16} /> Listen to Phrase
              </button>
            </div>
          </div>
        )}

        {/* SENTENCES LEVEL */}
        {currentLevel === 'sentences' && (
          <div className="text-center">
            <p className="font-crayon text-gray-500 mb-4">Read the sentence aloud:</p>
            
            <div className="bg-white rounded-3xl border-4 shadow-xl p-6 mb-6"
                 style={{ borderColor: soundData.color }}>
              <p className="text-xl font-crayon text-gray-800 leading-relaxed mb-4">
                {soundData.sentences[currentIndex]}
              </p>
              
              <button
                onClick={() => speak(soundData.sentences[currentIndex])}
                className="px-6 py-3 rounded-xl text-white font-display flex items-center 
                           gap-2 mx-auto"
                style={{ backgroundColor: soundData.color }}
              >
                <Volume2 size={20} /> Listen
              </button>
            </div>
          </div>
        )}

        {/* STORIES LEVEL */}
        {currentLevel === 'stories' && soundData.stories[0] && (
          <div className="text-center">
            {!showStoryQuestions ? (
              <>
                <h3 className="font-display text-xl mb-4" style={{ color: soundData.color }}>
                  📚 {soundData.stories[0].title}
                </h3>
                
                <div className="bg-white rounded-2xl border-4 shadow-xl p-5 mb-6 text-left"
                     style={{ borderColor: soundData.color }}>
                  <p className="font-crayon text-gray-700 leading-relaxed text-lg">
                    {soundData.stories[0].text}
                  </p>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => speak(soundData.stories[0].text, 0.85)}
                    className="px-4 py-2 rounded-xl text-white font-display flex items-center gap-2"
                    style={{ backgroundColor: soundData.color }}
                  >
                    <Volume2 size={18} /> Listen
                  </button>
                  <button
                    onClick={() => {
                      setShowStoryQuestions(true);
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-4 py-2 rounded-xl border-2 font-display flex items-center gap-2"
                    style={{ borderColor: soundData.color, color: soundData.color }}
                  >
                    <BookOpen size={18} /> Questions
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg mb-4" style={{ color: soundData.color }}>
                  Question {currentQuestionIndex + 1} of {soundData.stories[0].questions.length}
                </h3>
                
                <div className="bg-white rounded-2xl border-4 shadow-xl p-5 mb-6"
                     style={{ borderColor: soundData.color }}>
                  <p className="font-display text-xl text-gray-800 mb-4">
                    {soundData.stories[0].questions[currentQuestionIndex].q}
                  </p>
                  <button
                    onClick={() => speak(soundData.stories[0].questions[currentQuestionIndex].a)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-crayon"
                  >
                    Show Answer: {soundData.stories[0].questions[currentQuestionIndex].a}
                  </button>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowStoryQuestions(false)}
                    className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-600 font-crayon"
                  >
                    Back to Story
                  </button>
                  {currentQuestionIndex < soundData.stories[0].questions.length - 1 && (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl text-white font-display"
                      style={{ backgroundColor: soundData.color }}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* CONVERSATION LEVEL - Would You Rather, Have You Ever, etc. */}
        {currentLevel === 'conversation' && soundData.conversation[currentIndex] && (
          <div className="text-center">
            <div className="bg-white rounded-3xl border-4 shadow-xl p-6 mb-6"
                 style={{ borderColor: soundData.color }}>
              {/* Conversation type badge */}
              <span className="inline-block px-3 py-1 rounded-full text-sm font-display mb-4 text-white"
                    style={{ backgroundColor: soundData.color }}>
                {soundData.conversation[currentIndex].type === 'wouldYouRather' && '🤔 Would You Rather'}
                {soundData.conversation[currentIndex].type === 'haveYouEver' && '💭 Have You Ever'}
                {soundData.conversation[currentIndex].type === 'tellMeAbout' && '💬 Tell Me About'}
                {soundData.conversation[currentIndex].type === 'whatIf' && '✨ What If'}
              </span>
              
              <p className="text-xl font-crayon text-gray-800 leading-relaxed mb-4">
                {soundData.conversation[currentIndex].prompt}
              </p>
              
              <button
                onClick={() => speak(soundData.conversation[currentIndex].prompt)}
                className="px-6 py-3 rounded-xl text-white font-display flex items-center 
                           gap-2 mx-auto"
                style={{ backgroundColor: soundData.color }}
              >
                <Volume2 size={20} /> Listen
              </button>
            </div>
            
            <p className="text-sm text-gray-500 font-crayon">
              Talk about this topic using your target sound!
            </p>
          </div>
        )}

        {/* Recording Controls */}
        <div className="bg-white rounded-2xl border-4 border-gray-200 p-4 mb-6">
          <p className="font-display text-gray-700 text-center mb-3">🎤 Record & Listen</p>
          <div className="flex justify-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-crayon 
                           flex items-center gap-2"
              >
                <Mic size={18} /> Record
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-crayon 
                           flex items-center gap-2 animate-pulse"
              >
                <MicOff size={18} /> Stop
              </button>
            )}
            {audioURL && (
              <button
                onClick={playRecording}
                className="px-4 py-2 bg-green-500 text-white rounded-xl font-crayon 
                           flex items-center gap-2"
              >
                <Play size={18} /> Play Back
              </button>
            )}
          </div>
        </div>

        {/* Scoring Buttons (not for conversation/stories) */}
        {!['conversation', 'stories'].includes(currentLevel) && (
          <div className="bg-white rounded-2xl border-4 border-gray-200 p-4 mb-6">
            <p className="font-display text-gray-700 text-center mb-3">How was that?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => scoreTrial('correct')}
                className="px-4 py-3 bg-green-500 text-white rounded-xl font-display 
                           flex items-center gap-2 hover:bg-green-600"
              >
                <Check size={20} /> Correct
              </button>
              <button
                onClick={() => scoreTrial('approximate')}
                className="px-4 py-3 bg-yellow-500 text-white rounded-xl font-display 
                           flex items-center gap-2 hover:bg-yellow-600"
              >
                <Zap size={20} /> Close
              </button>
              <button
                onClick={() => scoreTrial('incorrect')}
                className="px-4 py-3 bg-red-500 text-white rounded-xl font-display 
                           flex items-center gap-2 hover:bg-red-600"
              >
                <X size={20} /> Try Again
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevItem}
            className="p-3 bg-white border-3 rounded-xl shadow"
            style={{ borderColor: soundData.color }}
          >
            <ChevronLeft size={24} style={{ color: soundData.color }} />
          </button>
          
          <button
            onClick={() => {
              setCurrentIndex(Math.floor(Math.random() * (
                currentLevel === 'isolation' ? soundData.isolation.length :
                currentLevel === 'syllables' ? soundData.syllables.length :
                currentLevel === 'words' ? soundData.words[position].length :
                currentLevel === 'phrases' ? soundData.phrases.length :
                currentLevel === 'sentences' ? soundData.sentences.length :
                currentLevel === 'conversation' ? soundData.conversation.length : 1
              )));
            }}
            className="p-3 bg-white border-3 rounded-xl shadow"
            style={{ borderColor: soundData.color }}
          >
            <Shuffle size={24} style={{ color: soundData.color }} />
          </button>
          
          <button
            onClick={nextItem}
            className="p-3 bg-white border-3 rounded-xl shadow"
            style={{ borderColor: soundData.color }}
          >
            <ChevronRight size={24} style={{ color: soundData.color }} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ArticulationStationV2;
