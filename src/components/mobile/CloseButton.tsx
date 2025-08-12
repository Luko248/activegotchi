import React from 'react';
import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors ${className}`}
      aria-label="Close"
    >
      <X className="w-4 h-4" />
    </button>
  );
};