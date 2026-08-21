import { projects, photos } from './data/site'
import ResumeHeader from './sections/ResumeHeader'
import ResumeSidebar from './sections/ResumeSidebar'
import ProjectItem from './sections/ProjectItem'
import EducationSection from './sections/EducationSection'
import GallerySection from './sections/GallerySection'
import ContactSection from './sections/ContactSection'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import './App.css'

function App() {
  const featuredProject = projects.find((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <div className="app">
      <ResumeHeader />

      <div className="layout">
        <ResumeSidebar />

        <main className="main">
          {/* ── Experience ── */}
          <section id="experience" className="main-section">
            <Reveal>
              <div className="section-head">
                <span className="section-num">01</span>
                <span className="section-title-serif">Experience</span>
                <div className="section-rule" />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="exp-block">
                <div className="exp-header">
                  <div className="exp-title">Website Business Developer — <span className="exp-company">Freelance</span></div>
                </div>
                <p className="exp-desc">
                  Design and develop professional websites and digital solutions for businesses,
                  translating business requirements into responsive, user-focused experiences.
                  Work across website development, UI/UX, system implementation, and
                  business-focused web solutions.
                </p>
                <div className="exp-focus-line">
                  <span>Website Development</span>
                  <span className="exp-sep">·</span>
                  <span>UI/UX</span>
                  <span className="exp-sep">·</span>
                  <span>Business Solutions</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="selected-business">
                <div className="selected-business-label">SELECTED BUSINESS WORK</div>
                <div className="selected-business-list">
                  <div className="selected-business-item">
                    <span className="selected-business-name">KRiB</span>
                    <span className="selected-business-type">Reservation System</span>
                  </div>
                  <div className="selected-business-item">
                    <span className="selected-business-name">Premier Rentals</span>
                    <span className="selected-business-type">Reservation System</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── Selected Work ── */}
          <section id="projects" className="main-section">
            <div className="section-head">
              <span className="section-num">02</span>
              <span className="section-title-serif">Selected Work</span>
              <div className="section-rule" />
            </div>

            {/* Featured project — KRiB */}
            {featuredProject && (
              <Reveal>
                <div className="featured-project">
                  <div className="featured-project-head">
                    <span className="featured-project-name">{featuredProject.name}</span>
                    <span className="featured-project-category">{featuredProject.category}</span>
                  </div>
                  <div className="featured-project-meta">
                    {featuredProject.type && <span>{featuredProject.type}</span>}
                    {featuredProject.type && featuredProject.date && (
                      <span className="featured-project-meta-dot" />
                    )}
                    {featuredProject.date && <span>{featuredProject.date}</span>}
                  </div>
                  <p className="featured-project-desc">{featuredProject.description}</p>
                  {featuredProject.technologies && (
                    <div className="featured-tech">
                      {featuredProject.technologies.map((t) => (
                        <span key={t} className="featured-tech-item">{t}</span>
                      ))}
                    </div>
                  )}
                  <a
                    href={featuredProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="featured-project-link"
                  >
                    View Project <span className="proj-arrow">↗</span>
                  </a>
                </div>
              </Reveal>
            )}

            {/* Other projects — editorial list */}
            <div className="project-list">
              {otherProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.05}>
                  <ProjectItem project={project} index={projects.indexOf(project)} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Education ── */}
          <Reveal>
            <EducationSection />
          </Reveal>

          {/* ── Gallery ── */}
          <GallerySection photos={photos} />

          {/* ── Contact ── */}
          <Reveal>
            <ContactSection />
          </Reveal>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default App
