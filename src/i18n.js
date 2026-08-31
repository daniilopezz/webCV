import { initProjects } from './sections/projects.js'
import { certifications, languages, siteCopy } from './data/content.js'

const STORAGE_KEY = 'webcv-language'
const defaultLang = 'es'
const claudeAcademyBadgeUrl = 'https://academy.claude.com/badges/'
let gsapPromise = null

function getGsap() {
  gsapPromise ||= import('gsap').then(module => module.default)
  return gsapPromise
}

function getStoredLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return languages.some(lang => lang.code === saved) ? saved : defaultLang
}

function getCopy(lang) {
  return siteCopy[lang] || siteCopy[defaultLang]
}

function updatePlainText(copy) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = readPath(copy, el.dataset.i18n)
    if (value) el.textContent = value
  })

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const value = readPath(copy, el.dataset.i18nHtml)
    if (value) el.innerHTML = value
  })

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const value = readPath(copy, el.dataset.i18nAriaLabel)
    if (value) el.setAttribute('aria-label', value)
  })
}

function updateRpgData(copy) {
  document.querySelectorAll('[data-i18n-type]').forEach(el => {
    const value = readPath(copy, el.dataset.i18nType)
    if (value) {
      el.dataset.type = value
      if (!window.refreshRpgPanel) el.textContent = value
    }
  })
}

function renderAboutDetails(copy) {
  const about = copy.about
  const intro = document.getElementById('about-intro')
  const traits = document.getElementById('about-traits')
  const education = document.getElementById('education-list')
  const experience = document.getElementById('experience-list')
  const languagesList = document.getElementById('languages-list')

  if (intro) {
    intro.innerHTML = about.intro.map(paragraph => `
      <p class="about-profile__text">${paragraph}</p>
    `).join('')
  }

  if (traits) {
    traits.innerHTML = about.traits.map(trait => `
      <span class="skill-tag">${trait}</span>
    `).join('')
  }

  if (education) {
    education.innerHTML = about.education.map(item => `
      <article class="credential-item">
        <span class="credential-item__meta">${item.meta}</span>
        <h4 class="credential-item__title">${item.title}</h4>
        <p class="credential-item__detail">${item.detail}</p>
      </article>
    `).join('')
  }

  if (experience) {
    experience.innerHTML = about.experience.map(item => `
      <article class="credential-item">
        <span class="credential-item__meta">${item.date}</span>
        <h4 class="credential-item__title">${item.title}</h4>
        <p class="credential-item__company">${item.company}</p>
        <p class="credential-item__detail">${item.detail}</p>
      </article>
    `).join('')
  }

  if (languagesList) {
    languagesList.innerHTML = about.languages.map(item => `
      <div class="language-meter" style="--language-level: ${item.value}%">
        <div class="language-meter__top">
          <span class="language-meter__name">${item.name}</span>
          <span class="language-meter__level">${item.level}</span>
        </div>
        <div class="language-meter__track" aria-hidden="true">
          <span class="language-meter__fill"></span>
        </div>
      </div>
    `).join('')
  }
}

function renderCertifications(copy, lang) {
  const certificateCopy = copy.certifications
  const grid = document.getElementById('certifications-grid')

  if (!grid || !certificateCopy) return

  grid.setAttribute('aria-label', certificateCopy.listLabel)
  grid.innerHTML = certifications.map(item => {
    const issued = item.issued[lang] || item.issued.es
    const track = item.track[lang] || item.track.es
    const credentialUrl = item.url || `${claudeAcademyBadgeUrl}${item.credentialId}`

    return `
      <article class="cert-card">
        <div class="cert-card__top">
          <span class="cert-card__mark" aria-hidden="true">A</span>
          <div class="cert-card__meta">
            <span>${certificateCopy.issuerLabel}: ${item.issuer}</span>
            <span>${certificateCopy.issuedLabel}: ${issued}</span>
          </div>
        </div>

        <div class="cert-card__body">
          <span class="cert-card__track">${track}</span>
          <h3 class="cert-card__title">${item.title}</h3>
        </div>

        <div class="cert-card__footer">
          <p class="cert-card__id">
            <span>${certificateCopy.credentialLabel}</span>
            <code>${item.credentialId}</code>
          </p>
          <a class="cert-card__link" href="${credentialUrl}" target="_blank" rel="noopener noreferrer" aria-label="${certificateCopy.action}: ${item.title}">
            <span>${certificateCopy.action}</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17 17 7m0 0H9m8 0v8" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </article>
    `
  }).join('')
}

function renderLanguageState(lang) {
  document.querySelectorAll('[data-lang]').forEach(button => {
    const active = button.dataset.lang === lang
    button.classList.toggle('active', active)
    button.setAttribute('aria-pressed', String(active))
  })
}

async function animateLanguageChange() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const gsap = await getGsap()

  gsap.fromTo(
    [
      '.hero__text',
      '.about-profile',
      '.credential-card',
      '.certifications-header',
      '.cert-card',
      '.project-card',
      '.contact__content',
    ],
    { autoAlpha: 0.82, y: 10 },
    { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.03, ease: 'power3.out', overwrite: 'auto' }
  )
}

function readPath(source, path) {
  return path.split('.').reduce((value, key) => value?.[key], source)
}

export function applyLanguage(lang, options = {}) {
  const nextLang = languages.some(item => item.code === lang) ? lang : defaultLang
  const copy = getCopy(nextLang)

  document.documentElement.lang = nextLang
  document.title = copy.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.meta.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.meta.description)

  updatePlainText(copy)
  updateRpgData(copy)
  renderAboutDetails(copy)
  renderCertifications(copy, nextLang)
  initProjects(nextLang)
  renderLanguageState(nextLang)

  localStorage.setItem(STORAGE_KEY, nextLang)
  window.refreshRpgPanel?.()

  if (options.animate) {
    animateLanguageChange().catch(() => {})
  }
}

export function initI18n() {
  const initialLang = getStoredLanguage()

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.lang, { animate: true })
    })
  })

  applyLanguage(initialLang, { animate: false })
}
