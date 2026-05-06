import { Application } from '@splinetool/runtime'

let heroApp = null
let contactApp = null

export async function initHeroSpline(canvas, sceneUrl) {
  if (!canvas || !sceneUrl) return

  try {
    heroApp = new Application(canvas)
    await heroApp.load(sceneUrl)
  } catch (err) {
    console.warn('Spline hero scene failed to load:', err)
  }
}

export async function initContactSpline(canvas, sceneUrl) {
  if (!canvas || !sceneUrl) return

  try {
    contactApp = new Application(canvas)
    await contactApp.load(sceneUrl)
  } catch (err) {
    console.warn('Spline contact scene failed to load:', err)
  }
}

export function destroySplineScenes() {
  heroApp?.dispose?.()
  contactApp?.dispose?.()
}
