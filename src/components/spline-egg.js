import { siteCopy } from '../data/content.js'

const LANGUAGE_KEY = 'webcv-language'

function getEggCopy() {
  try {
    const lang = localStorage.getItem(LANGUAGE_KEY)
    return siteCopy[lang]?.easterEgg || siteCopy.es.easterEgg
  } catch {
    return siteCopy.es.easterEgg
  }
}

export function initSplineEasterEgg() {
  const logo = document.querySelector('.header__logo')
  if (!logo) return

  let clicks = 0
  let timer  = null
  let overlay = null

  logo.addEventListener('click', (e) => {
    e.preventDefault()
    clicks++
    clearTimeout(timer)
    timer = setTimeout(() => { clicks = 0 }, 700)

    if (clicks >= 3) {
      clicks = 0
      clearTimeout(timer)
      openEgg()
    }
  })

  function openEgg() {
    if (overlay) return
    const copy = getEggCopy()

    overlay = document.createElement('div')
    overlay.className = 'spline-egg-overlay'
    overlay.innerHTML = `
      <div class="spline-egg-panel" role="dialog" aria-modal="true" aria-label="${copy.dialogLabel}">
        <div class="spline-egg-header">
          <span class="spline-egg-title">${copy.title}</span>
          <button class="spline-egg-close" aria-label="${copy.close}">✕</button>
        </div>
        <div class="spline-egg-stage" aria-hidden="true">
          <div class="spline-egg-grid"></div>
          <div class="spline-egg-orb">
            <span class="spline-egg-ring spline-egg-ring--outer"></span>
            <span class="spline-egg-ring spline-egg-ring--inner"></span>
            <span class="spline-egg-logo">DL</span>
          </div>
          <div class="spline-egg-terminal">
            <span>${copy.status}</span>
            <span>${copy.stack}</span>
            <span>${copy.location}</span>
          </div>
        </div>
        <p class="spline-egg-hint">${copy.hint}</p>
      </div>
    `
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add('spline-egg-overlay--visible'))

    overlay.querySelector('.spline-egg-close').addEventListener('click', closeEgg)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeEgg() })
    document.addEventListener('keydown', onKey)
  }

  function closeEgg() {
    if (!overlay) return
    overlay.classList.remove('spline-egg-overlay--visible')
    setTimeout(() => { overlay?.remove(); overlay = null }, 350)
    document.removeEventListener('keydown', onKey)
  }

  function onKey(e) { if (e.key === 'Escape') closeEgg() }
}
