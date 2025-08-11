import React, { useState, useEffect, useRef } from 'react'
import { WeekProgress } from './WeekProgress'

interface DayProgress {
  day: number
  date: string
  completed: boolean
  steps: number
  distance: number
  goals: {
    steps: number
    distance: number
  }
}

interface WeekProgressData {
  week: number
  startDate: string
  days: DayProgress[]
}

interface ProgressMapProps {
  progressData: WeekProgressData[]
  currentWeek: number
  onWeekChange: (weekIndex: number) => void
  isLoading?: boolean
  theme?: 'light' | 'dark'
  className?: string
  'aria-label'?: string
}

export const ProgressMap: React.FC<ProgressMapProps> = ({
  progressData,
  currentWeek,
  onWeekChange,
  isLoading = false,
  theme = 'light',
  className = '',
  'aria-label': ariaLabel = 'Progress map showing weekly fitness achievements'
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        if (currentWeek > 0) {
          onWeekChange(currentWeek - 1)
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (currentWeek < progressData.length - 1) {
          onWeekChange(currentWeek + 1)
        }
        break
      case 'Home':
        event.preventDefault()
        onWeekChange(0)
        break
      case 'End':
        event.preventDefault()
        onWeekChange(progressData.length - 1)
        break
    }
  }

  // Handle touch/swipe navigation
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    setTouchStart(touch.clientX)
    setIsDragging(false)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!touchStart) return
    
    const touch = event.touches[0]
    const diff = touchStart - touch.clientX
    
    if (Math.abs(diff) > 10) {
      setIsDragging(true)
    }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart || !isDragging) {
      setTouchStart(null)
      setIsDragging(false)
      return
    }

    const touch = event.changedTouches[0]
    const diff = touchStart - touch.clientX
    const minSwipeDistance = 50

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && currentWeek < progressData.length - 1) {
        // Swipe left - next week
        onWeekChange(currentWeek + 1)
      } else if (diff < 0 && currentWeek > 0) {
        // Swipe right - previous week
        onWeekChange(currentWeek - 1)
      }
    }

    setTouchStart(null)
    setIsDragging(false)
  }

  // Auto-scroll to current week
  useEffect(() => {
    if (scrollContainerRef.current) {
      const weekElement = scrollContainerRef.current.children[currentWeek] as HTMLElement
      if (weekElement) {
        weekElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }, [currentWeek])

  // Calculate overall progress statistics
  const getOverallStats = () => {
    if (!progressData.length) return { completedDays: 0, totalDays: 0, completionRate: 0 }
    
    const totalDays = progressData.reduce((acc, week) => acc + week.days.length, 0)
    const completedDays = progressData.reduce(
      (acc, week) => acc + week.days.filter(day => day.completed).length,
      0
    )
    
    return {
      completedDays,
      totalDays,
      completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0
    }
  }

  const stats = getOverallStats()

  if (isLoading) {
    return (
      <div 
        className={`progress-map-loading ${theme} ${className}`}
        aria-label="Loading progress data"
        role="status"
      >
        <div className="loading-spinner" aria-hidden="true"></div>
        <span className="sr-only">Loading progress data...</span>
      </div>
    )
  }

  if (!progressData.length) {
    return (
      <div 
        className={`progress-map-empty ${theme} ${className}`}
        aria-label="No progress data available"
        role="status"
      >
        <p>No progress data available. Start your fitness journey!</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`progress-map ${theme} ${className}`}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress Statistics */}
      <div className="progress-stats" aria-labelledby="stats-heading">
        <h3 id="stats-heading" className="sr-only">Progress Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item" aria-label={`${stats.completedDays} completed days`}>
            <span className="stat-value">{stats.completedDays}</span>
            <span className="stat-label">Completed Days</span>
          </div>
          <div className="stat-item" aria-label={`${stats.completionRate.toFixed(1)}% completion rate`}>
            <span className="stat-value">{stats.completionRate.toFixed(1)}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
          <div className="stat-item" aria-label={`Week ${currentWeek + 1} of ${progressData.length}`}>
            <span className="stat-value">{currentWeek + 1}/{progressData.length}</span>
            <span className="stat-label">Current Week</span>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="week-navigation" role="toolbar" aria-label="Week navigation">
        <button
          type="button"
          onClick={() => onWeekChange(Math.max(0, currentWeek - 1))}
          disabled={currentWeek === 0}
          aria-label="Previous week"
          className="nav-button nav-prev"
        >
          ← Previous
        </button>
        
        <span className="current-week-indicator" aria-live="polite">
          Week {currentWeek + 1}
        </span>
        
        <button
          type="button"
          onClick={() => onWeekChange(Math.min(progressData.length - 1, currentWeek + 1))}
          disabled={currentWeek === progressData.length - 1}
          aria-label="Next week"
          className="nav-button nav-next"
        >
          Next →
        </button>
      </div>

      {/* Weeks Container */}
      <div 
        ref={scrollContainerRef}
        className="weeks-container"
        role="list"
        aria-label="Weekly progress overview"
      >
        {progressData.map((week, index) => (
          <div
            key={`week-${week.week}`}
            role="listitem"
            className={`week-container ${index === currentWeek ? 'active' : ''}`}
            aria-current={index === currentWeek ? 'true' : 'false'}
          >
            <WeekProgress
              weekData={week}
              isActive={index === currentWeek}
              onClick={() => onWeekChange(index)}
              theme={theme}
              aria-label={`Week ${index + 1} progress`}
            />
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="week-indicators" role="tablist" aria-label="Week selection">
        {progressData.map((_, index) => (
          <button
            key={`indicator-${index}`}
            type="button"
            role="tab"
            aria-selected={index === currentWeek}
            aria-controls={`week-${index}-content`}
            tabIndex={index === currentWeek ? 0 : -1}
            onClick={() => onWeekChange(index)}
            className={`week-indicator ${index === currentWeek ? 'active' : ''}`}
            aria-label={`Go to week ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}