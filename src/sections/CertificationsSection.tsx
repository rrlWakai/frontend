import { useCallback, useMemo, useState } from 'react'
import { certifications } from '../data/site'
import CertificationViewer from './CertificationViewer'

const MAX_LAYERS = 3

function CertificationsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const total = certifications.length

  const activeCert = certifications[activeIndex]
  const viewerCert = viewerIndex !== null ? certifications[viewerIndex] : undefined

  const layerCount = Math.min(total - 1, MAX_LAYERS)

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total)
  }, [total])

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total)
  }, [total])

  const openViewer = useCallback((index: number) => {
    setViewerIndex(index)
  }, [])

  const closeViewer = useCallback(() => setViewerIndex(null), [])

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
    <section id="certifications" className="main-section">
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

        {/* Right — document stack */}
        <div className="cert-stack-area">
          <div className="cert-stack">
            <button
              type="button"
              className="cert-doc"
              onClick={() => openViewer(activeIndex)}
              aria-haspopup="dialog"
              aria-label={`${activeCert.title}, ${activeCert.issuer} — view credential`}
            >
              <div className="cert-doc-top">
                <span className="cert-doc-num">CERT. {activeCert.number}</span>
                <span className="cert-doc-year">{activeCert.year}</span>
              </div>
              <div className="cert-doc-issuer">{activeCert.issuer}</div>
              <div className="cert-doc-title">{activeCert.title}</div>
              <div className="cert-doc-rule" />
              <div className="cert-doc-issued">
                <span className="cert-doc-issued-label">Issued</span> {activeCert.issuedDate}
              </div>
              <div className="cert-doc-foot">
                <span className="cert-doc-category">{activeCert.category}</span>
                <span className="cert-doc-viewhint">
                  VIEW CREDENTIAL <span className="proj-arrow">↗</span>
                </span>
              </div>
            </button>
            {Array.from({ length: layerCount }).map((_, i) => (
              <div key={i} className={`cert-layer cert-layer-${i + 1}`} aria-hidden="true" />
            ))}
          </div>

          <div className="cert-stack-nav">
            <span className="cert-counter" aria-live="polite">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <div className="cert-nav-btns">
              <button
                type="button"
                className="cert-nav-btn"
                onClick={showPrev}
                aria-label="Previous certification"
              >
                ← Prev
              </button>
              <button
                type="button"
                className="cert-nav-btn"
                onClick={showNext}
                aria-label="Next certification"
              >
                Next →
              </button>
            </div>
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
