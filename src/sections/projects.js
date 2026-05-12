import { projects, socials, siteCopy } from '../data/content.js'

export function initProjects(lang = 'es') {
  const grid = document.getElementById('projects-grid')
  if (!grid) return

  const copy = siteCopy[lang]?.projects || siteCopy.es.projects
  const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`

  grid.innerHTML = projects.map(p => `
    <a
      href="${p.link}"
      target="_blank"
      rel="noopener noreferrer"
      class="project-card"
      aria-label="${copy.aria.replace('{title}', p.title)}"
    >
      <div
        class="project-card__image"
        style="background: linear-gradient(135deg, ${p.bgFrom} 0%, ${p.bgTo} 100%)"
      >
        <span class="project-card__label-big">${p.label}</span>
        <span class="project-card__lang">${p.lang}</span>
      </div>

      <div class="project-card__body">
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description[lang] || p.description.es}</p>
      </div>

      <div class="project-card__footer">
        <span class="project-card__link">
          ${copy.github}
          <span class="project-card__link-arrow">${arrowSvg}</span>
        </span>
      </div>
    </a>
  `).join('')
}

export function initSocials() {
  const contactSocials = document.getElementById('contact-socials')
  const footerSocials = document.getElementById('footer-socials')

  const socialLinks = socials.map(s => `
    <a
      href="${s.url}"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link"
      aria-label="${s.label}"
    >
      ${s.icon}
      ${s.label}
    </a>
  `).join('')

  if (contactSocials) contactSocials.innerHTML = socialLinks
  if (footerSocials) {
    footerSocials.innerHTML = socials.map(s => `
      <a
        href="${s.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-link"
        aria-label="${s.label}"
      >${s.label}</a>
    `).join('')
  }
}
