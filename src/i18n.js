import gsap from 'gsap'
import { initProjects } from './sections/projects.js'
import { languages, siteCopy } from './data/content.js'

const STORAGE_KEY = 'webcv-language'
const defaultLang = 'es'

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

function renderLanguageState(lang) {
  document.querySelectorAll('[data-lang]').forEach(button => {
    const active = button.dataset.lang === lang
    button.classList.toggle('active', active)
    button.setAttribute('aria-pressed', String(active))
  })
}

function animateLanguageChange() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  gsap.fromTo(
    [
      '.hero__text',
      '.about-profile',
      '.credential-card',
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
  initProjects(nextLang)
  renderLanguageState(nextLang)

  localStorage.setItem(STORAGE_KEY, nextLang)
  window.refreshRpgPanel?.()

  if (options.animate) animateLanguageChange()
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
