AR Assets Setup
================

Overview
- Android fallback uses Google Scene Viewer with GLB assets.
- iOS fallback uses Quick Look with USDZ assets.
- WebXR AR runs directly in the app when supported (Android Chrome).

Where to place files
- Put assets under `public/ar/` so they are served by Vite.
- Filenames are chosen by `avatarKind` from the pet store.

Supported kinds → filenames
- default → `public/ar/pet.glb` and `public/ar/pet.usdz`
- fox → `public/ar/fox.glb` and `public/ar/fox.usdz`
- dog → `public/ar/dog.glb` and `public/ar/dog.usdz`
- cat → `public/ar/cat.glb` and `public/ar/cat.usdz`
- frog → `public/ar/frog.glb` and `public/ar/frog.usdz`
- blob → `public/ar/blob.glb` and `public/ar/blob.usdz`
- element → `public/ar/element.glb` and `public/ar/element.usdz`

Configuration
- Edit `src/services/arConfig.ts` to set defaults:
  - `iosUSDZPath`: default USDZ path (e.g., `/ar/pet.usdz`).
  - `androidGLBPath`: optional default GLB path (e.g., `/ar/pet.glb`).

Flow
- Android Chrome with WebXR → in-app AR session.
- Android without WebXR → fallback button opens Scene Viewer with GLB.
- iOS (Safari) → fallback button opens Quick Look with USDZ.

Notes
- Scene Viewer requires HTTPS and a valid GLB URL (the app origin is fine for installed PWA/Capacitor).
- USDZ must be valid and authored for Quick Look.
- If only one asset for all kinds, just provide `pet.glb` and `pet.usdz` and set those in `arConfig`.
