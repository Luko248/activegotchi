import React from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, User, Activity } from "lucide-react";
type Tab = 'avatar' | 'stats' | 'map'

interface NavigationBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ active, onChange }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-white/30">
        <div className="flex items-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange('avatar')}
            className={`p-3 rounded-full transition-colors ${active === 'avatar' ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'}`}
            aria-label="Avatar"
            aria-pressed={active === 'avatar'}
          >
            <User className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange('stats')}
            className={`p-3 rounded-full transition-colors ${active === 'stats' ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'}`}
            aria-label="Stats"
            aria-pressed={active === 'stats'}
          >
            <Activity className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange('map')}
            className={`p-3 rounded-full transition-colors ${active === 'map' ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'}`}
            aria-label="Map"
            aria-pressed={active === 'map'}
          >
            <MapIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
