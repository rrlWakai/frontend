import { useEffect, useRef } from 'react'
import type { Certification } from '../data/site'

type CertificationViewerProps = {
  certification: Certification
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function CertificationViewer({
  certification,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: CertificationViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  /* Scroll lock + keyboard navigation while the viewer is open */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, onPrev, onNext])

  /* Move focus into the dialog on open */
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <div className="cert-viewer-overlay" onClick={onClose}>
      <div
        className="cert-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={`${certification.title} — credential`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cert-viewer-head">
          <span className="cert-viewer-count" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="cert-viewer-close"
            onClick={onClose}
            aria-label="Close credential viewer"
          >
            ✕
          </button>
        </div>

        <div className="cert-viewer-stage">
          {certification.image ? (
            <img
              src={certification.image}
              alt={`${certification.title} certificate — ${certification.issuer}`}
              className="cert-viewer-img"
            />
          ) : (
            <div className="cert-viewer-sheet" aria-label="Certificate summary">
              <span className="cert-viewer-sheet-kicker">{certification.category}</span>
              <span className="cert-viewer-sheet-issuer">{certification.issuer}</span>
              <span className="cert-viewer-sheet-title">{certification.title}</span>
              <span className="cert-viewer-sheet-rule" />
              <span className="cert-viewer-sheet-meta">
                CERTIFICATE · ISSUED {certification.issuedDate.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <h3 className="cert-viewer-title">{certification.title}</h3>

        {certification.description && (
          <p className="cert-viewer-desc">{certification.description}</p>
        )}

        <dl className="cert-viewer-meta">
          <div className="cert-viewer-meta-row">
            <dt>Issuer</dt>
            <dd>{certification.issuer}</dd>
          </div>
          <div className="cert-viewer-meta-row">
            <dt>Issued</dt>
            <dd>{certification.issuedDate}</dd>
          </div>
          {certification.credentialId && (
            <div className="cert-viewer-meta-row">
              <dt>Credential ID</dt>
              <dd>{certification.credentialId}</dd>
            </div>
          )}
        </dl>

        {certification.credentialUrl && (
          <div className="cert-viewer-foot">
            <a
              href={certification.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="proj-link cert-viewer-original"
            >
              View original credential <span className="proj-arrow">↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default CertificationViewer
