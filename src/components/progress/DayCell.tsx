import React from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isFuture, parseISO } from 'date-fns'
import { Check, Lock } from 'lucide-react'
import { DayProgress, DayState } from '../../types/progress'

interface DayCellProps {
  day: DayProgress
  dayIndex: number
  onDayPress?: (day: DayProgress) => void
}

const getDayState = (day: DayProgress): DayState => {
  const date = parseISO(day.date)
  
  if (day.completed) return 'completed'
  if (isToday(date)) return 'current'
  if (isFuture(date)) return 'locked'
  return 'available'
}

const getDayName = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, 'EEE').toUpperCase()
}

const getDayNumber = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, 'd')
}

export const DayCell: React.FC<DayCellProps> = ({ 
  day, 
  dayIndex, 
  onDayPress 
}) => {
  const dayState = getDayState(day)
  const dayName = getDayName(day.date)
  const dayNumber = getDayNumber(day.date)
  
  const getStateStyles = () => {
    switch (dayState) {
      case 'completed':
        return {
          container: 'bg-gradient-to-br from-green-500/90 to-emerald-600/90 border-green-400/60 shadow-green-500/25',
          inner: 'bg-green-500/20 border-green-300/40',
          text: 'text-white',
          glow: 'shadow-lg shadow-green-500/30'
        }
      case 'current':
        return {
          container: 'bg-gradient-to-br from-blue-500/90 to-indigo-600/90 border-blue-400/60 shadow-blue-500/25',
          inner: 'bg-blue-500/20 border-blue-300/40',
          text: 'text-white',
          glow: 'shadow-lg shadow-blue-500/30'
        }
      case 'locked':
        return {
          container: 'bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/40 dark:border-gray-600/40',
          inner: 'bg-gray-100/30 dark:bg-gray-800/30 border-gray-200/40 dark:border-gray-700/40',
          text: 'text-gray-400 dark:text-gray-500',
          glow: ''
        }
      default: // available
        return {
          container: 'bg-white/70 dark:bg-black/50 border-gray-200/60 dark:border-gray-600/40 hover:border-blue-300/60 dark:hover:border-blue-400/40',
          inner: 'bg-white/40 dark:bg-gray-800/40 border-gray-100/60 dark:border-gray-700/40',
          text: 'text-gray-700 dark:text-gray-300',
          glow: 'hover:shadow-md'
        }
    }
  }

  const styles = getStateStyles()
  const isInteractive = dayState !== 'locked' && onDayPress
  
  const renderIcon = () => {
    switch (dayState) {
      case 'completed':
        return (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              delay: dayIndex * 0.1 
            }}
          >
            <Check size={16} className="text-white" />
          </motion.div>
        )
      case 'current':
        return (
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
        )
      case 'locked':
        return <Lock size={14} className="text-gray-400 dark:text-gray-500" />
      default:
        return null
    }
  }

  const renderProgressRing = () => {
    if (dayState === 'locked' || day.progress === 0) return null
    
    const radius = 28
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (day.progress / 100) * circumference
    
    return (
      <motion.svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: dayIndex * 0.1 }}
      >
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-200 dark:text-gray-600"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1,
            delay: dayIndex * 0.1,
            ease: "easeOut"
          }}
          className={dayState === 'completed' ? 'text-green-300' : 'text-blue-300'}
        />
      </motion.svg>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        delay: dayIndex * 0.1,
        ease: "easeOut"
      }}
      className="flex flex-col items-center space-y-2"
    >
      {/* Day Label */}
      <span className={`text-xs font-medium ${styles.text}`}>
        {dayName}
      </span>
      
      {/* Day Cell */}
      <motion.button
        onClick={() => isInteractive && onDayPress?.(day)}
        disabled={!isInteractive}
        whileHover={isInteractive ? { scale: 1.05 } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        className={`
          relative w-16 h-16 rounded-2xl backdrop-blur-md border transition-all duration-300
          ${styles.container} ${styles.glow}
          ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
          ${dayState === 'current' ? 'animate-pulse' : ''}
        `}
      >
        {/* Progress Ring */}
        {renderProgressRing()}
        
        {/* Inner Content */}
        <div className={`
          absolute inset-2 rounded-xl border backdrop-blur-sm
          flex flex-col items-center justify-center space-y-1
          ${styles.inner}
        `}>
          {/* Day Number */}
          <span className={`text-sm font-bold ${styles.text}`}>
            {dayNumber}
          </span>
          
          {/* Icon */}
          <div className="flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>
        
        {/* Progress Percentage (for debugging - can be removed) */}
        {day.progress > 0 && dayState !== 'locked' && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <span className="text-xs font-medium bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white dark:text-gray-200">
              {day.progress}%
            </span>
          </div>
        )}
      </motion.button>
    </motion.div>
  )
}