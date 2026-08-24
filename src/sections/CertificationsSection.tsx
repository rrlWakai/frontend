import { useCallback, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { certifications } from '../data/site'
import CertificationViewer from './CertificationViewer'

/* Sheets rendered as separate documents; extras stay reachable via
   keyboard navigation once the pile grows past this depth. */
const MAX_VISIBLE = 5

/** Physical offset (px) per depth level in the pile */
const STEP = 9

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function CertificationsSection() {
  const prefersReducedMotion = useReducedMotion()

  /* The stack order IS the state — promoting a sheet moves it to the
     front and keeps every other sheet in its relative position. */
  const [order, setOrder] = useState<number[]>(() => certifications.map((_, i) => i))
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const total = certifications.length
  const visibleCount = Math.min(total, MAX_VISIBLE)

  const activeIndex = order[0]
  const activeCert = certifications[activeIndex]
  const viewerCert = viewerIndex !== null ? certifications[viewerIndex] : undefined

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
    /* Hand focus back to whichever sheet is on top — the stack was
       never reset, so it reads exactly as before the viewer opened. */
    requestAnimationFrame(() => {
      sectionRef.current?.querySelector<HTMLElement>('.cert-doc-active')?.focus()
    })
  }, [])

  /* Hidden keyboard navigation — no visible arrows, purely a11y */
  const handleStackKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (total < 2) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        promote(order[1])
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setOrder((prev) => [...prev.slice(1), prev[0]])
      }
    },
    [order, promote, total],
  )

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

      <div className="cert-layout">
        {/* Left — collection note */}
        <div className="cert-intro">
          <p className="cert-intro-text">
            A collection of learning milestones and professional growth.
          </p>
          <div className="cert-intro-meta">
            {String(total).padStart(2, '0')} CREDENTIALS · {sortedYears[0]}—
            {sortedYears[sortedYears.length - 1]}
          </div>
        </div>

        {/* Right — browsable document pile */}
        <div className="cert-stack-area">
          <div
            className="cert-stack"
            role="group"
            aria-label={`Credential stack — ${activeCert.title} on top`}
            onKeyDown={handleStackKeyDown}
          >
            {order.slice(0, visibleCount).map((certIdx, pos) => {
              const cert = certifications[certIdx]
              const isActive = pos === 0
              const restY = pos * STEP

              return (
                <motion.button
                  key={cert.id}
                  type="button"
                  className={`cert-doc${isActive ? ' cert-doc-active' : ''}`}
                  style={
                    {
                      zIndex: visibleCount - pos,
                      '--pos': pos,
                    } as CSSProperties
                  }
                  initial={false}
                  animate={{ x: pos * STEP, y: restY }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : isActive
                        ? { y: -6 }
                        : { y: restY - 7 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.38,
                    ease: EASE,
                  }}
                  onClick={() => (isActive ? openViewer(certIdx) : promote(certIdx))}
                  aria-label={
                    isActive
                      ? `${cert.title}, ${cert.issuer} — open credential viewer`
                      : `${cert.title}, ${cert.issuer} — bring to front`
                  }
                >
                  {isActive ? (
                    <>
                      <div className="cert-doc-top">
                        <span className="cert-doc-num">CERT. {cert.number}</span>
                        <span className="cert-doc-year">{cert.year}</span>
                      </div>
                      <div className="cert-doc-issuer">{cert.issuer}</div>
                      <div className="cert-doc-title">{cert.title}</div>
                      <div className="cert-doc-rule" />
                      <div className="cert-doc-issued">
                        <span className="cert-doc-issued-label">Issued</span> {cert.issuedDate}
                      </div>
                      <div className="cert-doc-foot">
                        <span className="cert-doc-category">{cert.category}</span>
                        <span className="cert-doc-viewhint">
                          VIEW CREDENTIAL <span className="proj-arrow">↗</span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="cert-doc-top">
                        <span className="cert-doc-num">CERT. {cert.number}</span>
                        <span className="cert-doc-year">{cert.year}</span>
                      </div>
                      <div className="cert-doc-mini-title">{cert.title}</div>
                      <div className="cert-doc-mini-issuer">{cert.issuer}</div>
                    </>
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="cert-stack-count" aria-live="polite">
            {activeCert.number} / {String(total).padStart(2, '0')}
          </div>
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
