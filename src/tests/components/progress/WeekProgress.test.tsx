import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeekProgress } from '../../../components/progress/WeekProgress'
import { mockWeekProgressData } from '../../fixtures/progressData'
import { renderWithTheme, getAccessibilityAttributes } from '../../utils/progressTestHelpers'

describe('WeekProgress Component', () => {
  const defaultProps = {
    weekData: mockWeekProgressData.weeks[0],
    isActive: false,
    onClick: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render week title and date range', () => {
      render(<WeekProgress {...defaultProps} />)
      
      expect(screen.getByText('Week 1')).toBeInTheDocument()
      expect(screen.getByText(/jan 1.*jan 7/i)).toBeInTheDocument()
    })

    it('should display completion statistics', () => {
      render(<WeekProgress {...defaultProps} />)
      
      // Based on mock data: 4 completed days out of 7
      expect(screen.getByText('4/7')).toBeInTheDocument()
      expect(screen.getByText('(57%)')).toBeInTheDocument()
    })

    it('should render day grid with proper labels', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      dayLabels.forEach(label => {
        expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
      })
    })

    it('should render 7 day cells', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      expect(dayCells).toHaveLength(7)
    })

    it('should show active state styling', () => {
      render(<WeekProgress {...defaultProps} isActive={true} />)
      
      const weekProgress = screen.getByRole('button')
      expect(weekProgress).toHaveClass('active')
      expect(weekProgress).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByText('Current Week')).toBeInTheDocument()
    })

    it('should render with different themes', () => {
      const { rerender } = render(<WeekProgress {...defaultProps} theme="light" />)
      expect(screen.getByRole('button')).toHaveClass('light')
      
      rerender(<WeekProgress {...defaultProps} theme="dark" />)
      expect(screen.getByRole('button')).toHaveClass('dark')
    })
  })

  describe('Day Cell Rendering', () => {
    it('should show completed days with correct styling', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      const completedCell = dayCells.find(cell => 
        cell.classList.contains('completed')
      )
      
      expect(completedCell).toBeInTheDocument()
      expect(completedCell).toHaveTextContent('✓')
    })

    it('should show incomplete days with correct styling', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      const incompleteCell = dayCells.find(cell => 
        cell.classList.contains('incomplete')
      )
      
      expect(incompleteCell).toBeInTheDocument()
      expect(incompleteCell).toHaveTextContent('○')
    })

    it('should display correct day numbers', () => {
      render(<WeekProgress {...defaultProps} />)
      
      for (let i = 1; i <= 7; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument()
      }
    })

    it('should calculate and display progress indicators', () => {
      render(<WeekProgress {...defaultProps} />)
      
      // Check that progress fill elements are rendered
      const progressFills = document.querySelectorAll('.progress-fill')
      expect(progressFills.length).toBeGreaterThan(0)
    })
  })

  describe('Statistics Display', () => {
    it('should show total steps with proper formatting', () => {
      render(<WeekProgress {...defaultProps} />)
      
      // Sum of steps from mock data
      const expectedSteps = mockWeekProgressData.weeks[0].days
        .reduce((sum, day) => sum + day.steps, 0)
      
      expect(screen.getByLabelText(new RegExp(`total steps.*${expectedSteps.toLocaleString()}`, 'i')))
        .toBeInTheDocument()
    })

    it('should show total distance with proper formatting', () => {
      render(<WeekProgress {...defaultProps} />)
      
      // Sum of distance from mock data
      const expectedDistance = mockWeekProgressData.weeks[0].days
        .reduce((sum, day) => sum + day.distance, 0)
      
      expect(screen.getByLabelText(new RegExp(`total distance.*${expectedDistance.toFixed(1)}`, 'i')))
        .toBeInTheDocument()
    })

    it('should display step and distance icons', () => {
      render(<WeekProgress {...defaultProps} />)
      
      expect(screen.getByText('👟')).toBeInTheDocument()
      expect(screen.getByText('📏')).toBeInTheDocument()
    })

    it('should handle zero statistics gracefully', () => {
      const emptyWeekData = {
        ...mockWeekProgressData.weeks[0],
        days: mockWeekProgressData.weeks[0].days.map(day => ({
          ...day,
          steps: 0,
          distance: 0,
          completed: false
        }))
      }
      
      render(<WeekProgress {...defaultProps} weekData={emptyWeekData} />)
      
      expect(screen.getByText('0')).toBeInTheDocument() // Steps
      expect(screen.getByText('0.0')).toBeInTheDocument() // Distance
      expect(screen.getByText('0/7')).toBeInTheDocument() // Completion
      expect(screen.getByText('(0%)')).toBeInTheDocument() // Percentage
    })
  })

  describe('Progress Bar', () => {
    it('should render progress bar with correct width', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const progressBar = document.querySelector('.week-progress-bar .progress-fill')
      expect(progressBar).toBeInTheDocument()
      
      // Should have width style based on completion percentage
      const completionRate = (4 / 7) * 100 // 4 completed days out of 7
      expect(progressBar).toHaveStyle(`width: ${completionRate.toFixed(0)}%`)
    })

    it('should handle 100% completion', () => {
      const fullWeekData = {
        ...mockWeekProgressData.weeks[0],
        days: mockWeekProgressData.weeks[0].days.map(day => ({
          ...day,
          completed: true
        }))
      }
      
      render(<WeekProgress {...defaultProps} weekData={fullWeekData} />)
      
      const progressBar = document.querySelector('.week-progress-bar .progress-fill')
      expect(progressBar).toHaveStyle('width: 100%')
      expect(screen.getByText('7/7')).toBeInTheDocument()
      expect(screen.getByText('(100%)')).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      
      render(<WeekProgress {...defaultProps} onClick={onClick} />)
      
      const weekProgress = screen.getByRole('button')
      await user.click(weekProgress)
      
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should handle keyboard interaction', () => {
      const onClick = vi.fn()
      
      render(<WeekProgress {...defaultProps} onClick={onClick} />)
      
      const weekProgress = screen.getByRole('button')
      weekProgress.focus()
      
      // Enter key
      fireEvent.keyDown(weekProgress, { key: 'Enter' })
      expect(onClick).toHaveBeenCalledTimes(1)
      
      // Space key
      fireEvent.keyDown(weekProgress, { key: ' ' })
      expect(onClick).toHaveBeenCalledTimes(2)
    })

    it('should prevent default for handled keyboard events', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const weekProgress = screen.getByRole('button')
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      
      fireEvent(weekProgress, event)
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should be focusable', async () => {
      const user = userEvent.setup()
      render(<WeekProgress {...defaultProps} />)
      
      const weekProgress = screen.getByRole('button')
      await user.tab()
      
      expect(weekProgress).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const weekProgress = screen.getByRole('button')
      const attributes = getAccessibilityAttributes(weekProgress)
      
      expect(attributes.ariaLabel).toContain('Week 1')
      expect(attributes.ariaLabel).toContain('4 of 7 days completed')
      expect(weekProgress).toHaveAttribute('tabIndex', '0')
    })

    it('should provide detailed day accessibility information', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      
      // Check first day (completed)
      const firstDay = dayCells[0]
      const ariaLabel = firstDay.getAttribute('aria-label')
      
      expect(ariaLabel).toContain('Sun Jan 1')
      expect(ariaLabel).toContain('completed')
      expect(ariaLabel).toContain('steps')
      expect(ariaLabel).toContain('km')
    })

    it('should provide goal progress information in day labels', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      const dayWithProgress = dayCells.find(cell => {
        const label = cell.getAttribute('aria-label')
        return label && label.includes('% of goal')
      })
      
      expect(dayWithProgress).toBeInTheDocument()
    })

    it('should have proper grid structure', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const grid = screen.getByRole('grid', { name: /daily progress for the week/i })
      expect(grid).toBeInTheDocument()
      
      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(7)
      
      const cells = screen.getAllByRole('gridcell')
      expect(cells).toHaveLength(7)
    })

    it('should provide statistics with proper labels', () => {
      render(<WeekProgress {...defaultProps} />)
      
      expect(screen.getByLabelText(/total steps/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/total distance/i)).toBeInTheDocument()
    })

    it('should hide decorative elements from screen readers', () => {
      render(<WeekProgress {...defaultProps} />)
      
      // Icons should be hidden
      const stepIcon = screen.getByText('👟')
      const distanceIcon = screen.getByText('📏')
      
      expect(stepIcon).toHaveAttribute('aria-hidden', 'true')
      expect(distanceIcon).toHaveAttribute('aria-hidden', 'true')
      
      // Progress bars should be hidden
      const progressFills = document.querySelectorAll('.progress-fill')
      progressFills.forEach(fill => {
        expect(fill).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('Custom Props', () => {
    it('should accept custom aria-label', () => {
      const customLabel = 'Custom week progress description'
      
      render(<WeekProgress {...defaultProps} aria-label={customLabel} />)
      
      expect(screen.getByLabelText(customLabel)).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      render(<WeekProgress {...defaultProps} className="custom-week-progress" />)
      
      const weekProgress = screen.getByRole('button')
      expect(weekProgress).toHaveClass('custom-week-progress')
    })
  })

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      const weekData = {
        ...mockWeekProgressData.weeks[0],
        startDate: '2024-03-15',
        days: mockWeekProgressData.weeks[0].days.map((day, index) => ({
          ...day,
          date: `2024-03-${15 + index}`
        }))
      }
      
      render(<WeekProgress {...defaultProps} weekData={weekData} />)
      
      expect(screen.getByText(/mar 15.*mar 21/i)).toBeInTheDocument()
    })

    it('should handle date formatting across month boundaries', () => {
      const weekData = {
        ...mockWeekProgressData.weeks[0],
        startDate: '2024-01-29',
        days: [
          { ...mockWeekProgressData.weeks[0].days[0], date: '2024-01-29' },
          { ...mockWeekProgressData.weeks[0].days[1], date: '2024-01-30' },
          { ...mockWeekProgressData.weeks[0].days[2], date: '2024-01-31' },
          { ...mockWeekProgressData.weeks[0].days[3], date: '2024-02-01' },
          { ...mockWeekProgressData.weeks[0].days[4], date: '2024-02-02' },
          { ...mockWeekProgressData.weeks[0].days[5], date: '2024-02-03' },
          { ...mockWeekProgressData.weeks[0].days[6], date: '2024-02-04' }
        ]
      }
      
      render(<WeekProgress {...defaultProps} weekData={weekData} />)
      
      expect(screen.getByText(/jan 29.*feb 4/i)).toBeInTheDocument()
    })
  })

  describe('Progress Calculations', () => {
    it('should calculate individual day progress correctly', () => {
      render(<WeekProgress {...defaultProps} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      
      // Check that progress calculations are reflected in styles
      dayCells.forEach((cell, index) => {
        const day = mockWeekProgressData.weeks[0].days[index]
        const stepsProgress = Math.min((day.steps / day.goals.steps) * 100, 100)
        const distanceProgress = Math.min((day.distance / day.goals.distance) * 100, 100)
        const overallProgress = (stepsProgress + distanceProgress) / 2
        
        expect(cell).toHaveStyle(`--progress-percentage: ${overallProgress}%`)
      })
    })

    it('should handle progress over 100%', () => {
      const overAchievingWeek = {
        ...mockWeekProgressData.weeks[0],
        days: mockWeekProgressData.weeks[0].days.map(day => ({
          ...day,
          steps: 20000, // Double the goal
          distance: 16,  // Double the goal
          completed: true
        }))
      }
      
      render(<WeekProgress {...defaultProps} weekData={overAchievingWeek} />)
      
      const dayCells = screen.getAllByRole('gridcell')
      dayCells.forEach(cell => {
        expect(cell).toHaveStyle('--progress-percentage: 100%')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing day data gracefully', () => {
      const incompleteWeek = {
        ...mockWeekProgressData.weeks[0],
        days: mockWeekProgressData.weeks[0].days.slice(0, 3) // Only 3 days
      }
      
      expect(() => {
        render(<WeekProgress {...defaultProps} weekData={incompleteWeek} />)
      }).not.toThrow()
    })

    it('should handle invalid dates gracefully', () => {
      const invalidDateWeek = {
        ...mockWeekProgressData.weeks[0],
        startDate: 'invalid-date',
        days: mockWeekProgressData.weeks[0].days.map(day => ({
          ...day,
          date: 'invalid-date'
        }))
      }
      
      expect(() => {
        render(<WeekProgress {...defaultProps} weekData={invalidDateWeek} />)
      }).not.toThrow()
    })

    it('should handle negative values gracefully', () => {
      const negativeWeek = {
        ...mockWeekProgressData.weeks[0],
        days: mockWeekProgressData.weeks[0].days.map(day => ({
          ...day,
          steps: -100,
          distance: -5
        }))
      }
      
      expect(() => {
        render(<WeekProgress {...defaultProps} weekData={negativeWeek} />)
      }).not.toThrow()
    })
  })
})