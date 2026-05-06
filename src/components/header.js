export function initHeader() {
  const header = document.getElementById('header')
  const burger = document.querySelector('.header__burger')
  const mobileNav = document.getElementById('mobile-nav')

  // Scroll: add frosted-glass class
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Burger toggle
  burger?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open')
    burger.classList.toggle('active', !isOpen)
    mobileNav.classList.toggle('open', !isOpen)
    burger.setAttribute('aria-expanded', String(!isOpen))
    mobileNav.setAttribute('aria-hidden', String(isOpen))
  })

  // Close mobile nav when a link is clicked
  mobileNav?.querySelectorAll('.mobile-nav__link, .mobile-nav__cta').forEach(el => {
    el.addEventListener('click', () => {
      burger.classList.remove('active')
      mobileNav.classList.remove('open')
      burger.setAttribute('aria-expanded', 'false')
      mobileNav.setAttribute('aria-hidden', 'true')
    })
  })

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.header__nav .nav-link')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            )
          })
        }
      })
    },
    { rootMargin: '-40% 0px -40% 0px' }
  )

  sections.forEach(section => observer.observe(section))
}
