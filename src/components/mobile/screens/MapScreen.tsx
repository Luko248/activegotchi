import React from 'react'
import { DuoPathMap } from '../../progress/DuoPathMap'
import { motion } from 'framer-motion'
import AROverlay from '../AROverlay'
import { triggerLightHaptic } from '../../../services/haptics'

interface MapScreenProps {
  onBack?: () => void
}

export const MapScreen: React.FC<MapScreenProps> = ({ onBack }) => {
  const [arOpen, setArOpen] = React.useState(false)
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
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => onBack?.()}
          aria-label="Back to pet"
          className="w-10 h-10 rounded-full bg-black/80 text-white grid place-items-center shadow-lg border border-white/20"
        >
          ←
        </button>
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

      {/* Floating AR button bottom-left */}
      <div className="absolute bottom-8 left-6 z-20">
        <button
          onClick={() => { triggerLightHaptic(); setArOpen(true) }}
          aria-label="Open AR"
          className="w-12 h-12 rounded-full bg-black/80 text-white grid place-items-center shadow-xl border border-white/20"
        >
          {/* AR icon (cube) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="M3.27 6.96 12 12l8.73-5.04" />
            <path d="M12 22V12" />
          </svg>
        </button>
      </div>

      {/* AR Overlay */}
      <AROverlay open={arOpen} onClose={() => setArOpen(false)} />
    </div>
  )
}

export default MapScreen
