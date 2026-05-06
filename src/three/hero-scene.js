import * as THREE from 'three'

const PARTICLE_COUNT = 90
const HUB_COUNT = 8
const CONNECT_THRESHOLD = 42
const MAX_LINES = 250

export class HeroScene {
  constructor(canvas) {
    this.canvas = canvas
    this.mouse = { x: 0, y: 0 }
    this.raf = null
    this.particles = []

    this.init()
    this.listen()
    this.tick()
  }

  init() {
    const w = this.canvas.offsetWidth
    const h = this.canvas.offsetHeight

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(w, h)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000)
    this.camera.position.set(0, 0, 110)

    this.buildParticles()
    this.buildLines()
  }

  buildParticles() {
    const total = PARTICLE_COUNT + HUB_COUNT
    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const sizes = new Float32Array(total)

    const blueColor = new THREE.Color('#34bfff')
    const orangeColor = new THREE.Color('#ff8400')

    for (let i = 0; i < total; i++) {
      const isHub = i >= PARTICLE_COUNT
      const spread = 90

      const x = (Math.random() - 0.5) * spread + (isHub ? 15 : 0)
      const y = (Math.random() - 0.5) * spread * 0.8
      const z = (Math.random() - 0.5) * 50

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const c = isHub ? orangeColor : blueColor
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = isHub ? 3.5 : 1.8 + Math.random() * 1.2

      this.particles.push({
        ox: x, oy: y, oz: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.12,
        amp: 4 + Math.random() * 6,
        isHub,
      })
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      size: 3,
      sizeAttenuation: false,
    })

    this.points = new THREE.Points(geo, mat)
    this.scene.add(this.points)
    this.posAttr = geo.getAttribute('position')
  }

  buildLines() {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_LINES * 6)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setDrawRange(0, 0)

    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#34bfff'),
      transparent: true,
      opacity: 0.13,
    })

    this.lineSegs = new THREE.LineSegments(geo, mat)
    this.scene.add(this.lineSegs)
    this.linesPosAttr = geo.getAttribute('position')
  }

  updateLines() {
    const arr = this.linesPosAttr.array
    let count = 0

    for (let i = 0; i < this.particles.length && count < MAX_LINES; i++) {
      const ai = i * 3
      const ax = this.posAttr.array[ai]
      const ay = this.posAttr.array[ai + 1]
      const az = this.posAttr.array[ai + 2]

      for (let j = i + 1; j < this.particles.length && count < MAX_LINES; j++) {
        const bi = j * 3
        const dx = ax - this.posAttr.array[bi]
        const dy = ay - this.posAttr.array[bi + 1]
        const dz = az - this.posAttr.array[bi + 2]
        const dist2 = dx * dx + dy * dy + dz * dz

        if (dist2 < CONNECT_THRESHOLD * CONNECT_THRESHOLD) {
          const base = count * 6
          arr[base]     = ax
          arr[base + 1] = ay
          arr[base + 2] = az
          arr[base + 3] = this.posAttr.array[bi]
          arr[base + 4] = this.posAttr.array[bi + 1]
          arr[base + 5] = this.posAttr.array[bi + 2]
          count++
        }
      }
    }

    this.linesPosAttr.needsUpdate = true
    this.lineSegs.geometry.setDrawRange(0, count * 2)
  }

  listen() {
    window.addEventListener('resize', () => this.onResize(), { passive: true })
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }, { passive: true })
  }

  onResize() {
    const w = this.canvas.offsetWidth
    const h = this.canvas.offsetHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  tick() {
    this.raf = requestAnimationFrame(() => this.tick())

    const t = performance.now() * 0.001

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      const base = i * 3
      this.posAttr.array[base]     = p.ox + Math.sin(t * p.speed + p.phase) * p.amp
      this.posAttr.array[base + 1] = p.oy + Math.cos(t * p.speed * 0.7 + p.phase) * p.amp * 0.8
      this.posAttr.array[base + 2] = p.oz + Math.sin(t * p.speed * 0.5 + p.phase) * p.amp * 0.4
    }
    this.posAttr.needsUpdate = true

    this.updateLines()

    // Subtle camera drift with mouse
    this.camera.position.x += (this.mouse.x * 8 - this.camera.position.x) * 0.025
    this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.025
    this.camera.lookAt(0, 0, 0)

    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.renderer.dispose()
  }
}
