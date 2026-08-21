import { site } from '../data/site'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-copy">
          © 2026 {site.name} — Software Engineer
        </div>
        <div className="footer-links">
          <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
