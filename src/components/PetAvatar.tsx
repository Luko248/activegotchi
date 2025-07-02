import React, { useState } from 'react'
import ThreePet from './ThreePet'
import { PetState } from '../types'

interface PetAvatarProps {
  petState: PetState
  onPetTap: () => void
}

const PetAvatar: React.FC<PetAvatarProps> = ({ petState, onPetTap }) => {
  const [showControls, setShowControls] = useState(true)

  const getMoodMessage = () => {
    switch (petState.mood) {
      case 'happy':
        return `is thrilled! You're crushing your fitness goals! 🌟`
      case 'sad':
        return `is feeling a bit down. Let's get moving together! 💪`
      default:
        return `is doing okay. Keep working towards your goals! 🎯`
    }
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {petState.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto">
          {getMoodMessage()}
        </p>
      </div>
      
      <div className="flex-1 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden relative text-gray-800 dark:text-gray-100 h-full min-h-0">
        <ThreePet petState={petState} onPetTap={onPetTap} />
        
        {showControls && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between text-gray-800 dark:text-gray-100">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex-1">
                Drag to rotate • Scroll to zoom • Tap pet to interact
              </p>
              <button
                onClick={() => setShowControls(false)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-4 px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PetAvatar