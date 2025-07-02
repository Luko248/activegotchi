import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PetState } from '../types';
import PetFactory from './3d/models/pets/PetFactory';

interface ThreePetProps {
  petState: PetState;
  onPetTap: () => void;
}

const ThreePet: React.FC<ThreePetProps> = ({ petState, onPetTap }) => {
  return (
    <div className="w-full h-full px-4 pb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" style={{ height: '100%', display: 'block' }}>
      <Canvas style={{ height: '100%' }} camera={{ position: [0, 0, 4], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PetFactory petState={petState} onPetTap={onPetTap} />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          maxDistance={6} 
          minDistance={2.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default ThreePet;
