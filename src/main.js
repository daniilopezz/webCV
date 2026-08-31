import './style.css'

import { injectSpeedInsights } from '@vercel/speed-insights'
import { initHeader }          from './components/header.js'
import { initCvDownload }      from './components/cv-download.js'
import { initSplineEasterEgg } from './components/spline-egg.js'
import { initSocials }         from './sections/projects.js'
import { initI18n }            from './i18n.js'

let hasBooted = false

function revealHeroFallback() {
  document.querySelectorAll([
    '.hero-tag',
    '.hero__title-line > span',
    '.hero__description',
    '.hero__actions',
    '.hero__canvas',
  ].join(',')).forEach(element => {
    element.style.opacity = '1'
    element.style.transform = 'none'
  })
}

async function initMotion() {
  const [
    { initLenis },
    { initHeroAnimations, initScrollAnimations },
  ] = await Promise.all([
    import('./animations/lenis.js'),
    import('./animations/gsap.js'),
  ])

  initLenis()
  initHeroAnimations()
  initScrollAnimations()
}

async function initCookieLayer() {
  const { initCookieConsent } = await import('./components/cookie-consent.js')
  initCookieConsent()
}

async function initAboutPanel() {
  const { initRpgPanel } = await import('./sections/about.js')
  initRpgPanel()
}

function canUseWebGl() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

async function initScenes() {
  if (!canUseWebGl()) return

  const [
    { HeroCharacter },
    { ContactScene },
  ] = await Promise.all([
    import('./three/hero-character.js'),
    import('./three/contact-scene.js'),
  ])

  const heroCanvas = document.getElementById('hero-canvas')
  if (heroCanvas) {
    new HeroCharacter(heroCanvas)
  }

  const contactCanvas = document.getElementById('contact-canvas')
  if (contactCanvas) {
    new ContactScene(contactCanvas)
  }
}

function bootApp() {
  if (hasBooted) return
  hasBooted = true

  injectSpeedInsights()

  // UI
  initHeader()
  initCvDownload()
  initSplineEasterEgg()
  initSocials()
  initI18n()

  initCookieLayer().catch(() => {})
  initAboutPanel().catch(() => {})
  initMotion().catch(revealHeroFallback)
  initScenes().catch(() => {})
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp, { once: true })
} else {
  bootApp()
}
