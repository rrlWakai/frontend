import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

type CredentialBadgeProps = {
  issuerName: string
  credentialTitle: string
  /** Overrides the default behavior (smooth-scroll to the #certifications section) */
  onClick?: () => void
}

/**
 * Compact circular credential badge shown inline after the name — a quiet
 * trust signal. Renders a lucide `BadgeCheck` mark on a navy disc.
 * Hover/focus shows a tooltip with the credential title and issuer; tapping
 * on touch devices flashes the same info briefly. Clicking smooth-scrolls to
 * the certifications section (the same target the nav anchors jump to),
 * unless a custom `onClick` is passed.
 */
function CredentialBadge({ issuerName, credentialTitle, onClick }: CredentialBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const [tipVisible, setTipVisible] = useState(false)
  const tipTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (tipTimer.current !== null) window.clearTimeout(tipTimer.current)
    }
  }, [])

  /* Touch devices have no hover — flash the tooltip briefly on tap */
  const flashTip = () => {
    if (tipTimer.current !== null) window.clearTimeout(tipTimer.current)
    setTipVisible(true)
    tipTimer.current = window.setTimeout(() => setTipVisible(false), 1600)
  }

  const handleClick = () => {
    flashTip()
    if (onClick) {
      onClick()
      return
    }
    document
      .getElementById('certifications')
      ?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
  }

  return (
    <button
      type="button"
      className={`credential-badge${tipVisible ? ' is-tapped' : ''}`}
      onClick={handleClick}
      aria-label={`${credentialTitle} — ${issuerName}`}
    >
      <BadgeCheck aria-hidden="true" />
      <span className="credential-badge-tip" aria-hidden="true">
        {credentialTitle} — {issuerName}
      </span>
    </button>
  )
}

export default CredentialBadge
