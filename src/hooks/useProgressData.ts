import { useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { useProgressStore } from '../store/progressStore'
import { HealthDataService } from '../services/healthData'
import { HealthData } from '../types'

export const useProgressData = () => {
  const {
    updateDayProgress,
    getCurrentWeekData,
    getStreakData,
    loadHistoricalData,
    totalDaysCompleted
  } = useProgressStore()

  const healthService = HealthDataService.getInstance()

  // Update today's progress based on current health data
  const updateTodayProgress = useCallback((healthData: HealthData) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const stepsProgress = Math.min((healthData.steps / healthData.goalSteps) * 100, 100)
    const distanceProgress = Math.min((healthData.distance / healthData.goalDistance) * 100, 100)
    const overallProgress = (stepsProgress + distanceProgress) / 2
    
    updateDayProgress(today, {
      progress: Math.round(overallProgress),
      steps: healthData.steps,
      distance: healthData.distance,
      goalsReached: healthData.steps >= healthData.goalSteps && healthData.distance >= healthData.goalDistance,
      completed: overallProgress >= 80
    })
  }, [updateDayProgress])

  // Initialize progress data on mount
  useEffect(() => {
    loadHistoricalData()
    
    // Update today's progress with current health data
    const currentHealthData = healthService.getHealthData()
    updateTodayProgress(currentHealthData)
  }, [loadHistoricalData, updateTodayProgress, healthService])

  // Get current week's progress data
  const weekData = getCurrentWeekData()
  const streakData = getStreakData()

  return {
    // Current week data
    currentWeek: weekData,
    
    // Streak information
    currentStreak: streakData.current,
    longestStreak: streakData.longest,
    
    // Overall stats
    totalDaysCompleted,
    
    // Actions
    updateTodayProgress,
    refreshProgress: loadHistoricalData,
    
    // Helper functions
    getTodayProgress: () => {
      const today = format(new Date(), 'yyyy-MM-dd')
      return weekData.days.find(day => day.date === today)
    },
    
    getWeekCompletion: () => {
      const completedDays = weekData.days.filter(day => day.completed).length
      return Math.round((completedDays / 7) * 100)
    },
    
    isOnStreak: () => streakData.current > 0,
    
    getMotivationalMessage: () => {
      const { current } = streakData
      
      if (current === 0) {
        return "Start your fitness journey today! 🚀"
      } else if (current === 1) {
        return "Great start! Keep the momentum going! 💪"
      } else if (current < 7) {
        return `${current} days strong! You're building a habit! 🔥`
      } else if (current < 21) {
        return `${current} day streak! You're on fire! 🏆`
      } else {
        return `${current} days! You're a fitness legend! 👑`
      }
    }
  }
}