// CirclesOfControl.jsx - Visual tool to understand what we can/can't control
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Trash2, HelpCircle, Printer, Save, Volume2 } from 'lucide-react';

// Default examples
const DEFAULT_EXAMPLES = {
  canControl: [
    { id: '1', text: 'My words', emoji: '💬' },
    { id: '2', text: 'My actions', emoji: '🎬' },
    { id: '3', text: 'My effort', emoji: '💪' },
    { id: '4', text: 'My attitude', emoji: '😊' },
    { id: '5', text: 'How I treat others', emoji: '🤝' },
    { id: '6', text: 'Asking for help', emoji: '🙋' },
  ],
  cannotControl: [
    { id: '7', text: 'Other people\'s actions', emoji: '👥' },
    { id: '8', text: 'The weather', emoji: '🌧️' },
    { id: '9', text: 'The past', emoji: '⏰' },
    { id: '10', text: 'What others think', emoji: '💭' },
    { id: '11', text: 'Other people\'s feelings', emoji: '😢' },
    { id: '12', text: 'Unexpected changes', emoji: '🔄' },
  ],
};

const STORAGE_KEY = 'snw_circles_control';

// Item component
const CircleItem = ({ item, onRemove, color, canRemove }) => (
  <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg shadow-sm group">
    <span className="text-lg">{item.emoji}</span>
    <span className="flex-1 font-crayon text-sm text-gray-700">{item.text}</span>
    {canRemove && (
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
      >
        <X size={14} className="text-red-400" />
      </button>
    )}
  </div>
);

