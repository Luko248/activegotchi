import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box, OrbitControls } from '@react-three/drei'
import { Mesh, Group } from 'three'
import { PetState } from '../types'

interface ThreePetProps {
  petState: PetState
  onPetTap: () => void
}

function PetModel({ petState, onPetTap }: ThreePetProps) {
  const groupRef = useRef<Group>(null)
  const bodyRef = useRef<Mesh>(null)
  const headRef = useRef<Mesh>(null)

  const moodColors = useMemo(() => ({
    happy: '#10b981', // green
    neutral: '#f59e0b', // yellow
    sad: '#6b7280' // gray
  }), [])

  const moodScale = useMemo(() => ({
    happy: 1.1,
    neutral: 1.0,
    sad: 0.9
  }), [])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Mood-based rotation
      if (petState.mood === 'happy') {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      }
    }

    if (headRef.current) {
      // Head bobbing based on mood
      const bobSpeed = petState.mood === 'happy' ? 4 : petState.mood === 'sad' ? 1 : 2
      headRef.current.position.y = 1.3 + Math.sin(state.clock.elapsedTime * bobSpeed) * 0.08
    }
  })

  const handleClick = () => {
    onPetTap()
    // Add bounce animation on click
    if (groupRef.current) {
      groupRef.current.scale.set(1.2, 1.2, 1.2)
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.scale.set(1, 1, 1)
        }
      }, 200)
    }
  }

  return (
    <group ref={groupRef} onClick={handleClick} scale={moodScale[petState.mood]} position={[0, 0, 0]}>
      {/* Body */}
      <Sphere ref={bodyRef} args={[1.2, 16, 16]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Sphere>
      
      {/* Head */}
      <Sphere ref={headRef} args={[1.0, 16, 16]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.15, 8, 8]} position={[-0.3, 1.5, 0.7]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.15, 8, 8]} position={[0.3, 1.5, 0.7]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      
      {/* Nose */}
      <Sphere args={[0.08, 8, 8]} position={[0, 1.1, 0.8]}>
        <meshStandardMaterial color="#ff69b4" />
      </Sphere>
      
      {/* Ears */}
      <Box args={[0.3, 0.6, 0.15]} position={[-0.5, 1.9, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Box>
      <Box args={[0.3, 0.6, 0.15]} position={[0.5, 1.9, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Box>
      
      {/* Paws */}
      <Sphere args={[0.3, 8, 8]} position={[-0.6, -1.4, 0.5]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Sphere>
      <Sphere args={[0.3, 8, 8]} position={[0.6, -1.4, 0.5]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Sphere>
      <Sphere args={[0.3, 8, 8]} position={[-0.5, -1.4, -0.5]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Sphere>
      <Sphere args={[0.3, 8, 8]} position={[0.5, -1.4, -0.5]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Sphere>
      
      {/* Tail */}
      <Box args={[0.15, 1.2, 0.15]} position={[0, -0.2, -1.2]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color={moodColors[petState.mood]} />
      </Box>
      
      {/* Mood indicator particles */}
      {petState.mood === 'happy' && (
        <>
          <Sphere args={[0.08, 8, 8]} position={[-1.2, 1.7, 0]}>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.08, 8, 8]} position={[1.2, 1.7, 0]}>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.08, 8, 8]} position={[0, 2.5, 0]}>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
          </Sphere>
        </>
      )}
    </group>
  )
}

const ThreePet: React.FC<ThreePetProps> = ({ petState, onPetTap }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PetModel petState={petState} onPetTap={onPetTap} />
        
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
  )
}

export default ThreePet