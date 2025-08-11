import React, { useMemo, useRef } from 'react';
import { Sphere } from '@react-three/drei';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import BasePet, { BasePetProps } from './BasePet';

const BluePet: React.FC<BasePetProps> = ({ petState, onPetTap }) => {
  // Color palette (primary can be overridden by petState.primaryColor)
  const pastel = (hex: string) => {
    // Mix with white for softer pastel look
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    const mix = (c:number) => Math.round(c + (255-c)*0.25); // 25% towards white
    const rr = mix(r), gg = mix(g), bb = mix(b);
    const toHex = (v:number) => v.toString(16).padStart(2,'0');
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  }
  const basePrimary = petState.primaryColor || '#7CC6FF';
  const blueColors = useMemo(() => ({
    primary: pastel(basePrimary),
    secondary: '#3A86FF',
    highlight: '#BDE0FE'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [basePrimary]);

  const mouthRef = useRef<Mesh>(null)
  const baseEyeY = 0.2
  const baseEyeZ = 0.85
  const baseEyeDX = 0.32
  const eyeRadius = 0.18
  const pupilRadius = 0.06
  const smileActive = useRef(false)
  const smileTime = useRef(0)
  const smileDuration = 0.9

  useFrame((_, delta) => {
    // No eye animation; keep eyes static and synchronized

    // Smile animate
    if (smileActive.current) {
      smileTime.current += delta
      if (mouthRef.current) {
        const phase = Math.min(1, smileTime.current / smileDuration)
        const s = Math.sin(phase * Math.PI) // 0..1..0
        mouthRef.current.scale.set(1, 0.35 * s, 0.35 * s)
      }
      if (smileTime.current >= smileDuration) {
        smileActive.current = false
        smileTime.current = 0
        if (mouthRef.current) mouthRef.current.scale.set(1, 0.0001, 0.0001)
      }
    }
  })

  return (
    <BasePet petState={petState} onPetTap={onPetTap}>
      {/* Head only, centered */}
      <Sphere args={[1.0, 64, 64]} position={[0, 0, 0]}
        onPointerDown={(e) => { e.stopPropagation(); onPetTap(); smileActive.current = true; smileTime.current = 0; }}
      >
        <meshStandardMaterial color={blueColors.primary} roughness={0.5} metalness={0.05} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[eyeRadius, 32, 32]} position={[-baseEyeDX, baseEyeY, 0.7]}>
        <meshStandardMaterial color="white" roughness={0.1} metalness={0.3} />
      </Sphere>
      <Sphere args={[eyeRadius, 32, 32]} position={[baseEyeDX, baseEyeY, 0.7]}>
        <meshStandardMaterial color="white" roughness={0.1} metalness={0.3} />
      </Sphere>
      
      {/* Pupils */}
      <Sphere args={[pupilRadius, 32, 32]} position={[-baseEyeDX, baseEyeY, baseEyeZ]}>
        <meshStandardMaterial color="#111827" roughness={0.05} metalness={0.6} />
      </Sphere>
      <Sphere args={[pupilRadius, 32, 32]} position={[baseEyeDX, baseEyeY, baseEyeZ]}>
        <meshStandardMaterial color="#111827" roughness={0.05} metalness={0.6} />
      </Sphere>

      {/* Smile appears on tap */}
      <Sphere ref={mouthRef} args={[0.45, 32, 32]} position={[0, -0.1, 0.75]} scale={[1, 0.0001, 0.0001]}>
        <meshStandardMaterial color="#FF6B6B" roughness={0.2} metalness={0.1} />
      </Sphere>
    </BasePet>
  );
};

export default BluePet;
