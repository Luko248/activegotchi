import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import ArPetScene from '../3d/ArPetScene';
import { isWebXRAvailable } from '../../services/platform';
import { CloseButton } from './CloseButton';
import { PetState } from '../../types';

interface AROverlayProps {
  open: boolean;
  onClose: () => void;
  petState?: PetState;
}

const AROverlay: React.FC<AROverlayProps> = ({ open, onClose, petState }) => {
  const [supported, setSupported] = useState<boolean | null>(null);
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
      if (!xr || !xr.isSessionSupported) throw new Error('WebXR not available');
      const supported = await xr.isSessionSupported('immersive-ar');
      if (!supported) throw new Error('AR session not supported');

      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor', 'hit-test'],
        optionalFeatures: ['dom-overlay'],
        // domOverlay: { root: document.body },
      });
      sessionRef.current = session;
      setStarted(true);
      // When session ends, clean up UI state
      session.addEventListener('end', () => {
        setStarted(false);
        sessionRef.current = null;
        setPlaced(false);
        setReticleVisible(false);
      }, { once: true });
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

      {started && (
        <div className="absolute inset-0">
          {/* Mount WebGL only after XR session starts to avoid jank */}
          <Canvas
            onCreated={({ gl }) => {
              gl.xr.enabled = true;
              // Prefer local-floor reference space
              ;(gl.xr as any).setReferenceSpaceType?.('local-floor');
              glRef.current = gl;
              // Attach the active session if present
              if (sessionRef.current) {
                gl.xr.setSession(sessionRef.current);
              }
            }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ArPetScene 
                petState={petState}
                onStatusChange={({ placed, reticleVisible }) => { setPlaced(placed); setReticleVisible(reticleVisible); }}
                resetSignal={resetCounter}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 right-6 z-10 pointer-events-auto">
          <CloseButton onClick={handleClose} className="bg-black/80 text-white border border-white/20 shadow-lg" />
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
              {supported === false && (
                <div className="text-gray-800 dark:text-gray-200 text-sm">
                  AR not supported on this device/browser.
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
