import { useState } from "react";
import { site } from "../data/site";
import { contactTips } from "../data/contactTips";

const TIP_KEY = "portfolio-contact-tip-index";

const SERVICES = [
  {
    name: "Business websites",
    description:
      "Professional websites for businesses and customer-facing services.",
  },
  {
    name: "Web applications",
    description:
      "User-focused web applications built around real business requirements.",
  },
  {
    name: "Reservation systems",
    description:
      "Booking workflows, availability, and administrative management.",
  },
  {
    name: "Custom business systems",
    description:
      "Digital websites for improving repetitive business workflows.",
  },
];

/** One tip per browser session — stable across re-renders, route changes
 *  and reloads, re-randomised in a new tab or after sessionStorage clears. */
function pickSessionTip(): string {
  try {
    const stored = sessionStorage.getItem(TIP_KEY);
    const index =
      stored === null
        ? Math.floor(Math.random() * contactTips.length)
        : Number(stored);

    if (!Number.isInteger(index) || index < 0 || index >= contactTips.length) {
      return contactTips[0];
    }

    sessionStorage.setItem(TIP_KEY, String(index));
    return contactTips[index];
  } catch {
    // Private mode / blocked storage — fall back to a fixed tip.
    return contactTips[0];
  }
}

function ContactSection() {
  const [tip] = useState(pickSessionTip);

  return (
    <section id="contact" className="main-section">
      <div className="section-head">
        <span className="section-num">07</span>
        <span className="section-title-serif">Contact</span>
        <div className="section-rule" />
      </div>

      <div className="contact-block">
        <div className="contact-main">
          <span className="postit" aria-hidden="false">
            <span className="postit-tape" aria-hidden="true" />
            {tip}
          </span>
          <p className="contact-eyebrow">Let&rsquo;s Work Together</p>
          <p className="contact-text">
            Open to collaboration, project inquiries, and opportunities in
            software engineering and web development.
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

        <div className="contact-panel">
          <p className="contact-status">
            <span className="contact-status-dot" aria-hidden="true" />
            Open for Projects
          </p>

          <h3 className="contact-panel-title">Available for</h3>

          <ul className="contact-services">
            {SERVICES.map((service) => (
              <li className="contact-service" key={service.name}>
                <span className="contact-service-arrow" aria-hidden="true">
                  &rarr;
                </span>
                <div className="contact-service-body">
                  <p className="contact-service-name">{service.name}</p>
                  <p className="contact-service-desc">{service.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="contact-location">
            San Pablo City, Laguna
            <br />
            Philippines
          </p>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
