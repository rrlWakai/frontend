import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { Project } from '../data/site'

/* ════════════════════════════════════════════════════════════════
   SELECTED WORK — PROJECT COVERFLOW

   Classic Cover Flow: one project centered at full size and
   opacity, neighbours fanned out with a scale / rotateY / opacity
   falloff inside a shared CSS perspective. Touch viewports swap
   the Y-rotation for a horizontal snap-scroll carousel with the
   same falloff (rotateY fights touch-drag). The arrows loop in
   both directions; arrow keys navigate while the stage is focused.
   ════════════════════════════════════════════════════════════════ */

/** Falloff per step out from the centered card (x = % of card width) */
const DEPTH_STEPS = [
  { x: 0, scale: 1, rotate: 0, opacity: 1 },         // centered
  { x: 50, scale: 0.82, rotate: 28, opacity: 0.55 }, // immediate neighbours
  { x: 84, scale: 0.64, rotate: 35, opacity: 0.22 }, // next pair
] as const

/** Past the last step: pushed out, faded away, inert */
const DEPTH_HIDDEN = { x: 112, scale: 0.5, rotate: 38, opacity: 0 }
const DEPTH_HIDDEN_AT = DEPTH_STEPS.length + 1

type Depth = { x: number; scale: number; rotate: number; opacity: number }

function depthFor(offset: number): Depth {
  const step = Math.abs(offset)
  if (step >= DEPTH_HIDDEN_AT) return DEPTH_HIDDEN
  const d = DEPTH_STEPS[step]
  const sign = offset < 0 ? -1 : 1
  return { x: d.x * sign, scale: d.scale, rotate: d.rotate * sign, opacity: d.opacity }
}

/** Shortest signed distance around the loop — last→first and back */
function loopOffset(index: number, active: number, count: number): number {
  let offset = (index - active) % count
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/* Touch viewports (coarse pointer / no hover) get the mobile fallback */
function useTouchViewport() {
  const [isTouch, setIsTouch] = useState(
    () => window.matchMedia('(hover: none), (pointer: coarse)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const apply = () => setIsTouch(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return isTouch
}

/* Thumbnail — a styled placeholder panel shows until the real
   screenshot exists at /public/screenshots/<id>.png, so a missing
   or slow image never renders as a broken-image icon */
function CoverflowThumb({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const ready = loaded && !failed
  return (
    <span className="coverflow-thumb">
      {!ready && (
        <span className="coverflow-thumb-ph" aria-hidden="true">
          <span className="coverflow-thumb-ph-name">{project.name}</span>
          <span className="coverflow-thumb-ph-tag">{project.category}</span>
        </span>
      )}
      <img
        src={project.screenshot}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ opacity: ready ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  )
}

function ProjectCoverflow({ projects }: { projects: Project[] }) {
  const count = projects.length
  const [active, setActive] = useState(0)
  const isTouch = useTouchViewport()
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollRaf = useRef(0)

  const activeProject = projects[active]

  /* Center the given card in the touch scroller — measured as a delta
     between rects, so padding/snap conventions never skew the math */
  const scrollToIndex = useCallback((index: number) => {
    const stage = stageRef.current
    const el = stage?.children[index] as HTMLElement | undefined
    if (!stage || !el) return
    const stageRect = stage.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const delta = rect.left + rect.width / 2 - (stageRect.left + stage.clientWidth / 2)
    stage.scrollBy({ left: delta, behavior: 'smooth' })
  }, [])

  /* Navigate — wraps last→first and first→last */
  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count
      setActive(next)
      if (isTouch) scrollToIndex(next)
    },
    [count, isTouch, scrollToIndex],
  )

  /* Track the centered card while swiping (touch mode only) */
  const handleScroll = useCallback(() => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0
      const stage = stageRef.current
      if (!stage) return
      const center = stage.getBoundingClientRect().left + stage.clientWidth / 2
      let best = 0
      let bestDist = Number.POSITIVE_INFINITY
      Array.from(stage.children).forEach((child, i) => {
        const rect = (child as HTMLElement).getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    })
  }, [])

  useEffect(() => {
    if (!isTouch) return
    const stage = stageRef.current
    if (!stage) return
    stage.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      stage.removeEventListener('scroll', handleScroll)
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    }
  }, [isTouch, handleScroll])

  /* Arrow keys navigate while the stage is focused */
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (count < 2) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(active + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(active - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(count - 1)
      }
    },
    [active, count, goTo],
  )

  const handleItemClick = useCallback(
    (project: Project, index: number) => {
      if (index === active) {
        window.open(project.url, '_blank', 'noopener,noreferrer')
      } else {
        goTo(index)
      }
    },
    [active, goTo],
  )

  return (
    <div className={`coverflow${isTouch ? ' coverflow--touch' : ''}`}>
      {/* Stage — shared perspective on pointer devices, snap scroller on touch */}
      <div
        ref={stageRef}
        className="coverflow-stage"
        role="group"
        aria-roledescription="carousel"
        aria-label={`Selected work — ${activeProject.name} centered, ${count} projects`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={isTouch ? handleScroll : undefined}
      >
        {projects.map((project, i) => {
          const offset = loopOffset(i, active, count)
          const depth = depthFor(offset)
          const hidden = Math.abs(offset) >= DEPTH_HIDDEN_AT
          const style: CSSProperties = isTouch
            ? {
                opacity: depth.opacity,
                transform: `scale(${depth.scale})`,
                zIndex: 10 - Math.abs(offset) * 2,
              }
            : {
                opacity: depth.opacity,
                transform: `translate(-50%, -50%) translateX(${depth.x}%) rotateY(${depth.rotate}deg) scale(${depth.scale})`,
                zIndex: 10 - Math.abs(offset) * 2,
              }
          return (
            <button
              key={project.id}
              type="button"
              className={`coverflow-item${i === active ? ' coverflow-item--active' : ''}${
                hidden ? ' is-hidden' : ''
              }`}
              style={style}
              onClick={() => handleItemClick(project, i)}
              aria-label={
                i === active
                  ? `${project.name} — open live project`
                  : `${project.name} — show project ${pad2(i + 1)} of ${pad2(count)}`
              }
              aria-current={i === active ? 'true' : undefined}
              aria-hidden={hidden || undefined}
              tabIndex={hidden ? -1 : undefined}
            >
              <CoverflowThumb project={project} />
            </button>
          )
        })}
      </div>

      {/* Prev / next arrows with the counter between them */}
      <div className="coverflow-controls">
        <button
          type="button"
          className="coverflow-nav-btn"
          onClick={() => goTo(active - 1)}
          aria-label="Previous project"
        >
          ←
        </button>
        <span className="coverflow-count">
          {pad2(active + 1)} / {pad2(count)}
        </span>
        <button
          type="button"
          className="coverflow-nav-btn"
          onClick={() => goTo(active + 1)}
          aria-label="Next project"
        >
          →
        </button>
      </div>

      {/* Active project details — updates with the centered card */}
      <div className="coverflow-details" aria-live="polite">
        <div className="coverflow-cat">{activeProject.category}</div>
        <h3 className="coverflow-title">{activeProject.name}</h3>
        <p className="coverflow-desc">{activeProject.description}</p>
        {activeProject.technologies && (
          <div className="coverflow-tags">
            {activeProject.technologies.map((t) => (
              <span key={t} className="coverflow-tag">
                {t}
              </span>
            ))}
          </div>
        )}
        <a className="coverflow-link" href={activeProject.url} target="_blank" rel="noreferrer">
          View project <span className="proj-arrow">↗</span>
        </a>
      </div>
    </div>
  )
}

export default ProjectCoverflow