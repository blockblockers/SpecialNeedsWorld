// BackButton.jsx - Bold, easy-to-find back button
// Consistent styling across the app

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ 
  to = '/', 
  label = 'Back',
  color = '#F5A623',
  onClick 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl 
                 font-display text-base shadow-md hover:shadow-lg
                 hover:scale-105 active:scale-95 transition-all"
      style={{ 
        borderColor: color,
        color: color,
      }}
    >
      <ArrowLeft size={20} strokeWidth={3} />
      <span className="font-bold">{label}</span>
    </button>
  );
};

export default BackButton;
