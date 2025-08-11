import React from 'react'

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

interface WeekProgressProps {
  weekData: WeekProgressData
  isActive: boolean
  onClick: () => void
  theme?: 'light' | 'dark'
  className?: string
  'aria-label'?: string
}

export const WeekProgress: React.FC<WeekProgressProps> = ({
  weekData,
  isActive,
  onClick,
  theme = 'light',
  className = '',
  'aria-label': ariaLabel
}) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Calculate week statistics
  const completedDays = weekData.days.filter(day => day.completed).length
  const totalSteps = weekData.days.reduce((sum, day) => sum + day.steps, 0)
  const totalDistance = weekData.days.reduce((sum, day) => sum + day.distance, 0)
  const weekCompletionRate = (completedDays / weekData.days.length) * 100

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Get day completion status for accessibility
  const getDayAriaLabel = (day: DayProgress) => {
    const dateFormatted = formatDate(day.date)
    const status = day.completed ? 'completed' : 'not completed'
    const stepsProgress = ((day.steps / day.goals.steps) * 100).toFixed(0)
    const distanceProgress = ((day.distance / day.goals.distance) * 100).toFixed(0)
    
    return `${dayNames[day.day]} ${dateFormatted}: ${status}, ${day.steps} steps (${stepsProgress}% of goal), ${day.distance.toFixed(1)}km (${distanceProgress}% of goal)`
  }

  // Handle keyboard interaction
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={`week-progress ${theme} ${isActive ? 'active' : ''} ${className}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `Week ${weekData.week + 1}: ${completedDays} of 7 days completed, ${weekCompletionRate.toFixed(0)}% completion rate`}
      aria-pressed={isActive}
    >
      {/* Week Header */}
      <div className="week-header">
        <h4 className="week-title">Week {weekData.week + 1}</h4>
        <div className="week-date-range">
          {formatDate(weekData.startDate)} - {formatDate(weekData.days[6].date)}
        </div>
        <div className="week-summary" aria-label={`${completedDays} of 7 days completed`}>
          <span className="completion-count">{completedDays}/7</span>
          <span className="completion-percentage">({weekCompletionRate.toFixed(0)}%)</span>
        </div>
      </div>

      {/* Days Grid */}
      <div 
        className="days-grid" 
        role="grid" 
        aria-label="Daily progress for the week"
      >
        <div className="day-labels" role="row">
          {dayNames.map((dayName, index) => (
            <div
              key={`day-label-${index}`}
              className="day-label"
              role="columnheader"
              aria-label={dayName}
            >
              {dayName}
            </div>
          ))}
        </div>
        
        <div className="day-cells" role="row">
          {weekData.days.map((day) => {
            const stepsProgress = Math.min((day.steps / day.goals.steps) * 100, 100)
            const distanceProgress = Math.min((day.distance / day.goals.distance) * 100, 100)
            const overallProgress = (stepsProgress + distanceProgress) / 2

            return (
              <div
                key={`day-${day.day}`}
                className={`day-cell ${day.completed ? 'completed' : 'incomplete'}`}
                role="gridcell"
                aria-label={getDayAriaLabel(day)}
                style={{
                  '--progress-percentage': `${overallProgress}%`
                } as React.CSSProperties}
              >
                <div className="day-number">{day.day + 1}</div>
                <div className="day-progress-indicator">
                  <div 
                    className="progress-fill"
                    style={{ height: `${overallProgress}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="day-status" aria-hidden="true">
                  {day.completed ? '✓' : '○'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Week Stats */}
      <div className="week-stats" aria-labelledby={`week-${weekData.week}-stats`}>
        <h5 id={`week-${weekData.week}-stats`} className="sr-only">
          Week {weekData.week + 1} Statistics
        </h5>
        <div className="stats-row">
          <div className="stat-item" aria-label={`Total steps: ${totalSteps.toLocaleString()}`}>
            <span className="stat-icon" aria-hidden="true">👟</span>
            <span className="stat-value">{totalSteps.toLocaleString()}</span>
            <span className="stat-unit">steps</span>
          </div>
          <div className="stat-item" aria-label={`Total distance: ${totalDistance.toFixed(1)} kilometers`}>
            <span className="stat-icon" aria-hidden="true">📏</span>
            <span className="stat-value">{totalDistance.toFixed(1)}</span>
            <span className="stat-unit">km</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="week-progress-bar" aria-hidden="true">
        <div 
          className="progress-fill"
          style={{ width: `${weekCompletionRate}%` }}
        />
      </div>

      {/* Active Week Indicator */}
      {isActive && (
        <div className="active-indicator" aria-hidden="true">
          <span>Current Week</span>
        </div>
      )}
    </div>
  )
}