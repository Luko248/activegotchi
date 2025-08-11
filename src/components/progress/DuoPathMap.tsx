import React from 'react'
import { useProgressData } from '../../hooks/useProgressData'
import { motion } from 'framer-motion'

interface DuoPathMapProps {
  className?: string
}

// Simple Duolingo-like vertical path for the current week
export const DuoPathMap: React.FC<DuoPathMapProps> = ({ className = '' }) => {
  const { currentWeek, getTodayProgress } = useProgressData()
  const today = getTodayProgress()

  return (
    <div className={`w-full h-full overflow-y-auto px-6 ${className}`}>
      <div className="relative max-w-md mx-auto py-8">
        {/* Vertical spine */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 bg-gradient-to-b from-blue-300/70 to-purple-300/70 dark:from-gray-700 dark:to-gray-800 rounded-full" />

        <div className="space-y-14 relative pb-24">
          {currentWeek.days.map((day, idx) => {
            const isLeft = idx % 2 === 0
            const isToday = today?.date === day.date
            const isCompleted = day.completed
            const isLocked = !isCompleted && !isToday && new Date(day.date) > new Date()

            const nodeColor = isCompleted
              ? 'from-green-400 to-emerald-500'
              : isToday
                ? 'from-blue-400 to-indigo-500'
                : isLocked
                  ? 'from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600'
                  : 'from-purple-400 to-fuchsia-500'

            return (
              <div key={day.date} className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                {/* Connector curve */}
                {idx > 0 && (
                  <div className={`absolute ${isLeft ? 'right-1/2' : 'left-1/2'} -translate-x-1/2`} style={{ top: idx * 112 - 28 }} aria-hidden>
                    <div className={`w-28 h-12 ${isLeft ? 'rounded-br-2xl' : 'rounded-bl-2xl'} border-b-4 ${isCompleted ? 'border-green-400' : 'border-blue-300'} dark:border-gray-600`} />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-44 text-left ${isLeft ? '' : 'text-right'}`}
                  aria-label={`Day ${idx + 1} ${isCompleted ? 'completed' : isToday ? 'today' : isLocked ? 'locked' : 'available'}`}
                  disabled={isLocked}
                >
                  <div className={`inline-flex items-center gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
                    {/* Node */}
                    <div className={`relative p-0.5 rounded-full bg-gradient-to-br ${nodeColor} shadow-xl`}>
                      <div className={`w-20 h-20 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur grid place-items-center border ${isCompleted ? 'border-green-300' : 'border-white/50 dark:border-white/10'}`}>
                        <span className={`text-2xl`}>{isCompleted ? '🏆' : isToday ? '⭐️' : '🎯'}</span>
                      </div>
                      {isToday && (
                        <motion.span layoutId="ring" className="absolute -inset-1 rounded-full border-2 border-blue-400/60" animate={{ opacity: [0.6, 0.2, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-semibold">Day {idx + 1}</div>
                      <div className="opacity-70">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
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
}

export default DuoPathMap
