import { site } from '../data/site'

function ContactSection() {
  return (
    <section id="contact" className="main-section">
      <div className="section-head">
        <span className="section-num">06</span>
        <span className="section-title-serif">Contact</span>
        <div className="section-rule" />
      </div>

      <div className="contact-block">
        <p className="contact-text">
          Open to collaboration, project inquiries, and opportunities in software engineering and web development.
        </p>
        <div className="contact-links-row">
          <a href={`mailto:${site.email}`} className="contact-btn">
            Email Me <span className="proj-arrow">↗</span>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="contact-btn"
          >
            GitHub <span className="proj-arrow">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
