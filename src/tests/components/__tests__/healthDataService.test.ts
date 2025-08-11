import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HealthDataService } from '../../../services/healthData'

describe('HealthDataService', () => {
  let service: HealthDataService

  beforeEach(() => {
    // Reset singleton instance
    ;(HealthDataService as any).instance = undefined
    service = HealthDataService.getInstance()
  })

  it('should return the same instance when called multiple times', () => {
    const instance1 = HealthDataService.getInstance()
    const instance2 = HealthDataService.getInstance()
    
    expect(instance1).toBe(instance2)
    expect(instance1).toBeInstanceOf(HealthDataService)
  })

  it('should return current health data', () => {
    const result = service.getHealthData()
    
    expect(result).toEqual({
      steps: 7234,
      distance: 5.2,
      goalSteps: 10000,
      goalDistance: 8.0
    })
  })

  it('should update mock data correctly', () => {
    service.updateMockData(15000, 12.0)
    
    const healthData = service.getHealthData()
    expect(healthData.steps).toBe(15000)
    expect(healthData.distance).toBe(12.0)
  })

  it('should calculate goal progress correctly', () => {
    service.updateMockData(5000, 4.0)
    
    const progress = service.getGoalProgress()
    
    expect(progress.stepsProgress).toBe(50)
    expect(progress.distanceProgress).toBe(50)
  })

  it('should determine when goals are reached', () => {
    service.updateMockData(5000, 4.0)
    expect(service.hasReachedGoals()).toBe(false)
    
    service.updateMockData(10000, 8.0)
    expect(service.hasReachedGoals()).toBe(true)
  })
})