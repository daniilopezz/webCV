import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  })

  // Sync Lenis with GSAP ticker for ScrollTrigger compatibility
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add(time => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // Anchor links handled by Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href')
      if (href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -80, duration: 1.2 })
    })
  })

  return lenis
}
