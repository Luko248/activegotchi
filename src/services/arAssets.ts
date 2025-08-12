import { PetMeta } from '../store/petStore';
import { arConfig } from './arConfig';

export interface ARAssetPaths {
  iosUSDZPath: string;
  androidGLBPath: string;
  title: string;
}

/**
 * Computes platform AR asset paths based on pet metadata with sensible defaults.
 * Place files under /public to be served by Vite.
 * - iOS:  /ar/<kind>.usdz (Quick Look)
 * - Android: /ar/<kind>.glb (Scene Viewer)
 */
const kindMap: Record<string, string> = {
  default: 'pet',
  fox: 'fox',
  dog: 'dog',
  cat: 'cat',
  frog: 'frog',
  blob: 'blob',
  element: 'element',
};

export const getArAssetForPet = (pet?: PetMeta | null): ARAssetPaths => {
  const rawKind = pet?.avatarKind || 'default';
  const mapped = kindMap[rawKind] || kindMap.default;
  const base = `/ar/${mapped}`;
  const fallbackUsdZ = arConfig.iosUSDZPath || '/ar/pet.usdz';
  const fallbackGlb = arConfig.androidGLBPath || '/ar/pet.glb';
  return {
    iosUSDZPath: `${base}.usdz` || fallbackUsdZ,
    androidGLBPath: `${base}.glb` || fallbackGlb,
    title: pet?.name || 'ActiveGotchi',
  };
};

export const buildAndroidSceneViewerUrl = (glbPath: string, title?: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fileUrl = origin ? new URL(glbPath, origin).toString() : glbPath;
  const t = encodeURIComponent(title || 'ActiveGotchi');
  const f = encodeURIComponent(fileUrl);
  // Scene Viewer intent URL
  return `https://arvr.google.com/scene-viewer/1.0?file=${f}&mode=ar_preferred&title=${t}#intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
};
