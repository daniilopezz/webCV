import './style.css'

import { injectSpeedInsights } from '@vercel/speed-insights'
import { initHeader }          from './components/header.js'
import { initCookieConsent }   from './components/cookie-consent.js'
import { initSplineEasterEgg } from './components/spline-egg.js'
import { initSocials }         from './sections/projects.js'
import { initRpgPanel }        from './sections/about.js'
import { initI18n }            from './i18n.js'
import { initLenis }           from './animations/lenis.js'
import { initHeroAnimations, initScrollAnimations } from './animations/gsap.js'
import { HeroCharacter }       from './three/hero-character.js'
import { ContactScene }        from './three/contact-scene.js'

document.addEventListener('DOMContentLoaded', () => {
  injectSpeedInsights()

  // UI
  initHeader()
  initCookieConsent()
  initSplineEasterEgg()
  initSocials()
  initI18n()

  // RPG about panel
  initRpgPanel()

  // Smooth scroll + GSAP
  initLenis()
  initHeroAnimations()
  initScrollAnimations()

  // Three.js character — responsive across desktop, tablet, and phone
  const heroCanvas = document.getElementById('hero-canvas')
  if (heroCanvas) {
    new HeroCharacter(heroCanvas)
  }

  // Contact globe — all devices (lighter scene)
  const contactCanvas = document.getElementById('contact-canvas')
  if (contactCanvas) {
    new ContactScene(contactCanvas)
  }
})
