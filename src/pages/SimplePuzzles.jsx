// SimplePuzzles.jsx - Simple drag-and-drop picture puzzles
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, Shuffle } from 'lucide-react';

// Puzzle images (using emoji grids)
const PUZZLES = [
  {
    id: 'cat',
    name: 'Cat',
    emoji: '🐱',
    grid: [
      ['😺', '😸', '😻'],
      ['😽', '🐱', '😿'],
      ['🙀', '😾', '😹'],
    ],
    difficulty: 'easy',
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌳',
    grid: [
      ['🌸', '🌺', '🌻'],
      ['🌷', '🌹', '🌼'],
      ['💐', '🌿', '🍀'],
    ],
    difficulty: 'easy',
  },
  {
    id: 'food',
    name: 'Yummy Food',
    emoji: '🍕',
    grid: [
      ['🍎', '🍊', '🍋'],
      ['🍇', '🍓', '🍑'],
      ['🥝', '🍌', '🍉'],
    ],
    difficulty: 'easy',
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🦁',
    grid: [
      ['🐶', '🐱', '🐭'],
      ['🐰', '🦊', '🐻'],
      ['🐼', '🐨', '🐯'],
    ],
    difficulty: 'medium',
  },
  {
    id: 'transport',
    name: 'Vehicles',
    emoji: '🚗',
    grid: [
      ['🚗', '🚕', '🚌'],
      ['🚎', '🏎️', '🚓'],
      ['🚑', '🚒', '🚐'],
    ],
    difficulty: 'medium',
  },
  {
    id: 'space',
    name: 'Space',
    emoji: '🚀',
    grid: [
      ['🌙', '⭐', '🌟'],
      ['✨', '🌍', '🪐'],
      ['☄️', '🛸', '🚀'],
    ],
    difficulty: 'hard',
  },
];

