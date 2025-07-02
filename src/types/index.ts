export interface HealthData {
  steps: number
  distance: number
  goalSteps: number
  goalDistance: number
}

export interface PetState {
  mood: 'happy' | 'neutral' | 'sad'
  name: string
}

export interface FitnessMetrics {
  currentSteps: number
  dailyDistance: number
  lastUpdated: Date
}