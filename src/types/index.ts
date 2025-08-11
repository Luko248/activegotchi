export interface HealthData {
  steps: number
  distance: number
  goalSteps: number
  goalDistance: number
  sleepHours?: number
  goalSleepHours?: number
}

export interface PetState {
  mood: 'happy' | 'neutral' | 'sad' | 'sleepy'
  name: string
  mode?: 'mortal' | 'immortal'
  livesRemaining?: number
  avatarSeed?: string
  alive?: boolean
  avatarKind?: 'fox' | 'dog' | 'cat' | 'frog' | 'blob' | 'element'
  primaryColor?: string
}

export interface FitnessMetrics {
  currentSteps: number
  dailyDistance: number
  lastUpdated: Date
}

// Re-export progress types for convenience
export type { 
  DayProgress, 
  WeeklyProgress, 
  ProgressState, 
  ProgressStore, 
  DayState, 
  CelebrationState 
} from './progress'
