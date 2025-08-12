import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  onClick, 
  'aria-label': ariaLabel 
}) => {

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-12 h-12 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur text-white grid place-items-center shadow-xl border border-white/20 hover:bg-white/40 dark:hover:bg-black/40 transition-colors"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};