const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function initCvDownload() {
  const modal = document.querySelector('[data-cv-modal]')
  const triggers = document.querySelectorAll('[data-cv-trigger]')
  if (!modal || !triggers.length) return

  const closeControls = modal.querySelectorAll('[data-cv-close]')
  const downloadLinks = modal.querySelectorAll('[data-cv-download]')
  let lastFocused = null

  function setTriggersExpanded(isExpanded) {
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', String(isExpanded))
    })
  }

  function getFocusableElements() {
    return [...modal.querySelectorAll(FOCUSABLE_SELECTOR)]
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
  }

  function openModal() {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    setTriggersExpanded(true)
    document.body.classList.add('cv-modal-open')
    document.addEventListener('keydown', handleKeydown)

    requestAnimationFrame(() => {
      const firstOption = modal.querySelector('[data-cv-download]')
      firstOption?.focus()
    })
  }

  function closeModal() {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    setTriggersExpanded(false)
    document.body.classList.remove('cv-modal-open')
    document.removeEventListener('keydown', handleKeydown)
    lastFocused?.focus()
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = getFocusableElements()
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', openModal)
  })

  closeControls.forEach(control => {
    control.addEventListener('click', closeModal)
  })

  downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeModal, 160)
    })
  })
}
