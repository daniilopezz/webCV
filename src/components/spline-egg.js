// Easter egg: clic 3 veces en el logo DL.

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

    overlay = document.createElement('div')
    overlay.className = 'spline-egg-overlay'
    overlay.innerHTML = `
      <div class="spline-egg-panel" role="dialog" aria-modal="true" aria-label="DL Lab desbloqueado">
        <div class="spline-egg-header">
          <span class="spline-egg-title">// DL LAB UNLOCKED</span>
          <button class="spline-egg-close" aria-label="Cerrar">✕</button>
        </div>
        <div class="spline-egg-stage" aria-hidden="true">
          <div class="spline-egg-grid"></div>
          <div class="spline-egg-orb">
            <span class="spline-egg-ring spline-egg-ring--outer"></span>
            <span class="spline-egg-ring spline-egg-ring--inner"></span>
            <span class="spline-egg-logo">DL</span>
          </div>
          <div class="spline-egg-terminal">
            <span>STATUS: ONLINE</span>
            <span>STACK: WEB / PYTHON / DATA</span>
            <span>LOCATION: CATANIA</span>
          </div>
        </div>
        <p class="spline-egg-hint">Easter egg desbloqueado - clic fuera para cerrar</p>
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
