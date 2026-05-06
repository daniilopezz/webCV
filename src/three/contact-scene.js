import * as THREE from 'three'

export class ContactScene {
  constructor(canvas) {
    this.canvas = canvas
    this.raf = null
    this.meshes = []

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

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    this.applyViewportLayout(w)

    this.buildGlobe()
    this.buildRings()
    this.buildParticles()
    this.addLights()
  }

  buildGlobe() {
    // Solid core (hologram blue)
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 4)
    const coreMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#001a4a'),
      transparent: true,
      opacity: 0.5,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    this.scene.add(core)
    this.meshes.push({ mesh: core, rx: 0.003, ry: 0.004 })

    // Wireframe shell
    const wireGeo = new THREE.IcosahedronGeometry(1.38, 3)
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#34bfff'),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    this.scene.add(wire)
    this.meshes.push({ mesh: wire, rx: 0.003, ry: 0.004 })
  }

  buildRings() {
    const ringData = [
      { radius: 1.9, tube: 0.008, opacity: 0.4, rx: Math.PI / 2, ry: 0, rz: 0 },
      { radius: 2.3, tube: 0.006, opacity: 0.25, rx: Math.PI / 3, ry: 0.5, rz: 0.3 },
      { radius: 2.7, tube: 0.004, opacity: 0.15, rx: Math.PI / 6, ry: 1.1, rz: 0.6 },
    ]

    ringData.forEach(d => {
      const geo = new THREE.TorusGeometry(d.radius, d.tube, 8, 120)
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#34bfff'),
        transparent: true,
        opacity: d.opacity,
      })
      const ring = new THREE.Mesh(geo, mat)
      ring.rotation.set(d.rx, d.ry, d.rz)
      this.scene.add(ring)
      this.meshes.push({ mesh: ring, rx: 0.002, ry: 0.003 })
    })
  }

  buildParticles() {
    const count = 200
    const positions = new Float32Array(count * 3)
    const radius = 2.2

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 0.6

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color('#34bfff'),
      size: 1.5,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.5,
    })

    const points = new THREE.Points(geo, mat)
    this.scene.add(points)
    this.meshes.push({ mesh: points, rx: 0.002, ry: 0.003 })
  }

  addLights() {
    const ambient = new THREE.AmbientLight(0x34bfff, 0.6)
    this.scene.add(ambient)

    const point = new THREE.PointLight(0xff8400, 1.2, 15)
    point.position.set(4, 3, 4)
    this.scene.add(point)

    const fill = new THREE.PointLight(0x34bfff, 0.8, 12)
    fill.position.set(-4, -2, 2)
    this.scene.add(fill)
  }

  applyViewportLayout(width = window.innerWidth) {
    const isPhone = width < 640
    const isTablet = width >= 640 && width < 1024

    if (isPhone) {
      this.camera.fov = 48
      this.camera.position.set(0, 0, 10.4)
    } else if (isTablet) {
      this.camera.fov = 45
      this.camera.position.set(0, 0, 7.2)
    } else {
      this.camera.fov = 45
      this.camera.position.set(0, 0, 6)
    }
    this.camera.updateProjectionMatrix()
  }

  listen() {
    window.addEventListener('resize', () => this.onResize(), { passive: true })
  }

  onResize() {
    const w = this.canvas.offsetWidth
    const h = this.canvas.offsetHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.applyViewportLayout(window.innerWidth)
  }

  tick() {
    this.raf = requestAnimationFrame(() => this.tick())

    const t = performance.now() * 0.001

    this.meshes.forEach(({ mesh, rx, ry }) => {
      mesh.rotation.x += rx
      mesh.rotation.y += ry
    })

    // Gentle floating
    this.scene.position.y = Math.sin(t * 0.4) * 0.08

    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.renderer.dispose()
  }
}
