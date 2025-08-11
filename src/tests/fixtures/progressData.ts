import { HealthData, FitnessMetrics } from '../../types'

export const mockHealthData: HealthData = {
  steps: 7234,
  distance: 5.2,
  goalSteps: 10000,
  goalDistance: 8.0
}

export const mockWeekProgressData = {
  weeks: [
    {
      week: 0,
      startDate: '2024-01-01',
      days: [
        { day: 0, date: '2024-01-01', completed: true, steps: 12500, distance: 9.2, goals: { steps: 10000, distance: 8 }},
        { day: 1, date: '2024-01-02', completed: true, steps: 11200, distance: 8.8, goals: { steps: 10000, distance: 8 }},
        { day: 2, date: '2024-01-03', completed: false, steps: 6500, distance: 4.2, goals: { steps: 10000, distance: 8 }},
        { day: 3, date: '2024-01-04', completed: true, steps: 13000, distance: 10.1, goals: { steps: 10000, distance: 8 }},
        { day: 4, date: '2024-01-05', completed: false, steps: 7800, distance: 5.9, goals: { steps: 10000, distance: 8 }},
        { day: 5, date: '2024-01-06', completed: true, steps: 10800, distance: 8.5, goals: { steps: 10000, distance: 8 }},
        { day: 6, date: '2024-01-07', completed: false, steps: 4200, distance: 2.8, goals: { steps: 10000, distance: 8 }}
      ]
    }
  ]
}

export const generateMultiWeekData = (numberOfWeeks: number = 4) =>
  Array.from({ length: numberOfWeeks }, (_, index) => ({
    week: index,
    startDate: new Date(2024, 0, 1 + (index * 7)).toISOString().split('T')[0],
    days: Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex,
      date: new Date(2024, 0, 1 + (index * 7) + dayIndex).toISOString().split('T')[0],
      completed: Math.random() > 0.3,
      steps: Math.floor(Math.random() * 15000) + 5000,
      distance: Math.random() * 12 + 3,
      goals: { steps: 10000, distance: 8 }
    }))
  }))