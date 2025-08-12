import React from 'react'
import { ThreePet } from '../../ThreePet'
import { PetState } from '../../../types'
import { Heart } from 'lucide-react'
import { usePetStore } from '../../../store/petStore'

interface AvatarScreenProps {
  petState: PetState
  onPetTap: () => void
  heartLevel?: number // 0-100 average progress used as affection
  onToggleDebug?: () => void
  debugOpen?: boolean
}

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ petState, onPetTap, onToggleDebug, debugOpen }) => {
  const petMeta = usePetStore(s => s.pet)
  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-purple-50/50 to-pink-50/70 dark:from-gray-900/70 dark:via-gray-800/50 dark:to-gray-900/70 backdrop-blur-lg" />
      {/* Header overlay: centered pet name and mood */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 select-none text-center pointer-events-none">
        <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {petState.name || 'Your Pet Name'}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
          {petState.mood === 'happy' ? 'Feeling great' : petState.mood === 'sad' ? 'Needs encouragement' : 'Feeling okay'}
        </div>
        {import.meta.env.MODE !== 'production' && (
          <div className="mt-2 pointer-events-auto">
            <button
              onClick={onToggleDebug}
              className="px-3 py-1 text-xs rounded-full bg-black/60 text-white backdrop-blur border border-white/20 shadow"
            >
              {debugOpen ? 'Close Debug' : 'Debug'}
            </button>
          </div>
        )}
      </div>
      <ThreePet petState={petState} onPetTap={onPetTap} />

      {/* Top-right lives (mortal only) */}
      {petMeta?.mode === 'mortal' && (
        <div className="absolute top-6 right-6 z-50 select-none">
          <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-full shadow-lg px-3 py-1.5 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{petMeta.livesRemaining ?? 0}</span>
          </div>
        </div>
      )}
      {/* Peek sheet handled globally in MobileApp */}
    </div>
  )
}

export default AvatarScreen
