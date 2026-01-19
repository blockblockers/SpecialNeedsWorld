// MusicSounds.jsx - Music & Sounds app for ATLASassist
// UPDATED: Uses REAL audio files from free, royalty-free sources
// Features calming music, nature sounds, and ambient soundscapes

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Music,
  Timer,
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';

// =====================================================
// REAL SOUND URLS - Free, royalty-free sources
// =====================================================
// Sources: Pixabay, Freesound (CC0), and other free audio CDNs
// All sounds are loopable ambient/nature sounds

const SOUND_CATEGORIES = [
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    color: '#5CB85C',
    description: 'Peaceful sounds from outdoors',
    sounds: [
      { 
        id: 'rain', 
        name: 'Rain', 
        emoji: '🌧️',
        // Gentle rain sound
        url: 'https://cdn.pixabay.com/audio/2022/05/16/audio_137b28f0f4.mp3',
        duration: 'loop'
      },
      { 
        id: 'ocean', 
        name: 'Ocean Waves', 
        emoji: '🌊',
        // Ocean waves on beach
        url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3',
        duration: 'loop'
      },
      { 
        id: 'forest', 
        name: 'Forest', 
        emoji: '🌲',
        // Forest ambience with birds
        url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3',
        duration: 'loop'
      },
      { 
        id: 'birds', 
        name: 'Birds Singing', 
        emoji: '🐦',
        // Morning birds chirping
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8f4e2dbe8a.mp3',
        duration: 'loop'
      },
      { 
        id: 'creek', 
        name: 'Stream', 
        emoji: '💧',
        // Babbling brook / stream
        url: 'https://cdn.pixabay.com/audio/2022/02/07/audio_9ee41f67de.mp3',
        duration: 'loop'
      },
      { 
        id: 'thunder', 
        name: 'Thunderstorm', 
        emoji: '⛈️',
        // Thunder and rain storm
        url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3c6c78735a.mp3',
        duration: 'loop'
      },
    ]
  },
  {
    id: 'calming',
    name: 'Calming',
    emoji: '🧘',
    color: '#8E6BBF',
    description: 'Relaxing sounds for calm moments',
    sounds: [
      { 
        id: 'whitenoise', 
        name: 'White Noise', 
        emoji: '📺',
        // Gentle white noise
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_a8a22fd4f0.mp3',
        duration: 'loop'
      },
      { 
        id: 'fireplace', 
        name: 'Fireplace', 
        emoji: '🔥',
        // Crackling fireplace
        url: 'https://cdn.pixabay.com/audio/2021/08/08/audio_dc8aa983ab.mp3',
        duration: 'loop'
      },
      { 
        id: 'wind', 
        name: 'Gentle Wind', 
        emoji: '🍃',
        // Soft wind blowing
        url: 'https://cdn.pixabay.com/audio/2022/01/20/audio_3ee1cf6b32.mp3',
        duration: 'loop'
      },
      { 
        id: 'night', 
        name: 'Night Sounds', 
        emoji: '🌙',
        // Crickets and night ambience
        url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
        duration: 'loop'
      },
      { 
        id: 'fan', 
        name: 'Fan', 
        emoji: '🌀',
        // Electric fan / air conditioner hum
        url: 'https://cdn.pixabay.com/audio/2022/11/17/audio_7e3b5c4b49.mp3',
        duration: 'loop'
      },
      { 
        id: 'meditation', 
        name: 'Meditation Bell', 
        emoji: '🔔',
        // Singing bowl / meditation bell
        url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_d5209e0449.mp3',
        duration: 'once'
      },
    ]
  },
  {
    id: 'music',
    name: 'Soft Music',
    emoji: '🎹',
    color: '#4A9FD4',
    description: 'Gentle background music',
    sounds: [
      { 
        id: 'piano', 
        name: 'Soft Piano', 
        emoji: '🎹',
        // Gentle piano melody
        url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3',
        duration: 'loop'
      },
      { 
        id: 'lullaby', 
        name: 'Lullaby', 
        emoji: '🌙',
        // Soft lullaby music box
        url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_ea75ad2a06.mp3',
        duration: 'loop'
      },
      { 
        id: 'ambient', 
        name: 'Ambient', 
        emoji: '✨',
        // Calming ambient music
        url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        duration: 'loop'
      },
      { 
        id: 'guitar', 
        name: 'Acoustic Guitar', 
        emoji: '🎸',
        // Soft acoustic guitar
        url: 'https://cdn.pixabay.com/audio/2022/08/25/audio_4f3b0a816e.mp3',
        duration: 'loop'
      },
      { 
        id: 'harp', 
        name: 'Harp', 
        emoji: '🎵',
        // Gentle harp music
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946ac80c93.mp3',
        duration: 'loop'
      },
      { 
        id: 'chimes', 
        name: 'Wind Chimes', 
        emoji: '🎐',
        // Wind chimes
        url: 'https://cdn.pixabay.com/audio/2022/03/22/audio_4ac3fd44ce.mp3',
        duration: 'loop'
      },
    ]
  },
  {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    color: '#20B2AA',
    description: 'Soothing water sounds',
    sounds: [
      { 
        id: 'rainroof', 
        name: 'Rain on Roof', 
        emoji: '🏠',
        // Rain on roof / window
        url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_67bcb56a67.mp3',
        duration: 'loop'
      },
      { 
        id: 'underwater', 
        name: 'Underwater', 
        emoji: '🐠',
        // Underwater bubbles
        url: 'https://cdn.pixabay.com/audio/2022/07/25/audio_07e3e177d4.mp3',
        duration: 'loop'
      },
      { 
        id: 'fountain', 
        name: 'Fountain', 
        emoji: '⛲',
        // Water fountain
        url: 'https://cdn.pixabay.com/audio/2022/02/23/audio_5e99020cc6.mp3',
        duration: 'loop'
      },
      { 
        id: 'waterfall', 
        name: 'Waterfall', 
        emoji: '🏞️',
        // Waterfall sounds
        url: 'https://cdn.pixabay.com/audio/2022/07/26/audio_112f2d606e.mp3',
        duration: 'loop'
      },
      { 
        id: 'dripping', 
        name: 'Water Drops', 
        emoji: '💦',
        // Water dripping
        url: 'https://cdn.pixabay.com/audio/2022/01/11/audio_99a6c95b6f.mp3',
        duration: 'loop'
      },
      { 
        id: 'river', 
        name: 'River', 
        emoji: '🌊',
        // Flowing river
        url: 'https://cdn.pixabay.com/audio/2022/03/09/audio_c89cbbf4ca.mp3',
        duration: 'loop'
      },
    ]
  },
];

