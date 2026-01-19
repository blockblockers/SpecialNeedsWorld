// SoundMatch.jsx - Sound matching game for ATLASassist
// Tries to load sounds from /sounds/match/, falls back to synthesized

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Star,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { playAudioWithFallback, playSynthesized, loadAudio } from '../services/soundUtils';

// Sound definitions - maps to files in /sounds/match/
const SOUND_LIBRARY = [
  { id: 'bell', name: 'Bell', emoji: '🔔', file: '/sounds/match/bell.mp3', fallback: 'bell' },
  { id: 'drum', name: 'Drum', emoji: '🥁', file: '/sounds/match/drum.mp3', fallback: 'drum' },
  { id: 'whistle', name: 'Whistle', emoji: '📯', file: '/sounds/match/whistle.mp3', fallback: 'whistle' },
  { id: 'buzz', name: 'Buzz', emoji: '🐝', file: '/sounds/match/buzz.mp3', fallback: 'buzz' },
  { id: 'bird', name: 'Bird', emoji: '🐦', file: '/sounds/match/bird.mp3', fallback: 'bird' },
  { id: 'boop', name: 'Boop', emoji: '🎵', file: '/sounds/match/boop.mp3', fallback: 'boop' },
  { id: 'siren', name: 'Siren', emoji: '🚨', file: '/sounds/match/siren.mp3', fallback: 'siren' },
  { id: 'pop', name: 'Pop', emoji: '🎈', file: '/sounds/match/pop.mp3', fallback: 'pop' },
  { id: 'horn', name: 'Horn', emoji: '📢', file: '/sounds/match/horn.mp3', fallback: 'horn' },
  { id: 'chime', name: 'Chime', emoji: '🎐', file: '/sounds/match/chime.mp3', fallback: 'chime' },
  { id: 'dog', name: 'Dog', emoji: '🐕', file: '/sounds/match/dog.mp3', fallback: 'dog' },
  { id: 'cat', name: 'Cat', emoji: '🐱', file: '/sounds/match/cat.mp3', fallback: 'cat' },
];

// Difficulty settings
const DIFFICULTY = {
  easy: { pairs: 3, label: 'Easy', stars: 1 },
  medium: { pairs: 4, label: 'Medium', stars: 2 },
  hard: { pairs: 6, label: 'Hard', stars: 3 },
};

// Card Component
const SoundCard = ({ card, isFlipped, isMatched, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`
        aspect-square rounded-2xl border-4 transition-all duration-300 transform
        flex flex-col items-center justify-center gap-2 p-2 relative
        ${isMatched 
          ? 'bg-green-100 border-green-400 scale-95' 
          : isFlipped 
            ? 'bg-blue-100 border-blue-400 scale-105' 
            : 'bg-white border-gray-300 hover:border-blue-300 hover:scale-102'
        }
        ${disabled && !isMatched ? 'cursor-not-allowed' : ''}
      `}
    >
      {isFlipped || isMatched ? (
        <>
          <span className="text-4xl sm:text-5xl">{card.emoji}</span>
          <span className="font-crayon text-sm text-gray-600">{card.name}</span>
          {isMatched && <CheckCircle className="text-green-500 absolute top-2 right-2" size={20} />}
        </>
      ) : (
        <>
          <Volume2 size={32} className="text-gray-400" />
          <span className="font-crayon text-sm text-gray-400">Tap to hear</span>
        </>
      )}
    </button>
  );
};

