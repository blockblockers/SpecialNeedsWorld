// SoundBoard.jsx - Interactive sound board for communication and play
// UPDATED: Uses REAL audio files from free, royalty-free sources
// Plays various sounds for expression and sensory input

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Music, Star, Loader2 } from 'lucide-react';

// =====================================================
// REAL SOUND URLS - Free, royalty-free sources
// =====================================================
// Sources: Pixabay Audio, Freesound (CC0), and other free audio CDNs

const SOUND_CATEGORIES = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    color: 'bg-green-100 border-green-400',
    sounds: [
      { 
        id: 'dog', 
        label: 'Dog', 
        emoji: '🐕', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694ff27.mp3'
      },
      { 
        id: 'cat', 
        label: 'Cat', 
        emoji: '🐱', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_bfdca5a23a.mp3'
      },
      { 
        id: 'bird', 
        label: 'Bird', 
        emoji: '🐦', 
        url: 'https://cdn.pixabay.com/audio/2022/03/09/audio_6c143d19c6.mp3'
      },
      { 
        id: 'cow', 
        label: 'Cow', 
        emoji: '🐄', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_0689f2fc53.mp3'
      },
      { 
        id: 'horse', 
        label: 'Horse', 
        emoji: '🐴', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c518ad3d40.mp3'
      },
      { 
        id: 'rooster', 
        label: 'Rooster', 
        emoji: '🐓', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_215bb8f1e3.mp3'
      },
      { 
        id: 'sheep', 
        label: 'Sheep', 
        emoji: '🐑', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_80c7aa8b7e.mp3'
      },
      { 
        id: 'duck', 
        label: 'Duck', 
        emoji: '🦆', 
        url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_18c169a30d.mp3'
      },
    ]
  },
  {
    id: 'fun',
    name: 'Fun Sounds',
    emoji: '🎉',
    color: 'bg-yellow-100 border-yellow-400',
    sounds: [
      { 
        id: 'tada', 
        label: 'Ta-da!', 
        emoji: '🎉', 
        url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3'
      },
      { 
        id: 'applause', 
        label: 'Applause', 
        emoji: '👏', 
        url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccbb5b5e.mp3'
      },
      { 
        id: 'cheer', 
        label: 'Cheer', 
        emoji: '🎊', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_1cfb74f81e.mp3'
      },
      { 
        id: 'bell', 
        label: 'Bell', 
        emoji: '🔔', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_85d4f65b72.mp3'
      },
      { 
        id: 'pop', 
        label: 'Pop!', 
        emoji: '🎈', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_8953bd7542.mp3'
      },
      { 
        id: 'whoosh', 
        label: 'Whoosh', 
        emoji: '💨', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_10b5c1ca04.mp3'
      },
      { 
        id: 'boing', 
        label: 'Boing', 
        emoji: '🏀', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_77c6a00e16.mp3'
      },
      { 
        id: 'magic', 
        label: 'Magic', 
        emoji: '✨', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4b6918a3b0.mp3'
      },
    ]
  },
  {
    id: 'actions',
    name: 'Actions',
    emoji: '✋',
    color: 'bg-blue-100 border-blue-400',
    sounds: [
      { 
        id: 'ding', 
        label: 'Correct!', 
        emoji: '✅', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_06b9c3b9b3.mp3'
      },
      { 
        id: 'error', 
        label: 'Oops', 
        emoji: '❌', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_a56c5e0b22.mp3'
      },
      { 
        id: 'click', 
        label: 'Click', 
        emoji: '👆', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_7b7e00c2d0.mp3'
      },
      { 
        id: 'notification', 
        label: 'Alert', 
        emoji: '🔔', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_80b2e4f5e9.mp3'
      },
      { 
        id: 'complete', 
        label: 'Done!', 
        emoji: '🎯', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2f11056b0d.mp3'
      },
      { 
        id: 'countdown', 
        label: 'Beep', 
        emoji: '⏰', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7d0d6b7e2c.mp3'
      },
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    emoji: '🚗',
    color: 'bg-red-100 border-red-400',
    sounds: [
      { 
        id: 'car-horn', 
        label: 'Car Horn', 
        emoji: '🚗', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c7a0dd7f73.mp3'
      },
      { 
        id: 'train', 
        label: 'Train', 
        emoji: '🚂', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f5e1db0c64.mp3'
      },
      { 
        id: 'airplane', 
        label: 'Airplane', 
        emoji: '✈️', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_e6f2e64343.mp3'
      },
      { 
        id: 'helicopter', 
        label: 'Helicopter', 
        emoji: '🚁', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_27ad0b3fc4.mp3'
      },
      { 
        id: 'boat', 
        label: 'Boat Horn', 
        emoji: '🚢', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_eb0c7e6f0c.mp3'
      },
      { 
        id: 'siren', 
        label: 'Siren', 
        emoji: '🚨', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8b3dbf3e8.mp3'
      },
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    color: 'bg-teal-100 border-teal-400',
    sounds: [
      { 
        id: 'rain-short', 
        label: 'Rain', 
        emoji: '🌧️', 
        url: 'https://cdn.pixabay.com/audio/2022/05/16/audio_137b28f0f4.mp3',
        isLong: true
      },
      { 
        id: 'thunder-short', 
        label: 'Thunder', 
        emoji: '⛈️', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_adb0e60879.mp3'
      },
      { 
        id: 'wind-short', 
        label: 'Wind', 
        emoji: '🌬️', 
        url: 'https://cdn.pixabay.com/audio/2022/01/20/audio_3ee1cf6b32.mp3',
        isLong: true
      },
      { 
        id: 'ocean-short', 
        label: 'Ocean', 
        emoji: '🌊', 
        url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3',
        isLong: true
      },
      { 
        id: 'fire', 
        label: 'Fire', 
        emoji: '🔥', 
        url: 'https://cdn.pixabay.com/audio/2021/08/08/audio_dc8aa983ab.mp3',
        isLong: true
      },
      { 
        id: 'water-drop', 
        label: 'Water Drop', 
        emoji: '💧', 
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_7e3b5c4b49.mp3'
      },
    ]
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    color: 'bg-purple-100 border-purple-400',
    sounds: [
      { 
        id: 'piano-note', 
        label: 'Piano', 
        emoji: '🎹', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_5ea4b2dd9e.mp3'
      },
      { 
        id: 'guitar-strum', 
        label: 'Guitar', 
        emoji: '🎸', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_3a3d63a15c.mp3'
      },
      { 
        id: 'drum-beat', 
        label: 'Drum', 
        emoji: '🥁', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4f3c1e0b9a.mp3'
      },
      { 
        id: 'xylophone', 
        label: 'Xylophone', 
        emoji: '🎶', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c3e1e8d5a2.mp3'
      },
      { 
        id: 'harp-gliss', 
        label: 'Harp', 
        emoji: '🎵', 
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_d4c2f1e0b9.mp3'
      },
      { 
        id: 'chime', 
        label: 'Chime', 
        emoji: '🎐', 
        url: 'https://cdn.pixabay.com/audio/2022/03/22/audio_4ac3fd44ce.mp3'
      },
    ]
  },
];

const SoundBoard = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('animals');
  const [playingSound, setPlayingSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snw_soundboard_favorites') || '[]');
    } catch {
      return [];
    }
  });
  
  const audioRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play a sound
  const playSound = async (sound) => {
    if (isMuted) return;
    
    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingSound(sound.id);
    setIsLoading(true);

    try {
      const audio = new Audio(sound.url);
      audio.volume = 0.7;
      
      audio.addEventListener('ended', () => {
        setPlayingSound(null);
      });

      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false);
      }, { once: true });

      audio.addEventListener('error', () => {
        setIsLoading(false);
        setPlayingSound(null);
      });

      // For long sounds (nature), only play for a few seconds
      if (sound.isLong) {
        setTimeout(() => {
          if (audioRef.current === audio) {
            audio.pause();
            setPlayingSound(null);
          }
        }, 5000); // Play for 5 seconds max
      }

      await audio.play();
      audioRef.current = audio;
    } catch (err) {
      console.error('Play error:', err);
      setIsLoading(false);
      setPlayingSound(null);
    }
  };

  // Toggle favorite
  const toggleFavorite = (e, soundId) => {
    e.stopPropagation();
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
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
              🔊 Sound Board
            </h1>
          </div>
          
          {/* Mute Toggle */}
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
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {SOUND_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-crayon text-sm transition-all
                ${activeCategory === cat.id 
                  ? 'bg-[#8E6BBF] text-white scale-105' 
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sounds Grid */}
        {currentCategory && (
          <div className={`p-4 rounded-2xl border-4 ${currentCategory.color}`}>
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">{currentCategory.emoji}</span>
              {currentCategory.name}
            </h2>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {currentCategory.sounds.map(sound => (
                <div key={sound.id} className="relative">
                  <button
                    onClick={() => playSound(sound)}
                    disabled={isLoading || isMuted}
                    className={`
                      w-full p-3 rounded-xl border-3 transition-all duration-200
                      flex flex-col items-center gap-1
                      ${playingSound === sound.id 
                        ? 'bg-green-100 border-green-400 scale-110' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:scale-105 active:scale-95'
                      }
                      ${isMuted ? 'opacity-50' : ''}
                    `}
                  >
                    {isLoading && playingSound === sound.id ? (
                      <Loader2 size={28} className="animate-spin text-gray-400" />
                    ) : (
                      <span className="text-3xl">{sound.emoji}</span>
                    )}
                    <span className="font-crayon text-xs text-gray-700 text-center leading-tight">
                      {sound.label}
                    </span>
                    
                    {/* Playing indicator */}
                    {playingSound === sound.id && !isLoading && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  {/* Favorite button */}
                  <button
                    onClick={(e) => toggleFavorite(e, sound.id)}
                    className={`absolute -top-2 -left-2 p-1 rounded-full text-sm transition-all
                               ${favorites.includes(sound.id) 
                                 ? 'bg-yellow-400 border-yellow-500 text-white'
                                 : 'bg-white border-gray-300 text-gray-400 hover:border-yellow-400'
                               } border-2`}
                  >
                    ⭐
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favoriteSounds.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border-4 border-yellow-300">
            <h2 className="font-display text-lg text-yellow-700 mb-3 flex items-center gap-2">
              <Star size={20} fill="currentColor" />
              Favorites
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {favoriteSounds.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => playSound(sound)}
                  disabled={isLoading || isMuted}
                  className={`
                    p-2 rounded-xl border-2 transition-all
                    flex flex-col items-center gap-1
                    ${playingSound === sound.id 
                      ? 'bg-green-100 border-green-400 scale-110' 
                      : 'bg-white border-gray-200 hover:border-yellow-400 hover:scale-105'
                    }
                  `}
                >
                  <span className="text-2xl">{sound.emoji}</span>
                  <span className="font-crayon text-xs text-gray-600 truncate w-full text-center">
                    {sound.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
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
