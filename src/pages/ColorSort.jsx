// ColorSort.jsx - Sort items by color game
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, HelpCircle } from 'lucide-react';

// Colors and their bins
const COLORS = [
  { id: 'red', name: 'Red', bg: 'bg-red-500', border: 'border-red-600', light: 'bg-red-100' },
  { id: 'blue', name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-600', light: 'bg-blue-100' },
  { id: 'yellow', name: 'Yellow', bg: 'bg-yellow-400', border: 'border-yellow-500', light: 'bg-yellow-100' },
  { id: 'green', name: 'Green', bg: 'bg-green-500', border: 'border-green-600', light: 'bg-green-100' },
];

// Items to sort (shapes with colors)
const SHAPES = ['●', '■', '▲', '★', '♥', '◆'];

// Difficulty settings
const DIFFICULTIES = {
  easy: { colors: 2, items: 6, label: 'Easy (2 colors)' },
  medium: { colors: 3, items: 9, label: 'Medium (3 colors)' },
  hard: { colors: 4, items: 12, label: 'Hard (4 colors)' },
};

const ColorSort = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [items, setItems] = useState([]);
  const [bins, setBins] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortedCount, setSortedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Initialize game
  const initGame = useCallback(() => {
    const { colors: numColors, items: numItems } = DIFFICULTIES[difficulty];
    const gameColors = COLORS.slice(0, numColors);
    
    // Create items
    const itemsPerColor = Math.floor(numItems / numColors);
    const newItems = [];
    
    gameColors.forEach((color, colorIndex) => {
      for (let i = 0; i < itemsPerColor; i++) {
        newItems.push({
          id: `${color.id}-${i}`,
          color: color,
          shape: SHAPES[(colorIndex + i) % SHAPES.length],
          sorted: false,
        });
      }
    });
    
    // Shuffle items
    const shuffled = newItems.sort(() => Math.random() - 0.5);
    
    // Create bins
    const newBins = gameColors.map(color => ({
      color: color,
      items: [],
    }));
    
    setItems(shuffled);
    setBins(newBins);
    setSelectedItem(null);
    setSortedCount(0);
    setMoves(0);
    setGameWon(false);
    setShowHint(false);
    setGameStarted(true);
  }, [difficulty]);

  // Check for win
  useEffect(() => {
    if (gameStarted && items.length > 0 && items.every(item => item.sorted)) {
      setGameWon(true);
    }
  }, [items, gameStarted]);

  // Handle item tap
  const handleItemTap = (item) => {
    if (item.sorted) return;
    setSelectedItem(item);
    setShowHint(false);
  };

  // Handle bin tap
  const handleBinTap = (bin) => {
    if (!selectedItem) return;
    
    setMoves(prev => prev + 1);
    
    if (selectedItem.color.id === bin.color.id) {
      // Correct! Add to bin
      setBins(prev => prev.map(b => 
        b.color.id === bin.color.id 
          ? { ...b, items: [...b.items, selectedItem] }
          : b
      ));
      
      setItems(prev => prev.map(item =>
        item.id === selectedItem.id ? { ...item, sorted: true } : item
      ));
      
      setSortedCount(prev => prev + 1);
      setSelectedItem(null);
    } else {
      // Wrong - shake animation handled by CSS
      setSelectedItem(null);
    }
  };

  // Show hint
  const handleShowHint = () => {
    if (selectedItem) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] 
                         rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] 
                         hover:text-white transition-all shadow-sm text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
                🔴 Color Sort
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#5CB85C] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#5CB85C] mb-2">
              Sort by Color! 🎨
            </h2>
            <p className="text-center text-gray-600 font-crayon mb-6">
              Tap a shape, then tap the matching color bin!
            </p>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Choose Level:</label>
              <div className="flex gap-2">
                {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`flex-1 p-3 rounded-xl border-3 font-crayon text-sm transition-all
                      ${difficulty === key 
                        ? 'border-[#5CB85C] bg-green-50 text-[#5CB85C]' 
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    {key === 'easy' && '😊'}
                    {key === 'medium' && '🤔'}
                    {key === 'hard' && '💪'}
                    <span className="block text-xs mt-1 capitalize">{key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Preview */}
            <div className="mb-6 flex justify-center gap-3">
              {COLORS.slice(0, DIFFICULTIES[difficulty].colors).map(color => (
                <div
                  key={color.id}
                  className={`w-12 h-12 rounded-xl ${color.bg} ${color.border} border-4 shadow-md`}
                />
              ))}
            </div>

            <button
              onClick={initGame}
              className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl border-4 border-green-600
                         font-display text-xl hover:scale-105 transition-transform shadow-crayon"
            >
              Let's Sort! 🚀
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Win screen
  if (gameWon) {
    const totalItems = DIFFICULTIES[difficulty].items;
    const stars = moves <= totalItems ? 3 : moves <= totalItems * 1.5 ? 2 : 1;

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-display text-[#5CB85C] mb-4">
            All Sorted! 🎉
          </h2>
          
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
            You sorted everything in <strong>{moves}</strong> moves!
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
              New Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  const unsortedItems = items.filter(item => !item.sorted);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] 
                       rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            <ArrowLeft size={16} />
            Menu
          </button>
          <div className="flex-1 text-center">
            <span className="font-crayon text-gray-600">
              Sorted: <strong className="text-[#5CB85C]">{sortedCount}/{items.length}</strong>
            </span>
            <span className="mx-3">|</span>
            <span className="font-crayon text-gray-600">
              Moves: <strong>{moves}</strong>
            </span>
          </div>
          <button
            onClick={handleShowHint}
            disabled={!selectedItem}
            className={`p-2 rounded-full border-3 transition-all
              ${selectedItem 
                ? 'bg-[#F8D14A] border-yellow-500 text-white' 
                : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            title="Show hint"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Instructions */}
        <p className="text-center text-gray-600 font-crayon text-sm mb-4">
          {selectedItem 
            ? `Now tap the ${selectedItem.color.name} bin! ${showHint ? '👇' : ''}` 
            : 'Tap a shape to pick it up!'}
        </p>

        {/* Color Bins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {bins.map(bin => (
            <button
              key={bin.color.id}
              onClick={() => handleBinTap(bin)}
              className={`
                p-4 rounded-2xl border-4 ${bin.color.border} ${bin.color.light}
                min-h-[120px] transition-all
                ${selectedItem 
                  ? 'hover:scale-105 cursor-pointer' 
                  : 'cursor-default'
                }
                ${showHint && selectedItem?.color.id === bin.color.id 
                  ? 'ring-4 ring-yellow-400 animate-pulse' 
                  : ''
                }
              `}
            >
              {/* Bin label */}
              <div className={`w-full h-8 ${bin.color.bg} rounded-lg mb-2 flex items-center justify-center`}>
                <span className="text-white font-crayon text-sm">{bin.color.name}</span>
              </div>
              
              {/* Sorted items in bin */}
              <div className="flex flex-wrap gap-1 justify-center">
                {bin.items.map(item => (
                  <span 
                    key={item.id}
                    className="text-2xl"
                    style={{ color: bin.color.id === 'yellow' ? '#ca8a04' : undefined }}
                  >
                    {item.shape}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Items to sort */}
        <div className="bg-white rounded-2xl border-4 border-gray-300 p-4 min-h-[150px]">
          <p className="text-center text-gray-400 font-crayon text-xs mb-3">
            Items to sort:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {unsortedItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemTap(item)}
                className={`
                  w-14 h-14 rounded-xl border-4 flex items-center justify-center
                  text-3xl transition-all
                  ${selectedItem?.id === item.id 
                    ? `${item.color.bg} ${item.color.border} scale-110 shadow-lg` 
                    : `bg-white ${item.color.border} hover:scale-105`
                  }
                `}
                style={{ 
                  color: selectedItem?.id === item.id 
                    ? 'white' 
                    : item.color.id === 'yellow' ? '#ca8a04' 
                    : item.color.id === 'red' ? '#dc2626'
                    : item.color.id === 'blue' ? '#2563eb'
                    : '#16a34a'
                }}
              >
                {item.shape}
              </button>
            ))}
          </div>
          
          {unsortedItems.length === 0 && (
            <p className="text-center text-gray-400 font-crayon">
              All done! 🎉
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ColorSort;
