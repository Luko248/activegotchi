import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PetState } from '../../types';
import PetFactory from './models/pets/PetFactory';

interface ArPetSceneProps {
  petState?: PetState;
  onStatusChange?: (status: { placed: boolean; reticleVisible: boolean }) => void;
  resetSignal?: number; // change value to request reset
}

const ArPetScene: React.FC<ArPetSceneProps> = ({ petState, onStatusChange, resetSignal }) => {
  const state: PetState = petState || {
    name: 'ActiveGotchi',
    mood: 'happy',
    primaryColor: '#7CC6FF',
  } as any;

  const { gl } = useThree();
  const reticleRef = useRef<THREE.Mesh>(null);
  const hitTestSourceRef = useRef<any>(null);
  const viewerSpaceRef = useRef<any>(null);
  const [localRefSpace, setLocalRefSpace] = useState<any>(null);
  const [placed, setPlaced] = useState(false);
  const [petPose, setPetPose] = useState<{ position: THREE.Vector3; quaternion: THREE.Quaternion } | null>(null);
  const [reticleVisible, setReticleVisible] = useState(false);

  // Setup WebXR hit-test source
  useEffect(() => {
    const session: any = gl.xr.getSession?.();
    if (!session) return;
    let cancelled = false;
    (async () => {
      try {
        const viewerSpace = await session.requestReferenceSpace('viewer');
        const refSpace = gl.xr.getReferenceSpace?.();
        const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
        if (cancelled) return;
        viewerSpaceRef.current = viewerSpace;
        hitTestSourceRef.current = hitTestSource;
        setLocalRefSpace(refSpace);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
      try { hitTestSourceRef.current?.cancel(); } catch {}
      hitTestSourceRef.current = null;
      viewerSpaceRef.current = null;
    };
  }, [gl]);

  // Update reticle each XR frame
  useFrame(() => {
    const session: any = gl.xr.getSession?.();
    if (!session || !reticleRef.current || !hitTestSourceRef.current || !localRefSpace) return;
    // Three stores last XRFrame
    const frame: any = gl.xr.getFrame?.();
    if (!frame) return;
    const results = frame.getHitTestResults(hitTestSourceRef.current);
    if (results && results.length > 0) {
      const pose = results[0].getPose(localRefSpace);
      if (!pose) return;
      const mat = new THREE.Matrix4();
      mat.fromArray(pose.transform.matrix as any);
      reticleRef.current.visible = true;
      setReticleVisible(true);
      reticleRef.current.matrixAutoUpdate = false;
      reticleRef.current.matrix.copy(mat);
    } else {
      reticleRef.current.visible = false;
      setReticleVisible(false);
    }
  });

  // Tap to place
  useEffect(() => {
    const session: any = gl.xr.getSession?.();
    const onSelect = () => {
      if (!reticleRef.current || !reticleRef.current.visible) return;
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      reticleRef.current.matrix.decompose(position, quaternion, scale);
      // Keep pet slightly above surface
      position.y += 0.05;
      setPetPose({ position, quaternion });
      setPlaced(true);
    };
    // Prefer XR select event, fallback to DOM click on canvas
    if (session) {
      session.addEventListener('select', onSelect);
    }
    const el = gl.domElement as HTMLCanvasElement;
    el.addEventListener('pointerdown', onSelect);
    return () => {
      if (session) {
        try { session.removeEventListener('select', onSelect); } catch {}
      }
      el.removeEventListener('pointerdown', onSelect);
    };
  }, [gl]);

  // Expose status upward
  useEffect(() => {
    onStatusChange?.({ placed, reticleVisible });
  }, [placed, reticleVisible]);

  // External reset support
  useEffect(() => {
    if (resetSignal !== undefined) {
      setPlaced(false);
      setPetPose(null);
    }
  }, [resetSignal]);

  // Reserved for future use (anchors or manual transforms)

  return (
    <>
      {/* AR-friendly lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 1]} intensity={1.0} />
      <pointLight position={[-2, 2, -1]} intensity={0.6} />

      {/* Reticle for placement */}
      <mesh ref={reticleRef} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[0.05, 0.06, 32]} />
        <meshBasicMaterial color={0x00ffff} opacity={0.9} transparent />
      </mesh>

      {/* Pet model; appears after placement */}
      {placed && petPose && (
        <group position={petPose.position} quaternion={petPose.quaternion} scale={[1, 1, 1]}>
          <Suspense fallback={null}>
            <PetFactory petState={state} onPetTap={() => {}} />
          </Suspense>
        </group>
      )}
    </>
  );
};

export default ArPetScene;
