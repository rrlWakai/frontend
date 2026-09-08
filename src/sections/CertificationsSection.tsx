import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { certifications } from '../data/site'
import type { Certification } from '../data/site'
import CertificationViewer from './CertificationViewer'

/* Sheets rendered as separate documents; extras stay reachable via the
   prev/next controls (and arrow keys) once the pile grows past this
   depth, or all at once through the "view all" grid. */
const MAX_VISIBLE = 5

/** Physical offset (px) per depth level — roomier on touch screens */
const BASE_STEP = 9
const TOUCH_STEP = 12

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Matches the site's mobile breakpoint behaviour for tap comfort */
function useStackStep() {
  const [step, setStep] = useState(BASE_STEP)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    const apply = () => setStep(mq.matches ? TOUCH_STEP : BASE_STEP)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return step
}

/* ── The single certificate component ──
   Every sheet in the pile — active or background — is this exact
   component. Position in the stack drives transforms, z-index and
   which parts of the document are expanded; nothing is remounted,
   so a sheet keeps its identity while it travels to the front. */
type CertificationSheetProps = {
  cert: Certification
  pos: number
  visibleCount: number
  step: number
  reducedMotion: boolean
  onSelect: () => void
}

function CertificationSheet({
  cert,
  pos,
  visibleCount,
  step,
  reducedMotion,
  onSelect,
}: CertificationSheetProps) {
  const isActive = pos === 0
  const restY = pos * step

  return (
    <motion.button
      type="button"
      className={`cert-doc${isActive ? ' cert-doc-active' : ''}`}
      style={{ zIndex: visibleCount - pos, '--pos': pos } as CSSProperties}
      initial={false}
      animate={{ x: pos * step, y: restY }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: isActive ? -6 : restY - 7,
              /* hover responds immediately — never waits on the pile */
              transition: { duration: 0.25, delay: 0, ease: EASE },
            }
      }
      /* the pulled-out sheet leads; the rest of the pile follows a beat later */
      transition={{
        duration: reducedMotion ? 0 : 0.42,
        delay: reducedMotion || isActive ? 0 : 0.05,
        ease: EASE,
      }}
      onClick={onSelect}
      aria-label={
        isActive
          ? `${cert.title}, ${cert.issuer} — open credential viewer`
          : `${cert.title}, ${cert.issuer} — bring to front`
      }
    >
      <div className="cert-doc-top">
        <span className="cert-doc-num">CERT. {cert.number}</span>
        <span className="cert-doc-year">{cert.year}</span>
      </div>
      <div className="cert-doc-issuer">{cert.issuer}</div>
      <div className="cert-doc-title">{cert.title}</div>
      <div className="cert-doc-details">
        <div className="cert-doc-details-inner">
          <div className="cert-doc-rule" />
          {cert.image && (
            <img
              className="cert-doc-thumb"
              src={cert.image}
              alt={`${cert.title} certificate preview`}
              decoding="async"
            />
          )}
          <div className="cert-doc-issued">
            <span className="cert-doc-issued-label">Issued</span> {cert.issuedDate}
          </div>
          <div className="cert-doc-foot">
            <span className="cert-doc-category">{cert.category}</span>
            <span className="cert-doc-viewhint">
              VIEW CREDENTIAL <span className="proj-arrow">↗</span>
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function CertificationsSection() {
  const prefersReducedMotion = useReducedMotion()
  const step = useStackStep()

  /* The stack order IS the state — promoting a sheet moves it to the
     front and keeps every other sheet in its relative position. */
  const [order, setOrder] = useState<number[]>(() => certifications.map((_, i) => i))
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)

  const total = certifications.length
  const visibleCount = Math.min(total, MAX_VISIBLE)

  const activeIndex = order[0]
  const activeCert = certifications[activeIndex]
  const viewerCert = viewerIndex !== null ? certifications[viewerIndex] : undefined

  /* Position indicator trails the animation — it settles once the
     selected sheet has landed on top, not before. */
  const [displayNumber, setDisplayNumber] = useState(activeCert.number)

  useEffect(() => {
    const t = setTimeout(
      () => setDisplayNumber(certifications[order[0]].number),
      prefersReducedMotion ? 0 : 430,
    )
    return () => clearTimeout(t)
  }, [order, prefersReducedMotion])

  const promote = useCallback((certIdx: number) => {
    setOrder((prev) =>
      prev[0] === certIdx ? prev : [certIdx, ...prev.filter((i) => i !== certIdx)],
    )
  }, [])

  const openViewer = useCallback((certIdx: number) => {
    setViewerIndex(certIdx)
  }, [])

  const closeViewer = useCallback(() => {
    setViewerIndex(null)
    /* Hand focus back to whichever sheet is on top — the pile was
       never reset, so it reads exactly as before the viewer opened. */
    requestAnimationFrame(() => {
      sectionRef.current?.querySelector<HTMLElement>('.cert-doc-active')?.focus()
    })
  }, [])

  /* Rotate through the FULL order array, wrapping at both ends —
     next sends the top sheet to the back of the pile, prev pulls the
     bottom sheet to the front. Shared by the visible arrow buttons
     and the keyboard, so every credential is reachable either way. */
  const rotateNext = useCallback(() => {
    setOrder((prev) => (prev.length < 2 ? prev : [...prev.slice(1), prev[0]]))
  }, [])

  const rotatePrev = useCallback(() => {
    setOrder((prev) =>
      prev.length < 2 ? prev : [prev[prev.length - 1], ...prev.slice(0, -1)],
    )
  }, [])

  /* Keyboard mirrors the visible arrows */
  const handleStackKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (total < 2) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        rotateNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        rotatePrev()
      }
    },
    [rotateNext, rotatePrev, total],
  )

  /* Pin the pile's height to the active sheet so promoting never
     causes a layout jump below the stack. */
  useEffect(() => {
    const stack = stackRef.current
    const active = stack?.querySelector<HTMLElement>('.cert-doc-active')
    if (!stack || !active) return

    const sync = () => {
      stack.style.height = `${active.offsetHeight}px`
    }
    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(active)
    return () => ro.disconnect()
    /* showAll in deps re-syncs the pinned height after the pile
       remounts on the way back from the grid view */
  }, [activeIndex, step, showAll])

  /* Timeline points — one per distinct year, positioned proportionally */
  const sortedYears = useMemo(() => [...new Set(certifications.map((c) => c.year))].sort(), [])

  const timelinePoints = useMemo(
    () =>
      sortedYears.map((year, i) => ({
        year,
        position:
          i === 0
            ? ('first' as const)
            : i === sortedYears.length - 1
              ? ('last' as const)
              : (i / (sortedYears.length - 1)) * 100,
      })),
    [sortedYears],
  )

  if (total === 0) return null

  return (
    <section id="certifications" className="main-section" ref={sectionRef}>
      <div className="section-head">
        <span className="section-num">04</span>
        <span className="section-title-serif">Certifications</span>
        <div className="section-rule" />
      </div>

      {/* Grid view spans the section's full width — the intro column
          steps aside entirely while it is open */}
      <div className={`cert-layout${showAll ? ' cert-layout--full' : ''}`}>
        {/* Left — collection note (stack view only) */}
        {!showAll && (
          <div className="cert-intro">
            <p className="cert-intro-text">
              A collection of learning milestones and professional growth.
            </p>
            <div className="cert-intro-meta">
              {String(total).padStart(2, '0')} CREDENTIALS · {sortedYears[0]}—
              {sortedYears[sortedYears.length - 1]}
            </div>
          </div>
        )}

        {/* Right — credential display: controls header on top, then either
            the document pile or the all-credentials grid in its place */}
        <div className="cert-stack-area">
          {/* Header row — stack navigation + view toggle live above the
              display; arrows and the counter are stack-specific, so they
              step aside while the grid is open. The toggle always stays. */}
          <div className="cert-stack-controls">
            {!showAll && (
              <span className="cert-stack-count" aria-live="polite">
                {displayNumber} / {String(total).padStart(2, '0')}
              </span>
            )}
            <div className="cert-stack-actions">
              {!showAll && (
                <div className="cert-stack-nav">
                  <button
                    type="button"
                    className="cert-nav-btn"
                    onClick={rotatePrev}
                    disabled={total < 2}
                    aria-label="Previous credential"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="cert-nav-btn"
                    onClick={rotateNext}
                    disabled={total < 2}
                    aria-label="Next credential"
                  >
                    →
                  </button>
                </div>
              )}
              <button
                type="button"
                className="cert-grid-toggle"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                aria-controls="cert-grid"
              >
                {showAll ? 'Back to stack' : 'View all'}
              </button>
            </div>
          </div>

          {showAll ? (
            /* All-credentials grid — replaces the pile while active.
               Every card opens the same viewer the pile uses. */
            <ul id="cert-grid" className="cert-grid" role="list">
              {certifications.map((cert, idx) => (
                <li key={cert.id}>
                  <button
                    type="button"
                    className="cert-grid-card"
                    onClick={() => openViewer(idx)}
                    aria-label={`${cert.title} — open credential viewer`}
                  >
                    <span className="cert-grid-top">
                      <span>CERT. {cert.number}</span>
                      <span className="cert-grid-year">{cert.year}</span>
                    </span>
                    {cert.image && (
                      <img
                        className="cert-doc-thumb"
                        src={cert.image}
                        alt={`${cert.title} certificate preview`}
                        decoding="async"
                        loading="lazy"
                      />
                    )}
                    <span className="cert-grid-issuer">{cert.issuer}</span>
                    <span className="cert-grid-title">{cert.title}</span>
                    <span className="cert-grid-desc">{cert.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            /* Browsable document pile */
            <div
              ref={stackRef}
              className="cert-stack"
              role="group"
              aria-label={`Credential stack — ${activeCert.title} on top`}
              onKeyDown={handleStackKeyDown}
              style={{
                /* reserve room for the widest cascade + hover lift */
                marginRight: step * (visibleCount - 1) + 10,
                marginBottom: step * (visibleCount - 1) + 10,
              }}
            >
              {order.slice(0, visibleCount).map((certIdx, pos) => (
                <CertificationSheet
                  key={certifications[certIdx].id}
                  cert={certifications[certIdx]}
                  pos={pos}
                  visibleCount={visibleCount}
                  step={step}
                  reducedMotion={Boolean(prefersReducedMotion)}
                  onSelect={() => (pos === 0 ? openViewer(certIdx) : promote(certIdx))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subtle progression timeline */}
      {timelinePoints.length > 1 && (
        <div className="cert-timeline" aria-hidden="true">
          {timelinePoints.map(({ year, position }) => (
            <span
              key={year}
              className="cert-timeline-point"
              style={
                position === 'first'
                  ? { left: 0 }
                  : position === 'last'
                    ? { right: 0 }
                    : { left: `${position}%` }
              }
            >
              <span className="cert-timeline-dot" />
              <span className="cert-timeline-year">{year}</span>
            </span>
          ))}
        </div>
      )}

      {viewerCert && viewerIndex !== null && (
        <CertificationViewer
          certification={viewerCert}
          index={viewerIndex}
          total={total}
          onClose={closeViewer}
          onPrev={() => setViewerIndex((i) => (i !== null ? (i - 1 + total) % total : i))}
          onNext={() => setViewerIndex((i) => (i !== null ? (i + 1) % total : i))}
        />
      )}
    </section>
  )
}

export default CertificationsSection
