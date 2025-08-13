import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Sphere, Torus } from '@react-three/drei'
import { Mesh, Group } from 'three'
import { useFrame } from '@react-three/fiber'
import BasePet, { BasePetProps } from './BasePet'

const CuteAvatarPet: React.FC<BasePetProps> = ({ petState, onPetTap, showPirouette = false }) => {
  const bodyRef = useRef<Mesh>(null)
  const headRef = useRef<Mesh>(null)
  const leftEyeRef = useRef<Mesh>(null)
  const rightEyeRef = useRef<Mesh>(null)
  const leftPupilRef = useRef<Mesh>(null)
  const rightPupilRef = useRef<Mesh>(null)
  const leftIrisRef = useRef<Mesh>(null)
  const rightIrisRef = useRef<Mesh>(null)
  const leftHighlightRef = useRef<Mesh>(null)
  const rightHighlightRef = useRef<Mesh>(null)
  const mouthRef = useRef<Mesh>(null)
  const leftCheekRef = useRef<Mesh>(null)
  const rightCheekRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)

  // Emotion state
  const [isBlinking, setIsBlinking] = useState(false)
  const [lastBlink, setLastBlink] = useState(Date.now())
  const [isSmiling, setIsSmiling] = useState(false)
  const [isExcited, setIsExcited] = useState(false)
  const [lastMoodChange, setLastMoodChange] = useState(Date.now())
  
  // Pirouette animation state
  const [pirouetteStartTime, setPirouetteStartTime] = useState<number | null>(null)
  
  // Enhanced reactions
  const [celebrationTime, setCelebrationTime] = useState<number | null>(null)
  
  // Convert hex color to pastel
  const pastel = (hex: string) => {
    const h = (hex || '#7CC6FF').replace('#','')
    const r = parseInt(h.substring(0,2),16)
    const g = parseInt(h.substring(2,4),16)
    const b = parseInt(h.substring(4,6),16)
    const mix = (c: number) => Math.round(c + (255-c)*0.4) // More pastel
    const toHex = (v: number) => v.toString(16).padStart(2,'0')
    return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`
  }

  const basePrimary = petState.primaryColor || '#7CC6FF'
  const colors = useMemo(() => ({
    primary: pastel(basePrimary),
    secondary: pastel('#FFB3D9'), // Soft pink
    accent: pastel('#B3FFB3'),    // Soft green
    cheek: '#FFB6C1', // Light pink for cheeks
    white: '#FFFFFF',
    dark: '#2C2C2C'
  }), [basePrimary])

  // Start pirouette when showPirouette becomes true
  useEffect(() => {
    if (showPirouette && !pirouetteStartTime) {
      setPirouetteStartTime(Date.now())
    } else if (!showPirouette) {
      setPirouetteStartTime(null)
    }
  }, [showPirouette, pirouetteStartTime])

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Date.now() - lastBlink > 2000 + Math.random() * 3000) {
        setIsBlinking(true)
        setLastBlink(Date.now())
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 100)

    return () => clearInterval(blinkInterval)
  }, [lastBlink])

  // Enhanced mood reactions
  useEffect(() => {
    const shouldSmile = petState.mood === 'happy' || isSmiling
    setIsSmiling(shouldSmile)
    
    // Detect mood changes for special animations
    const now = Date.now()
    if (now - lastMoodChange > 1000) { // Prevent rapid mood changes
      if (petState.mood === 'happy' && !isExcited) {
        setIsExcited(true)
        setCelebrationTime(now)
        setTimeout(() => setIsExcited(false), 3000)
      }
      setLastMoodChange(now)
    }
  }, [petState.mood, isSmiling, isExcited, lastMoodChange])

  const EYE_DEPTH = 0.12
  const IRIS_DEPTH = 0.08
  const PUPIL_DEPTH = 0.06
  const HIGHLIGHT_DEPTH = 0.04
  const EPS = 0.0015
  const EYE_Y = 1.04 // move slightly higher on head
  const EYE_Z = 0.82 // bring whites further forward
  // Radii for each eye layer (~15% smaller overall)
  const R_WHITE = 0.153
  const R_IRIS = 0.085
  const R_PUPIL = 0.06
  const R_HIGHLIGHT = 0.03
  const WHITE_HALF = R_WHITE * EYE_DEPTH
  const IRIS_HALF = R_IRIS * IRIS_DEPTH
  const PUPIL_HALF = R_PUPIL * PUPIL_DEPTH
  const HIGHLIGHT_HALF = R_HIGHLIGHT * HIGHLIGHT_DEPTH
  const IRIS_Z = EYE_Z + WHITE_HALF + IRIS_HALF + EPS
  const PUPIL_Z = IRIS_Z + IRIS_HALF + PUPIL_HALF + EPS
  const HIGHLIGHT_Z = PUPIL_Z + PUPIL_HALF + HIGHLIGHT_HALF + EPS

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Store the base floating position
    const baseFloatingY = Math.sin(time * 0.8) * 0.15
    
    // Pirouette animation logic
    if (pirouetteStartTime && groupRef.current) {
      const elapsed = Date.now() - pirouetteStartTime
      const duration = 1500 // 1.5 seconds animation
      
      if (elapsed < duration) {
        const progress = elapsed / duration
        
        // Jump height with simple sine wave (lower height)
        const jumpHeight = Math.sin(progress * Math.PI) * 1.2
        
        // Pirouette spin (2 full rotations) - ensure it ends at 0
        const spinRotation = progress * Math.PI * 4
        
        // Apply transformations - add jump to base floating
        groupRef.current.position.y = baseFloatingY + jumpHeight
        groupRef.current.rotation.y = spinRotation
      } else {
        // Animation finished, smoothly return to normal floating
        groupRef.current.position.y = baseFloatingY
        groupRef.current.rotation.y = 0
        setPirouetteStartTime(null)
      }
    } else {
      // Normal gentle floating animation when not doing pirouette
      if (groupRef.current) {
        groupRef.current.position.y = baseFloatingY
        groupRef.current.rotation.y = 0
      }
    }

    // Enhanced head animations based on mood
    if (headRef.current) {
      let bobSpeed = petState.mood === 'happy' ? 1.5 : petState.mood === 'sad' ? 0.5 : 1
      let bobAmount = petState.mood === 'happy' ? 0.1 : 0.05
      
      
      headRef.current.position.y = 0.8 + Math.sin(time * bobSpeed) * bobAmount
      
      // Add subtle head tilting for personality
      if (petState.mood === 'happy') {
        headRef.current.rotation.z = Math.sin(time * 0.5) * 0.1
      } else if (petState.mood === 'sad') {
        headRef.current.rotation.z = Math.sin(time * 0.3) * 0.05 - 0.1
      }
    }

    // Enhanced body animations
    if (bodyRef.current) {
      let breatheAmount = 0.05
      let breatheSpeed = 1
      
      // Excited breathing when happy
      if (petState.mood === 'happy') {
        breatheAmount = 0.08
        breatheSpeed = 1.5
      } else if (petState.mood === 'sad') {
        breatheAmount = 0.03
        breatheSpeed = 0.7
      }
      
      
      const scale = 1 + Math.sin(time * breatheSpeed) * breatheAmount
      bodyRef.current.scale.set(scale, scale, scale)
    }

    // Eye animations
    // Keep white fixed height; blink other layers only
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.set(1, 1, EYE_DEPTH)
      rightEyeRef.current.scale.set(1, 1, EYE_DEPTH)
    }
    if (leftIrisRef.current && rightIrisRef.current) {
      const y = isBlinking ? 0.05 : 1
      leftIrisRef.current.scale.set(1, y, IRIS_DEPTH)
      rightIrisRef.current.scale.set(1, y, IRIS_DEPTH)
    }
    if (leftPupilRef.current && rightPupilRef.current) {
      const y = isBlinking ? 0.05 : 1
      leftPupilRef.current.scale.set(1, y, PUPIL_DEPTH)
      rightPupilRef.current.scale.set(1, y, PUPIL_DEPTH)
    }
    if (leftHighlightRef.current && rightHighlightRef.current) {
      const y = isBlinking ? 0.05 : 1
      leftHighlightRef.current.scale.set(1, y, HIGHLIGHT_DEPTH)
      rightHighlightRef.current.scale.set(1, y, HIGHLIGHT_DEPTH)
    }

    // Enhanced pupil movement with mood-based behavior
    if (leftPupilRef.current && rightPupilRef.current) {
      let move = 0.02
      let speed = 0.5
      
      // More energetic eye movement when happy
      if (petState.mood === 'happy') {
        move = 0.03
        speed = 0.8
      } else if (petState.mood === 'sad') {
        move = 0.01
        speed = 0.3
      } else if (petState.mood === 'sleepy') {
        move = 0.005
        speed = 0.2
      }
      
      // Celebration sparkle in eyes
      if (celebrationTime && Date.now() - celebrationTime < 3000) {
        move *= 1.5
        speed *= 2
      }
      
      const offsetX = Math.sin(time * speed) * move
      const offsetY = Math.cos(time * speed * 0.8) * move
      leftPupilRef.current.position.x = -0.32 + offsetX
      leftPupilRef.current.position.y = EYE_Y + offsetY
      leftPupilRef.current.position.z = PUPIL_Z
      rightPupilRef.current.position.x = 0.32 + offsetX
      rightPupilRef.current.position.y = EYE_Y + offsetY
      rightPupilRef.current.position.z = PUPIL_Z
    }
    
    // Enhanced eye highlight effects
    if (leftHighlightRef.current && rightHighlightRef.current && petState.mood === 'happy') {
      const sparkle = 0.6 + Math.sin(time * 4) * 0.4
      ;(leftHighlightRef.current.material as any).emissiveIntensity = sparkle
      ;(rightHighlightRef.current.material as any).emissiveIntensity = sparkle
    }

    // Mouth expression
    if (mouthRef.current) {
      if (petState.mood === 'happy') {
        // Happy smile
        mouthRef.current.scale.set(1.2, 0.6, 0.3)
        mouthRef.current.position.y = 0.6
        mouthRef.current.rotation.z = 0
      } else if (petState.mood === 'sad') {
        // Sad frown
        mouthRef.current.scale.set(0.8, 0.6, 0.2)
        mouthRef.current.position.y = 0.55
        mouthRef.current.rotation.z = Math.PI
      } else if (petState.mood === 'sleepy') {
        // Sleepy mouth
        mouthRef.current.scale.set(0.6, 0.4, 0.15)
        mouthRef.current.position.y = 0.58
        mouthRef.current.rotation.z = 0
      } else {
        // Neutral
        mouthRef.current.scale.set(1, 0.4, 0.25)
        mouthRef.current.position.y = 0.58
        mouthRef.current.rotation.z = 0
      }
    }

    // Cheek animation for happiness
    if (leftCheekRef.current && rightCheekRef.current && petState.mood === 'happy') {
      const cheekGlow = 0.8 + Math.sin(time * 2) * 0.2
      leftCheekRef.current.scale.setScalar(cheekGlow)
      rightCheekRef.current.scale.setScalar(cheekGlow)
    }
  })

  const handleTap = (e: any) => {
    e.stopPropagation()
    onPetTap()
    
    // Bounce animation
    if (groupRef.current) {
      groupRef.current.scale.set(1.15, 1.15, 1.15)
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.scale.set(1, 1, 1)
        }
      }, 200)
    }

    // Trigger smile
    setIsSmiling(true)
    setTimeout(() => setIsSmiling(false), 1500)
  }

  return (
    <BasePet petState={petState} onPetTap={onPetTap}>
      <group ref={groupRef} onClick={handleTap}>
        {/* Main body */}
        <Sphere ref={bodyRef} args={[1.2, 64, 64]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial 
            color={colors.primary} 
            roughness={0.3} 
            metalness={0.1}
            transparent
            opacity={0.95}
          />
        </Sphere>

        {/* Head */}
        <Sphere ref={headRef} args={[0.85, 64, 64]} position={[0, 0.8, 0]} castShadow>
          <meshStandardMaterial 
            color={colors.primary} 
            roughness={0.2} 
            metalness={0.05}
          />
        </Sphere>

        {/* Eyes - flatter, higher, and more forward */}
        <Sphere ref={leftEyeRef} args={[R_WHITE, 32, 32]} position={[-0.32, EYE_Y, EYE_Z]} castShadow>
          <meshStandardMaterial 
            color={colors.white} 
            roughness={0.02} 
            metalness={0.15}
          />
        </Sphere>
        <Sphere ref={rightEyeRef} args={[R_WHITE, 32, 32]} position={[0.32, EYE_Y, EYE_Z]} castShadow>
          <meshStandardMaterial 
            color={colors.white} 
            roughness={0.02} 
            metalness={0.15}
          />
        </Sphere>

        {/* Eye iris (colored part) */}
        <Sphere ref={leftIrisRef} args={[R_IRIS, 32, 32]} position={[-0.32, EYE_Y, IRIS_Z]} castShadow>
          <meshStandardMaterial 
            color={colors.primary} 
            roughness={0.1} 
            metalness={0.2}
          />
        </Sphere>
        <Sphere ref={rightIrisRef} args={[R_IRIS, 32, 32]} position={[0.32, EYE_Y, IRIS_Z]} castShadow>
          <meshStandardMaterial 
            color={colors.primary} 
            roughness={0.1} 
            metalness={0.2}
          />
        </Sphere>

        {/* Pupils */}
        <Sphere ref={leftPupilRef} args={[R_PUPIL, 32, 32]} position={[-0.32, EYE_Y, PUPIL_Z]} castShadow>
          <meshStandardMaterial 
            color={colors.dark} 
            roughness={0.01} 
            metalness={0.1}
          />
        </Sphere>
        <Sphere ref={rightPupilRef} args={[R_PUPIL, 32, 32]} position={[0.32, EYE_Y, PUPIL_Z]} castShadow>
          <meshStandardMaterial 
            color={colors.dark} 
            roughness={0.01} 
            metalness={0.1}
          />
        </Sphere>

        {/* Primary eye highlights for life */}
        <Sphere ref={leftHighlightRef} args={[R_HIGHLIGHT, 16, 16]} position={[-0.29, EYE_Y + 0.03, HIGHLIGHT_Z]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>
        <Sphere ref={rightHighlightRef} args={[R_HIGHLIGHT, 16, 16]} position={[0.35, EYE_Y + 0.03, HIGHLIGHT_Z]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Secondary smaller highlights */}
        <Sphere args={[0.02, 16, 16]} position={[-0.34, EYE_Y - 0.06, HIGHLIGHT_Z + 0.001]} scale={[1, 1, 0.1]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </Sphere>
        <Sphere args={[0.02, 16, 16]} position={[0.30, EYE_Y - 0.06, HIGHLIGHT_Z + 0.001]} scale={[1, 1, 0.1]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </Sphere>

        {/* Eyelashes/Eye border for extra cuteness */}
        <Torus args={[0.21, 0.01, 16, 100]} position={[-0.32, 0.87, 0.51]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color={colors.dark} roughness={0.3} />
        </Torus>
        <Torus args={[0.21, 0.01, 16, 100]} position={[0.32, 0.87, 0.51]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color={colors.dark} roughness={0.3} />
        </Torus>

        {/* Mouth */}
        <Torus ref={mouthRef} args={[0.15, 0.04, 16, 32]} position={[0, 0.6, 0.4]} rotation={[0, 0, 0]} castShadow>
          <meshStandardMaterial color={colors.dark} roughness={0.2} />
        </Torus>

        {/* Cheeks (show when happy) */}
        {petState.mood === 'happy' && (
          <>
            <Sphere ref={leftCheekRef} args={[0.08, 32, 32]} position={[-0.45, 0.7, 0.3]}>
              <meshStandardMaterial 
                color={colors.cheek} 
                transparent 
                opacity={0.6} 
                roughness={0.3}
              />
            </Sphere>
            <Sphere ref={rightCheekRef} args={[0.08, 32, 32]} position={[0.45, 0.7, 0.3]}>
              <meshStandardMaterial 
                color={colors.cheek} 
                transparent 
                opacity={0.6} 
                roughness={0.3}
              />
            </Sphere>
          </>
        )}


        {/* Little arms */}
        <Sphere args={[0.25, 32, 32]} position={[-1.2, 0.2, 0]} castShadow>
          <meshStandardMaterial color={colors.accent} roughness={0.4} />
        </Sphere>
        <Sphere args={[0.25, 32, 32]} position={[1.2, 0.2, 0]} castShadow>
          <meshStandardMaterial color={colors.accent} roughness={0.4} />
        </Sphere>

        {/* Feet */}
        <Sphere args={[0.3, 32, 32]} position={[-0.5, -1.0, 0.2]} castShadow>
          <meshStandardMaterial color={colors.secondary} roughness={0.5} />
        </Sphere>
        <Sphere args={[0.3, 32, 32]} position={[0.5, -1.0, 0.2]} castShadow>
          <meshStandardMaterial color={colors.secondary} roughness={0.5} />
        </Sphere>
      </group>
    </BasePet>
  )
}

export default CuteAvatarPet
