export interface DayProgress {
  date: string // ISO date string
  completed: boolean
  progress: number // 0-100
  steps: number
  distance: number
  goalsReached: boolean
}

export interface WeeklyProgress {
  startDate: string // ISO date string for Monday
  days: DayProgress[]
  streak: number
  totalWeeks: number
  weekNumber: number
}

export interface ProgressState {
  currentWeek: WeeklyProgress
  historicalData: Map<string, DayProgress> // date -> progress
  longestStreak: number
  currentStreak: number
  totalDaysCompleted: number
}

export interface ProgressStore extends ProgressState {
  updateDayProgress: (date: string, progress: Partial<DayProgress>) => void
  getCurrentWeekData: () => WeeklyProgress
  getStreakData: () => { current: number; longest: number }
  loadHistoricalData: () => void
  resetProgress: () => void
}

export type DayState = 'completed' | 'current' | 'locked' | 'available'

export interface CelebrationState {
  show: boolean
  type: 'streak' | 'goal' | 'week_complete'
  value?: number
}