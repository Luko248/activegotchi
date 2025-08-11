import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressMap } from '../../../components/progress/ProgressMap'

// Mock data
const mockProgressData = [{
  week: 0,
  startDate: '2024-01-01',
  days: Array.from({ length: 7 }, (_, i) => ({
    day: i,
    date: `2024-01-0${i + 1}`,
    completed: i < 4,
    steps: 10000,
    distance: 8,
    goals: { steps: 10000, distance: 8 }
  }))
}]

describe('ProgressMap Component', () => {
  const defaultProps = {
    progressData: mockProgressData,
    currentWeek: 0,
    onWeekChange: vi.fn(),
  }

  it('should render successfully', () => {
    render(<ProgressMap {...defaultProps} />)
    expect(screen.getAllByText('Week 1')[0]).toBeInTheDocument()
  })

  it('should render loading state', () => {
    render(<ProgressMap {...defaultProps} isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render empty state', () => {
    render(<ProgressMap {...defaultProps} progressData={[]} />)
    expect(screen.getByText(/start your fitness journey/i)).toBeInTheDocument()
  })
})