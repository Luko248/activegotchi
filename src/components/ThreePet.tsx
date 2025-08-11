import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PetState } from "../types";
import PetFactory from "./3d/models/pets/PetFactory";

interface ThreePetProps {
  petState?: PetState;
  onPetTap?: () => void;
}

export const ThreePet: React.FC<ThreePetProps> = ({
  petState = {
    mood: "happy",
    name: "ActiveGotchi",
  },
  onPetTap = () => {},
}) => {
  return (
    <div
      className="w-full h-full touch-manipulation"
      style={{ height: "100vh", display: "block" }}
    >
      <Canvas
        style={{ height: "100%", width: "100%" }}
        camera={{ position: [0, 0.5, 4.2], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Soft global light */}
        <hemisphereLight intensity={0.6} color={0xffffff} groundColor={0x8899aa} />
        {/* Key light */}
        <spotLight position={[6, 8, 6]} angle={0.3} penumbra={1} intensity={1.0} castShadow />
        {/* Rim light for cute sheen */}
        <directionalLight position={[-6, 4, -4]} intensity={0.5} />

        <PetFactory petState={petState} onPetTap={onPetTap} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={6}
          minDistance={2.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          touches={{
            ONE: 2, // TOUCH.ROTATE
            TWO: 1, // TOUCH.DOLLY_PAN
          }}
        />
      </Canvas>
    </div>
  );
};

export default ThreePet;
