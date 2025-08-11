import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PetMode = 'mortal' | 'immortal'

export interface PetMeta {
  name: string
  mode: PetMode
  livesRemaining: number
  avatarSeed: string
  alive: boolean
  lastCheckedDate?: string // yyyy-MM-dd of last daily outcome processed
  avatarKind?: 'fox' | 'dog' | 'cat' | 'frog' | 'blob' | 'element'
  primaryColor?: string
}

interface PetStoreState {
  pet: PetMeta | null
  setPet: (pet: PetMeta) => void
  decrementLifeForDate: (date: string) => void
  killPet: () => void
  resetPet: () => void
}

export const usePetStore = create<PetStoreState>()(
  persist(
    (set, get) => ({
      pet: null,
      setPet: (pet) => set({ pet }),
      decrementLifeForDate: (date) => {
        const state = get()
        const pet = state.pet
        if (!pet || pet.mode !== 'mortal' || !pet.alive) return
        if (pet.lastCheckedDate === date) return // already processed
        const lives = Math.max(0, (pet.livesRemaining ?? 0) - 1)
        const alive = lives > 0
        const updated = { ...pet, livesRemaining: lives, alive, lastCheckedDate: date }
        set({ pet: updated })
        if (!alive) {
          // Clear legacy key so App shows onboarding again
          try { localStorage.removeItem('activegotchi-pet-name') } catch {}
        }
      },
      killPet: () => {
        const pet = get().pet
        if (!pet) return
        set({ pet: { ...pet, livesRemaining: 0, alive: false } })
        try { localStorage.removeItem('activegotchi-pet-name') } catch {}
      },
      resetPet: () => set({ pet: null })
    }),
    {
      name: 'activegotchi-pet',
      version: 1
    }
  )
)
