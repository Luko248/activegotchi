import React, { useRef, useMemo } from 'react';
import { Sphere, Box } from '@react-three/drei';
import { Mesh } from 'three';
import BasePet, { BasePetProps } from './BasePet';

const FirePet: React.FC<BasePetProps> = ({ petState, onPetTap }) => {
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  
  // Fire color palette
  const fireColors = useMemo(() => ({
    primary: '#1E88E5',  // Keeping the blue base
    secondary: '#0D47A1', // Darker blue for accents
    flame: '#FF9800',    // Orange for flames
    flameCore: '#FFEB3B', // Yellow for flame cores
    flameEdge: '#FF5722' // Deep orange for flame edges
  }), []);

  return (
    <BasePet petState={petState} onPetTap={onPetTap}>
      {/* Body */}
      <Sphere ref={bodyRef} args={[1.2, 32, 32]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color={fireColors.primary} />
      </Sphere>
      
      {/* Head */}
      <Sphere ref={headRef} args={[1.0, 32, 32]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color={fireColors.primary} />
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
      
      {/* Happy eyebrows */}
      <Box args={[0.3, 0.05, 0.05]} position={[-0.3, 1.75, 0.7]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial color={fireColors.secondary} />
      </Box>
      <Box args={[0.3, 0.05, 0.05]} position={[0.3, 1.75, 0.7]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial color={fireColors.secondary} />
      </Box>
      
      {/* Big smile */}
      <Sphere args={[0.5, 16, 16]} position={[0, 1.0, 0.7]} scale={[1, 0.6, 0.5]}>
        <meshStandardMaterial color="#FF6B6B" />
      </Sphere>
      
      {/* Cheeks */}
      <Sphere args={[0.25, 16, 16]} position={[-0.5, 1.1, 0.6]} scale={[1, 0.6, 0.6]}>
        <meshStandardMaterial color="#FF9AA2" />
      </Sphere>
      <Sphere args={[0.25, 16, 16]} position={[0.5, 1.1, 0.6]} scale={[1, 0.6, 0.6]}>
        <meshStandardMaterial color="#FF9AA2" />
      </Sphere>
      
      {/* FIRE EFFECTS */}
      {/* Main flame crown */}
      <group position={[0, 1.8, 0]} rotation={[0, 0, 0]}>
        {/* Central flame */}
        <Sphere args={[0.7, 16, 16]} position={[0, 0.5, 0]} scale={[0.7, 1.2, 0.7]}>
          <meshStandardMaterial color={fireColors.flame} emissive={fireColors.flame} emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.5, 16, 16]} position={[0, 0.7, 0]} scale={[0.6, 1.0, 0.6]}>
          <meshStandardMaterial color={fireColors.flameCore} emissive={fireColors.flameCore} emissiveIntensity={0.8} />
        </Sphere>
        
        {/* Side flames */}
        <Sphere args={[0.5, 16, 16]} position={[-0.5, 0.3, 0]} scale={[0.6, 1.0, 0.6]}>
          <meshStandardMaterial color={fireColors.flameEdge} emissive={fireColors.flameEdge} emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.5, 16, 16]} position={[0.5, 0.3, 0]} scale={[0.6, 1.0, 0.6]}>
          <meshStandardMaterial color={fireColors.flameEdge} emissive={fireColors.flameEdge} emissiveIntensity={0.5} />
        </Sphere>
        
        {/* Back flame */}
        <Sphere args={[0.4, 16, 16]} position={[0, 0.4, -0.5]} scale={[0.6, 1.0, 0.6]}>
          <meshStandardMaterial color={fireColors.flame} emissive={fireColors.flame} emissiveIntensity={0.5} />
        </Sphere>
      </group>
      
      {/* Flame particles */}
      <Sphere args={[0.15, 16, 16]} position={[-0.8, 2.0, 0.2]} scale={[0.7, 1.2, 0.7]}>
        <meshStandardMaterial color={fireColors.flameCore} emissive={fireColors.flameCore} emissiveIntensity={0.8} />
      </Sphere>
      <Sphere args={[0.12, 16, 16]} position={[0.7, 2.2, 0.1]} scale={[0.6, 1.0, 0.6]}>
        <meshStandardMaterial color={fireColors.flameCore} emissive={fireColors.flameCore} emissiveIntensity={0.8} />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.2, 2.6, -0.3]} scale={[0.7, 1.0, 0.7]}>
        <meshStandardMaterial color={fireColors.flameCore} emissive={fireColors.flameCore} emissiveIntensity={0.8} />
      </Sphere>
      
      {/* Fire glow effect */}
      <Sphere args={[1.8, 16, 16]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={fireColors.flame} emissive={fireColors.flame} emissiveIntensity={0.2} transparent opacity={0.15} />
      </Sphere>
    </BasePet>
  );
};

export default FirePet;
