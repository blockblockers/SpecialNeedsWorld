// RhythmSpeech.jsx - Use music and rhythm for fluency practice
// Speech therapy app for stuttering/fluency support using rhythmic speech techniques

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Play, Pause, Music, Drum,
  Metronome, Heart, Star, RotateCcw, Settings
} from 'lucide-react';

// Rhythm patterns
const RHYTHM_PATTERNS = {
  slow: {
    name: 'Slow & Steady',
    bpm: 60,
    icon: '🐢',
    color: '#5CB85C',
    description: 'Practice speaking slowly with a calm beat',
  },
  medium: {
    name: 'Walking Pace',
    bpm: 90,
    icon: '🚶',
    color: '#4A9FD4',
    description: 'A comfortable walking rhythm',
  },
  lively: {
    name: 'Lively Beat',
    bpm: 120,
    icon: '💃',
    color: '#F5A623',
    description: 'A more energetic pace',
  },
};

// Practice phrases organized by difficulty
const PRACTICE_CONTENT = {
  syllables: {
    name: 'Syllable Practice',
    icon: '🔤',
    color: '#E86B9A',
    items: [
      { text: 'ba ba ba ba', syllables: 4 },
      { text: 'ma ma ma ma', syllables: 4 },
      { text: 'da da da da', syllables: 4 },
      { text: 'la la la la', syllables: 4 },
      { text: 'pa pa pa pa', syllables: 4 },
    ],
  },
  words: {
    name: 'Word Practice',
    icon: '📝',
    color: '#8E6BBF',
    items: [
      { text: 'Hello', syllables: 2 },
      { text: 'Goodbye', syllables: 2 },
      { text: 'Please', syllables: 1 },
      { text: 'Thank you', syllables: 2 },
      { text: 'I love you', syllables: 3 },
      { text: 'Beautiful', syllables: 4 },
      { text: 'Wonderful', syllables: 3 },
      { text: 'Butterfly', syllables: 3 },
    ],
  },
  sentences: {
    name: 'Sentence Practice',
    icon: '💬',
    color: '#4A9FD4',
    items: [
      { text: 'I am happy', syllables: 4 },
      { text: 'The sun is bright', syllables: 4 },
      { text: 'I like to play', syllables: 4 },
      { text: 'My name is...', syllables: 3 },
      { text: 'I can do it', syllables: 4 },
      { text: 'Today is a good day', syllables: 6 },
      { text: 'I feel calm and relaxed', syllables: 6 },
    ],
  },
  breathing: {
    name: 'Breathing Exercises',
    icon: '🌬️',
    color: '#5CB85C',
    items: [
      { text: 'Breathe in... Breathe out...', syllables: 4, isBreathing: true },
      { text: 'In through nose... Out through mouth...', syllables: 6, isBreathing: true },
      { text: 'Slow breath in... Slow breath out...', syllables: 6, isBreathing: true },
    ],
  },
};

// Techniques tips
const FLUENCY_TIPS = [
  { 
    title: 'Easy Onset',
    description: 'Start sounds gently, like a whisper growing louder',
    icon: '🌊',
  },
  { 
    title: 'Stretch & Flow',
    description: 'Stretch the first sound of words smoothly',
    icon: '🎵',
  },
  { 
    title: 'Light Contacts',
    description: 'Touch sounds lightly, don\'t push hard',
    icon: '🪶',
  },
  { 
    title: 'Pausing',
    description: 'It\'s okay to pause and take a breath',
    icon: '⏸️',
  },
];

