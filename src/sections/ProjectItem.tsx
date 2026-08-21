import type { Project } from '../data/site'

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <div className={`proj ${project.featured ? 'proj--featured' : ''}`}>
      <div className="proj-left">
        <span className="proj-num">{num}</span>
        <div className="proj-info">
          <div className="proj-head">
            <span className="proj-name">{project.name}</span>
          </div>
          <div className="proj-category">{project.category}</div>
          {project.type && (
            <div className="proj-desc" style={{ marginBottom: 6 }}>{project.type}</div>
          )}
          {project.date && (
            <div className="proj-desc" style={{ fontSize: 12.5, color: 'var(--color-subtle)', marginBottom: 6 }}>{project.date}</div>
          )}
          <p className="proj-desc">{project.description}</p>
          {project.technologies && (
            <div className="proj-tech">
              {project.technologies.map((t) => (
                <span key={t} className="proj-tech-item">{t}</span>
              ))}
            </div>
          )}
          {project.features && (
            <div className="proj-features">
              {project.features.map((f) => (
                <span key={f} className="proj-feature-tag">{f}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className="proj-link"
      >
        VIEW PROJECT <span className="proj-arrow">↗</span>
      </a>
    </div>
  )
}

export default ProjectItem
