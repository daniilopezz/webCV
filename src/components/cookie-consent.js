import gsap from 'gsap'
import { siteCopy } from '../data/content.js'

const CONSENT_KEY = 'cookieConsent'
const PREFERENCES_KEY = 'cookiePreferences'
const LANGUAGE_KEY = 'webcv-language'

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: false,
  marketing: false,
}

const ALL_PREFERENCES = {
  necessary: true,
  analytics: true,
  marketing: true,
}

let analyticsInjected = false

function getCookieCopy(lang) {
  let currentLang = lang

  if (!currentLang && canUseStorage()) {
    currentLang = localStorage.getItem(LANGUAGE_KEY)
  }

  return siteCopy[currentLang]?.cookieConsent || siteCopy.es.cookieConsent
}

function canUseStorage() {
  try {
    const testKey = '__webcv_storage_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function readPreferences() {
  if (!canUseStorage()) return null

  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return null
  }
}

function hasStoredConsent() {
  if (!canUseStorage()) return false
  return Boolean(localStorage.getItem(CONSENT_KEY) && readPreferences())
}

function saveConsent(type, preferences) {
  if (!canUseStorage()) return

  const normalized = {
    necessary: true,
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
  }

  localStorage.setItem(CONSENT_KEY, type)
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(normalized))
}

async function enableAnalytics() {
  if (analyticsInjected || window.__webCvAnalyticsInjected) return

  analyticsInjected = true
  window.__webCvAnalyticsInjected = true

  try {
    const { inject } = await import('@vercel/analytics')
    inject()
  } catch (error) {
    console.warn('Vercel Analytics could not be initialized:', error)
  }
}

function applyPreferences(preferences) {
  const normalized = {
    necessary: true,
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
  }

  if (normalized.analytics) {
    enableAnalytics()
  }

  window.dispatchEvent(new CustomEvent('cookie-preferences-updated', {
    detail: normalized,
  }))
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function animateIn(element, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(element, { autoAlpha: 1, y: 0, scale: 1 })
    return
  }

  gsap.fromTo(
    element,
    { autoAlpha: 0, y: 36, scale: 0.985 },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.72,
      ease: 'power3.out',
      overwrite: 'auto',
      ...vars,
    }
  )
}

function animateOut(element, onComplete) {
  if (prefersReducedMotion()) {
    gsap.set(element, { autoAlpha: 0 })
    onComplete?.()
    return
  }

  gsap.to(element, {
    autoAlpha: 0,
    y: 18,
    scale: 0.985,
    duration: 0.34,
    ease: 'power2.inOut',
    overwrite: 'auto',
    onComplete,
  })
}

