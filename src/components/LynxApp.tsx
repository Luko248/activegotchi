import React, { useEffect, useState } from 'react';
import { LynxBridgeService } from '../services/lynxBridge';
import { createHealthDataService, LynxHealthDataService } from '../services/lynxHealthData';
import { LynxHapticsService } from '../services/lynxHaptics';
import { MobileApp } from './mobile/MobileApp';

interface LynxAppProps {
  petName: string;
}

interface AppCapabilities {
  health: boolean;
  haptics: boolean;
  ar: boolean;
  background: boolean;
  platform: 'ios' | 'android' | 'web';
  native: boolean;
}

/**
 * Lynx-powered App Wrapper
 * Handles native integration and provides enhanced capabilities
 */
export const LynxApp: React.FC<LynxAppProps> = ({ petName }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [capabilities, setCapabilities] = useState<AppCapabilities | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bridgeService] = useState(() => LynxBridgeService.getInstance());
  const [healthService] = useState(() => createHealthDataService());
  const [hapticsService] = useState(() => LynxHapticsService.getInstance());

  useEffect(() => {
    initializeLynxApp();
  }, []);

  const initializeLynxApp = async () => {
    try {
      console.log('Initializing Lynx app...');

      // Simplified initialization - just get basic capabilities
      const appCapabilities: AppCapabilities = {
        health: false,
        haptics: 'vibrate' in navigator,
        ar: false,
        background: false,
        platform: bridgeService.getPlatform(),
        native: bridgeService.isNative()
      };

      setCapabilities(appCapabilities);
      setIsInitialized(true);
      console.log('Lynx app initialization complete', appCapabilities);

    } catch (error) {
      console.error('Failed to initialize Lynx app:', error);
      setError(error instanceof Error ? error.message : 'Unknown initialization error');
      
      // Continue with web fallback
      setCapabilities({
        health: false,
        haptics: 'vibrate' in navigator,
        ar: false,
        background: false,
        platform: 'web',
        native: false
      });
      setIsInitialized(true);
    }
  };

  // Handle cleanup when capabilities or services change
  useEffect(() => {
    return () => {
      if (healthService instanceof LynxHealthDataService) {
        healthService.cleanup();
      }
    };
  }, [healthService]);

  // Development panel for testing Lynx integration
  const DevelopmentPanel = () => {
    if (import.meta.env.MODE === 'production' || !capabilities) return null;

    const testIntegration = async () => {
      try {
        console.log('Testing Lynx integration...');
        
        // Test health data
        if (healthService instanceof LynxHealthDataService) {
          const testResults = await healthService.testNativeIntegration();
          console.log('Health integration test:', testResults);
        }

        // Test haptics
        await hapticsService.testAllPatterns();

        // Test AR
        if (capabilities.ar) {
          const arSupported = await bridgeService.isARSupported();
          console.log('AR support:', arSupported);
        }

      } catch (error) {
        console.error('Integration test failed:', error);
      }
    };

    return (
      <div className="fixed top-0 right-0 z-50 p-2 bg-black/80 text-white text-xs rounded-bl">
        <div className="mb-2">
          <strong>Lynx Status:</strong>
          <br />
          Platform: {capabilities.platform}
          <br />
          
          Health: {capabilities.health ? '✅' : '❌'}
          <br />
          Haptics: {capabilities.haptics ? '✅' : '❌'}
          <br />
          AR: {capabilities.ar ? '✅' : '❌'}
          <br />
          Background: {capabilities.background ? '✅' : '❌'}
        </div>
        <button
          onClick={testIntegration}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
        >
          Test Integration
        </button>
      </div>
    );
  };

  // Loading screen
  if (!isInitialized) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Initializing ActiveGotchi</div>
          <div className="text-sm opacity-75 mt-2">
            {bridgeService.isNative() ? 'Setting up native features...' : 'Loading web experience...'}
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-500 to-purple-500">
        <div className="text-center text-white p-6 rounded-lg bg-black/20 backdrop-blur">
          <div className="text-lg font-semibold mb-2">Initialization Error</div>
          <div className="text-sm opacity-75 mb-4">{error}</div>
          <div className="text-xs">
            Continuing with web fallback mode...
          </div>
        </div>
      </div>
    );
  }

  // Main app with Lynx enhancements
  return (
    <div className="h-full w-full">
      <MobileApp petName={petName} />
      <DevelopmentPanel />
    </div>
  );
};

export default LynxApp;
