import { LynxConfig } from './src/services/lynxFramework';

const config: LynxConfig = {
  // App Information
  appId: 'com.activegotchi.app',
  appName: 'ActiveGotchi',
  version: '1.0.0',
  
  // Build Configuration
  webDir: 'dist',
  bundledWebRuntime: false,
  
  // Platform Configuration
  platforms: {
    ios: {
      scheme: 'ActiveGotchi',
      deploymentTarget: '13.0',
      buildConfiguration: 'Release',
      permissions: [
        'NSHealthShareUsageDescription',
        'NSHealthUpdateUsageDescription',
        'NSMotionUsageDescription',
        'NSLocationWhenInUseUsageDescription',
        'NSCameraUsageDescription'
      ]
    },
    android: {
      packageName: 'com.activegotchi.app',
      targetSdkVersion: 34,
      minSdkVersion: 24,
      permissions: [
        'android.permission.ACTIVITY_RECOGNITION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.CAMERA',
        'android.permission.VIBRATE',
        'com.google.android.gms.permission.ACTIVITY_RECOGNITION'
      ]
    }
  },
  
  // Plugin Configuration
  plugins: {
    // Health Data Integration
    '@lynx-framework/health': {
      permissions: {
        read: ['steps', 'distance', 'activeEnergyBurned'],
        write: []
      }
    },
    
    // Haptic Feedback
    '@lynx-framework/haptics': {
      patterns: ['light', 'medium', 'heavy', 'success', 'warning', 'error']
    },
    
    // AR/Camera Support
    '@lynx-framework/camera': {
      permissions: ['camera'],
      features: ['ar', 'webxr']
    },
    
    // Background Processing
    '@lynx-framework/background': {
      enabled: true,
      modes: ['background-fetch', 'background-processing']
    },
    
    // Push Notifications
    '@lynx-framework/notifications': {
      enabled: true,
      sound: true,
      badge: true,
      alert: true
    }
  },
  
  // Development Configuration
  server: {
    url: 'http://localhost:5173',
    cleartext: true,
    originalUrl: 'http://localhost:5173',
    androidScheme: 'https'
  },
  
  // Native Bridge Configuration
  bridge: {
    enabled: true,
    namespace: 'ActiveGotchi',
    plugins: [
      'health-data',
      'haptics',
      'ar-support',
      'background-sync'
    ]
  },
  
  // Build Optimization
  optimization: {
    minify: true,
    treeshake: true,
    bundleAnalyzer: false,
    sourceMap: false
  },
  
  // Security Configuration
  security: {
    contentSecurityPolicy: {
      'default-src': ["'self'", 'data:', 'blob:'],
      'style-src': ["'self'", "'unsafe-inline'"],
      'script-src': ["'self'", "'unsafe-eval'"],
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'connect-src': ["'self'", 'https:', 'wss:']
    },
    allowNavigation: ['*'],
    allowedOrigins: ['*']
  }
};

export default config;