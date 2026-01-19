// MusicSounds.jsx - Calming music and ambient sounds for ATLASassist
// FIXED: Seamless looping using Web Audio API buffer instead of HTML5 Audio
// This eliminates the pause when ambient sounds restart

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Moon,
  Music,
  Timer,
  X,
} from 'lucide-react';
import { getAudioContext, createNoiseBuffer } from '../services/soundUtils';

// Timer presets
const TIMER_PRESETS = [
  { label: '5 min', seconds: 5 * 60 },
  { label: '10 min', seconds: 10 * 60 },
  { label: '15 min', seconds: 15 * 60 },
  { label: '30 min', seconds: 30 * 60 },
  { label: '1 hour', seconds: 60 * 60 },
];

// Sound categories
const SOUND_CATEGORIES = [
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    color: '#5CB85C',
    sounds: [
      { id: 'rain', name: 'Rain', emoji: '🌧️', file: '/sounds/ambient/rain.mp3', synth: 'rain' },
      { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', file: '/sounds/ambient/ocean.mp3', synth: 'ocean' },
      { id: 'wind', name: 'Gentle Wind', emoji: '💨', file: '/sounds/ambient/wind.mp3', synth: 'wind' },
      { id: 'stream', name: 'Stream', emoji: '🏞️', file: '/sounds/ambient/stream.mp3', synth: 'stream' },
    ],
  },
  {
    id: 'ambient',
    name: 'Ambient',
    emoji: '✨',
    color: '#8E6BBF',
    sounds: [
      { id: 'drone', name: 'Deep Drone', emoji: '🎵', synth: 'drone' },
      { id: 'shimmer', name: 'Shimmer', emoji: '⭐', synth: 'shimmer' },
      { id: 'hum', name: 'Soft Hum', emoji: '🔔', synth: 'hum' },
      { id: 'space', name: 'Space', emoji: '🌌', synth: 'space' },
    ],
  },
  {
    id: 'calming',
    name: 'Brain Waves',
    emoji: '🧠',
    color: '#4A9FD4',
    sounds: [
      { id: 'focus', name: 'Focus Tones', emoji: '🎯', synth: 'binaural-focus' },
      { id: 'sleep', name: 'Sleep Waves', emoji: '😴', synth: 'binaural-sleep' },
      { id: 'relax', name: 'Relax Waves', emoji: '🧘', synth: 'binaural-relax' },
      { id: 'dream', name: 'Dream Waves', emoji: '💭', synth: 'binaural-dream' },
    ],
  },
  {
    id: 'tones',
    name: 'Tones',
    emoji: '🎶',
    color: '#F5A623',
    sounds: [
      { id: 'bowl', name: 'Singing Bowl', emoji: '🔔', file: '/sounds/ambient/singing-bowl.mp3', synth: 'bowl' },
      { id: 'chimes', name: 'Wind Chimes', emoji: '🎐', file: '/sounds/ambient/wind-chimes.mp3', synth: 'chimes' },
      { id: 'bell', name: 'Meditation Bell', emoji: '🛎️', file: '/sounds/ambient/meditation-bell.mp3', synth: 'meditation-bell' },
    ],
  },
];

// Active audio nodes management
const activeNodes = new Map();
const activeBufferSources = new Map();

// Stop a specific sound
const stopSound = (soundId) => {
  // Stop synthesized nodes
  const nodes = activeNodes.get(soundId);
  if (nodes) {
    nodes.oscillators?.forEach(osc => { try { osc.stop(); } catch (e) {} });
    nodes.sources?.forEach(src => { try { src.stop(); } catch (e) {} });
    if (nodes.interval) clearInterval(nodes.interval);
    activeNodes.delete(soundId);
  }
  
  // Stop buffer sources (for seamless looping)
  const bufferData = activeBufferSources.get(soundId);
  if (bufferData) {
    try {
      bufferData.source.stop();
      bufferData.gainNode.disconnect();
    } catch (e) {}
    activeBufferSources.delete(soundId);
  }
};

// Stop all sounds
const stopAllSounds = () => {
  activeNodes.forEach((_, id) => stopSound(id));
  activeBufferSources.forEach((_, id) => stopSound(id));
};

