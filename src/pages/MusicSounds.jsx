// MusicSounds.jsx - Music & Sounds app for ATLASassist
// Features calming music, nature sounds, and fun sound effects
// Helps with relaxation, sensory regulation, and engagement

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Music,
  Cloud,
  Bird,
  Waves,
  Wind,
  Sparkles,
  Heart,
  Moon,
  Sun,
  Zap,
  Timer,
  RotateCcw
} from 'lucide-react';

// Sound categories with Web Audio API frequencies/patterns
const SOUND_CATEGORIES = [
  {
    id: 'calming',
    name: 'Calming Sounds',
    emoji: '🧘',
    color: '#8E6BBF',
    description: 'Relaxing sounds for calm moments',
    sounds: [
      { id: 'rain', name: 'Rain', emoji: '🌧️', type: 'noise', frequency: 'pink' },
      { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', type: 'wave', frequency: 0.1 },
      { id: 'wind', name: 'Gentle Wind', emoji: '🍃', type: 'noise', frequency: 'brown' },
      { id: 'heartbeat', name: 'Heartbeat', emoji: '💗', type: 'pulse', frequency: 1.2 },
      { id: 'humming', name: 'Soft Hum', emoji: '🎵', type: 'tone', frequency: 220 },
      { id: 'chimes', name: 'Wind Chimes', emoji: '🔔', type: 'chimes', frequency: 440 },
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    color: '#5CB85C',
    description: 'Sounds from the outdoors',
    sounds: [
      { id: 'birds', name: 'Birds Singing', emoji: '🐦', type: 'chirp', frequency: 800 },
      { id: 'creek', name: 'Babbling Brook', emoji: '💧', type: 'noise', frequency: 'white' },
      { id: 'thunder', name: 'Distant Thunder', emoji: '⛈️', type: 'rumble', frequency: 60 },
      { id: 'forest', name: 'Forest', emoji: '🌲', type: 'ambient', frequency: 'pink' },
      { id: 'crickets', name: 'Crickets', emoji: '🦗', type: 'chirp', frequency: 4000 },
      { id: 'campfire', name: 'Campfire', emoji: '🔥', type: 'crackle', frequency: 200 },
    ]
  },
  {
    id: 'fun',
    name: 'Fun Sounds',
    emoji: '🎉',
    color: '#F5A623',
    description: 'Playful sounds and effects',
    sounds: [
      { id: 'pop', name: 'Pop!', emoji: '🎈', type: 'pop', frequency: 600 },
      { id: 'whoosh', name: 'Whoosh', emoji: '💨', type: 'sweep', frequency: 200 },
      { id: 'ding', name: 'Ding!', emoji: '🔔', type: 'bell', frequency: 880 },
      { id: 'boing', name: 'Boing!', emoji: '🏀', type: 'bounce', frequency: 300 },
      { id: 'sparkle', name: 'Sparkle', emoji: '✨', type: 'sparkle', frequency: 1200 },
      { id: 'laugh', name: 'Giggle', emoji: '😊', type: 'wobble', frequency: 400 },
    ]
  },
  {
    id: 'music',
    name: 'Simple Music',
    emoji: '🎹',
    color: '#4A9FD4',
    description: 'Gentle musical tones',
    sounds: [
      { id: 'lullaby', name: 'Lullaby', emoji: '🌙', type: 'melody', notes: [262, 294, 330, 294, 262] },
      { id: 'happy', name: 'Happy Tune', emoji: '😄', type: 'melody', notes: [330, 392, 440, 392, 330, 392, 440] },
      { id: 'piano-c', name: 'Piano C', emoji: '🎹', type: 'tone', frequency: 262 },
      { id: 'piano-e', name: 'Piano E', emoji: '🎹', type: 'tone', frequency: 330 },
      { id: 'piano-g', name: 'Piano G', emoji: '🎹', type: 'tone', frequency: 392 },
      { id: 'xylophone', name: 'Xylophone', emoji: '🎵', type: 'xylo', frequency: 523 },
    ]
  },
];

// Sleep timer options (in minutes)
const TIMER_OPTIONS = [5, 10, 15, 30, 60];

const MusicSounds = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(null);
  const [timerRemaining, setTimerRemaining] = useState(null);
  
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Initialize Audio Context
  useEffect(() => {
    return () => {
      stopSound();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepTimer && timerRemaining === null) {
      setTimerRemaining(sleepTimer * 60);
    }
    
    if (timerRemaining !== null && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            stopSound();
            setSleepTimer(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timerIntervalRef.current);
    }
  }, [sleepTimer, timerRemaining]);

  // Create audio context on demand
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Generate white/pink/brown noise
  const createNoiseBuffer = (type) => {
    const ctx = getAudioContext();
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'white') {
        output[i] = white * 0.5;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        output[i] = (b0 = (b0 + (0.02 * white)) / 1.02) * 3.5;
      }
    }
    
    return buffer;
  };

  // Play a sound
  const playSound = (sound) => {
    stopSound();
    
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    gainNodeRef.current.connect(ctx.destination);
    
    try {
      switch (sound.type) {
        case 'noise':
          // Pink/white/brown noise
          const noiseBuffer = createNoiseBuffer(sound.frequency);
          noiseNodeRef.current = ctx.createBufferSource();
          noiseNodeRef.current.buffer = noiseBuffer;
          noiseNodeRef.current.loop = true;
          noiseNodeRef.current.connect(gainNodeRef.current);
          noiseNodeRef.current.start();
          break;
          
        case 'tone':
          // Simple oscillator tone
          oscillatorRef.current = ctx.createOscillator();
          oscillatorRef.current.type = 'sine';
          oscillatorRef.current.frequency.value = sound.frequency;
          oscillatorRef.current.connect(gainNodeRef.current);
          oscillatorRef.current.start();
          break;
          
        case 'wave':
          // Oscillating volume for wave effect
          oscillatorRef.current = ctx.createOscillator();
          oscillatorRef.current.type = 'sine';
          oscillatorRef.current.frequency.value = 200;
          
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = sound.frequency;
          lfoGain.gain.value = volume * 0.5;
          
          lfo.connect(lfoGain);
          lfoGain.connect(gainNodeRef.current.gain);
          
          oscillatorRef.current.connect(gainNodeRef.current);
          oscillatorRef.current.start();
          lfo.start();
          break;
          
        case 'pulse':
          // Heartbeat-like pulse
          const pulseOsc = ctx.createOscillator();
          pulseOsc.type = 'sine';
          pulseOsc.frequency.value = 80;
          
          const pulseGain = ctx.createGain();
          pulseGain.gain.value = 0;
          
          // Create pulse envelope
          const pulseLFO = ctx.createOscillator();
          pulseLFO.frequency.value = sound.frequency;
          
          const pulseLFOGain = ctx.createGain();
          pulseLFOGain.gain.value = volume;
          
          pulseLFO.connect(pulseLFOGain);
          pulseLFOGain.connect(pulseGain.gain);
          
          pulseOsc.connect(pulseGain);
          pulseGain.connect(ctx.destination);
          
          pulseOsc.start();
          pulseLFO.start();
          oscillatorRef.current = pulseOsc;
          break;
          
        case 'chirp':
          // Bird chirp simulation
          const chirpInterval = setInterval(() => {
            if (!audioContextRef.current) {
              clearInterval(chirpInterval);
              return;
            }
            const chirp = ctx.createOscillator();
            const chirpGain = ctx.createGain();
            chirp.type = 'sine';
            chirp.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
            chirp.frequency.exponentialRampToValueAtTime(sound.frequency * 1.5, ctx.currentTime + 0.1);
            chirpGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.3, ctx.currentTime);
            chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            chirp.connect(chirpGain);
            chirpGain.connect(ctx.destination);
            chirp.start();
            chirp.stop(ctx.currentTime + 0.2);
          }, 2000 + Math.random() * 3000);
          noiseNodeRef.current = { stop: () => clearInterval(chirpInterval) };
          break;
          
        case 'chimes':
          // Wind chimes
          const chimesInterval = setInterval(() => {
            if (!audioContextRef.current) {
              clearInterval(chimesInterval);
              return;
            }
            const frequencies = [440, 523, 587, 659, 784];
            const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
            const chime = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chime.type = 'sine';
            chime.frequency.value = freq;
            chimeGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.2, ctx.currentTime);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
            chime.connect(chimeGain);
            chimeGain.connect(ctx.destination);
            chime.start();
            chime.stop(ctx.currentTime + 2);
          }, 1500 + Math.random() * 2000);
          noiseNodeRef.current = { stop: () => clearInterval(chimesInterval) };
          break;
          
        case 'melody':
          // Play a simple melody
          let noteIndex = 0;
          const melodyInterval = setInterval(() => {
            if (!audioContextRef.current || noteIndex >= sound.notes.length) {
              noteIndex = 0;
            }
            const note = ctx.createOscillator();
            const noteGain = ctx.createGain();
            note.type = 'sine';
            note.frequency.value = sound.notes[noteIndex];
            noteGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.3, ctx.currentTime);
            noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            note.connect(noteGain);
            noteGain.connect(ctx.destination);
            note.start();
            note.stop(ctx.currentTime + 0.5);
            noteIndex++;
          }, 600);
          noiseNodeRef.current = { stop: () => clearInterval(melodyInterval) };
          break;
          
        case 'pop':
        case 'ding':
        case 'bounce':
        case 'sparkle':
        case 'sweep':
        case 'wobble':
        case 'bell':
        case 'xylo':
          // One-shot sound effects (play once, then can replay)
          const fx = ctx.createOscillator();
          const fxGain = ctx.createGain();
          fx.type = sound.type === 'bell' || sound.type === 'xylo' ? 'triangle' : 'sine';
          fx.frequency.value = sound.frequency;
          
          if (sound.type === 'sweep' || sound.type === 'whoosh') {
            fx.frequency.exponentialRampToValueAtTime(sound.frequency * 4, ctx.currentTime + 0.3);
          } else if (sound.type === 'bounce') {
            fx.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
            fx.frequency.exponentialRampToValueAtTime(sound.frequency * 2, ctx.currentTime + 0.05);
            fx.frequency.exponentialRampToValueAtTime(sound.frequency, ctx.currentTime + 0.1);
          } else if (sound.type === 'wobble') {
            const wobbleLFO = ctx.createOscillator();
            wobbleLFO.frequency.value = 8;
            const wobbleGain = ctx.createGain();
            wobbleGain.gain.value = 50;
            wobbleLFO.connect(wobbleGain);
            wobbleGain.connect(fx.frequency);
            wobbleLFO.start();
            wobbleLFO.stop(ctx.currentTime + 0.5);
          }
          
          fxGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
          fxGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          
          fx.connect(fxGain);
          fxGain.connect(ctx.destination);
          fx.start();
          fx.stop(ctx.currentTime + 0.5);
          
          // Don't set as playing (one-shot)
          return;
          
        default:
          // Default tone
          oscillatorRef.current = ctx.createOscillator();
          oscillatorRef.current.type = 'sine';
          oscillatorRef.current.frequency.value = 440;
          oscillatorRef.current.connect(gainNodeRef.current);
          oscillatorRef.current.start();
      }
      
      setPlayingSound(sound.id);
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  };

  // Stop current sound
  const stopSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (noiseNodeRef.current) {
        if (noiseNodeRef.current.stop) noiseNodeRef.current.stop();
        if (noiseNodeRef.current.disconnect) noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    } catch (e) {
      // Ignore errors on stop
    }
    setPlayingSound(null);
  };

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Category view
  if (selectedCategory) {
    const category = SOUND_CATEGORIES.find(c => c.id === selectedCategory);
    
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: category.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                stopSound();
                setSelectedCategory(null);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl font-display font-bold transition-all shadow-md"
              style={{ borderColor: category.color, color: category.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display crayon-text" style={{ color: category.color }}>
                {category.emoji} {category.name}
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Volume Control */}
          <div className="bg-white rounded-2xl border-3 p-4 mb-6" style={{ borderColor: `${category.color}40` }}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {isMuted ? <VolumeX size={24} className="text-gray-400" /> : <Volume2 size={24} style={{ color: category.color }} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${category.color} ${volume * 100}%, #e5e5e5 ${volume * 100}%)` }}
              />
              <span className="font-crayon text-gray-600 w-12">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Sleep Timer */}
          <div className="bg-white rounded-2xl border-3 p-4 mb-6" style={{ borderColor: `${category.color}40` }}>
            <div className="flex items-center gap-3 mb-3">
              <Timer size={20} style={{ color: category.color }} />
              <span className="font-display text-gray-700">Sleep Timer</span>
              {timerRemaining !== null && (
                <span className="ml-auto font-crayon text-lg" style={{ color: category.color }}>
                  {formatTimer(timerRemaining)}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {TIMER_OPTIONS.map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    if (sleepTimer === mins) {
                      setSleepTimer(null);
                      setTimerRemaining(null);
                    } else {
                      setSleepTimer(mins);
                      setTimerRemaining(mins * 60);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full font-crayon text-sm transition-all
                    ${sleepTimer === mins 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  style={{ backgroundColor: sleepTimer === mins ? category.color : undefined }}
                >
                  {mins}m
                </button>
              ))}
              {sleepTimer && (
                <button
                  onClick={() => {
                    setSleepTimer(null);
                    setTimerRemaining(null);
                  }}
                  className="px-3 py-1.5 rounded-full font-crayon text-sm text-red-500 hover:bg-red-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Sound Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {category.sounds.map(sound => {
              const isPlaying = playingSound === sound.id;
              const isOneShot = ['pop', 'ding', 'bounce', 'sparkle', 'sweep', 'wobble', 'bell', 'xylo'].includes(sound.type);
              
              return (
                <button
                  key={sound.id}
                  onClick={() => {
                    if (isPlaying && !isOneShot) {
                      stopSound();
                    } else {
                      playSound(sound);
                    }
                  }}
                  className={`
                    p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all
                    ${isPlaying && !isOneShot
                      ? 'scale-105 shadow-lg animate-pulse' 
                      : 'hover:scale-102 hover:shadow-md'
                    }
                  `}
                  style={{ 
                    backgroundColor: isPlaying && !isOneShot ? category.color : 'white',
                    borderColor: category.color,
                    color: isPlaying && !isOneShot ? 'white' : category.color,
                  }}
                >
                  <span className="text-4xl">{sound.emoji}</span>
                  <span className="font-crayon text-sm text-center">
                    {sound.name}
                  </span>
                  {!isOneShot && (
                    <span className={`text-xs ${isPlaying ? 'text-white/80' : 'text-gray-400'}`}>
                      {isPlaying ? '▪️ Playing' : '▶️ Tap to play'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Currently Playing */}
          {playingSound && (
            <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
              <div 
                className="bg-white rounded-2xl border-4 p-4 shadow-lg flex items-center gap-4"
                style={{ borderColor: category.color }}
              >
                <div className="flex-1">
                  <p className="font-crayon text-gray-600">Now Playing</p>
                  <p className="font-display" style={{ color: category.color }}>
                    {category.sounds.find(s => s.id === playingSound)?.name}
                  </p>
                </div>
                <button
                  onClick={stopSound}
                  className="p-3 rounded-full text-white"
                  style={{ backgroundColor: category.color }}
                >
                  <Pause size={24} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Main category selection
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#87CEEB]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#87CEEB] 
                       rounded-xl font-display font-bold text-[#87CEEB] hover:bg-[#87CEEB] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#87CEEB] crayon-text">
              🎵 Music & Sounds
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Tap a category to explore sounds!
        </p>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SOUND_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="p-6 rounded-2xl border-4 text-left transition-all transform hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: category.color, borderColor: category.color }}
            >
              <span className="text-4xl block mb-3">{category.emoji}</span>
              <h2 className="text-xl font-display text-white mb-1">{category.name}</h2>
              <p className="text-white/80 font-crayon text-sm">{category.description}</p>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <p className="text-center text-blue-700 font-crayon text-sm">
            🎧 <strong>Tip:</strong> Use headphones for the best experience. 
            The sleep timer will automatically stop sounds.
          </p>
        </div>
      </main>
    </div>
  );
};

export default MusicSounds;
