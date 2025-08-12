export const triggerLightHaptic = () => {
  try {
    // Try Capacitor if available at runtime
    const cap = (window as any).Capacitor;
    const Haptics = cap?.Plugins?.Haptics || (cap?.isNativePlatform ? (cap?.Plugins?.Haptics) : undefined);
    if (Haptics && Haptics.impact) {
      Haptics.impact({ style: 'light' }).catch(() => {});
      return;
    }
  } catch {}
  try {
    if (navigator.vibrate) navigator.vibrate(15);
  } catch {}
};