// Start synthesized sound
const startSynthSound = (soundId, synthType, volume) => {
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
      [1, 2, 3, 5].forEach((harmonic, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55 * harmonic, now);
        if (i > 0) osc.detune.setValueAtTime(Math.random() * 10 - 5, now);
        gain.gain.setValueAtTime(volume * (0.3 / (harmonic * harmonic)), now);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        nodes.oscillators.push(osc);
        nodes.gains.push(gain);
      });
      break;
    }
    
    case 'shimmer': {
      const frequencies = [880, 1047, 1319, 1568, 1760];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + i * 0.1, now);
        lfoGain.gain.setValueAtTime(volume * 0.05, now);
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        gain.gain.setValueAtTime(volume * 0.08, now);
        osc.connect(gain);
        gain.connect(ctx.destination);
        lfo.start();
        osc.start();
        nodes.oscillators.push(osc, lfo);
        nodes.gains.push(gain);
      });
      break;
    }
    
    case 'hum': {
      [1, 2, 3].forEach((harmonic) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110 * harmonic, now);
        gain.gain.setValueAtTime(volume * (0.2 / harmonic), now);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        nodes.oscillators.push(osc);
        nodes.gains.push(gain);
      });
      break;
    }
    
    case 'space': {
      const buffer = createNoiseBuffer(ctx, 2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(100, now);
      filter.Q.setValueAtTime(5, now);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.02, now);
      lfoGain.gain.setValueAtTime(50, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.15, now);
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
    
    case 'binaural-focus': {
      const merger = ctx.createChannelMerger(2);
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      leftOsc.frequency.setValueAtTime(200, now);
      rightOsc.frequency.setValueAtTime(214, now);
      leftOsc.type = 'sine';
      rightOsc.type = 'sine';
      leftGain.gain.setValueAtTime(volume * 0.3, now);
      rightGain.gain.setValueAtTime(volume * 0.3, now);
      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(ctx.destination);
      leftOsc.start();
      rightOsc.start();
      nodes.oscillators.push(leftOsc, rightOsc);
      nodes.gains.push(leftGain, rightGain);
      break;
    }
    
    case 'binaural-sleep': {
      const merger = ctx.createChannelMerger(2);
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      leftOsc.frequency.setValueAtTime(100, now);
      rightOsc.frequency.setValueAtTime(104, now);
      leftOsc.type = 'sine';
      rightOsc.type = 'sine';
      leftGain.gain.setValueAtTime(volume * 0.3, now);
      rightGain.gain.setValueAtTime(volume * 0.3, now);
      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(ctx.destination);
      leftOsc.start();
      rightOsc.start();
      nodes.oscillators.push(leftOsc, rightOsc);
      nodes.gains.push(leftGain, rightGain);
      break;
    }
    
    case 'binaural-relax': {
      const merger = ctx.createChannelMerger(2);
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      leftOsc.frequency.setValueAtTime(150, now);
      rightOsc.frequency.setValueAtTime(160, now);
      leftOsc.type = 'sine';
      rightOsc.type = 'sine';
      leftGain.gain.setValueAtTime(volume * 0.3, now);
      rightGain.gain.setValueAtTime(volume * 0.3, now);
      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(ctx.destination);
      leftOsc.start();
      rightOsc.start();
      nodes.oscillators.push(leftOsc, rightOsc);
      nodes.gains.push(leftGain, rightGain);
      break;
    }
    
    case 'binaural-dream': {
      const merger = ctx.createChannelMerger(2);
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      leftOsc.frequency.setValueAtTime(120, now);
      rightOsc.frequency.setValueAtTime(127, now);
      leftOsc.type = 'sine';
      rightOsc.type = 'sine';
      leftGain.gain.setValueAtTime(volume * 0.3, now);
      rightGain.gain.setValueAtTime(volume * 0.3, now);
      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(ctx.destination);
      leftOsc.start();
      rightOsc.start();
      nodes.oscillators.push(leftOsc, rightOsc);
      nodes.gains.push(leftGain, rightGain);
      break;
    }
    
    case 'bowl': {
      const playBowl = () => {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [1, 2, 3, 4.5, 6].forEach((harmonic, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(256 * harmonic, now);
          const amplitude = volume * (0.3 / (i + 1));
          gain.gain.setValueAtTime(amplitude, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(now + 8);
        });
      };
      playBowl();
      const interval = setInterval(playBowl, 10000);
      nodes.interval = interval;
      break;
    }
    
    case 'chimes': {
      const playChime = () => {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const frequencies = [523, 587, 659, 784, 880, 988, 1047];
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 2);
      };
      const interval = setInterval(playChime, 1500 + Math.random() * 2000);
      nodes.interval = interval;
      playChime();
      break;
    }
    
    case 'meditation-bell': {
      const playBell = () => {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [1, 2, 2.4, 3, 4].forEach((harmonic, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(432 * harmonic, now);
          gain.gain.setValueAtTime(volume * (0.4 / (i + 1)), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(now + 6);
        });
      };
      playBell();
      const interval = setInterval(playBell, 15000);
      nodes.interval = interval;
      break;
    }
  }
  
  activeNodes.set(soundId, nodes);
};

