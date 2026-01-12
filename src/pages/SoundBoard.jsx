// SoundBoard.jsx - Interactive sound board for communication and play
// Plays various sounds for expression and sensory input

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Music, Star } from 'lucide-react';

// Sound categories with Web Audio API generated sounds
const SOUND_CATEGORIES = [
  {
    id: 'emotions',
    name: 'Feelings',
    emoji: '😊',
    color: 'bg-pink-100 border-pink-400',
    sounds: [
      { id: 'happy', label: 'Happy', emoji: '😊', freq: [523, 659, 784], type: 'triangle' },
      { id: 'sad', label: 'Sad', emoji: '😢', freq: [220, 196, 175], type: 'sine' },
      { id: 'excited', label: 'Excited', emoji: '🤩', freq: [600, 700, 800, 900], type: 'square' },
      { id: 'calm', label: 'Calm', emoji: '😌', freq: [280, 350], type: 'sine' },
      { id: 'silly', label: 'Silly', emoji: '🤪', freq: [400, 500, 300, 600], type: 'sawtooth' },
      { id: 'proud', label: 'Proud', emoji: '🥳', freq: [523, 659, 784, 1047], type: 'triangle' },
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    color: 'bg-green-100 border-green-400',
    sounds: [
      { id: 'dog', label: 'Dog', emoji: '🐕', freq: [400, 500, 400], type: 'sawtooth' },
      { id: 'cat', label: 'Cat', emoji: '🐱', freq: [700, 800, 700, 600], type: 'triangle' },
      { id: 'bird', label: 'Bird', emoji: '🐦', freq: [1200, 1400, 1200, 1000], type: 'sine' },
      { id: 'cow', label: 'Cow', emoji: '🐄', freq: [150, 140, 130], type: 'sawtooth' },
      { id: 'duck', label: 'Duck', emoji: '🦆', freq: [500, 450, 500, 450], type: 'square' },
      { id: 'frog', label: 'Frog', emoji: '🐸', freq: [200, 300, 200], type: 'square' },
    ]
  },
  {
    id: 'actions',
    name: 'Actions',
    emoji: '✋',
    color: 'bg-blue-100 border-blue-400',
    sounds: [
      { id: 'yes', label: 'Yes!', emoji: '✅', freq: [523, 659, 784], type: 'triangle' },
      { id: 'no', label: 'No', emoji: '❌', freq: [300, 250, 200], type: 'square' },
      { id: 'help', label: 'Help', emoji: '🆘', freq: [800, 600, 800, 600], type: 'sine' },
      { id: 'stop', label: 'Stop', emoji: '🛑', freq: [400, 200], type: 'square' },
      { id: 'go', label: 'Go!', emoji: '🟢', freq: [400, 500, 600, 700], type: 'triangle' },
      { id: 'wait', label: 'Wait', emoji: '⏸️', freq: [350, 350, 350], type: 'sine' },
    ]
  },
  {
    id: 'fun',
    name: 'Fun Sounds',
    emoji: '🎉',
    color: 'bg-yellow-100 border-yellow-400',
    sounds: [
      { id: 'tada', label: 'Ta-da!', emoji: '🎉', freq: [392, 494, 587, 784], type: 'triangle' },
      { id: 'boing', label: 'Boing', emoji: '🏀', freq: [200, 400, 200, 400], type: 'sine' },
      { id: 'whoosh', label: 'Whoosh', emoji: '💨', freq: [100, 200, 400, 800], type: 'sawtooth' },
      { id: 'pop', label: 'Pop', emoji: '🎈', freq: [1000, 100], type: 'square' },
      { id: 'ding', label: 'Ding', emoji: '🔔', freq: [880, 1047], type: 'sine' },
      { id: 'magic', label: 'Magic', emoji: '✨', freq: [523, 698, 880, 1047, 1319], type: 'triangle' },
    ]
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    color: 'bg-purple-100 border-purple-400',
    sounds: [
      { id: 'do', label: 'Do', emoji: '🎹', freq: [262], type: 'sine', long: true },
      { id: 're', label: 'Re', emoji: '🎹', freq: [294], type: 'sine', long: true },
      { id: 'mi', label: 'Mi', emoji: '🎹', freq: [330], type: 'sine', long: true },
      { id: 'fa', label: 'Fa', emoji: '🎹', freq: [349], type: 'sine', long: true },
      { id: 'sol', label: 'Sol', emoji: '🎹', freq: [392], type: 'sine', long: true },
      { id: 'la', label: 'La', emoji: '🎹', freq: [440], type: 'sine', long: true },
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    color: 'bg-teal-100 border-teal-400',
    sounds: [
      { id: 'rain', label: 'Rain', emoji: '🌧️', noise: true, filter: 'lowpass' },
      { id: 'wind', label: 'Wind', emoji: '🌬️', noise: true, filter: 'bandpass' },
      { id: 'thunder', label: 'Thunder', emoji: '⛈️', freq: [80, 60, 40, 30], type: 'sawtooth' },
      { id: 'ocean', label: 'Ocean', emoji: '🌊', noise: true, filter: 'lowpass', slow: true },
      { id: 'cricket', label: 'Cricket', emoji: '🦗', freq: [4000, 4200, 4000, 4200], type: 'square' },
      { id: 'owl', label: 'Owl', emoji: '🦉', freq: [400, 350, 400], type: 'sine' },
    ]
  },
];

const SoundBoard = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('emotions');
  const [playingSound, setPlayingSound] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snw_soundboard_favorites') || '[]');
    } catch {
      return [];
    }
  });
  
  const audioContextRef = useRef(null);

  // Initialize audio context on first interaction
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Play a sound
  const playSound = (sound) => {
    if (isMuted) return;
    
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    setPlayingSound(sound.id);

    if (sound.noise) {
      // Generate noise (rain, wind, ocean)
      playNoise(ctx, sound);
    } else {
      // Generate tonal sound
      playTone(ctx, sound);
    }

    // Clear playing state
    const duration = sound.long ? 800 : sound.noise ? 1500 : 400;
    setTimeout(() => setPlayingSound(null), duration);
  };

  // Play tonal sounds
  const playTone = (ctx, sound) => {
    const frequencies = sound.freq;
    const duration = sound.long ? 0.6 : 0.15;
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = sound.type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * duration));
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime + (i * duration));
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i * duration) + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + (i * duration));
      osc.stop(ctx.currentTime + (i * duration) + duration + 0.1);
    });
  };

  // Play noise-based sounds
  const playNoise = (ctx, sound) => {
    const bufferSize = ctx.sampleRate * (sound.slow ? 2 : 1);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = sound.filter || 'lowpass';
    filter.frequency.setValueAtTime(sound.filter === 'bandpass' ? 1000 : 2000, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start();
    source.stop(ctx.currentTime + 1.5);
  };

  // Toggle favorite
  const toggleFavorite = (soundId) => {
    const newFavorites = favorites.includes(soundId)
      ? favorites.filter(id => id !== soundId)
      : [...favorites, soundId];
    setFavorites(newFavorites);
    localStorage.setItem('snw_soundboard_favorites', JSON.stringify(newFavorites));
  };

  // Get current category
  const currentCategory = SOUND_CATEGORIES.find(c => c.id === activeCategory);

  // Get favorite sounds
  const favoriteSounds = SOUND_CATEGORIES.flatMap(cat => 
    cat.sounds.filter(s => favorites.includes(s.id))
  );

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#F5A623] crayon-text">
              🔊 Sound Board
            </h1>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-full border-3 transition-all ${
              isMuted 
                ? 'bg-gray-200 border-gray-400 text-gray-600' 
                : 'bg-green-100 border-green-400 text-green-600'
            }`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide">
          {favorites.length > 0 && (
            <button
              onClick={() => setActiveCategory('favorites')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-crayon text-sm border-3 transition-all
                ${activeCategory === 'favorites'
                  ? 'bg-yellow-200 border-yellow-500 text-yellow-800 scale-105'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-yellow-400'
                }`}
            >
              ⭐ Favorites
            </button>
          )}
          {SOUND_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-crayon text-sm border-3 transition-all
                ${activeCategory === cat.id
                  ? `${cat.color} scale-105`
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        {activeCategory === 'favorites' && (
          <div className="mb-6">
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <Star size={20} className="text-yellow-500" fill="currentColor" />
              My Favorites
            </h2>
            {favoriteSounds.length === 0 ? (
              <p className="text-gray-500 font-crayon text-center py-8">
                Tap the ⭐ on any sound to add it to favorites!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {favoriteSounds.map(sound => (
                  <button
                    key={sound.id}
                    onClick={() => playSound(sound)}
                    className={`relative p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300
                               flex flex-col items-center gap-2 transition-all
                               hover:scale-105 hover:shadow-lg active:scale-95
                               ${playingSound === sound.id ? 'animate-pulse bg-yellow-200' : ''}`}
                  >
                    <span className="text-4xl">{sound.emoji}</span>
                    <span className="font-crayon text-sm text-gray-700">{sound.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sound Grid */}
        {activeCategory !== 'favorites' && currentCategory && (
          <div>
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">{currentCategory.emoji}</span>
              {currentCategory.name}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {currentCategory.sounds.map(sound => (
                <div key={sound.id} className="relative">
                  <button
                    onClick={() => playSound(sound)}
                    className={`w-full p-4 rounded-2xl border-3 ${currentCategory.color}
                               flex flex-col items-center gap-2 transition-all
                               hover:scale-105 hover:shadow-lg active:scale-95
                               ${playingSound === sound.id ? 'animate-pulse scale-105' : ''}`}
                  >
                    <span className="text-4xl">{sound.emoji}</span>
                    <span className="font-crayon text-sm text-gray-700">{sound.label}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(sound.id);
                    }}
                    className={`absolute -top-1 -right-1 w-7 h-7 rounded-full border-2 
                               flex items-center justify-center text-sm transition-all
                               ${favorites.includes(sound.id)
                                 ? 'bg-yellow-400 border-yellow-500 text-white'
                                 : 'bg-white border-gray-300 text-gray-400 hover:border-yellow-400'
                               }`}
                  >
                    ⭐
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <h3 className="font-display text-blue-700 mb-2 flex items-center gap-2">
            <Music size={18} />
            How to Use
          </h3>
          <ul className="font-crayon text-sm text-blue-600 space-y-1">
            <li>• Tap any sound to play it</li>
            <li>• Tap ⭐ to save favorites</li>
            <li>• Use the mute button to turn sound off</li>
            <li>• Great for communication and sensory play!</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SoundBoard;
