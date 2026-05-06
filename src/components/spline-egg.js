// Easter egg: clic 3 veces en el logo DL → aparece la escena Spline
//
// Para activarlo necesitas exportar la escena desde Spline:
//   1. Abre la escena en tu cuenta de Spline
//   2. Export → Viewer → copia la URL (ej. https://my.spline.design/XXXXX/)
//   3. Pégala en VIEWER_URL
//
const VIEWER_URL = 'https://my.spline.design/98ea05ac-caa4-4984-a855-9db974575952/'

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
      <div class="spline-egg-panel">
        <div class="spline-egg-header">
          <span class="spline-egg-title">// mi workspace 3D</span>
          <button class="spline-egg-close" aria-label="Cerrar">✕</button>
        </div>
        <iframe
          class="spline-egg-iframe"
          src="${VIEWER_URL}"
          frameborder="0"
          allowfullscreen
          title="Interactive Workplace"
        ></iframe>
        <p class="spline-egg-hint">Easter egg desbloqueado — clic fuera para cerrar</p>
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
