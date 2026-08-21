import { site, skillCategories, toolsStack } from '../data/site'
import FocusGraphic from '../components/FocusGraphic'

function SideBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="side-block">
      <span className="side-label">{label}</span>
      {children}
    </div>
  )
}

function ResumeSidebar() {
  return (
    <aside className="sidebar">
      <SideBlock label="Profile">
        <p className="side-summary">{site.summary}</p>
      </SideBlock>

      <SideBlock label="Skills">
        {skillCategories.map((cat) => (
          <div key={cat.category} className="skill-group">
            <div className="skill-group-title">{cat.category}</div>
            <div className="skill-items">
              {cat.items.map((item) => (
                <span key={item} className="skill-item">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </SideBlock>

      <SideBlock label="Focus">
        <FocusGraphic />
      </SideBlock>

      <SideBlock label="Tools & Stack">
        <div className="pill-group">
          {toolsStack.map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
      </SideBlock>

      <SideBlock label="Contact">
        <ul className="contact-list">
          <li>
            <span className="contact-label">Email</span>
            <a href={`mailto:${site.email}`} className="contact-value contact-link">{site.email}</a>
          </li>
          <li>
            <span className="contact-label">GitHub</span>
            <a href={site.github} target="_blank" rel="noreferrer" className="contact-value contact-link">
              github.com/rrlWakai
            </a>
          </li>
          <li>
            <span className="contact-label">Based in</span>
            <span className="contact-value">{site.location}</span>
          </li>
        </ul>
      </SideBlock>
    </aside>
  )
}

export default ResumeSidebar
