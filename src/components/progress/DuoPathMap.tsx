import React, { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface DuoPathMapProps {
  className?: string
}

interface DayData {
  date: string
  completed: boolean
  isToday: boolean
  steps: number
  goalSteps: number
  distance: number
  goalDistance: number
  heartLost?: boolean
  heartLostReason?: string
}

interface WeekData {
  weekStart: string
  days: DayData[]
}

// Mock data generator for demonstration
const generateMockData = (): WeekData[] => {
  const weeks: WeekData[] = []
  const today = new Date()
  
  // Generate 4 weeks (current + 3 historical)
  for (let weekOffset = 0; weekOffset <= 3; weekOffset++) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (weekOffset * 7) - today.getDay() + 1) // Monday
    
    const days: DayData[] = []
    let heartLossCount = 0 // Track heart losses per week to keep it realistic
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const dayDate = new Date(weekStart)
      dayDate.setDate(weekStart.getDate() + dayOffset)
      
      const isToday = dayDate.toDateString() === today.toDateString()
      const isInPast = dayDate < today && !isToday
      const isInFuture = dayDate > today
      
      // Generate realistic mock data
      const stepsProgress = isInFuture ? 0 : Math.random() * 120 + 30 // 30-150%
      const distanceProgress = isInFuture ? 0 : Math.random() * 110 + 40 // 40-150%
      const avgProgress = (stepsProgress + distanceProgress) / 2
      
      const steps = Math.round((stepsProgress / 100) * 10000)
      const distance = parseFloat(((distanceProgress / 100) * 8.0).toFixed(1))
      
      // Realistic heart loss - max 1-2 per week to keep avatar alive
      const shouldLoseHeart = isInPast && avgProgress < 70 && heartLossCount < 2 && Math.random() < 0.3
      const heartLost = shouldLoseHeart
      const completed = isInPast && avgProgress >= 80
      
      if (heartLost) heartLossCount++
      
      days.push({
        date: dayDate.toISOString().split('T')[0],
        completed: completed,
        isToday: isToday,
        steps: steps,
        goalSteps: 10000,
        distance: distance,
        goalDistance: 8.0,
        heartLost: heartLost,
        heartLostReason: heartLost ? (stepsProgress < 50 ? 'Not enough steps completed' : 'Daily distance goal not reached') : undefined
      })
    }
    
    weeks.push({
      weekStart: weekStart.toISOString().split('T')[0],
      days
    })
  }
  
  return weeks // Current first, then historical
}

// Day Detail Modal Component
interface DayDetailModalProps {
  day: DayData | null
  onClose: () => void
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ day, onClose }) => {
  if (!day) return null
  
  const stepsProgress = (day.steps / day.goalSteps) * 100
  const distanceProgress = (day.distance / day.goalDistance) * 100
  const overallProgress = (stepsProgress + distanceProgress) / 2
  
  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })
  const dayDate = new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-sm w-full backdrop-blur-md bg-white/30 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{dayName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{dayDate}</p>
          
          {/* Status icon */}
          <div className="mt-4 flex justify-center">
            {day.isToday ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-3xl shadow-lg">
                ⭐️
              </div>
            ) : day.completed ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl shadow-lg">
                🏆
              </div>
            ) : day.heartLost ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-3xl shadow-lg">
                💔
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-3xl shadow-lg">
                🎯
              </div>
            )}
          </div>
        </div>
        
        {/* Heart lost warning */}
        {day.heartLost && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-xl text-center"
          >
            <div className="text-2xl mb-2">💔</div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">Heart Lost!</p>
            <p className="text-xs text-red-600 dark:text-red-400">{day.heartLostReason}</p>
          </motion.div>
        )}
        
        {/* Progress stats */}
        <div className="space-y-4">
          {/* Steps */}
          <div className="backdrop-blur-sm bg-white/20 dark:bg-black/10 rounded-xl p-4 border border-white/30 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">👟</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Steps</span>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{Math.round(stepsProgress)}%</span>
            </div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{day.steps.toLocaleString()}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">of {day.goalSteps.toLocaleString()} steps</div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stepsProgress)}%` }}
              />
            </div>
          </div>
          
          {/* Distance */}
          <div className="backdrop-blur-sm bg-white/20 dark:bg-black/10 rounded-xl p-4 border border-white/30 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏃</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Distance</span>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{Math.round(distanceProgress)}%</span>
            </div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{day.distance.toFixed(1)} km</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">of {day.goalDistance.toFixed(1)} km</div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, distanceProgress)}%` }}
              />
            </div>
          </div>
          
          {/* Overall */}
          <div className="backdrop-blur-sm bg-white/20 dark:bg-black/10 rounded-xl p-4 border border-white/30 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Overall Progress</span>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${Math.min(100, overallProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Enhanced Duolingo-style path with zig-zag design
