import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar, RotateCcw } from 'lucide-react'
import { DayCell } from './DayCell'
import { ProgressStreak } from './ProgressStreak'
import { useProgressData } from '../../hooks/useProgressData'
import { DayProgress, CelebrationState } from '../../types/progress'

interface WeeklyProgressMapProps {
  className?: string
  onDayPress?: (day: DayProgress) => void
}

export const WeeklyProgressMap: React.FC<WeeklyProgressMapProps> = ({
  className = '',
  onDayPress
}) => {
  const {
    currentWeek,
    currentStreak,
    longestStreak,
    totalDaysCompleted,
    getWeekCompletion,
    getMotivationalMessage,
    refreshProgress,
    getTodayProgress
  } = useProgressData()

  const [celebration, setCelebration] = useState<CelebrationState>({
    show: false,
    type: 'streak'
  })
  const [previousStreak, setPreviousStreak] = useState(currentStreak)

  // Handle streak celebrations
  useEffect(() => {
    if (currentStreak > previousStreak && currentStreak > 0) {
      if (currentStreak % 7 === 0 || currentStreak === 3) {
        setCelebration({
          show: true,
          type: 'streak',
          value: currentStreak
        })
      }
    }
    setPreviousStreak(currentStreak)
  }, [currentStreak, previousStreak])

  const weekCompletion = getWeekCompletion()
  const motivationalMessage = getMotivationalMessage()
  const todayProgress = getTodayProgress()

  const handleDayPress = (day: DayProgress) => {
    onDayPress?.(day)
  }

  const handleCelebrationComplete = () => {
    setCelebration(prev => ({ ...prev, show: false }))
  }

  const handleRefresh = () => {
    refreshProgress()
  }

  const weekLabel = format(new Date(), 'MMM d, yyyy')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`}
    >
      <div className="space-y-4">
        {/* Header Section */}
        <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Weekly Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {weekLabel}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
              title="Refresh progress"
            >
              <RotateCcw size={16} className="text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Week Progress Overview */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Week completion
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {weekCompletion}%
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${weekCompletion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </div>

          {/* Motivational Message */}
          <motion.p
            key={motivationalMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-center text-gray-700 dark:text-gray-300 font-medium"
          >
            {motivationalMessage}
          </motion.p>
        </div>

        {/* Weekly Progress Grid */}
        <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-6">
          <div className="grid grid-cols-7 gap-4 mb-6">
            {currentWeek.days.map((day, index) => (
              <DayCell
                key={day.date}
                day={day}
                dayIndex={index}
                onDayPress={handleDayPress}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse" />
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-white/70 dark:bg-black/50 border border-gray-200/60 dark:border-gray-600/40" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-200/50 dark:bg-gray-700/50" />
              <span>Locked</span>
            </div>
          </div>
        </div>

        {/* Streak Display */}
        <ProgressStreak
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          showCelebration={celebration.show}
          onCelebrationComplete={handleCelebrationComplete}
        />

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-xl shadow-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalDaysCompleted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Days Completed
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-xl shadow-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {todayProgress?.progress || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Today's Progress
            </div>
          </motion.div>
        </div>

        {/* Debug Information (can be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="backdrop-blur-md bg-black/20 border border-gray-600/40 rounded-xl p-3 text-xs text-gray-400"
          >
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <div className="space-y-1">
              <div>Week Start: {currentWeek.startDate}</div>
              <div>Current Streak: {currentStreak}</div>
              <div>Longest Streak: {longestStreak}</div>
              <div>Week Completion: {weekCompletion}%</div>
              {todayProgress && (
                <div>
                  Today: {todayProgress.steps} steps, {todayProgress.distance}km ({todayProgress.progress}%)
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}