// Add item modal
const AddItemModal = ({ isOpen, onClose, onAdd, circleType }) => {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('📝');

  const commonEmojis = ['💪', '😊', '🎯', '❤️', '🌟', '🤔', '😢', '🌧️', '⏰', '🔄', '👥', '🙋'];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd({ id: Date.now().toString(), text: text.trim(), emoji });
      setText('');
      setEmoji('📝');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <h2 className="font-display text-xl text-gray-800 mb-4">
          Add to {circleType === 'can' ? 'Things I CAN Control' : 'Things I CANNOT Control'}
        </h2>
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is it?"
          className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-blue-500 outline-none mb-4"
          autoFocus
        />
        
        <div className="mb-4">
          <p className="text-sm font-crayon text-gray-500 mb-2">Pick an emoji:</p>
          <div className="flex flex-wrap gap-2">
            {commonEmojis.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-lg transition-all ${
                  emoji === e ? 'bg-blue-100 scale-110' : 'hover:bg-gray-100'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-display text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-display hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
const CirclesOfControl = () => {
  const navigate = useNavigate();
  const [canControl, setCanControl] = useState(DEFAULT_EXAMPLES.canControl);
  const [cannotControl, setCannotControl] = useState(DEFAULT_EXAMPLES.cannotControl);
  const [addModal, setAddModal] = useState({ isOpen: false, type: null });
  const [showInfo, setShowInfo] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.canControl) setCanControl(data.canControl);
        if (data.cannotControl) setCannotControl(data.cannotControl);
      } catch (e) {
        console.error('Error loading:', e);
      }
    }
  }, []);

  // Save data
  const saveData = (can, cannot) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ canControl: can, cannotControl: cannot }));
  };

  const addItem = (item) => {
    if (addModal.type === 'can') {
      const updated = [...canControl, item];
      setCanControl(updated);
      saveData(updated, cannotControl);
    } else {
      const updated = [...cannotControl, item];
      setCannotControl(updated);
      saveData(canControl, updated);
    }
  };

  const removeItem = (id, type) => {
    if (type === 'can') {
      const updated = canControl.filter(i => i.id !== id);
      setCanControl(updated);
      saveData(updated, cannotControl);
    } else {
      const updated = cannotControl.filter(i => i.id !== id);
      setCannotControl(updated);
      saveData(canControl, updated);
    }
  };

  const resetDefaults = () => {
    setCanControl(DEFAULT_EXAMPLES.canControl);
    setCannotControl(DEFAULT_EXAMPLES.cannotControl);
    saveData(DEFAULT_EXAMPLES.canControl, DEFAULT_EXAMPLES.cannotControl);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              ⭕ Circles of Control
            </h1>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 rounded-full hover:bg-gray-100">
            <HelpCircle size={22} className="text-gray-400" />
          </button>
          <button onClick={() => window.print()} className="p-2 rounded-full hover:bg-gray-100 print:hidden">
            <Printer size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="font-crayon text-gray-600">
            Some things we can control, and some things we can't. That's okay!
          </p>
          <button
            onClick={() => speak("Some things we can control, and some things we can't. Let's sort them out together!")}
            className="mt-2 text-sm text-[#8E6BBF] hover:underline flex items-center gap-1 mx-auto"
          >
            <Volume2 size={14} /> Hear this
          </button>
        </div>

        {/* Circles Display */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* CAN Control - Inner Circle */}
          <div className="flex-1">
            <div className="bg-green-100 rounded-3xl p-6 border-4 border-green-400 min-h-[300px]">
              <div className="text-center mb-4">
                <h2 className="font-display text-xl text-green-700">✅ Things I CAN Control</h2>
                <p className="text-xs font-crayon text-green-600 mt-1">Focus your energy here!</p>
              </div>
              
              <div className="space-y-2">
                {canControl.map(item => (
                  <CircleItem
                    key={item.id}
                    item={item}
                    color="green"
                    onRemove={(id) => removeItem(id, 'can')}
                    canRemove={editMode}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setAddModal({ isOpen: true, type: 'can' })}
                className="w-full mt-4 py-2 border-2 border-dashed border-green-400 rounded-xl text-green-600 font-crayon hover:bg-green-50 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add something
              </button>
            </div>
          </div>

          {/* CANNOT Control - Outer */}
          <div className="flex-1">
            <div className="bg-orange-100 rounded-3xl p-6 border-4 border-orange-400 min-h-[300px]">
              <div className="text-center mb-4">
                <h2 className="font-display text-xl text-orange-700">🚫 Things I CANNOT Control</h2>
                <p className="text-xs font-crayon text-orange-600 mt-1">Let these go</p>
              </div>
              
              <div className="space-y-2">
                {cannotControl.map(item => (
                  <CircleItem
                    key={item.id}
                    item={item}
                    color="orange"
                    onRemove={(id) => removeItem(id, 'cannot')}
                    canRemove={editMode}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setAddModal({ isOpen: true, type: 'cannot' })}
                className="w-full mt-4 py-2 border-2 border-dashed border-orange-400 rounded-xl text-orange-600 font-crayon hover:bg-orange-50 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add something
              </button>
            </div>
          </div>
        </div>

        {/* Edit/Reset controls */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-xl font-crayon flex items-center gap-2 ${
              editMode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Trash2 size={16} />
            {editMode ? 'Done Editing' : 'Edit Items'}
          </button>
          <button
            onClick={resetDefaults}
            className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 font-crayon hover:bg-gray-200"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Helpful tip */}
        <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
          <p className="font-crayon text-gray-700 text-center">
            💡 <strong>Tip:</strong> When you feel worried, check if it's something you can control. 
            If not, take a deep breath and let it go!
          </p>
        </div>
      </main>

      {/* Add Modal */}
      <AddItemModal
        isOpen={addModal.isOpen}
        onClose={() => setAddModal({ isOpen: false, type: null })}
        onAdd={addItem}
        circleType={addModal.type}
      />

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#8E6BBF]">How to Use</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p><strong>What is this?</strong> Circles of Control help you see what you can and can't change.</p>
              <p><strong>Green circle:</strong> Things you CAN control - focus your energy here!</p>
              <p><strong>Orange area:</strong> Things you CANNOT control - it's okay to let these go.</p>
              <p><strong>When to use:</strong> When you feel worried or stressed, check which circle it belongs to.</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#8E6BBF] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CirclesOfControl;
