import React, { useState } from 'react'
import { ThreePet } from '../../ThreePet'
import { PetState } from '../../../types'
import { Map as MapIcon, Heart, Box } from 'lucide-react'
import { usePetStore } from '../../../store/petStore'
import { IconButton } from '../IconButton'
import AROverlay from '../AROverlay'
import { triggerLightHaptic } from '../../../services/haptics'

interface AvatarScreenProps {
  petState: PetState
  onPetTap: () => void
  heartLevel?: number // 0-100 average progress used as affection
  onToggleDebug?: () => void
  debugOpen?: boolean
  onOpenMap?: () => void
}

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ petState, onPetTap, onToggleDebug, debugOpen, onOpenMap }) => {
  const petMeta = usePetStore(s => s.pet)
  const [arOpen, setArOpen] = useState(false)
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

      {/* Top-left: heart lives only */}
      {petMeta?.mode === 'mortal' && (
        <div className="absolute top-6 left-6 z-50 select-none">
          <div className="relative flex items-center justify-center">
            <Heart 
              className="w-9 h-9 animate-heartbeat text-red-500"
              fill="currentColor"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-md">
              {petMeta.livesRemaining ?? 0}
            </span>
          </div>
        </div>
      )}

      {/* Top-right controls: map and AR buttons */}
      <div className="absolute top-6 right-6 z-50 select-none flex flex-col items-center gap-3">
        {/* Map button */}
        {onOpenMap && (
          <IconButton 
            icon={MapIcon}
            onClick={onOpenMap}
            aria-label="Open map"
          />
        )}
        
        {/* AR button */}
        <IconButton 
          icon={Box}
          onClick={() => { triggerLightHaptic(); setArOpen(true) }}
          aria-label="Open AR"
        />
      </div>
      {/* Peek sheet handled globally in MobileApp */}
      
      {/* AR Overlay */}
      <AROverlay open={arOpen} onClose={() => setArOpen(false)} />
    </div>
  )
}

export default AvatarScreen
