import { useRef, useState, useEffect } from 'react'

const SESSION_KEY = 'loader-shown'
const ASSEMBLE_MS = 1500
const HOLD_MS = 1000
const REVEAL_MS = 700
const TOTAL_MS = ASSEMBLE_MS + HOLD_MS + REVEAL_MS

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const BAND: readonly string[] = [
  '#9A9CA1',
  '#6B6D72',
  '#1B2A4A',
  '#0E1013',
]
const BAND_WEIGHTS = [0.12, 0.38, 0.30, 0.20] as const

function pickBand(r: number): string {
  let acc = 0
  for (let i = 0; i < BAND_WEIGHTS.length; i++) {
    acc += BAND_WEIGHTS[i]
    if (r < acc) return BAND[i]
  }
  return BAND[BAND.length - 1]
}

interface Dot {
  tx: number; ty: number
  x: number; y: number
  phase: number; speed: number
  baseRadius: number; baseOpacity: number
  delay: number; bandColor: string
}

function buildDots(
  w: number,
  h: number,
): Dot[] {
  const fontSize = Math.min(w * 0.42, h * 0.45, 220)
  const offscreen = document.createElement('canvas')
  offscreen.width = w
  offscreen.height = h
  const offCtx = offscreen.getContext('2d')!
  offCtx.fillStyle = '#000'
  offCtx.font = `600 ${fontSize}px Fraunces, Georgia, serif`
  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'
  offCtx.fillText('RL', w / 2, h / 2)

  const imgData = offCtx.getImageData(0, 0, w, h).data
  const step = Math.max(3, Math.round(Math.sqrt(w * h) / 100))

  const targets: { x: number; y: number }[] = []
  const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (imgData[(y * w + x) * 4 + 3] > 128) {
        targets.push({ x, y })
        if (x < bounds.minX) bounds.minX = x
        if (x > bounds.maxX) bounds.maxX = x
        if (y < bounds.minY) bounds.minY = y
        if (y > bounds.maxY) bounds.maxY = y
      }
    }
  }

  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const shapeRadius = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) / 2

  return targets.map((t) => {
    const angle = Math.random() * Math.PI * 2
    const dist = shapeRadius * (2.5 + Math.random() * 4)
    return {
      tx: t.x,
      ty: t.y,
      x: centerX + Math.cos(angle) * dist,
      y: centerY + Math.sin(angle) * dist,
      phase: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 0.6,
      baseRadius: 2.5 + Math.random() * 2,
      baseOpacity: 0.85 + Math.random() * 0.15,
      delay: Math.random() * 0.35,
      bandColor: pickBand(Math.random()),
    }
  })
}

function Loader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  useEffect(() => {
    if (prefersReducedMotion) {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        const t = setTimeout(() => {
          setIsComplete(true)
          sessionStorage.setItem(SESSION_KEY, '1')
        }, 400)
        return () => clearTimeout(t)
      }
      setIsComplete(true)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    let raf = 0
    let labelShown = false

    const init = async () => {
      await document.fonts.ready

      const c = canvasRef.current
      if (!c) return
      const rawCx = c.getContext('2d')
      if (!rawCx) return
      // Narrowing is lost in nested closures; assert after guard
      const cx = rawCx as CanvasRenderingContext2D

      let w = window.innerWidth
      let h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      c.width = w * dpr
      c.height = h * dpr
      c.style.width = w + 'px'
      c.style.height = h + 'px'
      cx.scale(dpr, dpr)

      const particles = buildDots(w, h)
      const t0 = performance.now()

      function animate(now: number) {
        const elapsed = now - t0

        w = window.innerWidth
        h = window.innerHeight

        cx.clearRect(0, 0, w, h)

        for (const dot of particles) {
          const rawT = (elapsed / 1000 - dot.delay) / (ASSEMBLE_MS / 1000)
          const p = Math.max(0, Math.min(1, rawT))
          const ep = easeOutCubic(p)

          const x = dot.x + (dot.tx - dot.x) * ep
          const y = dot.y + (dot.ty - dot.y) * ep

          let color: string
          let opacity: number
          let radius: number

          if (p < 0.5) {
            color = '#DBDAD5'
            opacity = ep * dot.baseOpacity
            radius = dot.baseRadius * (0.3 + ep * 0.7)
          } else {
            color = dot.bandColor
            opacity = dot.baseRadius > 3.5 ? 1 : 0.85
            radius = dot.baseRadius
          }

          if (elapsed > ASSEMBLE_MS) {
            const bt = (elapsed - ASSEMBLE_MS) / HOLD_MS
            const s = Math.sin(bt * Math.PI * 2 * dot.speed + dot.phase)
            radius *= 1 + s * 0.18
            opacity *= 1 - Math.abs(s) * 0.15
            opacity = Math.max(0.3, Math.min(1, opacity))
          }

          cx.globalAlpha = opacity
          cx.fillStyle = color
          cx.beginPath()
          cx.arc(x, y, radius, 0, Math.PI * 2)
          cx.fill()
        }

        cx.globalAlpha = 1

        if (elapsed > ASSEMBLE_MS && !labelShown) {
          labelShown = true
          setShowLabel(true)
        }

        if (elapsed >= TOTAL_MS) {
          setIsComplete(true)
          if (!sessionStorage.getItem(SESSION_KEY)) {
            sessionStorage.setItem(SESSION_KEY, '1')
          }
          return
        }

        raf = requestAnimationFrame(animate)
      }

      raf = requestAnimationFrame(animate)
    }

    init()

    return () => cancelAnimationFrame(raf)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (isComplete && overlayRef.current) {
      const el = overlayRef.current
      const handler = () => el.remove()
      el.addEventListener('transitionend', handler, { once: true })
      return () => el.removeEventListener('transitionend', handler)
    }
  }, [isComplete])

  if (isComplete && !showLabel) return null

  return (
    <div
      ref={overlayRef}
      className="loader-overlay"
      style={{ opacity: isComplete ? 0 : 1 }}
    >
      <canvas ref={canvasRef} className="loader-canvas" />
      <div
        className="loader-label"
        style={{ opacity: showLabel && !isComplete ? 1 : 0 }}
      >
        Rhen-Rhen Lumbo
      </div>
    </div>
  )
}

export default Loader
