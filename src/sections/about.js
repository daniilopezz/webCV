import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Typewriter effect for RPG stat values
function typeText(el, text, delay = 0) {
  el.textContent = ''
  const chars = text.split('')
  let i = 0

  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent += chars[i]
      i++
      if (i >= chars.length) clearInterval(interval)
    }, 38)
  }, delay)
}

export function initRpgPanel() {
  const infoPanel   = document.getElementById('rpg-info')
  const skillsPanel = document.getElementById('rpg-skills')
  if (!infoPanel || !skillsPanel) return

  let triggered = false

  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 72%',
    once: true,
    onEnter: () => {
      if (triggered) return
      triggered = true
      animatePanels()
    },
  })

  function animatePanels() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Panels slide in
    tl.fromTo(infoPanel,
      { x: -60, opacity: 0 },
      { x: 0,   opacity: 1, duration: 0.75 }
    )
    tl.fromTo(skillsPanel,
      { x: 60, opacity: 0 },
      { x: 0,  opacity: 1, duration: 0.75 },
      0.15
    )

    // Stat rows type in one by one
    const rows = infoPanel.querySelectorAll('.rpg__val')
    rows.forEach((el, i) => {
      const text = el.dataset.type || ''
      tl.call(() => typeText(el, text), [], 0.6 + i * 0.35)
    })

    // Skill bars fill after panels appear
    const skills = skillsPanel.querySelectorAll('.rpg__skill')
    skills.forEach((skill, i) => {
      const value   = parseInt(skill.dataset.value, 10)
      const fill    = skill.querySelector('.rpg__bar-fill')
      const numEl   = skill.querySelector('.rpg__skill-num')

      tl.fromTo(fill,
        { width: '0%' },
        {
          width: `${value}%`,
          duration: 0.7,
          ease: 'power2.out',
          onUpdate() {
            if (numEl) {
              const current = Math.round(value * this.progress())
              numEl.textContent = current
            }
          },
        },
        0.8 + i * 0.12
      )
    })

    // Quote fade in last
    tl.fromTo('.rpg__quote',
      { y: 16, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6 },
      1.6
    )
  }
}
