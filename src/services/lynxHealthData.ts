import { LynxBridgeService } from './lynxBridge';
import { HealthDataService } from './healthData';

/**
 * Lynx-powered Health Data Service
 * Integrates with native health APIs through Lynx framework
 */
export class LynxHealthDataService extends HealthDataService {
  private bridgeService: LynxBridgeService;
  private isSubscribed: boolean = false;
  private currentSteps: number = 0;
  private currentDistance: number = 0;
  private goalSteps: number = 10000;
  private goalDistance: number = 8.0;

  constructor() {
    super();
    this.bridgeService = LynxBridgeService.getInstance();
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.bridgeService.isNative()) {
      console.log('Running in web mode, using mock data');
      return true;
    }

    try {
      const granted = await this.bridgeService.requestHealthPermissions();
      if (granted) {
        console.log('Health permissions granted');
        // Enable background sync for real-time updates
        await this.bridgeService.enableBackgroundSync();
        return true;
      } else {
        console.warn('Health permissions denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request health permissions:', error);
      return false;
    }
  }

  getHealthData() {
    if (!this.bridgeService.isNative()) {
      return super.getHealthData();
    }
    return {
      steps: this.currentSteps,
      distance: this.currentDistance,
      goalSteps: this.goalSteps,
      goalDistance: this.goalDistance,
      // Include optional fields if base type expects them
      ...(super.getHealthData() as any).sleepHours !== undefined ? { sleepHours: (super.getHealthData() as any).sleepHours } : {},
      ...(super.getHealthData() as any).goalSleepHours !== undefined ? { goalSleepHours: (super.getHealthData() as any).goalSleepHours } : {}
    } as any;
  }

  async refreshFromNative(): Promise<void> {
    if (!this.bridgeService.isNative()) return;
    try {
      const nativeData = await this.bridgeService.getHealthData();
      this.currentSteps = nativeData.steps;
      this.currentDistance = nativeData.distance;
    } catch (error) {
      console.error('Failed to refresh native health data:', error);
    }
  }

  async subscribeToRealTimeUpdates(callback: (data: { steps: number; distance: number }) => void): Promise<void> {
    if (!this.bridgeService.isNative()) {
      console.log('Real-time updates not available in web mode');
      return;
    }

    try {
      // Store not required; callback is invoked directly by bridge subscription
      
      await this.bridgeService.subscribeToHealthUpdates((nativeData) => {
        // Update internal state
        this.currentSteps = nativeData.steps;
        this.currentDistance = nativeData.distance;
        
        // Notify callback
        callback({
          steps: nativeData.steps,
          distance: nativeData.distance
        });
      });

      this.isSubscribed = true;
      console.log('Subscribed to real-time health updates');
    } catch (error) {
      console.error('Failed to subscribe to real-time updates:', error);
    }
  }

  async unsubscribeFromRealTimeUpdates(): Promise<void> {
    if (!this.isSubscribed || !this.bridgeService.isNative()) {
      return;
    }

    try {
      await this.bridgeService.unsubscribeFromHealthUpdates();
      this.isSubscribed = false;
      // No-op: callback reference not stored
      console.log('Unsubscribed from real-time health updates');
    } catch (error) {
      console.error('Failed to unsubscribe from real-time updates:', error);
    }
  }

  // Enhanced goal tracking with native integration
  async checkGoalAchievements(): Promise<{
    stepsAchieved: boolean;
    distanceAchieved: boolean;
    previousStepsAchieved: boolean;
    previousDistanceAchieved: boolean;
  }> {
    const data = await this.getHealthData();
    
    const previousStepsAchieved = this.hasReachedStepsGoal();
    const previousDistanceAchieved = this.hasReachedDistanceGoal();
    
    const stepsAchieved = data.steps >= data.goalSteps;
    const distanceAchieved = data.distance >= data.goalDistance;

    // Trigger haptic feedback for newly achieved goals
    if (this.bridgeService.isNative()) {
      if (stepsAchieved && !previousStepsAchieved) {
        await this.bridgeService.triggerNotificationHaptic('success');
      }
      if (distanceAchieved && !previousDistanceAchieved) {
        await this.bridgeService.triggerNotificationHaptic('success');
      }
    }

    return {
      stepsAchieved,
      distanceAchieved,
      previousStepsAchieved,
      previousDistanceAchieved
    };
  }

  private hasReachedStepsGoal(): boolean {
    const data: any = this.getHealthData();
    return data.steps >= data.goalSteps;
  }

  private hasReachedDistanceGoal(): boolean {
    const data: any = this.getHealthData();
    return data.distance >= data.goalDistance;
  }

  // Platform-specific optimizations
  async optimizeForPlatform(): Promise<void> {
    if (!this.bridgeService.isNative()) return;

    const platform = this.bridgeService.getPlatform();
    
    try {
      if (platform === 'ios') {
        // iOS-specific optimizations
        await this.bridgeService.scheduleBackgroundTask(300000); // 5 minutes
      } else if (platform === 'android') {
        // Android-specific optimizations
        await this.bridgeService.scheduleBackgroundTask(600000); // 10 minutes (battery optimization)
      }
    } catch (error) {
      console.error('Failed to optimize for platform:', error);
    }
  }

  // Development and debugging
  async testNativeIntegration(): Promise<{
    bridge: boolean;
    permissions: boolean;
    data: boolean;
    capabilities: any;
  }> {
    const results: { bridge: boolean; permissions: boolean; data: boolean; capabilities: any } = {
      bridge: false,
      permissions: false,
      data: false,
      capabilities: {} as any
    };

    try {
      // Test bridge connectivity
      results.bridge = await this.bridgeService.testBridge();

      // Test permissions
      results.permissions = await this.requestPermissions();

      // Test data retrieval
      const data = await this.getHealthData();
      results.data = data.steps >= 0 && data.distance >= 0;

      // Get device capabilities
      results.capabilities = await this.bridgeService.checkDeviceCapabilities();

      console.log('Native integration test results:', results);
      return results;
    } catch (error) {
      console.error('Native integration test failed:', error);
      return results;
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    await this.unsubscribeFromRealTimeUpdates();
  }
}

// Factory function to create the appropriate health service
export function createHealthDataService(): HealthDataService {
  try {
    console.log('Creating standard health service (web fallback)');
    return new HealthDataService();
  } catch (error) {
    console.error('Failed to create health service:', error);
    return new HealthDataService();
  }
}
