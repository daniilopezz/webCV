import { projects, socials, siteCopy } from '../data/content.js'

export function initProjects(lang = 'es') {
  const grid = document.getElementById('projects-grid')
  if (!grid) return

  const copy = siteCopy[lang]?.projects || siteCopy.es.projects
  const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`

  grid.setAttribute('aria-label', copy.listLabel)
  grid.innerHTML = projects.map(p => `
    <article class="project-card${p.featured ? ' project-card--featured' : ''}">
      <div
        class="project-card__image"
        style="background: linear-gradient(135deg, ${p.bgFrom} 0%, ${p.bgTo} 100%)"
      >
        <span class="project-card__label-big">${p.label}</span>
        <span class="project-card__lang">${p.tech.slice(0, 2).join(' / ')}</span>
      </div>

      <div class="project-card__body">
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${getLocalized(p.description, lang)}</p>

        <div class="project-card__details">
          ${renderDetail(copy.problem, p.problem, lang)}
          ${renderDetail(copy.role, p.role, lang)}
          <div class="project-card__detail project-card__detail--tech">
            <span class="project-card__detail-label">${copy.tech}</span>
            <div class="project-card__tech-list">
              ${p.tech.map(item => `<span class="project-card__tech">${item}</span>`).join('')}
            </div>
          </div>
          ${renderDetail(copy.result, p.result, lang)}
        </div>
      </div>

      <div class="project-card__footer">
        ${p.link ? `<a
          href="${p.link}"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__link"
          aria-label="${copy.aria.replace('{title}', p.title)}"
        >
          ${copy.github}
          <span class="project-card__link-arrow">${arrowSvg}</span>
        </a>` : `<span class="project-card__note">${copy.noPublicRepo}</span>`}
        ${p.liveUrl ? `
        <a
          href="${p.liveUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__link project-card__link--live"
          aria-label="${copy.ariaLive.replace('{title}', p.title)}"
        >
          ${copy.live}
        </a>` : ''}
      </div>
    </article>
  `).join('')
}

function getLocalized(value, lang) {
  return value?.[lang] || value?.es || ''
}

function renderDetail(label, value, lang) {
  const content = getLocalized(value, lang)
  if (!content) return ''

  return `
    <div class="project-card__detail">
      <span class="project-card__detail-label">${label}</span>
      <p>${content}</p>
    </div>
  `
}

export function initSocials() {
  const contactSocials = document.getElementById('contact-socials')
  const footerSocials = document.getElementById('footer-socials')

  const socialLinks = socials.map(s => {
    const attrs = s.url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"'

    return `
    <a
      href="${s.url}"
      class="social-link"
      aria-label="${s.label}"
      ${attrs}
    >
      ${s.icon}
      <span>${s.label}</span>
    </a>
  `
  }).join('')

  if (contactSocials) contactSocials.innerHTML = socialLinks
  if (footerSocials) {
    footerSocials.innerHTML = socials.map(s => {
      const attrs = s.url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"'

      return `
      <a
        href="${s.url}"
        class="nav-link"
        aria-label="${s.label}"
        ${attrs}
      >${s.footerLabel || s.label}</a>
    `
    }).join('')
  }
}