const RhythmSpeech = () => {
  const navigate = useNavigate();
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  
  // State
  const [selectedRhythm, setSelectedRhythm] = useState('slow');
  const [selectedContent, setSelectedContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [customBpm, setCustomBpm] = useState(null);

  // Get current BPM
  const currentBpm = customBpm || RHYTHM_PATTERNS[selectedRhythm].bpm;

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play metronome tick
  const playTick = useCallback((isAccent = false) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = isAccent ? 880 : 440;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, []);

  // Start/stop metronome
  const toggleMetronome = useCallback(() => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      setCurrentBeat(0);
    } else {
      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const intervalMs = (60 / currentBpm) * 1000;
      let beat = 0;
      
      playTick(true); // First beat accent
      setCurrentBeat(1);
      
      intervalRef.current = setInterval(() => {
        beat = (beat + 1) % 4;
        playTick(beat === 0);
        setCurrentBeat(beat + 1);
      }, intervalMs);
      
      setIsPlaying(true);
    }
  }, [isPlaying, currentBpm, playTick]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Text to speech
  const speak = useCallback((text, rate = 0.8) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Next phrase
  const nextPhrase = () => {
    if (!selectedContent) return;
    const items = PRACTICE_CONTENT[selectedContent].items;
    setCurrentPhrase((prev) => (prev + 1) % items.length);
  };

  // Previous phrase
  const prevPhrase = () => {
    if (!selectedContent) return;
    const items = PRACTICE_CONTENT[selectedContent].items;
    setCurrentPhrase((prev) => (prev - 1 + items.length) % items.length);
  };

  const rhythmData = RHYTHM_PATTERNS[selectedRhythm];
  const contentData = selectedContent ? PRACTICE_CONTENT[selectedContent] : null;
  const currentItem = contentData?.items[currentPhrase];

  // Selection screen
  if (!practiceStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#8E6BBF] flex items-center gap-2">
                🎵 Rhythm & Speech
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Use rhythm for fluency practice</p>
            </div>
            <button
              onClick={() => setShowTips(true)}
              className="p-2 text-[#8E6BBF] hover:bg-purple-50 rounded-xl"
            >
              <Heart size={24} />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#8E6BBF] mb-2 flex items-center gap-2">
              <Music size={24} />
              Practice with Rhythm
            </h2>
            <p className="font-crayon text-gray-600">
              Speaking with a rhythm can help words flow more smoothly. 
              Choose a beat speed and practice speaking along with it!
            </p>
          </div>

          {/* Rhythm Selection */}
          <h3 className="font-display text-gray-700 mb-3">1. Choose Your Rhythm</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {Object.entries(RHYTHM_PATTERNS).map(([key, rhythm]) => (
              <button
                key={key}
                onClick={() => setSelectedRhythm(key)}
                className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all text-center
                           ${selectedRhythm === key ? 'scale-105' : 'hover:scale-102'}`}
                style={{ 
                  borderColor: rhythm.color,
                  backgroundColor: selectedRhythm === key ? `${rhythm.color}15` : 'white',
                }}
              >
                <span className="text-3xl block mb-2">{rhythm.icon}</span>
                <span className="font-display text-sm" style={{ color: rhythm.color }}>
                  {rhythm.name}
                </span>
                <p className="text-xs text-gray-500 font-crayon mt-1">{rhythm.bpm} BPM</p>
              </button>
            ))}
          </div>

          {/* Content Selection */}
          <h3 className="font-display text-gray-700 mb-3">2. Choose What to Practice</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(PRACTICE_CONTENT).map(([key, content]) => (
              <button
                key={key}
                onClick={() => setSelectedContent(key)}
                className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all
                           flex items-center gap-3 text-left
                           ${selectedContent === key ? 'scale-105' : 'hover:scale-102'}`}
                style={{ 
                  borderColor: content.color,
                  backgroundColor: selectedContent === key ? `${content.color}15` : 'white',
                }}
              >
                <span className="text-3xl">{content.icon}</span>
                <div>
                  <span className="font-display" style={{ color: content.color }}>
                    {content.name}
                  </span>
                  <p className="text-xs text-gray-500 font-crayon">
                    {content.items.length} items
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Start Button */}
          {selectedContent && (
            <button
              onClick={() => setPracticeStarted(true)}
              className="w-full py-4 bg-[#8E6BBF] text-xl font-display text-white rounded-2xl
                         shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Start Practice
            </button>
          )}
        </main>

        {/* Tips Modal */}
        {showTips && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 max-w-md shadow-2xl">
              <h2 className="text-xl font-display text-[#8E6BBF] mb-4 flex items-center gap-2">
                <Heart size={24} />
                Fluency Tips
              </h2>
              <div className="space-y-4">
                {FLUENCY_TIPS.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <h4 className="font-display text-[#8E6BBF]">{tip.title}</h4>
                      <p className="text-sm text-gray-600 font-crayon">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="w-full mt-6 py-3 bg-[#8E6BBF] text-white font-display rounded-xl"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Practice screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: contentData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (isPlaying) toggleMetronome();
              setPracticeStarted(false);
            }}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: contentData.color }}
          >
            <ArrowLeft size={20} style={{ color: contentData.color }} />
          </button>
          <div className="flex-1 text-center">
            <span className="font-display" style={{ color: contentData.color }}>
              {contentData.icon} {contentData.name}
            </span>
          </div>
          <button
            onClick={() => setShowTips(true)}
            className="p-2 text-gray-400 hover:text-[#8E6BBF]"
          >
            <Heart size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Metronome Control */}
        <div className="bg-white rounded-2xl border-4 shadow-lg p-6 mb-6 text-center"
             style={{ borderColor: rhythmData.color }}>
          {/* Beat visualization */}
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3, 4].map((beat) => (
              <div
                key={beat}
                className={`w-6 h-6 rounded-full transition-all ${
                  isPlaying && currentBeat === beat ? 'scale-125' : ''
                }`}
                style={{ 
                  backgroundColor: isPlaying && currentBeat === beat 
                    ? rhythmData.color 
                    : `${rhythmData.color}30`,
                }}
              />
            ))}
          </div>

          {/* BPM display */}
          <p className="font-display text-2xl mb-2" style={{ color: rhythmData.color }}>
            {currentBpm} BPM
          </p>
          <p className="font-crayon text-gray-500 text-sm mb-4">
            {rhythmData.icon} {rhythmData.name}
          </p>

          {/* Play/Pause button */}
          <button
            onClick={toggleMetronome}
            className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center
                       transition-transform hover:scale-110 mx-auto"
            style={{ backgroundColor: rhythmData.color }}
          >
            {isPlaying ? (
              <Pause size={36} className="text-white" />
            ) : (
              <Play size={36} className="text-white ml-1" />
            )}
          </button>

          {/* Speed adjustment */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setCustomBpm((prev) => Math.max(40, (prev || currentBpm) - 10))}
              className="px-3 py-1 rounded-lg text-sm font-display"
              style={{ backgroundColor: `${rhythmData.color}20`, color: rhythmData.color }}
            >
              Slower
            </button>
            <button
              onClick={() => setCustomBpm(null)}
              className="px-3 py-1 rounded-lg text-sm font-crayon text-gray-500"
            >
              Reset
            </button>
            <button
              onClick={() => setCustomBpm((prev) => Math.min(180, (prev || currentBpm) + 10))}
              className="px-3 py-1 rounded-lg text-sm font-display"
              style={{ backgroundColor: `${rhythmData.color}20`, color: rhythmData.color }}
            >
              Faster
            </button>
          </div>
        </div>

        {/* Current phrase */}
        <div className="bg-white rounded-2xl border-4 shadow-lg p-6 mb-6"
             style={{ borderColor: contentData.color }}>
          <p className="text-center font-crayon text-gray-500 text-sm mb-2">
            Practice saying:
          </p>
          
          <p className="text-center font-display text-2xl mb-4"
             style={{ color: contentData.color }}>
            {currentItem?.text}
          </p>

          {currentItem?.isBreathing && (
            <p className="text-center text-sm text-gray-500 font-crayon mb-4">
              🌬️ Focus on your breathing with this rhythm
            </p>
          )}

          {/* Listen button */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => speak(currentItem?.text, 0.7)}
              className="px-4 py-2 rounded-xl text-white font-crayon flex items-center gap-2"
              style={{ backgroundColor: contentData.color }}
            >
              <Volume2 size={18} />
              Listen
            </button>
          </div>

          {/* Syllable hint */}
          <p className="text-center text-xs text-gray-400 font-crayon mt-3">
            {currentItem?.syllables} syllables - try one syllable per beat
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={prevPhrase}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl"
          >
            Previous
          </button>
          <button
            onClick={nextPhrase}
            className="flex-1 py-3 text-white font-display rounded-xl"
            style={{ backgroundColor: contentData.color }}
          >
            Next
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {contentData?.items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPhrase(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentPhrase ? 'w-6' : ''
              }`}
              style={{ 
                backgroundColor: idx === currentPhrase ? contentData.color : '#E5E7EB' 
              }}
            />
          ))}
        </div>

        {/* Quick tips reminder */}
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <p className="text-sm text-purple-700 font-crayon text-center">
            💡 <strong>Tip:</strong> Speak each syllable with one beat. 
            It's okay to go slow!
          </p>
        </div>
      </main>

      {/* Tips Modal */}
      {showTips && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 max-w-md shadow-2xl">
            <h2 className="text-xl font-display text-[#8E6BBF] mb-4 flex items-center gap-2">
              <Heart size={24} />
              Fluency Tips
            </h2>
            <div className="space-y-4">
              {FLUENCY_TIPS.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h4 className="font-display text-[#8E6BBF]">{tip.title}</h4>
                    <p className="text-sm text-gray-600 font-crayon">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTips(false)}
              className="w-full mt-6 py-3 bg-[#8E6BBF] text-white font-display rounded-xl"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RhythmSpeech;
