import { education } from '../data/site'

function EducationSection() {
  return (
    <section id="education" className="main-section">
      <div className="section-head">
        <span className="section-num">03</span>
        <span className="section-title-serif">Education</span>
        <div className="section-rule" />
      </div>

      <div className="edu-card">
        <div className="edu-main">
          <div className="edu-degree">{education.degree}</div>
          <div className="edu-major">{education.major}</div>
          <div className="edu-institution">{education.institution}</div>
          <div className="edu-location">{education.location}</div>
        </div>
        <div className="edu-status">{education.status}</div>
      </div>
    </section>
  )
}

export default EducationSection