function getFocusable(container) {
  return Array.from(container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter(el => !el.disabled && el.offsetParent !== null)
}

function buildMarkup(copy = getCookieCopy()) {
  const root = document.createElement('div')
  root.className = 'cookie-consent'
  root.innerHTML = `
    <section class="cookie-consent__banner" role="region" aria-label="${copy.bannerLabel}">
      <div class="cookie-consent__mark" aria-hidden="true">DL</div>
      <div class="cookie-consent__body">
        <p class="cookie-consent__eyebrow" data-cookie-copy="privacy">${copy.privacy}</p>
        <h2 class="cookie-consent__title" data-cookie-copy="title">${copy.title}</h2>
        <p class="cookie-consent__text">
          <span data-cookie-copy="text">${copy.text}</span>
        </p>
      </div>
      <div class="cookie-consent__actions" aria-label="${copy.actionsLabel}">
        <button class="cookie-consent__btn cookie-consent__btn--primary" type="button" data-cookie-action="accept">
          <span data-cookie-copy="accept">${copy.accept}</span>
        </button>
        <button class="cookie-consent__btn cookie-consent__btn--ghost" type="button" data-cookie-action="reject">
          <span data-cookie-copy="reject">${copy.reject}</span>
        </button>
        <button class="cookie-consent__btn cookie-consent__btn--text" type="button" data-cookie-action="settings">
          <span data-cookie-copy="settings">${copy.settings}</span>
        </button>
      </div>
    </section>

    <div class="cookie-modal" aria-hidden="true">
      <div class="cookie-modal__overlay" data-cookie-action="close-settings"></div>
      <section
        class="cookie-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
        aria-describedby="cookie-modal-description"
      >
        <button class="cookie-modal__close" type="button" data-cookie-action="close-settings" aria-label="${copy.close}">
          <span aria-hidden="true">×</span>
        </button>

        <p class="cookie-consent__eyebrow" data-cookie-copy="preferences">${copy.preferences}</p>
        <h2 class="cookie-modal__title" id="cookie-modal-title" tabindex="-1" data-cookie-copy="modalTitle">${copy.modalTitle}</h2>
        <p class="cookie-modal__description" id="cookie-modal-description">
          <span data-cookie-copy="modalDescription">${copy.modalDescription}</span>
        </p>

        <div class="cookie-modal__options">
          <article class="cookie-option">
            <div>
              <h3 class="cookie-option__title" data-cookie-copy="necessaryTitle">${copy.necessaryTitle}</h3>
              <p class="cookie-option__text" data-cookie-copy="necessaryText">${copy.necessaryText}</p>
            </div>
            <span class="cookie-option__status" aria-label="${copy.necessaryStatusAria}" data-cookie-copy="necessaryStatus">${copy.necessaryStatus}</span>
          </article>

          <article class="cookie-option">
            <div>
              <h3 class="cookie-option__title" data-cookie-copy="analyticsTitle">${copy.analyticsTitle}</h3>
              <p class="cookie-option__text" data-cookie-copy="analyticsText">${copy.analyticsText}</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" name="analytics">
              <span class="cookie-toggle__track" aria-hidden="true">
                <span class="cookie-toggle__thumb"></span>
              </span>
              <span class="sr-only" data-cookie-copy="analyticsSr">${copy.analyticsSr}</span>
            </label>
          </article>

          <article class="cookie-option">
            <div>
              <h3 class="cookie-option__title" data-cookie-copy="marketingTitle">${copy.marketingTitle}</h3>
              <p class="cookie-option__text" data-cookie-copy="marketingText">${copy.marketingText}</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" name="marketing">
              <span class="cookie-toggle__track" aria-hidden="true">
                <span class="cookie-toggle__thumb"></span>
              </span>
              <span class="sr-only" data-cookie-copy="marketingSr">${copy.marketingSr}</span>
            </label>
          </article>
        </div>

        <div class="cookie-modal__actions">
          <button class="cookie-consent__btn cookie-consent__btn--ghost" type="button" data-cookie-action="save-settings">
            <span data-cookie-copy="save">${copy.save}</span>
          </button>
          <button class="cookie-consent__btn cookie-consent__btn--primary" type="button" data-cookie-action="accept-settings">
            <span data-cookie-copy="accept">${copy.accept}</span>
          </button>
        </div>
      </section>
    </div>
  `

  return root
}

function updateCookieCopy(root, copy) {
  root.querySelector('.cookie-consent__banner')?.setAttribute('aria-label', copy.bannerLabel)
  root.querySelector('.cookie-consent__actions')?.setAttribute('aria-label', copy.actionsLabel)
  root.querySelector('.cookie-modal__close')?.setAttribute('aria-label', copy.close)
  root.querySelector('.cookie-option__status')?.setAttribute('aria-label', copy.necessaryStatusAria)

  root.querySelectorAll('[data-cookie-copy]').forEach(element => {
    const value = copy[element.dataset.cookieCopy]
    if (value) element.textContent = value
  })
}

export function initCookieConsent() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const savedPreferences = readPreferences()
  if (hasStoredConsent() && savedPreferences) {
    applyPreferences(savedPreferences)
    return
  }

  const root = buildMarkup()
  document.body.appendChild(root)

  const banner = root.querySelector('.cookie-consent__banner')
  const modal = root.querySelector('.cookie-modal')
  const modalPanel = root.querySelector('.cookie-modal__panel')
  const modalTitle = root.querySelector('#cookie-modal-title')
  const analyticsInput = root.querySelector('input[name="analytics"]')
  const marketingInput = root.querySelector('input[name="marketing"]')
  let previousFocus = null

  const onLanguageChange = event => {
    const copy = event.detail?.copy?.cookieConsent || getCookieCopy(event.detail?.lang)
    updateCookieCopy(root, copy)
  }

  window.addEventListener('webcv:language-change', onLanguageChange)

  gsap.set(banner, { autoAlpha: 0, y: 36, scale: 0.985 })
  gsap.set(modal, { autoAlpha: 0, display: 'none' })
  gsap.set(modalPanel, { y: 32, scale: 0.985 })

  requestAnimationFrame(() => animateIn(banner))

  const closeRoot = () => {
    animateOut(banner, () => {
      window.removeEventListener('webcv:language-change', onLanguageChange)
      root.remove()
    })
  }

  const completeConsent = (type, preferences) => {
    saveConsent(type, preferences)
    applyPreferences(preferences)
    closeSettings(false)
    closeRoot()
  }

  const openSettings = () => {
    previousFocus = document.activeElement
    const current = readPreferences() || DEFAULT_PREFERENCES
    analyticsInput.checked = Boolean(current.analytics)
    marketingInput.checked = Boolean(current.marketing)

    modal.setAttribute('aria-hidden', 'false')
    gsap.set(modal, { display: 'grid' })

    if (prefersReducedMotion()) {
      gsap.set([modal, modalPanel], { autoAlpha: 1, y: 0, scale: 1 })
    } else {
      gsap.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26, ease: 'power2.out' })
      gsap.fromTo(
        modalPanel,
        { autoAlpha: 0, y: 32, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, ease: 'power3.out' }
      )
    }

    modalTitle.focus({ preventScroll: true })
  }

  function closeSettings(restoreFocus = true) {
    if (modal.getAttribute('aria-hidden') === 'true') return

    const finish = () => {
      modal.setAttribute('aria-hidden', 'true')
      gsap.set(modal, { display: 'none' })
      if (restoreFocus && previousFocus?.focus) {
        previousFocus.focus({ preventScroll: true })
      }
    }

    if (prefersReducedMotion()) {
      gsap.set(modal, { autoAlpha: 0 })
      finish()
      return
    }

    gsap.to(modalPanel, {
      autoAlpha: 0,
      y: 20,
      scale: 0.985,
      duration: 0.24,
      ease: 'power2.inOut',
    })
    gsap.to(modal, {
      autoAlpha: 0,
      duration: 0.28,
      ease: 'power2.inOut',
      onComplete: finish,
    })
  }

  const getSelectedPreferences = () => ({
    necessary: true,
    analytics: analyticsInput.checked,
    marketing: marketingInput.checked,
  })

  root.addEventListener('click', event => {
    const action = event.target.closest('[data-cookie-action]')?.dataset.cookieAction
    if (!action) return

    if (action === 'accept') completeConsent('accepted_all', ALL_PREFERENCES)
    if (action === 'reject') completeConsent('rejected', DEFAULT_PREFERENCES)
    if (action === 'settings') openSettings()
    if (action === 'close-settings') closeSettings()
    if (action === 'save-settings') completeConsent('custom', getSelectedPreferences())
    if (action === 'accept-settings') completeConsent('accepted_all', ALL_PREFERENCES)
  })

  root.addEventListener('keydown', event => {
    if (modal.getAttribute('aria-hidden') === 'true') return

    if (event.key === 'Escape') {
      event.preventDefault()
      closeSettings()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = getFocusable(modalPanel)
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
}
