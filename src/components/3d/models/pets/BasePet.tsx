import React, { useRef, useMemo, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { PetState } from '../../../../types';

export interface BasePetProps {
  petState: PetState;
  onPetTap: () => void;
  children?: ReactNode;
}

const BasePet: React.FC<BasePetProps> = ({ petState, onPetTap, children }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);

  const moodScale = useMemo(() => ({
    happy: 1.1,
    neutral: 1.0,
    sad: 0.9
  }), []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Mood-based rotation
      if (petState.mood === 'happy') {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }

    if (headRef.current) {
      // Head bobbing based on mood
      const bobSpeed = petState.mood === 'happy' ? 4 : petState.mood === 'sad' ? 1 : 2;
      headRef.current.position.y = 1.3 + Math.sin(state.clock.elapsedTime * bobSpeed) * 0.08;
    }
  });

  const handleClick = () => {
    onPetTap();
    // Add bounce animation on click
    if (groupRef.current) {
      groupRef.current.scale.set(1.2, 1.2, 1.2);
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.scale.set(1, 1, 1);
        }
      }, 200);
    }
  };

  return (
    <group 
      ref={groupRef} 
      onClick={handleClick} 
      scale={moodScale[petState.mood]} 
      position={[0, 0, 0]}
    >
      {children}
    </group>
  );
};

export default BasePet;
