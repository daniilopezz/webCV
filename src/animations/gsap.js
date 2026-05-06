import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo('.hero-tag',
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7 },
    0.2
  )

  tl.fromTo('.hero__title-line > span',
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.85, stagger: 0.1 },
    0.45
  )

  tl.fromTo('.hero__description',
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75 },
    1.0
  )

  tl.fromTo('.hero__actions',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7 },
    1.2
  )

  tl.fromTo('.hero__scroll-indicator',
    { opacity: 0, y: 8 },
    { opacity: 0.5, y: 0, duration: 0.8 },
    1.6
  )
}

export function initScrollAnimations() {
  /* ── About ── */
  gsap.fromTo('.about-header',
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '.about', start: 'top 82%', once: true },
    }
  )

  gsap.fromTo('.about-bio',
    { x: -36, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.about__grid', start: 'top 80%', once: true },
    }
  )

  gsap.fromTo('.about-visual',
    { x: 36, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.about__grid', start: 'top 80%', once: true },
    }
  )

  gsap.fromTo('.skill-tag',
    { y: 18, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out',
      scrollTrigger: { trigger: '.about__skills', start: 'top 85%', once: true },
    }
  )

  /* ── Projects ── */
  gsap.fromTo('.projects-header',
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '.projects', start: 'top 82%', once: true },
    }
  )

  gsap.fromTo('.project-card',
    { y: 56, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.projects__grid', start: 'top 82%', once: true },
    }
  )

  /* ── Contact ── */
  const contactTl = gsap.timeline({
    scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true },
    defaults: { ease: 'power3.out' },
  })

  contactTl
    .fromTo('.contact-tag',   { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
    .fromTo('.contact__title',{ y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, 0.15)
    .fromTo('.contact__description', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 0.35)
    .fromTo('.contact-cta',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6  }, 0.5)
    .fromTo('.contact__socials', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.65)
}
