// SoundBoard.jsx - Interactive Sound Board for ATLASassist
// Tries to load sounds from /sounds/, falls back to synthesized

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Sparkles,
} from 'lucide-react';
import { playAudioWithFallback } from '../services/soundUtils';

// Sound categories - maps to files in /sounds/
const SOUND_CATEGORIES = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    color: '#5CB85C',
    sounds: [
      { id: 'dog', name: 'Dog', emoji: '🐕', file: '/sounds/animals/dog.mp3', fallback: 'dog' },
      { id: 'cat', name: 'Cat', emoji: '🐱', file: '/sounds/animals/cat.mp3', fallback: 'cat' },
      { id: 'bird', name: 'Bird', emoji: '🐦', file: '/sounds/animals/bird.mp3', fallback: 'bird' },
      { id: 'cow', name: 'Cow', emoji: '🐄', file: '/sounds/animals/cow.mp3', fallback: 'cow' },
      { id: 'duck', name: 'Duck', emoji: '🦆', file: '/sounds/animals/duck.mp3', fallback: 'duck' },
      { id: 'frog', name: 'Frog', emoji: '🐸', file: '/sounds/animals/frog.mp3', fallback: 'frog' },
    ],
  },
  {
    id: 'instruments',
    name: 'Instruments',
    emoji: '🎵',
    color: '#4A9FD4',
    sounds: [
      { id: 'drum', name: 'Drum', emoji: '🥁', file: '/sounds/instruments/drum.mp3', fallback: 'drum' },
      { id: 'bell', name: 'Bell', emoji: '🔔', file: '/sounds/instruments/bell.mp3', fallback: 'bell' },
      { id: 'piano', name: 'Piano', emoji: '🎹', file: '/sounds/instruments/piano.mp3', fallback: 'piano' },
      { id: 'guitar', name: 'Guitar', emoji: '🎸', file: '/sounds/instruments/guitar.mp3', fallback: 'guitar' },
      { id: 'trumpet', name: 'Trumpet', emoji: '🎺', file: '/sounds/instruments/trumpet.mp3', fallback: 'trumpet' },
      { id: 'xylophone', name: 'Xylophone', emoji: '🎵', file: '/sounds/instruments/xylophone.mp3', fallback: 'xylophone' },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    emoji: '🚗',
    color: '#F5A623',
    sounds: [
      { id: 'car', name: 'Car Horn', emoji: '🚗', file: '/sounds/vehicles/car-horn.mp3', fallback: 'car-horn' },
      { id: 'train', name: 'Train', emoji: '🚂', file: '/sounds/vehicles/train.mp3', fallback: 'train' },
      { id: 'airplane', name: 'Airplane', emoji: '✈️', file: '/sounds/vehicles/airplane.mp3', fallback: 'airplane' },
      { id: 'boat', name: 'Boat Horn', emoji: '🚢', file: '/sounds/vehicles/boat-horn.mp3', fallback: 'boat-horn' },
      { id: 'siren', name: 'Siren', emoji: '🚨', file: '/sounds/vehicles/siren.mp3', fallback: 'siren' },
      { id: 'bike', name: 'Bike Bell', emoji: '🚲', file: '/sounds/vehicles/bike-bell.mp3', fallback: 'bike-bell' },
    ],
  },
  {
    id: 'fun',
    name: 'Fun Sounds',
    emoji: '🎉',
    color: '#E86B9A',
    sounds: [
      { id: 'pop', name: 'Pop', emoji: '🎈', file: '/sounds/fun/pop.mp3', fallback: 'pop' },
      { id: 'boing', name: 'Boing', emoji: '🦘', file: '/sounds/fun/boing.mp3', fallback: 'boing' },
      { id: 'whoosh', name: 'Whoosh', emoji: '💨', file: '/sounds/fun/whoosh.mp3', fallback: 'whoosh' },
      { id: 'sparkle', name: 'Sparkle', emoji: '✨', file: '/sounds/fun/sparkle.mp3', fallback: 'sparkle' },
      { id: 'laugh', name: 'Laugh', emoji: '😄', file: '/sounds/fun/laugh.mp3', fallback: 'laugh' },
      { id: 'applause', name: 'Applause', emoji: '👏', file: '/sounds/fun/applause.mp3', fallback: 'applause' },
    ],
  },
];

// Sound Button Component
const SoundButton = ({ sound, categoryColor, onPlay, disabled }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleClick = async () => {
    if (disabled) return;
    setIsPlaying(true);
    await onPlay(sound);
    setTimeout(() => setIsPlaying(false), 300);
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`aspect-square rounded-2xl border-4 flex flex-col items-center justify-center
                 gap-1 p-2 transition-all active:scale-95
                 ${isPlaying ? 'scale-110 shadow-lg' : 'hover:scale-105'}
                 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ 
        borderColor: categoryColor,
        backgroundColor: isPlaying ? `${categoryColor}30` : 'white',
      }}
    >
      <span className="text-4xl">{sound.emoji}</span>
      <span className="font-crayon text-sm text-gray-700">{sound.name}</span>
    </button>
  );
};

// Main Component
const SoundBoard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(SOUND_CATEGORIES[0]);
  const [volume, setVolume] = useState(0.6);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handlePlaySound = async (sound) => {
    if (!soundEnabled) return;
    await playAudioWithFallback(sound.file, sound.fallback, volume);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
              <Music size={20} />
              Sound Board
            </h1>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Volume Control */}
        <div className="mb-4 p-3 bg-white rounded-xl border-2 border-gray-200 flex items-center gap-3">
          <VolumeX size={16} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-[#F5A623]"
          />
          <Volume2 size={16} className="text-gray-400" />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {SOUND_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-crayon text-sm transition-all
                ${selectedCategory.id === category.id 
                  ? 'text-white' 
                  : 'bg-white border-2 border-gray-200 text-gray-600'}`}
              style={selectedCategory.id === category.id ? { backgroundColor: category.color } : {}}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>

        {/* Sound Grid */}
        <div className="grid grid-cols-3 gap-3">
          {selectedCategory.sounds.map(sound => (
            <SoundButton
              key={sound.id}
              sound={sound}
              categoryColor={selectedCategory.color}
              onPlay={handlePlaySound}
              disabled={!soundEnabled}
            />
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-orange-50 rounded-2xl border-3 border-orange-200">
          <h3 className="font-display text-[#F5A623] mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            Sound Board Fun!
          </h3>
          <ul className="font-crayon text-sm text-orange-700 space-y-1">
            <li>• Tap any button to hear the sound</li>
            <li>• Try different categories</li>
            <li>• Make your own sound stories!</li>
            <li>• Adjust volume with the slider</li>
          </ul>
        </div>

        {/* Note about sounds */}
        <p className="mt-4 text-center font-crayon text-xs text-gray-400">
          Note: If custom sounds aren't loaded, backup sounds will play automatically.
        </p>
      </main>
    </div>
  );
};

export default SoundBoard;
