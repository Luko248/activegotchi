import { useCallback } from 'react'
import { format, subDays } from 'date-fns'
import { useProgressStore } from '../store/progressStore'
import { usePetStore } from '../store/petStore'

// Hook to process daily life decrement for mortal pets
export const usePetLifecycle = () => {
  const historical = useProgressStore((s) => s.historicalData)
  const pet = usePetStore((s) => s.pet)
  const decrementLifeForDate = usePetStore((s) => s.decrementLifeForDate)

  const checkDailyOutcome = useCallback(() => {
    if (!pet || pet.mode !== 'mortal' || !pet.alive) return
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
    const day = historical.get(yesterday)
    if (!day) return
    // Lose life only if ALL goals not met
    if (!day.goalsReached) {
      decrementLifeForDate(yesterday)
    }
  }, [pet, historical, decrementLifeForDate])

  return { checkDailyOutcome }
}

export default usePetLifecycle

