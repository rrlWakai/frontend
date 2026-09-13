import { projects, photos } from './data/site'
import ResumeHeader from './sections/ResumeHeader'
import ResumeSidebar from './sections/ResumeSidebar'
import ProjectCoverflow from './sections/ProjectCoverflow'
import EducationSection from './sections/EducationSection'
import CertificationsSection from './sections/CertificationsSection'
import GallerySection from './sections/GallerySection'
import GitHubActivitySection from './sections/GitHubActivitySection'
import ContactSection from './sections/ContactSection'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import Loader from './components/Loader'
import { useGitHubActivity } from './hooks/useGitHubActivity'
import './App.css'

function App() {
  const activity = useGitHubActivity()

  return (
    <div className="app">
      <Loader />
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
            <Reveal>
              <div className="section-head">
                <span className="section-num">02</span>
                <span className="section-title-serif">Selected Work</span>
                <div className="section-rule" />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <ProjectCoverflow projects={projects} />
            </Reveal>
          </section>

          {/* ── Education ── */}
          <Reveal>
            <EducationSection />
          </Reveal>

          {/* ── Certifications ── */}
          <Reveal>
            <CertificationsSection />
          </Reveal>

          {/* ── Gallery ── */}
          <GallerySection photos={photos} />

          {/* ── GitHub Activity ── */}
          <Reveal>
            <GitHubActivitySection
              status={activity.status}
              stats={activity.stats}
              weeks={activity.weeks}
            />
          </Reveal>

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
