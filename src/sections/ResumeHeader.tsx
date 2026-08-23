import { useState, useEffect, useCallback } from 'react'
import { site } from '../data/site'
import { useTheme } from '../hooks/useTheme'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ResumeHeader() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxOpen, closeLightbox])

  return (
    <header className="lh-wrapper">
      {/* Full-bleed cover banner */}
      <div className="lh-cover" onClick={() => setLightboxOpen(true)}>
        <img
          src="/coverr.png"
          alt={isDark ? 'Cover banner' : ''}
          aria-hidden={!isDark}
          className="lh-cover-img"
          draggable={false}
        />
        <img
          src="/covermor.png"
          alt={isDark ? '' : 'Cover banner'}
          aria-hidden={isDark}
          className={`lh-cover-img lh-cover-img-light${!isDark ? ' is-active' : ''}`}
          draggable={false}
        />
        <button
          className="theme-toggle"
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleTheme() }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className={`theme-toggle-icon ${!isDark ? 'active' : ''}`}>
            <SunIcon />
          </span>
          <span className={`theme-toggle-icon ${isDark ? 'active' : ''}`}>
            <MoonIcon />
          </span>
        </button>
      </div>

      {/* Cover lightbox */}
      {lightboxOpen && (
        <div
          className="cover-lightbox"
          onClick={closeLightbox}
        >
          <button
            className="cover-lightbox-close"
            type="button"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <img
            src={isDark ? '/coverr.png' : '/covermor.png'}
            alt="Cover banner full size"
            className="cover-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Content area — sits below the cover */}
      <div className="lh-content">
        {/* Avatar — overlaps the cover seam via negative margin */}
        <div className="lh-avatar anim-avatar">
          <img
            src="/morning.png"
            alt={isDark ? '' : site.name}
            aria-hidden={isDark}
            className={`lh-avatar-img${!isDark ? ' is-active' : ''}`}
            draggable={false}
          />
          <img
            src="/profile.png"
            alt={isDark ? site.name : ''}
            aria-hidden={!isDark}
            className={`lh-avatar-img${isDark ? ' is-active' : ''}`}
            draggable={false}
          />
        </div>

        {/* Text + nav row */}
        <div className="lh-body">
          <div className="lh-left">
            <div className="lh-text">
              <h1 className="lh-name anim-identity anim-identity-1">{site.name}</h1>
              <div className="lh-role anim-identity anim-identity-2">{site.role}</div>
            </div>
          </div>
          <div className="lh-right">
            <div className="lh-meta anim-identity anim-identity-3">
              {site.location}
              <span className="lh-dot"> · </span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <nav className="lh-nav anim-identity anim-identity-4">
              <a href="#experience">Experience</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
              <a href="#" className="resume-btn">Download Résumé</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hairline divider */}
      <div className="lh-divider" />
    </header>
  )
}

export default ResumeHeader
