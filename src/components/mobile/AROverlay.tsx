import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import ArPetScene from '../3d/ArPetScene';
import { isAndroid, isIOS, isWebXRAvailable } from '../../services/platform';
import { arConfig } from '../../services/arConfig';
import { usePetStore } from '../../store/petStore';
import { buildAndroidSceneViewerUrl, getArAssetForPet } from '../../services/arAssets';

interface AROverlayProps {
  open: boolean;
  onClose: () => void;
}

const AROverlay: React.FC<AROverlayProps> = ({ open, onClose }) => {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ios, setIos] = useState(false);
  const [android, setAndroid] = useState(false);
  const pet = usePetStore((s) => s.pet);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const sessionRef = useRef<any>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const [reticleVisible, setReticleVisible] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const ok = await isWebXRAvailable();
        if (mounted) setSupported(ok);
      } catch (_e) {
        if (mounted) setSupported(false);
      }
    };
    if (open) {
      setIos(isIOS());
      setAndroid(isAndroid());
      check();
    }
    return () => {
      mounted = false;
    };
  }, [open]);

  const handleStart = async () => {
    setError(null);
    setStarting(true);
    try {
      // @ts-ignore
      const xr = (navigator as any).xr;
      if (!xr) throw new Error('WebXR not available');
      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hit-test', 'dom-overlay'],
        // domOverlay: { root: document.body },
      });
      sessionRef.current = session;
      if (glRef.current) {
        glRef.current.xr.setSession(session);
        setStarted(true);
      } else {
        // Canvas not ready yet, wait a tick
        setTimeout(() => {
          if (glRef.current) {
            glRef.current.xr.setSession(session);
            setStarted(true);
          }
        }, 100);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to start AR');
    } finally {
      setStarting(false);
    }
  };

  const handleClose = async () => {
    try {
      if (sessionRef.current) {
        await sessionRef.current.end();
        sessionRef.current = null;
      }
    } catch {}
    setStarted(false);
    setPlaced(false);
    setReticleVisible(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Dim backdrop when not in AR session; transparent once AR starts */}
      {!started && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />}

      <div className="absolute inset-0">
        {/* AR Canvas always mounted so renderer is ready */}
        <Canvas
          onCreated={({ gl }) => {
            gl.xr.enabled = true;
            glRef.current = gl;
          }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ArPetScene 
              onStatusChange={({ placed, reticleVisible }) => { setPlaced(placed); setReticleVisible(reticleVisible); }}
              resetSignal={resetCounter}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 right-6 z-10 pointer-events-auto">
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-black/80 text-white grid place-items-center shadow-lg border border-white/20"
            aria-label="Close AR"
          >
            ✕
          </button>
        </div>

        {/* Bottom controls before AR starts */}
        {!started && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 w-full max-w-sm pointer-events-auto">
            <div className="backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-2xl shadow-xl p-4 text-center mx-6">
              {supported === null && (
                <div className="text-gray-800 dark:text-gray-200 text-sm">Checking AR support…</div>
              )}
              {supported && (
                <>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mb-2">View your pet in AR</div>
                  <button
                    onClick={() => { try { (navigator as any).vibrate?.(10) } catch {} ; handleStart() }}
                    disabled={starting}
                    className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-lg disabled:opacity-60"
                  >
                    {starting ? 'Starting…' : 'Start AR'}
                  </button>
                </>
              )}
              {supported === false && ios && (
                <>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mb-2">View in AR (iOS)</div>
                  {(() => {
                    const assets = getArAssetForPet(pet);
                    return (
                      <a
                        rel="ar"
                        href={assets.iosUSDZPath || arConfig.iosUSDZPath}
                        className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-black/80 text-white font-semibold shadow-lg"
                        aria-label="Open in AR Quick Look"
                      >
                        Open in AR
                      </a>
                    );
                  })()}
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-2">
                    Place a USDZ under <code className="px-1 py-0.5 bg-black/20 rounded">public/ar/&lt;kind&gt;.usdz</code>.
                  </div>
                </>
              )}
              {supported === false && android && (
                <>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mb-2">View in AR (Android)</div>
                  {(() => {
                    const assets = getArAssetForPet(pet);
                    const href = buildAndroidSceneViewerUrl(assets.androidGLBPath || arConfig.androidGLBPath || '/ar/pet.glb', assets.title);
                    return (
                      <a
                        href={href}
                        className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-black/80 text-white font-semibold shadow-lg"
                        aria-label="Open in AR Scene Viewer"
                      >
                        Open in AR
                      </a>
                    );
                  })()}
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-2">
                    Place a GLB under <code className="px-1 py-0.5 bg-black/20 rounded">public/ar/&lt;kind&gt;.glb</code>.
                  </div>
                </>
              )}
              {supported === false && !ios && (
                <div className="text-gray-800 dark:text-gray-200 text-sm">
                  AR not supported. Update Chrome or enable WebXR.
                </div>
              )}
              {error && (
                <div className="mt-2 text-xs text-red-200">{error}</div>
              )}
            </div>
          </div>
        )}

        {/* In-session hints and controls */}
        {started && (
          <>
            {/* Hint: before placement */}
            {!placed && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 w-full max-w-md pointer-events-none">
                <div className="mx-6 rounded-2xl backdrop-blur bg-black/50 text-white text-center text-sm py-2 px-3">
                  {reticleVisible ? 'Tap to place your pet.' : 'Move your phone to find a surface…'}
                </div>
              </div>
            )}
            {/* Reset placement */}
            {placed && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 w-full max-w-md pointer-events-auto grid place-items-center">
                <button
                  onClick={() => setResetCounter((v) => v + 1)}
                  className="mx-6 rounded-xl bg-white/80 text-black text-sm font-semibold py-2 px-4 shadow"
                >
                  Reset placement
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AROverlay;
