import React, { useEffect, useRef, useState } from 'react'

interface GeneratedAvatarCanvasProps {
  seed: string
  kind?: 'fox' | 'dog' | 'cat' | 'frog' | 'blob' | 'element'
  width?: number
  height?: number
  className?: string
  onTap?: () => void
  ariaLabel?: string
}

// Simple deterministic PRNG
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Draw a cute, professional-looking flat avatar with simple shapes
function drawBlob(ctx: CanvasRenderingContext2D, rng: () => number, w: number, h: number) {
  ctx.save()
  ctx.clearRect(0, 0, w, h)

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  const hue = Math.floor(rng() * 360)
  bg.addColorStop(0, `hsl(${hue}, 70%, 65%)`)
  bg.addColorStop(1, `hsl(${(hue + 40) % 360}, 70%, 55%)`)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Center coordinates in virtual space
  const cx = w / 2
  const cy = h / 2 + h * 0.05
  const size = Math.min(w, h) * 0.6

  // Body blob
  ctx.beginPath()
  ctx.fillStyle = `hsl(${(hue + 180) % 360}, 50%, 92%)`
  ctx.strokeStyle = `hsla(0,0%,0%,0.08)`
  ctx.lineWidth = size * 0.02
  const r = size * 0.5
  ctx.moveTo(cx - r, cy)
  ctx.bezierCurveTo(cx - r, cy - r, cx + r, cy - r, cx + r, cy)
  ctx.bezierCurveTo(cx + r * 0.9, cy + r, cx - r * 0.9, cy + r, cx - r, cy)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Face circle
  ctx.beginPath()
  const faceR = size * 0.28
  ctx.fillStyle = `hsl(${(hue + 180) % 360}, 30%, 99%)`
  ctx.arc(cx, cy - r * 0.4, faceR, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  const eyeY = cy - r * 0.45
  const eyeDX = faceR * 0.45
  const eyeR = faceR * 0.09
  ctx.fillStyle = '#1b1b1b'
  ctx.beginPath(); ctx.arc(cx - eyeDX, eyeY, eyeR, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + eyeDX, eyeY, eyeR, 0, Math.PI * 2); ctx.fill()

  // Mouth
  ctx.strokeStyle = '#c44'
  ctx.lineWidth = faceR * 0.08
  ctx.lineCap = 'round'
  ctx.beginPath()
  const smile = rng() > 0.2
  if (smile) {
    ctx.moveTo(cx - faceR * 0.25, eyeY + faceR * 0.28)
    ctx.quadraticCurveTo(cx, eyeY + faceR * 0.42, cx + faceR * 0.25, eyeY + faceR * 0.28)
  } else {
    ctx.moveTo(cx - faceR * 0.2, eyeY + faceR * 0.4)
    ctx.lineTo(cx + faceR * 0.2, eyeY + faceR * 0.4)
  }
  ctx.stroke()

  // Accent accessory (ear, hat, etc.)
  if (rng() > 0.5) {
    ctx.fillStyle = `hsl(${(hue + 320) % 360}, 70%, 60%)`
    ctx.beginPath()
    ctx.arc(cx - faceR * 0.6, cy - r * 0.45, faceR * 0.18, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillStyle = `hsl(${(hue + 20) % 360}, 80%, 60%)`
    ctx.beginPath()
    ctx.arc(cx + faceR * 0.6, cy - r * 0.55, faceR * 0.18, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawAnimal(ctx: CanvasRenderingContext2D, kind: 'fox'|'dog'|'cat'|'frog', rng: () => number, w: number, h: number){
  ctx.save()
  ctx.clearRect(0,0,w,h)
  const hueBase = Math.floor(rng()*360)
  // background
  const bg = ctx.createLinearGradient(0,0,0,h)
  bg.addColorStop(0, `hsl(${(hueBase+40)%360}, 70%, 70%)`)
  bg.addColorStop(1, `hsl(${(hueBase+0)%360}, 70%, 60%)`)
  ctx.fillStyle = bg; ctx.fillRect(0,0,w,h)

  const cx=w/2, cy=h*0.55
  const headR = Math.min(w,h)*0.22
  const bodyR = headR*1.15
  // body
  ctx.fillStyle = `hsl(${(hueBase+190)%360}, 40%, 95%)`
  ctx.beginPath(); ctx.ellipse(cx, cy+bodyR*0.8, bodyR*1.2, bodyR*0.9, 0, 0, Math.PI*2); ctx.fill()
  // head base color per kind
  const colorMap: Record<string,string> = {
    fox: `hsl(20, 80%, 60%)`,
    dog: `hsl(35, 45%, 60%)`,
    cat: `hsl(210, 30%, 60%)`,
    frog: `hsl(110, 50%, 55%)`,
  }
  ctx.fillStyle = colorMap[kind]
  ctx.beginPath(); ctx.arc(cx, cy-bodyR*0.2, headR, 0, Math.PI*2); ctx.fill()

  // ears per kind
  ctx.fillStyle = colorMap[kind]
  if(kind==='fox' || kind==='cat'){
    ctx.beginPath(); ctx.moveTo(cx-headR*0.6, cy-bodyR*0.2-headR*0.3); ctx.lineTo(cx-headR*0.1, cy-bodyR*0.2-headR*1.1); ctx.lineTo(cx-headR*0.9, cy-bodyR*0.2-headR*0.9); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(cx+headR*0.6, cy-bodyR*0.2-headR*0.3); ctx.lineTo(cx+headR*0.1, cy-bodyR*0.2-headR*1.1); ctx.lineTo(cx+headR*0.9, cy-bodyR*0.2-headR*0.9); ctx.closePath(); ctx.fill()
  } else if(kind==='dog'){
    ctx.fillStyle = `hsl(20, 20%, 30%)`
    const earW=headR*0.35, earH=headR*0.8
    ctx.beginPath(); ctx.ellipse(cx-headR*0.75, cy-bodyR*0.2-headR*0.1, earW, earH, Math.PI*0.08, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(cx+headR*0.75, cy-bodyR*0.2-headR*0.1, earW, earH, -Math.PI*0.08, 0, Math.PI*2); ctx.fill()
  } else if(kind==='frog'){
    ctx.fillStyle = colorMap[kind]
    const stalk=headR*0.3, eyeR=headR*0.18
    ctx.beginPath(); ctx.ellipse(cx-headR*0.55, cy-bodyR*0.2-headR*0.9, stalk*0.6, stalk, 0, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(cx+headR*0.55, cy-bodyR*0.2-headR*0.9, stalk*0.6, stalk, 0, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(cx-headR*0.55, cy-bodyR*0.2-headR*1.1, eyeR, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx+headR*0.55, cy-bodyR*0.2-headR*1.1, eyeR, 0, Math.PI*2); ctx.fill()
  }

  // face area
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.ellipse(cx, cy-bodyR*0.1, headR*0.9, headR*0.7, 0, 0, Math.PI*2); ctx.fill()

  // eyes
  ctx.fillStyle = '#1b1b1b'
  const eyeDX=headR*0.35, eyeY=cy-bodyR*0.15, eyeR=headR*0.08
  ctx.beginPath(); ctx.arc(cx-eyeDX, eyeY, eyeR, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx+eyeDX, eyeY, eyeR, 0, Math.PI*2); ctx.fill()
  // mouth
  ctx.strokeStyle = '#c44'
  ctx.lineWidth = headR*0.08; ctx.lineCap='round'
  ctx.beginPath(); ctx.moveTo(cx-headR*0.18, eyeY+headR*0.25); ctx.quadraticCurveTo(cx, eyeY+headR*0.35, cx+headR*0.18, eyeY+headR*0.25); ctx.stroke()

  // cheeks
  ctx.fillStyle = `hsla(5, 80%, 60%, 0.35)`
  ctx.beginPath(); ctx.ellipse(cx-eyeDX*1.2, eyeY+headR*0.18, headR*0.11, headR*0.07, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx+eyeDX*1.2, eyeY+headR*0.18, headR*0.11, headR*0.07, 0, 0, Math.PI*2); ctx.fill()

  ctx.restore()
}

function drawElemental(ctx: CanvasRenderingContext2D, rng: ()=>number, w:number, h:number){
  ctx.save(); ctx.clearRect(0,0,w,h)
  const theme = Math.floor(rng()*3) // 0 fire,1 water,2 leaf
  const cx=w/2, cy=h/2, R=Math.min(w,h)*0.3
  const bg = ctx.createLinearGradient(0,0,0,h)
  const palettes=[
    ['hsl(18,90%,60%)','hsl(40,90%,55%)'],
    ['hsl(200,80%,65%)','hsl(220,80%,60%)'],
    ['hsl(110,50%,60%)','hsl(140,50%,55%)']
  ]
  bg.addColorStop(0, palettes[theme][0]); bg.addColorStop(1, palettes[theme][1]); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h)
  // elemental sprite
  ctx.fillStyle='hsla(0,0%,100%,0.95)'
  ctx.beginPath(); ctx.ellipse(cx, cy+R*0.4, R*1.1, R*0.9, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx, cy-R*0.8); ctx.bezierCurveTo(cx-R, cy-R*0.3, cx-R*0.6, cy+R*0.2, cx, cy+R*0.6); ctx.bezierCurveTo(cx+R*0.6, cy+R*0.2, cx+R, cy-R*0.3, cx, cy-R*0.8); ctx.fillStyle='hsla(0,0%,100%,0.95)'; ctx.fill()
  // eyes
  ctx.fillStyle='#1b1b1b'; ctx.beginPath(); ctx.arc(cx-R*0.25, cy-R*0.1, R*0.08, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+R*0.25, cy-R*0.1, R*0.08, 0, Math.PI*2); ctx.fill()
  // small mouth
  ctx.strokeStyle='#c44'; ctx.lineWidth=R*0.08; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(cx-R*0.15, cy+R*0.05); ctx.quadraticCurveTo(cx, cy+R*0.15, cx+R*0.15, cy+R*0.05); ctx.stroke()
  ctx.restore()
}

export const GeneratedAvatarCanvas: React.FC<GeneratedAvatarCanvasProps> = ({ seed, kind='blob', width = 320, height = 400, className = '', onTap, ariaLabel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rng = mulberry32(hashSeed(seed))
    // Draw into an offscreen buffer for stable zoom/pan rendering and crisp scaling
    const off = document.createElement('canvas')
    const dpr = window.devicePixelRatio || 1
    off.width = Math.floor(width * dpr)
    off.height = Math.floor(height * dpr)
    const offCtx = off.getContext('2d')!
    offCtx.scale(dpr, dpr)
    if(kind==='blob') drawBlob(offCtx, rng, width, height)
    else if(kind==='element') drawElemental(offCtx, rng, width, height)
    else drawAnimal(offCtx, kind as any, rng, width, height)

    const render = () => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.translate(offset.x, offset.y)
      ctx.scale(scale, scale)
      ctx.drawImage(off, 0, 0)
      ctx.restore()
    }
    render()
  }, [seed, width, height, scale, offset.x, offset.y])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY
      const factor = Math.exp(delta * 0.001)
      setScale((s) => Math.min(3, Math.max(0.6, s * factor)))
    }
    const onDown = (e: MouseEvent) => { dragging.current = true; last.current = { x: e.clientX, y: e.clientY } }
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }))
    }
    const onUp = () => { dragging.current = false }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('click', () => onTap?.())
    return () => {
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [onTap])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={ariaLabel || `Cute ${kind} avatar`}
      style={{ touchAction: 'none', borderRadius: 16, display: 'block', width: '100%', height: 'auto' }}
    />
  )
}

export default GeneratedAvatarCanvas
