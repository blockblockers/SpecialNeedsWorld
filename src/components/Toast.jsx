// Toast.jsx - Simple toast notification component
// This file provides Toast functionality for components that import from '../components/Toast'

import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext(null);

// Toast types with their styles
const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-500',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50 border-red-500',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-500',
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-500',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

// Individual Toast component
const ToastItem = ({ toast, onDismiss }) => {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-lg ${style.bg} 
                  animate-in slide-in-from-top-2 fade-in duration-200`}
    >
      <Icon size={20} className={style.iconColor} />
      <p className="flex-1 text-gray-800 font-crayon text-sm">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    dismiss: dismissToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op toast if not within provider
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      dismiss: () => {},
    };
  }
  return context;
};

// Default export
export default useToast;
