import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import { PetState } from "../types";
import PetFactory from "./3d/models/pets/PetFactory";
import * as THREE from "three";

interface ThreePetProps {
  petState?: PetState;
  onPetTap?: () => void;
  cameraZ?: number; // allow callers to zoom out a bit
  showPirouette?: boolean;
}

// Loading component for 3D avatar
const AvatarFallback = () => (
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[0.8, 32, 32]} />
    <meshStandardMaterial color="#E5E5E5" transparent opacity={0.6} />
  </mesh>
);

export const ThreePet: React.FC<ThreePetProps> = ({
  petState = {
    mood: "happy",
    name: "ActiveGotchi",
  },
  onPetTap = () => {},
  cameraZ,
  showPirouette = false,
}) => {
  return (
    <div
      className="w-full h-full touch-manipulation"
      style={{ height: "100vh", display: "block" }}
    >
      <Canvas
        style={{ height: "100%", width: "100%", background: 'transparent' }}
        camera={{ position: [0, 1.2, cameraZ ?? 8.0], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          premultipliedAlpha: false,
          preserveDrawingBuffer: true
        }}
        shadows
        dpr={[1, 2]}
      >
        {/* Fixed ambient lighting - doesn't rotate with camera */}
        <ambientLight intensity={0.4} color={0xffffff} />
        
        {/* Fixed key light from top-right - stays in world position */}
        <directionalLight 
          position={[5, 8, 3]} 
          intensity={1.2}
          color={0xffffff}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Fill light from opposite side */}
        <directionalLight 
          position={[-3, 4, -2]} 
          intensity={0.5}
          color={0xfff8e1}
        />
        
        {/* Rim light for cute glow */}
        <pointLight 
          position={[0, 3, -4]} 
          intensity={0.8}
          color={0xe1f5fe}
          distance={20}
        />

        {/* Ground plane for shadows */}
        <Plane 
          args={[20, 20]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -2, 0]}
          receiveShadow
        >
          <meshLambertMaterial 
            color={0xf8f9fa} 
            transparent 
            opacity={0.1}
          />
        </Plane>

        <Suspense fallback={<AvatarFallback />}>
          <PetFactory petState={petState} onPetTap={onPetTap} showPirouette={showPirouette} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={8}
          minDistance={3}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 8}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.8}
          zoomSpeed={1.2}
          touches={{
            ONE: THREE.TOUCH.ROTATE, // Single finger rotate
            TWO: THREE.TOUCH.DOLLY_PAN, // Two finger zoom/pan
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: undefined, // Disable pan
          }}
        />
      </Canvas>
    </div>
  );
};

export default ThreePet;