export const DuoPathMap: React.FC<DuoPathMapProps> = ({ className = '' }) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const mockWeeks = useMemo(() => generateMockData(), [])
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  
  // Auto-scroll to show current week at the bottom by default
  React.useEffect(() => {
    if (scrollContainerRef.current && mockWeeks.length > 0) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          // Scroll to bottom to show current week (which appears last in the DOM)
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
        }
      })
    }
  }, [mockWeeks.length])
  
  return (
    <>
      <div className={`w-full h-full relative ${className}`}>
        <div 
          ref={scrollContainerRef}
          className="h-full w-full min-h-0 overflow-y-auto overflow-x-hidden"
        >
          {/* Display weeks from oldest to newest, current week last */}
          {[...mockWeeks].reverse().map((week, weekIdx) => {
            // Since we reversed, calculate the original index
            const originalIdx = mockWeeks.length - 1 - weekIdx
            const isCurrentWeek = originalIdx === 0
            const weekStartDate = new Date(week.weekStart)
            
            return (
              <div key={week.weekStart} className="w-full flex flex-col justify-center py-12 px-3 @[420px]:py-16 @[420px]:px-4">
                <div className="relative max-w-md mx-auto flex-shrink-0">
                  {/* Week header - sticky */}
                  <div className="sticky -top-4 z-30 text-center mb-8 pt-4">
                    <motion.div 
                      className={`inline-block backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border ${
                        isCurrentWeek 
                          ? 'bg-gradient-to-r from-blue-400/30 to-purple-400/30 border-blue-300/50 dark:from-blue-500/30 dark:to-purple-500/30 dark:border-blue-400/50'
                          : 'bg-white/25 dark:bg-black/25 border-white/30 dark:border-white/15'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <span className={`font-semibold ${
                        isCurrentWeek 
                          ? 'text-lg text-blue-700 dark:text-blue-300'
                          : 'text-base text-gray-700 dark:text-gray-200'
                      }`}>
                        {isCurrentWeek ? 'This Week' : `Week of ${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Zig-zag days layout responsive to container size */}
                  <div className="space-y-4 @[420px]:space-y-6">
                    {week.days.map((day, dayIdx) => {
                      const isLeft = dayIdx % 2 === 0
                      const dayDate = new Date(day.date)
                      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' })
                      const dayNum = dayDate.getDate()
                      
                      // Softer, more pastel colors
                      const nodeColor = day.completed
                        ? 'from-emerald-200 via-green-300 to-emerald-400 dark:from-emerald-400 dark:via-green-500 dark:to-emerald-600'
                        : day.isToday
                          ? 'from-blue-300 via-indigo-400 to-blue-500 dark:from-blue-400 dark:via-indigo-500 dark:to-blue-600'
                          : day.heartLost
                            ? 'from-rose-200 via-pink-300 to-rose-400 dark:from-rose-400 dark:via-pink-500 dark:to-rose-600'
                            : dayDate > new Date()
                              ? 'from-gray-200 via-gray-300 to-gray-400 dark:from-gray-500 dark:via-gray-600 dark:to-gray-700'
                              : 'from-purple-200 via-violet-300 to-purple-400 dark:from-purple-400 dark:via-violet-500 dark:to-purple-600'
                      
                      const shadowColor = day.completed
                        ? 'shadow-green-300/30 dark:shadow-green-500/30'
                        : day.isToday
                          ? 'shadow-blue-400/40 dark:shadow-blue-500/40'
                          : day.heartLost
                            ? 'shadow-rose-300/30 dark:shadow-rose-500/30'
                            : 'shadow-purple-300/20 dark:shadow-purple-500/20'

                      return (
                        <div
                          key={day.date}
                          className={`flex ${
                            isLeft
                              ? 'justify-start pl-10 @[360px]:pl-14 @[420px]:pl-20 @[520px]:pl-28'
                              : 'justify-end pr-10 @[360px]:pr-14 @[420px]:pr-20 @[520px]:pr-28'
                          }`}
                        >
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: weekIdx * 0.1 + dayIdx * 0.05, type: "spring", bounce: 0.3 }}
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                            onClick={() => setSelectedDay(day)}
                            disabled={dayDate > new Date() && !day.isToday}
                          >
                            <div className={`inline-flex items-center gap-4 @[420px]:gap-6 ${isLeft ? '' : 'flex-row-reverse'}`}>
                              {/* Day node */}
                              <div className="relative">
                                {/* Glow effect for current day */}
                                {day.isToday && (
                                  <motion.div
                                    className="absolute -inset-2 bg-gradient-to-r from-blue-300 to-purple-400 rounded-full opacity-30 blur-md"
                                    animate={{ 
                                      scale: [1, 1.2, 1],
                                      opacity: [0.2, 0.4, 0.2]
                                    }}
                                    transition={{ 
                                      duration: 2, 
                                      repeat: Infinity, 
                                      ease: "easeInOut" 
                                    }}
                                  />
                                )}
                                
                                {/* Main node */}
                                <div className={`relative w-14 h-14 @[360px]:w-16 @[360px]:h-16 @[420px]:w-18 @[420px]:h-18 @[520px]:w-22 @[520px]:h-22 rounded-full bg-gradient-to-br ${nodeColor} shadow-lg ${shadowColor} backdrop-blur-sm border-2 border-white/40 dark:border-white/20 group-hover:shadow-xl transition-all duration-300`}>
                                  <div className="absolute inset-1 rounded-full bg-white/80 dark:bg-black/30 backdrop-blur flex items-center justify-center">
                                    <span className="text-xl @[360px]:text-2xl @[520px]:text-3xl">
                                      {day.completed ? '🏆' : day.isToday ? '⭐️' : day.heartLost ? '💔' : '🎯'}
                                    </span>
                                  </div>
                                  
                                  {/* Today indicator ring */}
                                  {day.isToday && (
                                    <motion.div 
                                      className="absolute -inset-1 rounded-full border-2 border-blue-400/60" 
                                      animate={{ 
                                        opacity: [0.8, 0.4, 0.8],
                                        scale: [1, 1.05, 1]
                                      }} 
                                      transition={{ 
                                        repeat: Infinity, 
                                        duration: 2,
                                        ease: "easeInOut"
                                      }} 
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Day label */}
                              <div className={`${isLeft ? 'text-left' : 'text-right'}`}>
                                <div className={`text-sm font-semibold ${
                                  day.isToday 
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-gray-800 dark:text-gray-100'
                                }`}>
                                  {dayName}
                                </div>
                                <div className={`text-xs ${
                                  day.isToday 
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {dayNum}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default DuoPathMap
