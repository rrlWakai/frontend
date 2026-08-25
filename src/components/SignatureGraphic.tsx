import { site } from '../data/site'

function SignatureGraphic() {
  return (
    <div className="sig-graphic">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="52" stroke="var(--color-line)" strokeWidth="0.5" fill="none" />
        <circle cx="60" cy="60" r="36" stroke="var(--color-line)" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
        <path d="M 60 8 A 52 52 0 0 1 112 60" stroke="var(--color-ink)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <line x1="60" y1="20" x2="60" y2="28" stroke="var(--color-line)" strokeWidth="0.5" />
        <line x1="60" y1="92" x2="60" y2="100" stroke="var(--color-line)" strokeWidth="0.5" />
        <line x1="20" y1="60" x2="28" y2="60" stroke="var(--color-line)" strokeWidth="0.5" />
        <line x1="92" y1="60" x2="100" y2="60" stroke="var(--color-line)" strokeWidth="0.5" />
        <text
          x="60" y="64"
          textAnchor="middle"
          fontFamily="'Source Serif 4', Georgia, serif"
          fontSize="22"
          fontWeight="500"
          fill="var(--color-ink)"
        >
          {site.initials}
        </text>
      </svg>
    </div>
  )
}

export default SignatureGraphic
