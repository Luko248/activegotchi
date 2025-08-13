/**
 * Mock Lynx Framework Implementation
 * This provides the interface and fallback behavior for Lynx framework
 * until the actual packages are available.
 */

// Type definitions for Lynx Framework
export interface LynxConfig {
  appId: string;
  appName: string;
  version: string;
  webDir: string;
  bundledWebRuntime: boolean;
  platforms: {
    ios?: {
      scheme: string;
      deploymentTarget: string;
      buildConfiguration: string;
      permissions: string[];
    };
    android?: {
      packageName: string;
      targetSdkVersion: number;
      minSdkVersion: number;
      permissions: string[];
    };
  };
  plugins: Record<string, any>;
  server: {
    url: string;
    cleartext: boolean;
    originalUrl: string;
    androidScheme: string;
  };
  bridge: {
    enabled: boolean;
    namespace: string;
    plugins: string[];
  };
  optimization: {
    minify: boolean;
    treeshake: boolean;
    bundleAnalyzer: boolean;
    sourceMap: boolean;
  };
  security: {
    contentSecurityPolicy: Record<string, string[]>;
    allowNavigation: string[];
    allowedOrigins: string[];
  };
}

export interface NativePlugin {
  name: string;
  call(method: string, args?: any): Promise<any>;
}

export class LynxBridge {
  private isNativeEnvironment: boolean;

  constructor(_config: { namespace: string; timeout: number }) {
    
    // Detect if we're in a native environment
    this.isNativeEnvironment = this.detectNativeEnvironment();
  }

  private detectNativeEnvironment(): boolean {
    // Check for Capacitor
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      return true;
    }
    
    // Check for other native indicators
    if (typeof window !== 'undefined' && (window as any).webkit) {
      return true;
    }
    
    // Check user agent for mobile
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;
      return /Android|iPhone|iPad|iPod/i.test(userAgent);
    }
    
    return false;
  }

  isNative(): boolean {
    return this.isNativeEnvironment;
  }

  getPlatform(): 'ios' | 'android' | 'web' {
    if (!this.isNativeEnvironment) return 'web';
    
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
      if (/Android/.test(userAgent)) return 'android';
    }
    
    return 'web';
  }

  getPlugin(name: string): NativePlugin {
    return new MockNativePlugin(name, this);
  }

  async call(plugin: string, method: string, args?: any): Promise<any> {
    if (this.isNativeEnvironment && (window as any).Capacitor) {
      // Try to use Capacitor plugins if available
      try {
        const pluginInstance = (window as any).Capacitor.Plugins[plugin];
        if (pluginInstance && pluginInstance[method]) {
          return await pluginInstance[method](args);
        }
      } catch (error) {
        console.warn(`Capacitor plugin ${plugin}.${method} failed:`, error);
      }
    }
    
    // Fallback to mock implementation
    return this.mockCall(plugin, method, args);
  }

  private async mockCall(plugin: string, method: string, args?: any): Promise<any> {
    console.log(`Mock call: ${plugin}.${method}`, args);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Return appropriate mock responses
    switch (`${plugin}.${method}`) {
      case 'test.ping':
        return 'pong';
      case 'health-data.requestPermissions':
        return true;
      case 'health-data.getSteps':
        return Math.floor(Math.random() * 15000) + 5000;
      case 'health-data.getDistance':
        return Math.random() * 8 + 2;
      case 'haptics.impact':
      case 'haptics.notification':
      case 'haptics.selection':
        // Try web vibration API
        if ('vibrate' in navigator) {
          const duration = args === 'light' ? 25 : args === 'medium' ? 50 : 100;
          navigator.vibrate(duration);
        }
        return true;
      case 'ar-support.isARSupported':
        return false; // Conservative default
      case 'background-sync.registerBackgroundTask':
      case 'background-sync.scheduleBackgroundSync':
      case 'background-sync.enableBackgroundHealthSync':
        return true;
      default:
        return null;
    }
  }
}

class MockNativePlugin implements NativePlugin {
  name: string;
  private bridge: LynxBridge;

  constructor(name: string, bridge: LynxBridge) {
    this.name = name;
    this.bridge = bridge;
  }

  async call(method: string, args?: any): Promise<any> {
    return this.bridge.call(this.name, method, args);
  }

  // Health Data Plugin Methods
  async requestPermissions(): Promise<boolean> {
    return this.call('requestPermissions');
  }

  async getSteps(): Promise<number> {
    return this.call('getSteps');
  }

  async getDistance(): Promise<number> {
    return this.call('getDistance');
  }

  async subscribeToHealthUpdates(callback: (data: { steps: number; distance: number }) => void): Promise<void> {
    // Simulate periodic updates in web environment
    if (!this.bridge.isNative()) {
      const interval = setInterval(async () => {
        const steps = await this.getSteps();
        const distance = await this.getDistance();
        callback({ steps, distance });
      }, 30000); // Every 30 seconds

      // Store interval for cleanup (in a real implementation)
      (window as any)._lynxHealthInterval = interval;
    }
  }

  async unsubscribeFromHealthUpdates(): Promise<void> {
    if ((window as any)._lynxHealthInterval) {
      clearInterval((window as any)._lynxHealthInterval);
      delete (window as any)._lynxHealthInterval;
    }
  }

  // Haptics Plugin Methods
  async impact(style: 'light' | 'medium' | 'heavy'): Promise<void> {
    return this.call('impact', style);
  }

  async notification(type: 'success' | 'warning' | 'error'): Promise<void> {
    return this.call('notification', type);
  }

  async selection(): Promise<void> {
    return this.call('selection');
  }

  // AR Plugin Methods
  async isARSupported(): Promise<boolean> {
    return this.call('isARSupported');
  }

  async requestARSession(): Promise<void> {
    return this.call('requestARSession');
  }

  async stopARSession(): Promise<void> {
    return this.call('stopARSession');
  }

  // Background Plugin Methods
  async registerBackgroundTask(taskId: string): Promise<void> {
    return this.call('registerBackgroundTask', taskId);
  }

  async scheduleBackgroundSync(interval: number): Promise<void> {
    return this.call('scheduleBackgroundSync', interval);
  }

  async enableBackgroundHealthSync(): Promise<void> {
    return this.call('enableBackgroundHealthSync');
  }
}

// Consumers can import the interface NativePlugin for typing; the mock class is internal.
