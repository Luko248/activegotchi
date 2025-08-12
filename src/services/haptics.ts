type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

const getHapticPattern = (style: HapticStyle): number | number[] => {
  switch (style) {
    case 'light': return 15;
    case 'medium': return 30;
    case 'heavy': return 50;
    case 'success': return [20, 50, 20];
    case 'warning': return [50, 30, 50];
    case 'error': return [100, 50, 100, 50, 100];
    case 'selection': return 10;
    default: return 15;
  }
};

const triggerHaptic = (style: HapticStyle = 'light') => {
  try {
    // Try Capacitor if available at runtime
    const cap = (window as any).Capacitor;
    const Haptics = cap?.Plugins?.Haptics || (cap?.isNativePlatform ? (cap?.Plugins?.Haptics) : undefined);
    if (Haptics && Haptics.impact) {
      const capacitorStyle = style === 'selection' ? 'light' : 
                           style === 'success' || style === 'warning' || style === 'error' ? 'medium' : 
                           style;
      Haptics.impact({ style: capacitorStyle }).catch(() => {});
      return;
    }
  } catch {}
  
  try {
    const pattern = getHapticPattern(style);
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {}
};

// Convenience functions
export const triggerLightHaptic = () => triggerHaptic('light');
export const triggerMediumHaptic = () => triggerHaptic('medium');
export const triggerHeavyHaptic = () => triggerHaptic('heavy');
export const triggerSuccessHaptic = () => triggerHaptic('success');
export const triggerWarningHaptic = () => triggerHaptic('warning');
export const triggerErrorHaptic = () => triggerHaptic('error');
export const triggerSelectionHaptic = () => triggerHaptic('selection');