// Start sound using Web Audio API buffer for SEAMLESS looping (no pause on restart)
const startSound = async (sound, volume) => {
  // If has file, try to load and play with Web Audio API for seamless looping
  if (sound.file) {
    try {
      const ctx = getAudioContext();
      const response = await fetch(sound.file);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        
        // Create buffer source with seamless looping
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        // Set loop points to the entire buffer for seamless playback
        source.loopStart = 0;
        source.loopEnd = audioBuffer.duration;
        
        // Create gain node for volume control
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        
        // Connect and start
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        
        // Store reference for stopping and volume control
        activeBufferSources.set(sound.id, { source, gainNode });
        return;
      }
    } catch (e) {
      console.log('Using synthesized fallback for:', sound.id);
    }
  }
  
  // Fall back to synthesized
  startSynthSound(sound.id, sound.synth, volume);
};

// Main Component
const MusicSounds = () => {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(new Set());
  const [volume, setVolume] = useState(0.5);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopAllSounds();
            setPlaying(new Set());
            clearInterval(timerRef.current);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timeRemaining]);

  // Update volume for playing sounds
  useEffect(() => {
    activeBufferSources.forEach(({ gainNode }) => {
      try {
        gainNode.gain.setValueAtTime(volume, getAudioContext().currentTime);
      } catch (e) {}
    });
    activeNodes.forEach(({ gains }) => {
      gains?.forEach(g => {
        try { g.gain.setValueAtTime(volume * 0.3, getAudioContext().currentTime); } catch (e) {}
      });
    });
  }, [volume]);

  const toggleSound = async (sound) => {
    if (playing.has(sound.id)) {
      stopSound(sound.id);
      setPlaying(prev => {
        const next = new Set(prev);
        next.delete(sound.id);
        return next;
      });
    } else {
      await startSound(sound, volume);
      setPlaying(prev => new Set(prev).add(sound.id));
    }
  };

  const handleStopAll = () => {
    stopAllSounds();
    setPlaying(new Set());
  };

  const handleSetTimer = (seconds) => {
    setTimer(seconds);
    setTimeRemaining(seconds);
    setShowTimer(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-indigo-900/90 backdrop-blur-sm border-b-2 border-purple-500/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              stopAllSounds();
              navigate('/activities');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border-2 border-white/30 
                       rounded-xl font-display font-bold text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-white flex items-center gap-2">
              <Music size={20} />
              Calming Sounds
            </h1>
          </div>
          <button
            onClick={() => setShowTimer(true)}
            className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
          >
            <Timer size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Timer Display */}
        {timeRemaining !== null && (
          <div className="mb-4 p-3 bg-white/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Timer size={18} />
              <span className="font-crayon">Timer: {formatTime(timeRemaining)}</span>
            </div>
            <button
              onClick={() => { setTimeRemaining(null); setTimer(null); }}
              className="text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Now Playing */}
        {playing.size > 0 && (
          <div className="mb-6 p-4 bg-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-white flex items-center gap-2">
                <Volume2 size={18} className="animate-pulse" />
                Now Playing
              </h3>
              <button
                onClick={handleStopAll}
                className="px-3 py-1 bg-red-500/30 text-red-300 rounded-lg font-crayon text-sm
                         hover:bg-red-500/50 transition-all"
              >
                Stop All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...playing].map(id => {
                const sound = SOUND_CATEGORIES.flatMap(c => c.sounds).find(s => s.id === id);
                return sound ? (
                  <span key={id} className="px-3 py-1 bg-purple-500/30 rounded-full text-white font-crayon text-sm">
                    {sound.emoji} {sound.name}
                  </span>
                ) : null;
              })}
            </div>
            
            {/* Volume Control */}
            <div className="mt-4 flex items-center gap-3">
              <VolumeX size={16} className="text-white/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-purple-500"
              />
              <Volume2 size={16} className="text-white/60" />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SOUND_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`p-4 rounded-2xl border-2 transition-all text-center
                ${selectedCategory === category.id 
                  ? 'bg-white/20 border-white/50' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
            >
              <span className="text-3xl block mb-1">{category.emoji}</span>
              <span className="font-crayon text-white">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Sounds List */}
        {selectedCategory && (
          <div className="space-y-3">
            {SOUND_CATEGORIES.find(c => c.id === selectedCategory)?.sounds.map(sound => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound)}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all
                  ${playing.has(sound.id)
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
              >
                <span className="text-3xl">{sound.emoji}</span>
                <div className="flex-1 text-left">
                  <span className="font-display text-white">{sound.name}</span>
                </div>
                <div className={`p-2 rounded-full ${playing.has(sound.id) ? 'bg-purple-500' : 'bg-white/20'}`}>
                  {playing.has(sound.id) ? (
                    <Pause size={20} className="text-white" />
                  ) : (
                    <Play size={20} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Mix */}
        {!selectedCategory && (
          <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/20">
            <h3 className="font-display text-white mb-3 flex items-center gap-2">
              <Moon size={18} />
              Quick Mixes
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Sleep Mode', sounds: ['rain', 'sleep'], emoji: '😴' },
                { name: 'Focus Time', sounds: ['drone', 'focus'], emoji: '🎯' },
                { name: 'Relax', sounds: ['ocean', 'shimmer'], emoji: '🧘' },
              ].map(mix => (
                <button
                  key={mix.name}
                  onClick={async () => {
                    stopAllSounds();
                    const allSounds = SOUND_CATEGORIES.flatMap(c => c.sounds);
                    const newPlaying = new Set();
                    for (const id of mix.sounds) {
                      const sound = allSounds.find(s => s.id === id);
                      if (sound) {
                        await startSound(sound, volume);
                        newPlaying.add(id);
                      }
                    }
                    setPlaying(newPlaying);
                  }}
                  className="w-full p-3 bg-white/10 rounded-xl text-white font-crayon
                           hover:bg-white/20 transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">{mix.emoji}</span>
                  {mix.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-purple-500/20 rounded-2xl border border-purple-400/30">
          <h3 className="font-display text-purple-200 mb-2 flex items-center gap-2">
            <Moon size={18} />
            Tips
          </h3>
          <ul className="font-crayon text-sm text-purple-200/80 space-y-1">
            <li>• Mix different sounds together</li>
            <li>• Use headphones for Brain Waves (binaural beats)</li>
            <li>• Set a timer for sleep sounds</li>
          </ul>
        </div>
      </main>

      {/* Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-indigo-900 rounded-2xl max-w-sm w-full border-2 border-purple-500/50 overflow-hidden">
            <div className="p-4 bg-purple-500/30 flex items-center justify-between">
              <h3 className="font-display text-white flex items-center gap-2">
                <Timer size={20} />
                Set Timer
              </h3>
              <button onClick={() => setShowTimer(false)} className="text-white/60 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {TIMER_PRESETS.map(preset => (
                <button
                  key={preset.seconds}
                  onClick={() => handleSetTimer(preset.seconds)}
                  className="w-full p-3 bg-white/10 rounded-xl text-white font-crayon
                           hover:bg-white/20 transition-all"
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={() => setShowTimer(false)}
                className="w-full p-3 bg-white/5 rounded-xl text-white/60 font-crayon
                         hover:bg-white/10 transition-all"
              >
                No Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicSounds;
