import React, { useState } from 'react'
import { ThreePet } from '../../ThreePet'
import { PetState } from '../../../types'
import { Map as MapIcon, Heart, Box } from 'lucide-react'
import { usePetStore } from '../../../store/petStore'
import { IconButton } from '../IconButton'
import AROverlay from '../AROverlay'
import { triggerLightHaptic } from '../../../services/haptics'
import { AnimatedBackground } from '../AnimatedBackground'

interface AvatarScreenProps {
  petState: PetState
  onPetTap: () => void
  onPirouette?: () => void
  heartLevel?: number // 0-100 average progress used as affection
  onToggleDebug?: () => void
  debugOpen?: boolean
  onOpenMap?: () => void
}

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ petState, onPetTap, onPirouette, onToggleDebug, debugOpen, onOpenMap }) => {
  const petMeta = usePetStore(s => s.pet)
  const [arOpen, setArOpen] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [showPirouette, setShowPirouette] = useState(false)
  const tapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handlePetTap = () => {
    // Don't process new taps if pirouette is already running
    if (showPirouette) {
      return
    }

    // Clear existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }

    const newTapCount = tapCount + 1
    setTapCount(newTapCount)

    // If we hit 3 taps, trigger pirouette
    if (newTapCount >= 3) {
      setShowPirouette(true)
      setTapCount(0)
      
      // Track pirouette achievement
      onPirouette?.()
      
      // Reset pirouette after animation
      setTimeout(() => {
        setShowPirouette(false)
      }, 1500) // Match animation duration
    } else {
      // Reset tap count after 800ms if no more taps
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0)
      }, 800)
    }

    // Call original onPetTap
    onPetTap()
  }
  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Unified animated background */}
      <AnimatedBackground />
      {/* Header overlay: centered pet name and mood */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 select-none text-center pointer-events-none">
        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {petState.name || 'Your Pet Name'}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
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
      <div className="relative z-10">
        <ThreePet petState={petState} onPetTap={handlePetTap} showPirouette={showPirouette} />
      </div>

      {/* Top-left: heart lives only */}
      {petMeta?.mode === 'mortal' && (
        <div className="absolute top-4 left-4 z-50 select-none">
          <div className="relative flex items-center justify-center">
            <Heart 
              className="w-9 h-9 animate-heartbeat text-rose-500"
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
      <div className="absolute top-4 right-4 z-50 select-none flex flex-col items-center gap-3">
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
      
      {/* WebXR AR overlay (three.js + R3F) */}
      <AROverlay 
        open={arOpen}
        onClose={() => setArOpen(false)}
        petState={petState}
      />
    </div>
  )
}

export default AvatarScreen
