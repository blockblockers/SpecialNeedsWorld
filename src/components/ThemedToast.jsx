// ThemedToast.jsx - Themed notification component for ATLASassist
// Replaces standard browser alerts with kid-friendly styled notifications
// UPDATED: Added celebration toast type

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, Check, AlertCircle, Info, Calendar, CheckCircle, PartyPopper, Sparkles } from 'lucide-react';

// Toast Context for global access
const ToastContext = createContext(null);

// Toast types with their styling
const TOAST_TYPES = {
  success: {
    bg: 'bg-[#5CB85C]',
    border: 'border-green-600',
    icon: CheckCircle,
    iconColor: 'text-white',
  },
  error: {
    bg: 'bg-[#E63B2E]',
    border: 'border-red-700',
    icon: AlertCircle,
    iconColor: 'text-white',
  },
  warning: {
    bg: 'bg-[#F5A623]',
    border: 'border-orange-600',
    icon: AlertCircle,
    iconColor: 'text-white',
  },
  info: {
    bg: 'bg-[#4A9FD4]',
    border: 'border-blue-600',
    icon: Info,
    iconColor: 'text-white',
  },
  schedule: {
    bg: 'bg-[#8E6BBF]',
    border: 'border-purple-600',
    icon: Calendar,
    iconColor: 'text-white',
  },
  celebration: {
    bg: 'bg-gradient-to-r from-[#E86B9A] to-[#F5A623]',
    border: 'border-pink-500',
    icon: PartyPopper,
    iconColor: 'text-white',
  },
};

// Individual Toast Component
const Toast = ({ id, type = 'info', title, message, duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const IconComponent = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-2xl border-4 shadow-crayon-lg
        transform transition-all duration-300 min-w-[280px] max-w-[400px]
        ${config.bg} ${config.border}
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${type === 'celebration' ? 'animate-bounce-in' : ''}
      `}
      style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
    >
      <div className={`p-2 rounded-full bg-white/20 ${config.iconColor}`}>
        <IconComponent size={24} />
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-display text-white text-lg leading-tight">{title}</h4>
        )}
        {message && (
          <p className="font-crayon text-white/90 text-sm mt-1">{message}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={20} className="text-white" />
      </button>
    </div>
  );
};

// Confirmation Modal Component
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Yes',
  cancelText = 'No',
  type = 'info',
  icon: CustomIcon
}) => {
  if (!isOpen) return null;

  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const IconComponent = CustomIcon || config.icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl border-4 border-[#4A9FD4] shadow-crayon-lg overflow-hidden animate-bounce-in"
        style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
      >
        {/* Header */}
        <div className={`${config.bg} p-4 flex items-center gap-3`}>
          <div className="p-2 bg-white/20 rounded-full">
            <IconComponent size={28} className="text-white" />
          </div>
          <h3 className="font-display text-xl text-white flex-1">{title}</h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="font-crayon text-gray-700 text-lg text-center">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all text-lg"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 px-4 ${config.bg} border-3 ${config.border} rounded-xl font-crayon text-white
                       hover:opacity-90 transition-all text-lg flex items-center justify-center gap-2`}
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
          >
            <Check size={20} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...options }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((title, message, duration) => {
    return addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title, message, duration) => {
    return addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title, message, duration) => {
    return addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title, message, duration) => {
    return addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const schedule = useCallback((title, message, duration) => {
    return addToast({ type: 'schedule', title, message, duration });
  }, [addToast]);

  // NEW: Celebration toast for achievements and selections
  const celebration = useCallback((title, message, duration = 4000) => {
    return addToast({ type: 'celebration', title, message, duration });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    schedule,
    celebration,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