// Main Component
const SoundMatch = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  // Preload sounds when game starts
  useEffect(() => {
    if (difficulty) {
      // Try to preload sounds
      const preloadSounds = async () => {
        for (const sound of SOUND_LIBRARY) {
          await loadAudio(sound.file);
        }
        setSoundsLoaded(true);
      };
      preloadSounds();
    }
  }, [difficulty]);

  // Play a sound
  const playSound = async (sound) => {
    if (!soundEnabled) return;
    await playAudioWithFallback(sound.file, sound.fallback, 0.6);
  };

  // Play feedback sound
  const playFeedback = async (success) => {
    if (!soundEnabled) return;
    const file = success ? '/sounds/match/success.mp3' : '/sounds/match/error.mp3';
    const fallback = success ? 'success' : 'error';
    await playAudioWithFallback(file, fallback, 0.5);
  };

  // Initialize game
  const initGame = useCallback((diff) => {
    const numPairs = DIFFICULTY[diff].pairs;
    const selectedSounds = [...SOUND_LIBRARY]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);
    
    const cardPairs = selectedSounds.flatMap((sound, idx) => [
      { ...sound, pairId: idx, cardId: idx * 2 },
      { ...sound, pairId: idx, cardId: idx * 2 + 1 },
    ]);
    
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setDifficulty(diff);
  }, []);

  // Handle card click
  const handleCardClick = async (cardId) => {
    if (isChecking || flipped.includes(cardId) || matched.includes(cardId)) return;
    
    const card = cards.find(c => c.cardId === cardId);
    if (card) {
      await playSound(card);
    }
    
    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.cardId === first);
      const card2 = cards.find(c => c.cardId === second);
      
      if (card1.pairId === card2.pairId) {
        setTimeout(async () => {
          await playFeedback(true);
          const newMatched = [...matched, first, second];
          setMatched(newMatched);
          setFlipped([]);
          setIsChecking(false);
          
          if (newMatched.length === cards.length) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        setTimeout(async () => {
          await playFeedback(false);
          setFlipped([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // Calculate stars
  const getStars = () => {
    if (!difficulty) return 0;
    const pairs = DIFFICULTY[difficulty].pairs;
    const perfectMoves = pairs;
    const ratio = perfectMoves / moves;
    if (ratio >= 0.8) return 3;
    if (ratio >= 0.5) return 2;
    return 1;
  };

  // Difficulty selection screen
  if (!difficulty) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                         rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text">
                🔊 Sound Match
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <span className="text-7xl block mb-4">🎵</span>
            <h2 className="font-display text-2xl text-gray-800 mb-2">Sound Match</h2>
            <p className="font-crayon text-gray-600">Listen carefully and match the sounds!</p>
          </div>

          <div className="space-y-4">
            {Object.entries(DIFFICULTY).map(([key, value]) => (
              <button
                key={key}
                onClick={() => initGame(key)}
                className="w-full p-6 bg-white rounded-2xl border-4 border-[#4A9FD4] 
                         hover:bg-blue-50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(value.stars)].map((_, i) => (
                      <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-display text-xl text-gray-800">{value.label}</span>
                </div>
                <span className="font-crayon text-gray-500">{value.pairs} pairs</span>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
            <h3 className="font-display text-[#4A9FD4] mb-2 flex items-center gap-2">
              <HelpCircle size={18} />
              How to Play
            </h3>
            <ul className="font-crayon text-sm text-blue-700 space-y-1">
              <li>• Tap a card to hear its sound</li>
              <li>• Find the card that makes the same sound</li>
              <li>• Match all pairs to win!</li>
              <li>• Try to use fewer moves for more stars</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // Game complete screen
  if (gameComplete) {
    const stars = getStars();
    
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#5CB85C] p-8 text-center max-w-sm w-full shadow-crayon">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="font-display text-3xl text-[#5CB85C] mb-2">You Win! 🎉</h2>
          
          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3].map(i => (
              <Star key={i} size={40} className={i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          
          <p className="font-crayon text-gray-600 mb-6">Completed in {moves} moves!</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => initGame(difficulty)}
              className="flex-1 py-3 bg-[#4A9FD4] text-white rounded-xl font-crayon
                       hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Play Again
            </button>
            <button
              onClick={() => setDifficulty(null)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon
                       hover:bg-gray-300 transition-all"
            >
              Change Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  const gridCols = cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4';
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setDifficulty(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1 flex items-center justify-center gap-4">
            <span className="font-crayon text-gray-600">Moves: {moves}</span>
            <span className="font-crayon text-gray-600">Matched: {matched.length / 2}/{cards.length / 2}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full ${soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className={`grid ${gridCols} gap-3`}>
          {cards.map(card => (
            <SoundCard
              key={card.cardId}
              card={card}
              isFlipped={flipped.includes(card.cardId)}
              isMatched={matched.includes(card.cardId)}
              onClick={() => handleCardClick(card.cardId)}
              disabled={isChecking}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => initGame(difficulty)}
            className="px-6 py-2 bg-white border-2 border-gray-300 rounded-xl font-crayon text-gray-600
                     hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Restart
          </button>
        </div>
      </main>
    </div>
  );
};

export default SoundMatch;
