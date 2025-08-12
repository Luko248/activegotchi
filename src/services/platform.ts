export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
};

export const isAndroid = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
};

export const isWebXRAvailable = async (): Promise<boolean> => {
  try {
    // @ts-ignore
    const xr = (navigator as any).xr;
    if (!xr || !xr.isSessionSupported) return false;
    return !!(await xr.isSessionSupported('immersive-ar'));
  } catch {
    return false;
  }
};

