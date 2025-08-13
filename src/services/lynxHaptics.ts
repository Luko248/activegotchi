import { LynxBridgeService } from './lynxBridge';

/**
 * Lynx-powered Haptics Service
 * Provides native haptic feedback through Lynx framework
 */
export class LynxHapticsService {
  private static instance: LynxHapticsService;
  private bridgeService: LynxBridgeService;
  private isEnabled: boolean = true;

  private constructor() {
    this.bridgeService = LynxBridgeService.getInstance();
    this.loadSettings();
  }

  static getInstance(): LynxHapticsService {
    if (!LynxHapticsService.instance) {
      LynxHapticsService.instance = new LynxHapticsService();
    }
    return LynxHapticsService.instance;
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('activegotchi-haptics-enabled');
      if (stored !== null) {
        this.isEnabled = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load haptics settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('activegotchi-haptics-enabled', JSON.stringify(this.isEnabled));
    } catch (error) {
      console.warn('Failed to save haptics settings:', error);
    }
  }

  // Core haptic methods with Lynx integration
  async triggerLight(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerHaptic('light');
      } catch (error) {
        console.warn('Failed to trigger native light haptic:', error);
        this.fallbackVibrate(50);
      }
    } else {
      this.fallbackVibrate(50);
    }
  }

  async triggerMedium(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerHaptic('medium');
      } catch (error) {
        console.warn('Failed to trigger native medium haptic:', error);
        this.fallbackVibrate(100);
      }
    } else {
      this.fallbackVibrate(100);
    }
  }

  async triggerHeavy(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerHaptic('heavy');
      } catch (error) {
        console.warn('Failed to trigger native heavy haptic:', error);
        this.fallbackVibrate(200);
      }
    } else {
      this.fallbackVibrate(200);
    }
  }

  async triggerSuccess(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerNotificationHaptic('success');
      } catch (error) {
        console.warn('Failed to trigger native success haptic:', error);
        this.fallbackSuccessPattern();
      }
    } else {
      this.fallbackSuccessPattern();
    }
  }

  async triggerWarning(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerNotificationHaptic('warning');
      } catch (error) {
        console.warn('Failed to trigger native warning haptic:', error);
        this.fallbackWarningPattern();
      }
    } else {
      this.fallbackWarningPattern();
    }
  }

  async triggerError(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerNotificationHaptic('error');
      } catch (error) {
        console.warn('Failed to trigger native error haptic:', error);
        this.fallbackErrorPattern();
      }
    } else {
      this.fallbackErrorPattern();
    }
  }

  async triggerSelection(): Promise<void> {
    if (!this.isEnabled) return;

    if (this.bridgeService.isNative()) {
      try {
        await this.bridgeService.triggerSelectionHaptic();
      } catch (error) {
        console.warn('Failed to trigger native selection haptic:', error);
        this.fallbackVibrate(25);
      }
    } else {
      this.fallbackVibrate(25);
    }
  }

  // Enhanced patterns for pet interactions
  async triggerPetTap(): Promise<void> {
    if (!this.isEnabled) return;
    
    if (this.bridgeService.isNative()) {
      // Use medium haptic for pet taps
      await this.triggerMedium();
    } else {
      // Custom pattern for web: short-long-short
      this.fallbackPattern([50, 50, 100, 50, 50]);
    }
  }

  async triggerGoalAchievement(): Promise<void> {
    if (!this.isEnabled) return;
    
    if (this.bridgeService.isNative()) {
      await this.triggerSuccess();
    } else {
      // Celebration pattern: multiple pulses
      this.fallbackPattern([100, 100, 150, 100, 200, 100, 150]);
    }
  }

  async triggerPirouette(): Promise<void> {
    if (!this.isEnabled) return;
    
    if (this.bridgeService.isNative()) {
      // Use light haptic for pirouette
      await this.triggerLight();
    } else {
      // Magical pattern: gentle increasing pulses
      this.fallbackPattern([30, 50, 60, 50, 90, 50, 120]);
    }
  }

  // Fallback methods for web/non-native environments
  private fallbackVibrate(duration: number): void {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch (error) {
        console.warn('Vibration not supported:', error);
      }
    }
  }

  private fallbackPattern(pattern: number[]): void {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Vibration pattern not supported:', error);
      }
    }
  }

  private fallbackSuccessPattern(): void {
    this.fallbackPattern([100, 50, 100, 50, 200]);
  }

  private fallbackWarningPattern(): void {
    this.fallbackPattern([200, 100, 200]);
  }

  private fallbackErrorPattern(): void {
    this.fallbackPattern([300, 100, 300, 100, 300]);
  }

  // Settings management
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.saveSettings();
  }

  isHapticsEnabled(): boolean {
    return this.isEnabled;
  }

  // Capability detection
  async checkCapabilities(): Promise<{
    native: boolean;
    webVibrate: boolean;
    platform: string;
  }> {
    return {
      native: this.bridgeService.isNative(),
      webVibrate: 'vibrate' in navigator,
      platform: this.bridgeService.getPlatform()
    };
  }

  // Development methods
  async testAllPatterns(): Promise<void> {
    if (!this.isEnabled) {
      console.log('Haptics disabled, skipping test');
      return;
    }

    console.log('Testing haptic patterns...');
    
    const patterns = [
      { name: 'Light', method: () => this.triggerLight() },
      { name: 'Medium', method: () => this.triggerMedium() },
      { name: 'Heavy', method: () => this.triggerHeavy() },
      { name: 'Success', method: () => this.triggerSuccess() },
      { name: 'Warning', method: () => this.triggerWarning() },
      { name: 'Error', method: () => this.triggerError() },
      { name: 'Selection', method: () => this.triggerSelection() },
      { name: 'Pet Tap', method: () => this.triggerPetTap() },
      { name: 'Achievement', method: () => this.triggerGoalAchievement() },
      { name: 'Pirouette', method: () => this.triggerPirouette() }
    ];

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      console.log(`Testing ${pattern.name}...`);
      await pattern.method();
      
      // Wait between patterns
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Haptic pattern testing complete');
  }
}

// Convenience functions for backward compatibility
export const triggerLightHaptic = () => LynxHapticsService.getInstance().triggerLight();
export const triggerMediumHaptic = () => LynxHapticsService.getInstance().triggerMedium();
export const triggerHeavyHaptic = () => LynxHapticsService.getInstance().triggerHeavy();
export const triggerSuccessHaptic = () => LynxHapticsService.getInstance().triggerSuccess();
export const triggerWarningHaptic = () => LynxHapticsService.getInstance().triggerWarning();
export const triggerErrorHaptic = () => LynxHapticsService.getInstance().triggerError();
export const triggerSelectionHaptic = () => LynxHapticsService.getInstance().triggerSelection();

// Pet-specific haptic functions
export const triggerPetTapHaptic = () => LynxHapticsService.getInstance().triggerPetTap();
export const triggerGoalAchievementHaptic = () => LynxHapticsService.getInstance().triggerGoalAchievement();
export const triggerPirouetteHaptic = () => LynxHapticsService.getInstance().triggerPirouette();