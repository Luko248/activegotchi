import React from 'react'
import { DuoPathMap } from '../../progress/DuoPathMap'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { IconButton } from '../IconButton'

interface MapScreenProps {
  onBack?: () => void
}

export const MapScreen: React.FC<MapScreenProps> = ({ onBack }) => {
  return (
    <div className="h-full w-full relative">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 backdrop-blur-xl" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 -right-16 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Back button (absolute top-left) */}
      <div className="absolute top-4 left-4 z-20">
        <IconButton 
          icon={ArrowLeft}
          onClick={() => onBack?.()}
          aria-label="Back to pet"
        />
      </div>

      <div className="relative z-10 h-full grid grid-rows-[auto_1fr] min-h-0">
        {/* Header section - auto height */}
        <div className="px-6 py-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-white/20 dark:bg-black/10 border border-white/30 dark:border-white/10 rounded-xl p-4 shadow-lg text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Your Fitness Journey</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tap any day to see your progress • Scroll up for history</p>
          </motion.div>
        </div>
        
        {/* Map content section - takes remaining space, scrolls internally */}
        <div className="pb-24 min-h-0 overflow-hidden @container">
          <DuoPathMap className="h-full" />
        </div>
      </div>

    </div>
  )
}

export default MapScreen
