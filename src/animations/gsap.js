import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initHeroAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    gsap.set([
      '.hero-tag',
      '.hero__title-line > span',
      '.hero__description',
      '.hero__actions',
      '.hero__canvas',
    ], { opacity: 1, y: 0, scale: 1, clearProps: 'transform' })
    return
  }

  const mm = gsap.matchMedia()

  mm.add(
    {
      isPhone: '(max-width: 767px)',
      isTablet: '(min-width: 768px) and (max-width: 1023px)',
      isDesktop: '(min-width: 1024px)',
    },
    context => {
      const { isPhone, isTablet } = context.conditions
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

      tl.fromTo('.hero__canvas',
        {
          opacity: 0,
          scale: isPhone ? 1.08 : isTablet ? 1.04 : 1.02,
        },
        {
          opacity: 1,
          scale: 1,
          duration: isPhone ? 1.0 : 1.2,
        },
        isPhone ? 0.9 : 0.55
      )

    }
  )
}

export function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ── Projects ── */
  if (document.querySelector('.projects-header')) {
    gsap.fromTo('.projects-header',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.projects', start: 'top 82%', once: true },
      }
    )
  }

  const projectCards = gsap.utils.toArray('.project-card')
  if (projectCards.length) {
    gsap.set(projectCards, { y: 48, opacity: 0 })
    ScrollTrigger.batch(projectCards, {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: true,
      }),
    })
  }

  /* ── Contact ── */
  if (!document.querySelector('.contact')) return

  if (!prefersReduced && document.querySelector('.contact__canvas')) {
    gsap.matchMedia().add(
      {
        isPhone: '(max-width: 767px)',
        isDesktop: '(min-width: 768px)',
      },
      context => {
        const { isPhone } = context.conditions

        gsap.fromTo('.contact__canvas',
          {
            '--contact-orb-scale': isPhone ? 0.92 : 0.96,
            autoAlpha: isPhone ? 0.24 : 0.48,
          },
          {
            '--contact-orb-scale': isPhone ? 1.04 : 1.08,
            autoAlpha: isPhone ? 0.38 : 0.72,
            ease: 'none',
            scrollTrigger: {
              trigger: '.contact',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        )
      }
    )
  }

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
