import { LynxBridge, NativePlugin } from './lynxFramework';

// Type definitions for native bridge methods
interface HealthDataPlugin extends NativePlugin {
  requestPermissions(): Promise<boolean>;
  getSteps(): Promise<number>;
  getDistance(): Promise<number>;
  subscribeToHealthUpdates(callback: (data: { steps: number; distance: number }) => void): Promise<void>;
  unsubscribeFromHealthUpdates(): Promise<void>;
}

interface HapticsPlugin extends NativePlugin {
  impact(style: 'light' | 'medium' | 'heavy'): Promise<void>;
  notification(type: 'success' | 'warning' | 'error'): Promise<void>;
  selection(): Promise<void>;
}

interface ARPlugin extends NativePlugin {
  isARSupported(): Promise<boolean>;
  requestARSession(): Promise<void>;
  stopARSession(): Promise<void>;
}

interface BackgroundPlugin extends NativePlugin {
  registerBackgroundTask(taskId: string): Promise<void>;
  scheduleBackgroundSync(interval: number): Promise<void>;
  enableBackgroundHealthSync(): Promise<void>;
}

// Lynx Bridge Service
export class LynxBridgeService {
  private static instance: LynxBridgeService;
  private bridge: LynxBridge;
  private healthPlugin: HealthDataPlugin;
  private hapticsPlugin: HapticsPlugin;
  private arPlugin: ARPlugin;
  private backgroundPlugin: BackgroundPlugin;

  private constructor() {
    this.bridge = new LynxBridge({
      namespace: 'ActiveGotchi',
      timeout: 5000
    });

    // Initialize plugins
    this.healthPlugin = this.bridge.getPlugin('health-data') as HealthDataPlugin;
    this.hapticsPlugin = this.bridge.getPlugin('haptics') as HapticsPlugin;
    this.arPlugin = this.bridge.getPlugin('ar-support') as ARPlugin;
    this.backgroundPlugin = this.bridge.getPlugin('background-sync') as BackgroundPlugin;
  }

  static getInstance(): LynxBridgeService {
    if (!LynxBridgeService.instance) {
      LynxBridgeService.instance = new LynxBridgeService();
    }
    return LynxBridgeService.instance;
  }

  // Health Data Methods
  async requestHealthPermissions(): Promise<boolean> {
    try {
      return await this.healthPlugin.requestPermissions();
    } catch (error) {
      console.error('Failed to request health permissions:', error);
      return false;
    }
  }

  async getHealthData(): Promise<{ steps: number; distance: number }> {
    try {
      const [steps, distance] = await Promise.all([
        this.healthPlugin.getSteps(),
        this.healthPlugin.getDistance()
      ]);
      return { steps, distance };
    } catch (error) {
      console.error('Failed to get health data:', error);
      return { steps: 0, distance: 0 };
    }
  }

  async subscribeToHealthUpdates(callback: (data: { steps: number; distance: number }) => void): Promise<void> {
    try {
      await this.healthPlugin.subscribeToHealthUpdates(callback);
    } catch (error) {
      console.error('Failed to subscribe to health updates:', error);
    }
  }

  async unsubscribeFromHealthUpdates(): Promise<void> {
    try {
      await this.healthPlugin.unsubscribeFromHealthUpdates();
    } catch (error) {
      console.error('Failed to unsubscribe from health updates:', error);
    }
  }

  // Haptics Methods
  async triggerHaptic(style: 'light' | 'medium' | 'heavy'): Promise<void> {
    try {
      await this.hapticsPlugin.impact(style);
    } catch (error) {
      console.error('Failed to trigger haptic:', error);
    }
  }

  async triggerNotificationHaptic(type: 'success' | 'warning' | 'error'): Promise<void> {
    try {
      await this.hapticsPlugin.notification(type);
    } catch (error) {
      console.error('Failed to trigger notification haptic:', error);
    }
  }

  async triggerSelectionHaptic(): Promise<void> {
    try {
      await this.hapticsPlugin.selection();
    } catch (error) {
      console.error('Failed to trigger selection haptic:', error);
    }
  }

  // AR Methods
  async isARSupported(): Promise<boolean> {
    try {
      return await this.arPlugin.isARSupported();
    } catch (error) {
      console.error('Failed to check AR support:', error);
      return false;
    }
  }

  async startARSession(): Promise<void> {
    try {
      await this.arPlugin.requestARSession();
    } catch (error) {
      console.error('Failed to start AR session:', error);
    }
  }

  async stopARSession(): Promise<void> {
    try {
      await this.arPlugin.stopARSession();
    } catch (error) {
      console.error('Failed to stop AR session:', error);
    }
  }

  // Background Methods
  async enableBackgroundSync(): Promise<void> {
    try {
      await this.backgroundPlugin.enableBackgroundHealthSync();
    } catch (error) {
      console.error('Failed to enable background sync:', error);
    }
  }

  async scheduleBackgroundTask(interval: number = 300000): Promise<void> { // 5 minutes default
    try {
      await this.backgroundPlugin.scheduleBackgroundSync(interval);
    } catch (error) {
      console.error('Failed to schedule background task:', error);
    }
  }

  // Utility Methods
  async checkDeviceCapabilities(): Promise<{
    health: boolean;
    haptics: boolean;
    ar: boolean;
    background: boolean;
  }> {
    try {
      const [health, ar] = await Promise.all([
        this.requestHealthPermissions(),
        this.isARSupported()
      ]);

      return {
        health,
        haptics: true, // Most devices support haptics
        ar,
        background: true // Background tasks are supported on both platforms
      };
    } catch (error) {
      console.error('Failed to check device capabilities:', error);
      return {
        health: false,
        haptics: false,
        ar: false,
        background: false
      };
    }
  }

  // Platform Detection
  getPlatform(): 'ios' | 'android' | 'web' {
    if (this.bridge.isNative()) {
      return this.bridge.getPlatform() as 'ios' | 'android';
    }
    return 'web';
  }

  isNative(): boolean {
    return this.bridge.isNative();
  }

  // Development Methods
  async testBridge(): Promise<boolean> {
    try {
      await this.bridge.call('test', 'ping');
      return true;
    } catch (error) {
      console.error('Bridge test failed:', error);
      return false;
    }
  }
}

export default LynxBridgeService;