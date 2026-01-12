// MatchingGame.jsx - Memory matching pairs game
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';

// Card themes with emojis
const CARD_SETS = {
  animals: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁'],
  food: ['🍎', '🍌', '🍕', '🍦', '🧁', '🍪', '🍩', '🍓'],
  nature: ['🌸', '🌻', '🌈', '⭐', '🌙', '☀️', '🌺', '🍀'],
  transport: ['🚗', '🚌', '✈️', '🚀', '🚂', '⛵', '🚁', '🏎️'],
};

// Difficulty settings
const DIFFICULTIES = {
  easy: { pairs: 4, cols: 4, label: 'Easy (4 pairs)' },
  medium: { pairs: 6, cols: 4, label: 'Medium (6 pairs)' },
  hard: { pairs: 8, cols: 4, label: 'Hard (8 pairs)' },
};

const MatchingGame = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('animals');
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  const initGame = useCallback(() => {
    const { pairs } = DIFFICULTIES[difficulty];
    const emojis = CARD_SETS[theme].slice(0, pairs);
    const cardPairs = [...emojis, ...emojis];
    
    // Shuffle cards
    const shuffled = cardPairs
      .map((emoji, index) => ({ id: index, emoji, key: Math.random() }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setIsChecking(false);
    setGameStarted(true);
  }, [difficulty, theme]);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedIndexes.length === 2) {
      setIsChecking(true);
      const [first, second] = flippedIndexes;
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found!
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, cards[first].emoji]);
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedIndexes, cards]);

  // Check for win
  useEffect(() => {
    const { pairs } = DIFFICULTIES[difficulty];
    if (matchedPairs.length === pairs && gameStarted) {
      setGameWon(true);
    }
  }, [matchedPairs, difficulty, gameStarted]);

  // Handle card click
  const handleCardClick = (index) => {
    if (isChecking) return;
    if (flippedIndexes.includes(index)) return;
    if (matchedPairs.includes(cards[index].emoji)) return;
    if (flippedIndexes.length >= 2) return;

    setFlippedIndexes(prev => [...prev, index]);
  };

  // Check if card is flipped
  const isFlipped = (index) => {
    return flippedIndexes.includes(index) || matchedPairs.includes(cards[index]?.emoji);
  };

  // Check if card is matched
  const isMatched = (index) => {
    return matchedPairs.includes(cards[index]?.emoji);
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E63B2E] 
                         rounded-xl font-display font-bold text-[#E63B2E] hover:bg-[#E63B2E] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#E63B2E] crayon-text flex items-center gap-2">
                🎴 Matching Game
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#E63B2E] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#E63B2E] mb-6">
              Let's Play! 🎮
            </h2>

            {/* Theme Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Choose Pictures:</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CARD_SETS).map(([key, emojis]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-3 rounded-xl border-3 font-crayon capitalize transition-all
                      ${theme === key 
                        ? 'border-[#E63B2E] bg-red-50 text-[#E63B2E]' 
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    <span className="text-2xl">{emojis[0]}{emojis[1]}</span>
                    <span className="block text-sm mt-1">{key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">How Many Pairs?</label>
              <div className="flex gap-2">
                {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`flex-1 p-3 rounded-xl border-3 font-crayon transition-all
                      ${difficulty === key 
                        ? 'border-[#5CB85C] bg-green-50 text-[#5CB85C]' 
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    {key === 'easy' && '😊'}
                    {key === 'medium' && '🤔'}
                    {key === 'hard' && '💪'}
                    <span className="block text-sm mt-1 capitalize">{key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={initGame}
              className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl border-4 border-green-600
                         font-display text-xl hover:scale-105 transition-transform shadow-crayon"
            >
              Start Game! 🚀
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Win screen
  if (gameWon) {
    const stars = moves <= DIFFICULTIES[difficulty].pairs * 2 ? 3 
                : moves <= DIFFICULTIES[difficulty].pairs * 3 ? 2 : 1;

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-display text-[#5CB85C] mb-4">
            You Win! 🎉
          </h2>
          
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={40}
                className={star <= stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
              />
            ))}
          </div>

          <p className="font-crayon text-gray-600 mb-6">
            You found all pairs in <strong>{moves}</strong> moves!
          </p>

          <div className="flex gap-3">
            <button
              onClick={initGame}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="flex-1 py-3 bg-[#4A9FD4] text-white rounded-xl border-3 border-blue-600
                         font-crayon hover:scale-105 transition-transform"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  const { pairs, cols } = DIFFICULTIES[difficulty];

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E63B2E] 
                       rounded-xl font-display font-bold text-[#E63B2E] hover:bg-[#E63B2E] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Menu
          </button>
          <div className="flex-1 text-center">
            <span className="font-crayon text-gray-600">
              Moves: <strong className="text-[#E63B2E]">{moves}</strong>
            </span>
            <span className="mx-3">|</span>
            <span className="font-crayon text-gray-600">
              Found: <strong className="text-[#5CB85C]">{matchedPairs.length}/{pairs}</strong>
            </span>
          </div>
          <button
            onClick={initGame}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-[#E63B2E] transition-all"
            title="Restart"
          >
            <RotateCcw size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div 
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cards.map((card, index) => (
            <button
              key={card.key}
              onClick={() => handleCardClick(index)}
              disabled={isFlipped(index) || isChecking}
              className={`
                aspect-square rounded-2xl border-4 text-4xl sm:text-5xl
                transition-all duration-300 transform
                ${isFlipped(index) 
                  ? isMatched(index)
                    ? 'bg-green-100 border-[#5CB85C] scale-95'
                    : 'bg-white border-[#4A9FD4]'
                  : 'bg-gradient-to-br from-[#E63B2E] to-[#c42f23] border-red-700 hover:scale-105 cursor-pointer'
                }
                ${isFlipped(index) ? '' : 'shadow-crayon'}
              `}
              style={{
                transform: isFlipped(index) ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {isFlipped(index) ? (
                <span className={isMatched(index) ? 'opacity-60' : ''}>
                  {card.emoji}
                </span>
              ) : (
                <span className="text-white text-2xl">❓</span>
              )}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-gray-500 font-crayon text-sm mt-6">
          Tap two cards to find matching pairs! 🎯
        </p>
      </main>
    </div>
  );
};

export default MatchingGame;