const SimplePuzzles = () => {
  const navigate = useNavigate();
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize puzzle
  const startPuzzle = useCallback((puzzle) => {
    const grid = puzzle.grid;
    const flatPieces = [];
    const emptyBoard = [];
    
    // Create pieces from grid
    grid.forEach((row, rowIndex) => {
      const boardRow = [];
      row.forEach((emoji, colIndex) => {
        flatPieces.push({
          id: `${rowIndex}-${colIndex}`,
          emoji,
          correctRow: rowIndex,
          correctCol: colIndex,
        });
        boardRow.push(null);
      });
      emptyBoard.push(boardRow);
    });
    
    // Shuffle pieces
    const shuffled = flatPieces.sort(() => Math.random() - 0.5);
    
    setPieces(shuffled);
    setBoard(emptyBoard);
    setSelectedPiece(null);
    setMoves(0);
    setGameWon(false);
    setSelectedPuzzle(puzzle);
    setGameStarted(true);
  }, []);

  // Check if puzzle is complete
  const checkWin = useCallback((newBoard) => {
    if (!selectedPuzzle) return false;
    
    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard[row].length; col++) {
        const piece = newBoard[row][col];
        if (!piece || piece.correctRow !== row || piece.correctCol !== col) {
          return false;
        }
      }
    }
    return true;
  }, [selectedPuzzle]);

  // Handle piece selection
  const handlePieceClick = (piece) => {
    if (gameWon) return;
    setSelectedPiece(piece);
  };

  // Handle board cell click
  const handleCellClick = (rowIndex, colIndex) => {
    if (!selectedPiece || gameWon) return;
    
    // Check if cell is empty
    if (board[rowIndex][colIndex] !== null) return;
    
    // Place piece
    const newBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? selectedPiece : cell
      )
    );
    
    // Remove from pieces
    const newPieces = pieces.filter(p => p.id !== selectedPiece.id);
    
    setBoard(newBoard);
    setPieces(newPieces);
    setSelectedPiece(null);
    setMoves(prev => prev + 1);
    
    // Check for win
    if (checkWin(newBoard)) {
      setGameWon(true);
    }
  };

  // Remove piece from board
  const handleRemovePiece = (rowIndex, colIndex) => {
    if (gameWon) return;
    
    const piece = board[rowIndex][colIndex];
    if (!piece) return;
    
    // Remove from board
    const newBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? null : cell
      )
    );
    
    // Add back to pieces
    setPieces(prev => [...prev, piece]);
    setBoard(newBoard);
    setMoves(prev => prev + 1);
  };

  // Puzzle selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                         rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
                🧩 Simple Puzzles
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600 font-crayon mb-6">
            Choose a puzzle to solve!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PUZZLES.map((puzzle) => (
              <button
                key={puzzle.id}
                onClick={() => startPuzzle(puzzle)}
                className="bg-white rounded-2xl border-4 border-[#E86B9A] p-4 shadow-crayon
                           hover:scale-105 hover:-rotate-1 transition-all"
              >
                <div className="text-5xl mb-2">{puzzle.emoji}</div>
                <h3 className="font-display text-gray-800">{puzzle.name}</h3>
                <span className={`text-xs font-crayon px-2 py-1 rounded-full mt-2 inline-block
                  ${puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-600' : 
                    puzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                  {puzzle.difficulty}
                </span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Win screen
  if (gameWon) {
    const totalCells = selectedPuzzle.grid.length * selectedPuzzle.grid[0].length;
    const stars = moves <= totalCells ? 3 : moves <= totalCells * 1.5 ? 2 : 1;

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-display text-[#5CB85C] mb-2">
            Puzzle Complete! 🎉
          </h2>
          <p className="font-display text-xl text-[#E86B9A] mb-4">
            {selectedPuzzle.name} {selectedPuzzle.emoji}
          </p>
          
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
            Completed in <strong>{moves}</strong> moves!
          </p>

          {/* Show completed puzzle */}
          <div className="mb-6 inline-block">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className="w-12 h-12 flex items-center justify-center text-3xl"
                  >
                    {cell?.emoji}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startPuzzle(selectedPuzzle)}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Again
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="flex-1 py-3 bg-[#E86B9A] text-white rounded-xl border-3 border-pink-600
                         font-crayon hover:scale-105 transition-transform"
            >
              New Puzzle
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  const placedCount = board.flat().filter(cell => cell !== null).length;
  const totalCells = selectedPuzzle.grid.length * selectedPuzzle.grid[0].length;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Menu
          </button>
          <div className="flex-1 text-center">
            <span className="font-crayon text-gray-600">
              {selectedPuzzle.name} {selectedPuzzle.emoji}
            </span>
            <span className="mx-2">|</span>
            <span className="font-crayon text-gray-600">
              <strong className="text-[#5CB85C]">{placedCount}/{totalCells}</strong>
            </span>
          </div>
          <button
            onClick={() => startPuzzle(selectedPuzzle)}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-[#E86B9A] transition-all"
            title="Restart"
          >
            <Shuffle size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Instructions */}
        <p className="text-center text-gray-600 font-crayon text-sm mb-4">
          {selectedPiece 
            ? 'Now tap an empty spot on the puzzle!' 
            : 'Tap a piece below, then tap where it goes!'}
        </p>

        {/* Puzzle Board */}
        <div className="bg-white rounded-2xl border-4 border-[#E86B9A] p-4 mb-6 shadow-crayon">
          <div className="flex flex-col items-center gap-1">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((cell, colIndex) => (
                  <button
                    key={colIndex}
                    onClick={() => cell ? handleRemovePiece(rowIndex, colIndex) : handleCellClick(rowIndex, colIndex)}
                    className={`
                      w-20 h-20 rounded-xl border-3 flex items-center justify-center text-4xl
                      transition-all
                      ${cell 
                        ? 'bg-pink-50 border-pink-300 hover:bg-pink-100' 
                        : selectedPiece
                          ? 'bg-yellow-50 border-yellow-400 border-dashed hover:bg-yellow-100 animate-pulse'
                          : 'bg-gray-100 border-gray-300 border-dashed'
                      }
                    `}
                  >
                    {cell?.emoji || ''}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pieces Tray */}
        <div className="bg-gray-100 rounded-2xl border-3 border-gray-300 p-4 min-h-[120px]">
          <p className="text-center text-gray-400 font-crayon text-xs mb-3">
            Puzzle pieces:
          </p>
          
          {pieces.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {pieces.map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  className={`
                    w-16 h-16 rounded-xl border-3 flex items-center justify-center text-3xl
                    transition-all hover:scale-110
                    ${selectedPiece?.id === piece.id 
                      ? 'bg-[#F8D14A] border-yellow-500 scale-110 shadow-lg' 
                      : 'bg-white border-gray-300 hover:border-[#E86B9A]'
                    }
                  `}
                >
                  {piece.emoji}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-green-500 font-crayon">
              All pieces placed! ✨
            </p>
          )}
        </div>

        {/* Hint */}
        <p className="text-center text-gray-400 font-crayon text-xs mt-4">
          💡 Tap a placed piece to remove it
        </p>
      </main>
    </div>
  );
};

export default SimplePuzzles;
