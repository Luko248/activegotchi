import React, { useRef, useMemo, ReactNode, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { PetState } from '../../../../types';

export interface BasePetProps {
  petState: PetState;
  onPetTap: () => void;
  children?: ReactNode;
  showPirouette?: boolean;
}

const BasePet: React.FC<BasePetProps> = ({ petState, onPetTap, children }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const moodScale = useMemo(() => ({
    happy: 1.05,
    neutral: 1.0,
    sad: 0.95,
    sleepy: 0.98
  }), []);
  
  // Smaller initial scale for better proportions
  const initialScale = 0.8;

  // Ensure avatar is properly initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    if (!isInitialized || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Gentle floating animation based on mood
    const floatSpeed = petState.mood === 'happy' ? 0.8 : petState.mood === 'sad' ? 0.3 : 0.5;
    const floatAmount = petState.mood === 'happy' ? 0.12 : petState.mood === 'sad' ? 0.05 : 0.08;
    groupRef.current.position.y = Math.sin(time * floatSpeed) * floatAmount;
    
    // Subtle mood-based rotation
    if (petState.mood === 'happy') {
      groupRef.current.rotation.y = Math.sin(time * 1.5) * 0.08;
    } else if (petState.mood === 'sleepy') {
      // Gentle swaying for sleepy mood
      groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05;
    }

    if (headRef.current) {
      // Head bobbing based on mood
      const bobSpeed = petState.mood === 'happy' ? 3 : petState.mood === 'sad' ? 0.8 : petState.mood === 'sleepy' ? 0.5 : 2;
      const bobAmount = petState.mood === 'happy' ? 0.1 : petState.mood === 'sad' ? 0.03 : 0.06;
      headRef.current.position.y = 1.3 + Math.sin(time * bobSpeed) * bobAmount;
    }
  });

  const handleClick = () => {
    onPetTap();
    // Add bounce animation on click
    if (groupRef.current && isInitialized) {
      const currentScale = moodScale[petState.mood as keyof typeof moodScale] * initialScale;
      groupRef.current.scale.set(currentScale * 1.15, currentScale * 1.15, currentScale * 1.15);
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.scale.set(currentScale, currentScale, currentScale);
        }
      }, 200);
    }
  };

  const currentScale = moodScale[petState.mood as keyof typeof moodScale] * initialScale;

  return (
    <group 
      ref={groupRef} 
      onClick={handleClick} 
      scale={currentScale}
      position={[0, 0, 0]}
      visible={isInitialized}
    >
      {children}
    </group>
  );
};

export default BasePet;
