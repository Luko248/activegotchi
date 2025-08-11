import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Target } from 'lucide-react'

interface ProgressStreakProps {
  currentStreak: number
  longestStreak: number
  showCelebration?: boolean
  onCelebrationComplete?: () => void
}

export const ProgressStreak: React.FC<ProgressStreakProps> = ({
  currentStreak,
  longestStreak,
  showCelebration = false,
  onCelebrationComplete
}) => {
  const getStreakIcon = (streak: number) => {
    if (streak === 0) return Target
    if (streak < 7) return Flame
    return Trophy
  }

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400 dark:text-gray-500'
    if (streak < 3) return 'text-orange-500'
    if (streak < 7) return 'text-orange-400'
    if (streak < 14) return 'text-red-500'
    return 'text-purple-500'
  }

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak!"
    if (streak === 1) return "Great start!"
    if (streak < 7) return `${streak} days strong!`
    if (streak < 14) return `${streak} days on fire!`
    if (streak < 21) return `${streak} days unstoppable!`
    return `${streak} days legendary!`
  }

  const StreakIcon = getStreakIcon(currentStreak)
  const streakColor = getStreakColor(currentStreak)
  const streakMessage = getStreakMessage(currentStreak)

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-4"
      >
        <div className="flex items-center justify-between">
          {/* Current Streak */}
          <div className="flex items-center space-x-3">
            <motion.div
              animate={currentStreak > 0 ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: currentStreak > 0 ? Infinity : 0,
                repeatType: "loop"
              }}
              className={`p-2 rounded-xl bg-white/20 dark:bg-black/20 ${streakColor}`}
            >
              <StreakIcon size={20} />
            </motion.div>
            
            <div>
              <div className="flex items-baseline space-x-1">
                <motion.span
                  key={currentStreak}
                  initial={{ scale: 1.2, color: '#f59e0b' }}
                  animate={{ scale: 1, color: 'currentColor' }}
                  className={`text-2xl font-bold ${streakColor}`}
                >
                  {currentStreak}
                </motion.span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  day{currentStreak !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {streakMessage}
              </p>
            </div>
          </div>

          {/* Best Streak */}
          {longestStreak > 0 && (
            <div className="text-right">
              <div className="flex items-center space-x-1 justify-end">
                <Trophy size={14} className="text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  {longestStreak}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                best streak
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-3 relative">
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: currentStreak > 0 ? `${Math.min((currentStreak / 7) * 100, 100)}%` : '0%' 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                currentStreak < 3 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                currentStreak < 7 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                'bg-gradient-to-r from-purple-400 to-purple-500'
              }`}
            />
          </div>
          
          {/* Milestone markers */}
          <div className="absolute -top-1 left-0 w-full flex justify-between">
            {[3, 7, 14, 21].map((milestone) => (
              <motion.div
                key={milestone}
                initial={{ scale: 0 }}
                animate={{ scale: currentStreak >= milestone ? 1.2 : 0.8 }}
                className={`w-2 h-2 rounded-full border-2 ${
                  currentStreak >= milestone
                    ? 'bg-purple-500 border-white'
                    : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500'
                }`}
                style={{ left: `${(milestone / 21) * 100}%`, transform: 'translateX(-50%)' }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            onAnimationComplete={onCelebrationComplete}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            
            {/* Confetti particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 720]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className={`absolute w-3 h-3 rounded-full ${
                  ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][i]
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}