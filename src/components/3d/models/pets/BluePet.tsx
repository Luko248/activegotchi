import React, { useRef, useMemo } from 'react';
import { Sphere, Box } from '@react-three/drei';
import { Mesh } from 'three';
import BasePet, { BasePetProps } from './BasePet';

const BluePet: React.FC<BasePetProps> = ({ petState, onPetTap }) => {
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  
  // Blue color palette
  const blueColors = useMemo(() => ({
    primary: '#1E88E5',  // Main blue body color
    secondary: '#0D47A1', // Darker blue for accents
    highlight: '#64B5F6'  // Light blue for highlights
  }), []);

  return (
    <BasePet petState={petState} onPetTap={onPetTap}>
      {/* Body */}
      <Sphere ref={bodyRef} args={[1.2, 32, 32]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color={blueColors.primary} />
      </Sphere>
      
      {/* Head */}
      <Sphere ref={headRef} args={[1.0, 32, 32]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color={blueColors.primary} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.15, 16, 16]} position={[-0.3, 1.5, 0.7]}>
        <meshStandardMaterial color="white" />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.3, 1.5, 0.7]}>
        <meshStandardMaterial color="white" />
      </Sphere>
      
      {/* Pupils */}
      <Sphere args={[0.08, 16, 16]} position={[-0.3, 1.5, 0.85]}>
        <meshStandardMaterial color="black" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.3, 1.5, 0.85]}>
        <meshStandardMaterial color="black" />
      </Sphere>
      
      {/* Eyebrows */}
      <Box args={[0.3, 0.05, 0.05]} position={[-0.3, 1.75, 0.7]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial color={blueColors.secondary} />
      </Box>
      <Box args={[0.3, 0.05, 0.05]} position={[0.3, 1.75, 0.7]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial color={blueColors.secondary} />
      </Box>
      
      {/* Mouth */}
      <Sphere args={[0.5, 16, 16]} position={[0, 1.0, 0.7]} scale={[1, 0.5, 0.5]}>
        <meshStandardMaterial color="#FF6B6B" />
      </Sphere>
      
      {/* Cheeks */}
      <Sphere args={[0.2, 16, 16]} position={[-0.5, 1.1, 0.6]} scale={[1, 0.6, 0.6]}>
        <meshStandardMaterial color="#FF9AA2" opacity={0.6} transparent />
      </Sphere>
      <Sphere args={[0.2, 16, 16]} position={[0.5, 1.1, 0.6]} scale={[1, 0.6, 0.6]}>
        <meshStandardMaterial color="#FF9AA2" opacity={0.6} transparent />
      </Sphere>
      
      {/* Water droplet effects */}
      <Sphere args={[0.08, 16, 16]} position={[-0.8, 0.8, 0.6]}>
        <meshStandardMaterial color={blueColors.highlight} transparent opacity={0.8} />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.7, 0.5, 0.7]}>
        <meshStandardMaterial color={blueColors.highlight} transparent opacity={0.8} />
      </Sphere>
      <Sphere args={[0.06, 16, 16]} position={[0, 2.0, 0.5]}>
        <meshStandardMaterial color={blueColors.highlight} transparent opacity={0.8} />
      </Sphere>
    </BasePet>
  );
};

export default BluePet;
