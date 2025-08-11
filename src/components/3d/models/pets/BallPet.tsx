import React, { useMemo, useRef } from 'react'
import { Sphere } from '@react-three/drei'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import BasePet, { BasePetProps } from './BasePet'

const BallPet: React.FC<BasePetProps> = ({ petState, onPetTap }) => {
  const pastel = (hex: string) => {
    const h = (hex || '#7CC6FF').replace('#','')
    const r = parseInt(h.substring(0,2),16)
    const g = parseInt(h.substring(2,4),16)
    const b = parseInt(h.substring(4,6),16)
    const mix = (c:number) => Math.round(c + (255-c)*0.25)
    const toHex = (v:number) => v.toString(16).padStart(2,'0')
    return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`
  }
  const basePrimary = petState.primaryColor || '#7CC6FF'
  const colors = useMemo(() => ({
    primary: pastel(basePrimary)
  }), [basePrimary])

  const mouthRef = useRef<Mesh>(null)
  const tapsRef = useRef<number[]>([])
  const smileActive = useRef(false)
  const smileTime = useRef(0)
  const smileDuration = 1.0

  const baseEyeY = 0.15
  const baseEyeZ = 0.85
  const baseEyeDX = 0.32
  const eyeRadius = 0.18
  const pupilRadius = 0.06

  useFrame((_, delta) => {
    if (smileActive.current) {
      smileTime.current += delta
      if (mouthRef.current) {
        const phase = Math.min(1, smileTime.current / smileDuration)
        const s = Math.sin(phase * Math.PI)
        mouthRef.current.scale.set(1, 0.35 * s, 0.35 * s)
      }
      if (smileTime.current >= smileDuration) {
        smileActive.current = false
        smileTime.current = 0
        if (mouthRef.current) mouthRef.current.scale.set(1, 0.0001, 0.0001)
      }
    }
  })

  const handleTap = (e: any) => {
    e.stopPropagation()
    onPetTap()
    const now = performance.now()
    tapsRef.current.push(now)
    // keep last 2 seconds
    tapsRef.current = tapsRef.current.filter(t => now - t <= 2000)
    if (tapsRef.current.length >= 10) {
      const windowStart = tapsRef.current[tapsRef.current.length - 10]
      const windowDuration = now - windowStart
      if (windowDuration <= 1200) { // quick 10 taps within 1.2s
        smileActive.current = true
        smileTime.current = 0
        tapsRef.current = []
      }
    }
  }

  return (
    <BasePet petState={petState} onPetTap={onPetTap}>
      {/* Ball head */}
      <Sphere args={[1.0, 64, 64]} position={[0, 0, 0]} onPointerDown={handleTap}>
        <meshStandardMaterial color={colors.primary} roughness={0.5} metalness={0.05} />
      </Sphere>

      {/* Static cartoon eyes */}
      <Sphere args={[eyeRadius, 32, 32]} position={[-baseEyeDX, baseEyeY, 0.7]}>
        <meshStandardMaterial color={'white'} roughness={0.2} metalness={0.05} />
      </Sphere>
      <Sphere args={[eyeRadius, 32, 32]} position={[baseEyeDX, baseEyeY, 0.7]}>
        <meshStandardMaterial color={'white'} roughness={0.2} metalness={0.05} />
      </Sphere>
      <Sphere args={[pupilRadius, 32, 32]} position={[-baseEyeDX, baseEyeY, baseEyeZ]}>
        <meshStandardMaterial color={'#111827'} roughness={0.05} metalness={0.2} />
      </Sphere>
      <Sphere args={[pupilRadius, 32, 32]} position={[baseEyeDX, baseEyeY, baseEyeZ]}>
        <meshStandardMaterial color={'#111827'} roughness={0.05} metalness={0.2} />
      </Sphere>

      {/* Smile (hidden until triggered) */}
      <Sphere ref={mouthRef} args={[0.45, 32, 32]} position={[0, -0.12, 0.75]} scale={[1, 0.0001, 0.0001]}>
        <meshStandardMaterial color={'#FF6B6B'} roughness={0.2} metalness={0.1} />
      </Sphere>
    </BasePet>
  )
}

export default BallPet

