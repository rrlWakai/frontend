import { useRef, useCallback, useEffect } from 'react'

export type Photo = {
  name: string
  year: string
  src: string
}

type GallerySectionProps = {
  photos: Photo[]
}

function GallerySection({ photos }: GallerySectionProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
      scrollTimeout.current = null
    }
  }, [])

  const pauseThenResume = useCallback(() => {
    const el = stripRef.current
    if (!el) return
    clearScrollTimeout()
    el.classList.add('animation-disabled')
    scrollTimeout.current = setTimeout(() => {
      el.classList.remove('animation-disabled')
      scrollTimeout.current = null
    }, 3000)
  }, [clearScrollTimeout])

  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    el.addEventListener('scroll', pauseThenResume, { passive: true })
    return () => {
      el.removeEventListener('scroll', pauseThenResume)
      clearScrollTimeout()
    }
  }, [pauseThenResume, clearScrollTimeout])

  return (
    <section id="gallery" className="main-section">
      <div className="section-head">
        <span className="section-num">05</span>
        <span className="section-title-serif">Gallery</span>
        <div className="section-rule" />
      </div>

      <div
        ref={stripRef}
        className="gallery-strip"
        role="region"
        aria-label="Photo gallery"
      >
        <div className="gallery-track">
          {photos.map((photo, i) => (
            <div
              className="gallery-frame"
              key={`a-${i}`}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className="gallery-frame-inner">
                <img
                  src={photo.src}
                  alt={`${photo.name}, ${photo.year}`}
                  className="gallery-img"
                  loading="lazy"
                />
                <span className="gallery-badge">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="gallery-caption">
                <span className="gallery-name">{photo.name}</span>
                <span className="gallery-year">{photo.year}</span>
              </div>
            </div>
          ))}
          {photos.map((photo, i) => (
            <div className="gallery-frame" key={`b-${i}`}>
              <div className="gallery-frame-inner">
                <img
                  src={photo.src}
                  alt={`${photo.name}, ${photo.year}`}
                  className="gallery-img"
                  loading="lazy"
                />
                <span className="gallery-badge">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="gallery-caption">
                <span className="gallery-name">{photo.name}</span>
                <span className="gallery-year">{photo.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
