import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { startOfWeek, format, addDays } from 'date-fns'
import { ProgressStore, DayProgress, WeeklyProgress } from '../types/progress'

// Generate sample historical data for demonstration
const generateSampleData = (): Map<string, DayProgress> => {
  const data = new Map<string, DayProgress>()
  const today = new Date()
  
  // Generate data for the past 21 days (3 weeks)
  for (let i = 21; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateString = format(date, 'yyyy-MM-dd')
    
    // Create realistic sample data with some variation
    const isCompleted = Math.random() > 0.3 // 70% completion rate
    const steps = isCompleted ? Math.floor(Math.random() * 5000) + 8000 : Math.floor(Math.random() * 7000) + 2000
    const distance = isCompleted ? Math.random() * 3 + 6 : Math.random() * 5 + 1
    const progress = Math.min(((steps / 10000) + (distance / 8.0)) / 2 * 100, 100)
    
    data.set(dateString, {
      date: dateString,
      completed: isCompleted && progress >= 80,
      progress: Math.round(progress),
      steps,
      distance: Math.round(distance * 10) / 10,
      goalsReached: steps >= 10000 && distance >= 8.0
    })
  }
  
  return data
}

const calculateStreak = (historicalData: Map<string, DayProgress>, currentDate: Date = new Date()): { current: number; longest: number } => {
  const sortedDates = Array.from(historicalData.keys()).sort()
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  
  // Calculate current streak (working backwards from today)
  for (let i = 0; i <= 30; i++) {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() - i)
    const dateString = format(date, 'yyyy-MM-dd')
    
    const dayData = historicalData.get(dateString)
    if (dayData?.completed) {
      if (i === 0 || currentStreak > 0) {
        currentStreak++
      }
    } else if (i === 0) {
      break // If today isn't completed, no current streak
    } else {
      break
    }
  }
  
  // Calculate longest streak from all data
  for (const date of sortedDates) {
    const dayData = historicalData.get(date)
    if (dayData?.completed) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }
  
  return { current: currentStreak, longest: longestStreak }
}

const getCurrentWeekData = (historicalData: Map<string, DayProgress>, currentDate: Date = new Date()): WeeklyProgress => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const days: DayProgress[] = []
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    const dateString = format(date, 'yyyy-MM-dd')
    
    const existingData = historicalData.get(dateString)
    if (existingData) {
      days.push(existingData)
    } else {
      // Create default data for days without data
      days.push({
        date: dateString,
        completed: false,
        progress: 0,
        steps: 0,
        distance: 0,
        goalsReached: false
      })
    }
  }
  
  const streak = calculateStreak(historicalData, currentDate)
  
  return {
    startDate: format(weekStart, 'yyyy-MM-dd'),
    days,
    streak: streak.current,
    totalWeeks: Math.ceil(historicalData.size / 7),
    weekNumber: Math.ceil((currentDate.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
  }
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // Initialize with sample data
      historicalData: generateSampleData(),
      longestStreak: 0,
      currentStreak: 0,
      totalDaysCompleted: 0,
      currentWeek: getCurrentWeekData(generateSampleData()),
      
      updateDayProgress: (date: string, progressUpdate: Partial<DayProgress>) => {
        const state = get()
        const existingData = state.historicalData.get(date) || {
          date,
          completed: false,
          progress: 0,
          steps: 0,
          distance: 0,
          goalsReached: false
        }
        
        const updatedDay: DayProgress = {
          ...existingData,
          ...progressUpdate,
          completed: progressUpdate.progress !== undefined 
            ? progressUpdate.progress >= 80 
            : existingData.completed
        }
        
        const newHistoricalData = new Map(state.historicalData)
        newHistoricalData.set(date, updatedDay)
        
        const streakData = calculateStreak(newHistoricalData)
        const currentWeekData = getCurrentWeekData(newHistoricalData)
        
        set({
          historicalData: newHistoricalData,
          currentStreak: streakData.current,
          longestStreak: streakData.longest,
          currentWeek: currentWeekData,
          totalDaysCompleted: Array.from(newHistoricalData.values()).filter(d => d.completed).length
        })
      },
      
      getCurrentWeekData: () => {
        const state = get()
        return getCurrentWeekData(state.historicalData)
      },
      
      getStreakData: () => {
        const state = get()
        return calculateStreak(state.historicalData)
      },
      
      loadHistoricalData: () => {
        const state = get()
        const streakData = calculateStreak(state.historicalData)
        const currentWeekData = getCurrentWeekData(state.historicalData)
        
        set({
          currentStreak: streakData.current,
          longestStreak: streakData.longest,
          currentWeek: currentWeekData,
          totalDaysCompleted: Array.from(state.historicalData.values()).filter(d => d.completed).length
        })
      },
      
      resetProgress: () => {
        const newData = generateSampleData()
        const streakData = calculateStreak(newData)
        const currentWeekData = getCurrentWeekData(newData)
        
        set({
          historicalData: newData,
          currentStreak: streakData.current,
          longestStreak: streakData.longest,
          currentWeek: currentWeekData,
          totalDaysCompleted: Array.from(newData.values()).filter(d => d.completed).length
        })
      }
    }),
    {
      name: 'activegotchi-progress',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          return {
            ...persistedState,
            historicalData: new Map(Object.entries(persistedState.historicalData || {}))
          }
        }
        return persistedState as ProgressStore
      },
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const data = JSON.parse(str)
          // Convert historicalData array back to Map
          if (data.state.historicalData) {
            data.state.historicalData = new Map(Object.entries(data.state.historicalData))
          }
          return data
        },
        setItem: (name, value) => {
          // Convert Map to object for storage
          const dataToStore = {
            ...value,
            state: {
              ...value.state,
              historicalData: Object.fromEntries(value.state.historicalData)
            }
          }
          localStorage.setItem(name, JSON.stringify(dataToStore))
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)