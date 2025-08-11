import { HealthData, FitnessMetrics } from '../types'

export class HealthDataService {
  private static instance: HealthDataService
  private mockData: HealthData = {
    steps: 7234,
    distance: 5.2,
    goalSteps: 10000,
    goalDistance: 8.0,
    sleepHours: 6.2,
    goalSleepHours: 7.5
  }

  static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService()
    }
    return HealthDataService.instance
  }

  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000)
    })
  }

  getMockAppleHealthKitData(): FitnessMetrics {
    return {
      currentSteps: this.mockData.steps,
      dailyDistance: this.mockData.distance,
      lastUpdated: new Date()
    }
  }

  async getGoogleFitData(): Promise<FitnessMetrics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          currentSteps: this.mockData.steps + Math.floor(Math.random() * 100),
          dailyDistance: this.mockData.distance + Math.random() * 0.5,
          lastUpdated: new Date()
        })
      }, 500)
    })
  }

  getHealthData(): HealthData {
    return { ...this.mockData }
  }

  updateMockData(steps: number, distance: number) {
    this.mockData.steps = steps
    this.mockData.distance = distance
  }

  hasReachedGoals(): boolean {
    return this.mockData.steps >= this.mockData.goalSteps && 
           this.mockData.distance >= this.mockData.goalDistance
  }

  getGoalProgress(): { stepsProgress: number; distanceProgress: number } {
    return {
      stepsProgress: Math.min((this.mockData.steps / this.mockData.goalSteps) * 100, 100),
      distanceProgress: Math.min((this.mockData.distance / this.mockData.goalDistance) * 100, 100)
    }
  }

  hasGoodSleep(): boolean {
    return (this.mockData.sleepHours ?? 0) >= (this.mockData.goalSleepHours ?? 7)
  }
}