// Sleep timer options (in minutes)
const TIMER_OPTIONS = [5, 10, 15, 30, 60];

const MusicSounds = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(null);
  const [timerRemaining, setTimerRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  // Stop current sound
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingSound(null);
    setIsLoading(false);
    setError(null);
  };

  // Play a sound
  const playSound = async (sound) => {
    // If same sound is playing, stop it
    if (playingSound?.id === sound.id) {
      stopSound();
      return;
    }

    // Stop any current sound
    stopSound();
    setIsLoading(true);
    setError(null);

    try {
      // Create new audio element
      const audio = new Audio(sound.url);
      audio.volume = isMuted ? 0 : volume;
      audio.loop = sound.duration === 'loop';
      
      // Handle loading
      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false);
      }, { once: true });

      // Handle errors
      audio.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        setIsLoading(false);
        setError('Could not load sound. Check your connection.');
        setPlayingSound(null);
      });

      // Handle end (for non-looping sounds)
      audio.addEventListener('ended', () => {
        if (sound.duration !== 'loop') {
          setPlayingSound(null);
        }
      });

      // Start playing
      await audio.play();
      audioRef.current = audio;
      setPlayingSound(sound);
      setIsLoading(false);
    } catch (err) {
      console.error('Play error:', err);
      setIsLoading(false);
      setError('Could not play sound. Tap to try again.');
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle sleep timer
  const toggleTimer = (minutes) => {
    if (sleepTimer === minutes) {
      setSleepTimer(null);
      setTimerRemaining(null);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    } else {
      setSleepTimer(minutes);
      setTimerRemaining(minutes * 60);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              stopSound();
              navigate('/activities');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
              <Music size={20} />
              Music & Sounds
            </h1>
          </div>
          
          {/* Volume Controls */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-600'
            }`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Now Playing Bar */}
        {playingSound && (
          <div className="mb-6 p-4 bg-white rounded-2xl border-4 border-[#8E6BBF] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-4xl">{playingSound.emoji}</span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-display text-[#8E6BBF]">Now Playing</p>
                <p className="font-crayon text-gray-600">{playingSound.name}</p>
              </div>
              <button
                onClick={stopSound}
                className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              >
                <Pause size={24} />
              </button>
            </div>
            
            {/* Volume Slider */}
            <div className="mt-4 flex items-center gap-3">
              <VolumeX size={16} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#8E6BBF] 
                         [&::-webkit-slider-thumb]:rounded-full"
              />
              <Volume2 size={16} className="text-gray-400" />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-red-600">
            <AlertCircle size={18} />
            <span className="font-crayon text-sm">{error}</span>
          </div>
        )}

        {/* Sleep Timer */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Timer size={18} className="text-gray-600" />
            <span className="font-display text-gray-700">Sleep Timer</span>
            {timerRemaining && (
              <span className="ml-auto font-crayon text-[#8E6BBF] bg-purple-100 px-2 py-1 rounded-full text-sm">
                {formatTime(timerRemaining)}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {TIMER_OPTIONS.map(mins => (
              <button
                key={mins}
                onClick={() => toggleTimer(mins)}
                className={`px-3 py-2 rounded-xl font-crayon text-sm transition-all
                  ${sleepTimer === mins 
                    ? 'bg-[#8E6BBF] text-white' 
                    : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#8E6BBF]'
                  }`}
              >
                {mins} min
              </button>
            ))}
            {sleepTimer && (
              <button
                onClick={() => {
                  setSleepTimer(null);
                  setTimerRemaining(null);
                }}
                className="px-3 py-2 rounded-xl font-crayon text-sm bg-gray-100 text-gray-500"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Selection */}
        {!selectedCategory ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600 font-crayon mb-4">
              Choose a category to explore sounds 🎵
            </p>
            <div className="grid grid-cols-2 gap-4">
              {SOUND_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="p-6 rounded-2xl border-4 text-white text-center
                           transition-all hover:scale-105 hover:-rotate-1 shadow-crayon"
                  style={{
                    backgroundColor: category.color,
                    borderColor: category.color,
                  }}
                >
                  <span className="text-4xl block mb-2">{category.emoji}</span>
                  <span className="font-display text-lg block">{category.name}</span>
                  <span className="font-crayon text-xs text-white/80 mt-1 block">
                    {category.sounds.length} sounds
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Sound Selection */
          <div>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-3xl">{selectedCategory.emoji}</span>
              <div>
                <h2 className="font-display text-xl" style={{ color: selectedCategory.color }}>
                  {selectedCategory.name}
                </h2>
                <p className="font-crayon text-sm text-gray-500">{selectedCategory.description}</p>
              </div>
            </div>

            {/* Sound Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedCategory.sounds.map(sound => {
                const isPlaying = playingSound?.id === sound.id;
                const isThisLoading = isLoading && isPlaying;
                
                return (
                  <button
                    key={sound.id}
                    onClick={() => playSound(sound)}
                    disabled={isLoading && !isPlaying}
                    className={`
                      relative p-4 rounded-2xl border-3 text-center
                      transition-all duration-200
                      ${isPlaying 
                        ? 'border-green-400 bg-green-50 scale-105' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:scale-[1.02]'
                      }
                      ${isLoading && !isPlaying ? 'opacity-50' : ''}
                    `}
                  >
                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      </div>
                    )}
                    
                    {/* Loading indicator */}
                    {isThisLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                        <Loader2 size={24} className="animate-spin text-gray-400" />
                      </div>
                    )}
                    
                    <span className="text-3xl block mb-2">{sound.emoji}</span>
                    <span className="font-crayon text-sm text-gray-700 block">{sound.name}</span>
                    
                    {/* Play/Pause icon */}
                    <div className={`mt-2 mx-auto w-8 h-8 rounded-full flex items-center justify-center
                                  ${isPlaying ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-purple-200">
          <h3 className="font-display text-[#8E6BBF] mb-2 flex items-center gap-2">
            <Music size={18} />
            Tips
          </h3>
          <ul className="font-crayon text-sm text-gray-600 space-y-1">
            <li>• Tap any sound to play or pause</li>
            <li>• Use the sleep timer for bedtime</li>
            <li>• Adjust volume with the slider</li>
            <li>• Great for relaxation and focus!</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default MusicSounds;
