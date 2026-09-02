import * as THREE from 'three'

const C = {
  skin:       0xf5c9a0,
  hair:       0x2d2a24,
  hoodie:     0x34bfff,
  hoodieDeep: 0x1a9fd4,
  pants:      0x3a3630,
  desk:       0xdfd2bf,
  laptop:     0x2d2a24,
  laptopEdge: 0x4a453c,
  screenInk:  0x74dcff,
  chair:      0xe9ded0,
  chairDark:  0xc8b89a,
  shoe:       0x2d2a24,
  floor:      0xede5d8,
  linen:      0xf5efe6,
}

const phong = (color, props = {}) =>
  new THREE.MeshPhongMaterial({ color, ...props })

const makeCanvasTexture = (draw, width = 512, height = 256) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

const makeScreenTexture = () =>
  makeCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#071923'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#111f27'
    ctx.fillRect(0, 0, w, 34)

    ;['#ff8400', '#dfd2bf', '#34bfff'].forEach((color, i) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(22 + i * 20, 17, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.font = '700 19px "Roboto Mono", monospace'
    ctx.fillStyle = '#8edfff'
    ctx.fillText('dani@webcv:~/projects', 90, 23)

    const lines = [
      ['$', 'npm run build -- webcv'],
      ['>', 'vite portfolio | i18n: es / en / it'],
      ['$', 'python data_tools.py --sql'],
      ['>', 'loading pandas, csv, postgresql...'],
      ['>', 'clean data -> project notes'],
      ['$', 'git status --short'],
      ['INFO', 'stack: web / python / sql / data'],
      ['API', 'portfolio links verified'],
    ]

    ctx.font = '700 20px "Roboto Mono", monospace'
    lines.forEach(([prefix, text], i) => {
      const y = 64 + i * 25
      ctx.fillStyle = prefix === '$' ? '#ff8400' : '#34bfff'
      ctx.fillText(prefix, 24, y)
      ctx.fillStyle = 'rgba(225, 245, 255, 0.94)'
      ctx.fillText(text, 86, y)
    })

    ctx.fillStyle = '#34bfff'
    ctx.fillRect(86, h - 31, 10, 21)
  })

const roundRect = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

const makeBadgeTexture = (label, accent = '#34bfff') =>
  makeCanvasTexture((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(245, 239, 230, 0.9)'
    ctx.strokeStyle = accent
    ctx.lineWidth = 8
    roundRect(ctx, 12, 12, w - 24, h - 24, 24)
    ctx.fill()
    ctx.stroke()

    ctx.font = label.length > 9
      ? '900 40px "Urbanist", sans-serif'
      : '900 48px "Urbanist", sans-serif'
    ctx.fillStyle = '#2d2a24'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, w / 2, h / 2 + 2)
  }, 320, 128)

const smoothstep = (edge0, edge1, x) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

const capsuleBetween = (from, to, radius, material) => {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const direction = new THREE.Vector3().subVectors(end, start)
  const length = direction.length()
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.01), 8, 16),
    material
  )

  mesh.position.copy(start).add(end).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  )
  mesh.castShadow = true
  return mesh
}

export class HeroCharacter {
  constructor(canvas) {
    this.canvas = canvas
    this.raf = null
    this.refs = {}     // named mesh references for animation
    this.onResizeBound = () => this.onResize()

    this.init()
    this.buildLights()
    this.buildFloor()
    this.buildDesk()
    this.buildChair()
    this.buildCharacter()
    this.buildFloatingCode()
    this.listen()
    this.tick()
  }

  /* ─── Renderer + Camera ─────────────────────────── */
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
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor(0x000000, 0)

    this.scene = new THREE.Scene()
    this.stage = new THREE.Group()
    this.scene.add(this.stage)

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100)
    this.applyViewportLayout(w)
  }

  applyViewportLayout(width = window.innerWidth) {
    const isPhone = width < 640
    const isTablet = width >= 640 && width < 1024
    const pixelRatio = isPhone ? 1.2 : isTablet ? 1.5 : 2

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio))

    if (isPhone) {
      const isNarrow = width < 390
      this.stage.position.set(isNarrow ? -0.04 : 0, -0.05, 0)
      this.stage.scale.setScalar(isNarrow ? 0.9 : 0.98)
      this.camera.fov = isNarrow ? 40 : 39
      this.camera.position.set(0.26, 2.62, isNarrow ? 5.95 : 5.65)
      this.camera.lookAt(0, 1.34, 0)
    } else if (isTablet) {
      this.stage.position.set(-0.28, -0.10, 0)
      this.stage.scale.setScalar(0.82)
      this.camera.fov = 43
      this.camera.position.set(0.96, 3.02, 7.9)
      this.camera.lookAt(-0.08, 1.36, 0)
    } else {
      this.stage.position.set(1.55, -0.02, 0)
      this.stage.scale.setScalar(0.94)
      this.camera.fov = 42
      this.camera.position.set(2.8, 3.4, 7.5)
      this.camera.lookAt(0.6, 1.4, 0)
    }

    this.camera.updateProjectionMatrix()
    this.applyFloatingLayout(width)
  }

  applyFloatingLayout(width = window.innerWidth) {
    if (!this.refs.floatBadges) return

    const isPhone = width < 640
    const isNarrow = width < 390
    const mobile = {
      Python:     { x: -0.22, y: 3.02, z: 0.12, s: isNarrow ? 0.29 : 0.31 },
      SQL:        { x: 1.16,  y: 2.70, z: 0.05, s: isNarrow ? 0.25 : 0.27 },
      DATA:       { x: 1.05,  y: 3.17, z: -0.10, s: isNarrow ? 0.28 : 0.30 },
      PostgreSQL: { x: -0.02, y: 2.34, z: -0.18, s: isNarrow ? 0.28 : 0.30 },
      Docker:     { x: 0.60,  y: 3.34, z: 0.25, s: isNarrow ? 0.25 : 0.27 },
    }

    this.refs.floatBadges.forEach(badge => {
      const d = badge.userData
      const next = isPhone ? mobile[d.label] : null
      d.baseX = next?.x ?? d.homeX
      d.baseY = next?.y ?? d.homeY
      d.s = next?.s ?? d.homeScale
      badge.position.z = next?.z ?? d.homeZ
      badge.scale.set(d.s * 2.55, d.s, 1)
    })
  }

  /* ─── Lights ────────────────────────────────────── */
  buildLights() {
    this.scene.add(new THREE.AmbientLight(0xf5efe6, 0.85))

    const sun = new THREE.DirectionalLight(0xfff4e0, 1.3)
    sun.position.set(-4, 6, 5)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 30
    this.scene.add(sun)

    // Screen glow — Electric Blue
    this.refs.screenLight = new THREE.PointLight(0x34bfff, 1.0, 5)
    this.refs.screenLight.position.set(0.55, 1.9, 0.75)
    this.stage.add(this.refs.screenLight)

    // Warm rim from right
    const rim = new THREE.PointLight(0xff8400, 0.35, 8)
    rim.position.set(4, 3, -1)
    this.scene.add(rim)
  }

  /* ─── Floor ─────────────────────────────────────── */
  buildFloor() {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.06, 8),
      phong(C.floor)
    )
    mesh.position.y = -0.03
    mesh.receiveShadow = true
    this.stage.add(mesh)
  }

  /* ─── Desk ───────────────────────────────────────── */
  buildDesk() {
    const add = (geo, mat, px, py, pz, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(px, py, pz)
      m.rotation.set(rx, ry, rz)
      m.castShadow = true
      m.receiveShadow = true
      this.stage.add(m)
      return m
    }

    const deskMat = phong(C.desk, { shininess: 18 })
    const legMat  = phong(C.chairDark, { shininess: 12 })

    // Surface
    add(new THREE.BoxGeometry(2.6, 0.08, 1.1), deskMat, 0, 1.05, 0)

    // Soft front lip to make the desk feel less blocky.
    add(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 16), deskMat, 0, 1.10, 0.55, 0, 0, Math.PI / 2)

    // Legs
    const legH = new THREE.BoxGeometry(0.07, 1.05, 0.07)
    ;[[-1.2, 0.525, 0.48], [1.2, 0.525, 0.48],
      [-1.2, 0.525,-0.48], [1.2, 0.525,-0.48]].forEach(([x,y,z]) =>
      add(legH, legMat, x, y, z)
    )

    // Laptop base
    add(new THREE.BoxGeometry(1.32, 0.045, 0.74), phong(C.laptop), 0.28, 1.11, -0.1)
    add(new THREE.BoxGeometry(1.38, 0.018, 0.78), phong(C.laptopEdge), 0.28, 1.105, -0.1)

    // Keyboard and trackpad
    const keyMat = phong(0x3f3a32, { shininess: 8 })
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        add(
          new THREE.BoxGeometry(0.055, 0.014, 0.038),
          keyMat,
          -0.15 + col * 0.06,
          1.145,
          -0.17 + row * 0.055
        )
      }
    }
    add(new THREE.BoxGeometry(0.26, 0.012, 0.13), phong(0x5f5646), 0.22, 1.145, 0.18)

    // Laptop screen body
    const screenGroup = new THREE.Group()
    screenGroup.position.set(0.58, 1.18, -0.43)
    this.stage.add(screenGroup)

    const screenBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.32, 0.82, 0.035),
      phong(C.laptop)
    )
    screenBody.position.set(0, 0.39, 0)
    screenBody.rotation.x = -0.22
    screenGroup.add(screenBody)

    this.refs.screenMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: makeScreenTexture(),
      emissive: new THREE.Color(0x34bfff),
      emissiveIntensity: 0.35,
    })
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.68, 0.01),
      this.refs.screenMat
    )
    panel.position.set(0, 0.39, 0.018)
    panel.rotation.x = -0.22
    screenGroup.add(panel)

    const cameraDot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), phong(C.screenInk))
    cameraDot.position.set(0, 0.78, 0.04)
    screenGroup.add(cameraDot)

    // Mug
    const mugMat = phong(0xe9ded0)
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.17, 12), mugMat)
    mug.position.set(-0.9, 1.17, -0.05)
    mug.castShadow = true
    this.stage.add(mug)

    const mugTop = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.01, 12), phong(0xff8400))
    mugTop.position.set(-0.9, 1.26, -0.05)
    this.stage.add(mugTop)

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 16), mugMat)
    handle.position.set(-0.98, 1.20, -0.05)
    handle.rotation.y = Math.PI / 2
    handle.castShadow = true
    this.stage.add(handle)

    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.58, 1.11, 0.02),
      new THREE.Vector3(0.85, 1.08, 0.20),
      new THREE.Vector3(1.02, 1.08, 0.46),
    ])
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 20, 0.008, 8, false),
      phong(C.laptopEdge)
    )
    cable.castShadow = true
    this.stage.add(cable)
  }

  /* ─── Chair ──────────────────────────────────────── */
  buildChair() {
    const cMat = phong(C.chair, { shininess: 14 })
    const lMat = phong(0x888880, { shininess: 20 })
    const add  = (geo, mat, x, y, z, rx = 0) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.rotation.x = rx
      m.castShadow = true
      this.stage.add(m)
    }

    add(new THREE.BoxGeometry(0.96, 0.12, 0.82), cMat, 0, 0.90, 0.62)
    add(new THREE.BoxGeometry(0.84, 0.58, 0.08), cMat, 0, 1.25, 0.98, 0.08)
    add(new THREE.CylinderGeometry(0.026, 0.026, 0.68, 10), phong(C.chairDark), -0.44, 1.05, 0.93, 0.08)
    add(new THREE.CylinderGeometry(0.026, 0.026, 0.68, 10), phong(C.chairDark),  0.44, 1.05, 0.93, 0.08)

    const legG = new THREE.CylinderGeometry(0.026, 0.026, 0.90, 8)
    ;[[-0.34, 0.45, 0.28],[0.34, 0.45, 0.28],
      [-0.34, 0.45, 0.92],[0.34, 0.45, 0.92]].forEach(([x,y,z]) =>
      add(legG, lMat, x, y, z)
    )
  }

  /* ─── Character ──────────────────────────────────── */
  buildCharacter() {
    const g = new THREE.Group()

    const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, ref) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.rotation.set(rx, ry, rz)
      m.castShadow = true
      if (ref) this.refs[ref] = m
      g.add(m)
      return m
    }

    const addLimb = (from, to, radius, mat, ref) => {
      const m = capsuleBetween(from, to, radius, mat)
      if (ref) this.refs[ref] = m
      g.add(m)
      return m
    }

    const addToHead = (headGroup, geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.rotation.set(rx, ry, rz)
      m.castShadow = true
      headGroup.add(m)
      return m
    }

    const skin   = phong(C.skin, { shininess: 16 })
    const hoodie = phong(C.hoodie, { shininess: 26 })
    const hoodieDeep = phong(C.hoodieDeep, { shininess: 24 })
    const pants  = phong(C.pants, { shininess: 10 })
    const hair = phong(C.hair, { shininess: 18 })

    // Torso and hoodie back
    add(new THREE.CapsuleGeometry(0.29, 0.48, 10, 22), hoodie, 0, 1.64, 0.53, 0, 0, 0, 'torso')
    add(new THREE.BoxGeometry(0.34, 0.18, 0.028), hoodieDeep, 0, 1.43, 0.80)

    const hood = add(new THREE.TorusGeometry(0.25, 0.045, 12, 32), hoodieDeep, 0, 1.96, 0.62)
    hood.scale.set(1.18, 0.72, 1)
    add(new THREE.BoxGeometry(0.028, 0.44, 0.022), phong(C.linen), 0, 1.60, 0.815)

    // Neck and fully back-facing head
    add(new THREE.CylinderGeometry(0.11, 0.12, 0.20, 14), skin, 0, 2.06, 0.47)

    const headGroup = new THREE.Group()
    headGroup.position.set(0, 2.46, 0.50)
    this.refs.head = headGroup
    g.add(headGroup)

    addToHead(headGroup, new THREE.SphereGeometry(0.34, 24, 20), skin, 0, -0.02, 0)
    addToHead(
      headGroup,
      new THREE.SphereGeometry(0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.78),
      hair,
      0,
      0.03,
      0.05
    )

    ;[
      [-0.20, 0.14, 0.24, 0.115],
      [-0.04, 0.20, 0.27, 0.13],
      [0.12, 0.16, 0.25, 0.12],
      [0.26, 0.02, 0.18, 0.105],
      [-0.27, 0.00, 0.17, 0.105],
    ].forEach(([x, y, z, s]) =>
      addToHead(headGroup, new THREE.SphereGeometry(s, 10, 10), hair, x, y, z)
    )

    const headsetCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0.02, 0.08),
      new THREE.Vector3(-0.23, 0.34, 0.10),
      new THREE.Vector3(0, 0.43, 0.10),
      new THREE.Vector3(0.23, 0.34, 0.10),
      new THREE.Vector3(0.36, 0.02, 0.08),
    ])
    const headset = new THREE.Mesh(
      new THREE.TubeGeometry(headsetCurve, 28, 0.018, 8, false),
      hair
    )
    headGroup.add(headset)

    ;[-1, 1].forEach(side => {
      addToHead(headGroup, new THREE.CylinderGeometry(0.095, 0.095, 0.09, 16), hair, side * 0.36, -0.02, 0.08, 0, 0, Math.PI / 2)
      addToHead(headGroup, new THREE.CylinderGeometry(0.050, 0.050, 0.095, 16), hoodie, side * 0.365, -0.02, 0.08, 0, 0, Math.PI / 2)
    })

    // Connected arms: shoulder -> elbow -> wrist on the keyboard.
    ;[
      [-0.34, 1.82, 0.54],
      [0.34, 1.82, 0.54],
    ].forEach(([x, y, z]) =>
      add(new THREE.SphereGeometry(0.105, 12, 12), hoodie, x, y, z)
    )

    addLimb([-0.34, 1.78, 0.50], [-0.52, 1.46, 0.20], 0.075, hoodie, 'leftUpperArm')
    addLimb([0.34, 1.78, 0.50], [0.52, 1.46, 0.18], 0.075, hoodie, 'rightUpperArm')
    add(new THREE.SphereGeometry(0.078, 10, 10), hoodie, -0.52, 1.46, 0.20)
    add(new THREE.SphereGeometry(0.078, 10, 10), hoodie, 0.52, 1.46, 0.18)

    addLimb([-0.52, 1.46, 0.20], [-0.24, 1.18, -0.08], 0.056, skin, 'leftForearm')
    addLimb([0.52, 1.46, 0.18], [0.46, 1.18, -0.08], 0.056, skin, 'rightForearm')
    add(new THREE.SphereGeometry(0.075, 12, 12), skin, -0.24, 1.17, -0.08, 0, 0, 0, 'leftHand')
    add(new THREE.SphereGeometry(0.075, 12, 12), skin, 0.46, 1.17, -0.08, 0, 0, 0, 'rightHand')
    add(new THREE.BoxGeometry(0.09, 0.025, 0.05), skin, -0.17, 1.18, -0.15, 0, 0, 0, 'leftFinger')
    add(new THREE.BoxGeometry(0.09, 0.025, 0.05), skin, 0.39, 1.18, -0.15, 0, 0, 0, 'rightFinger')

    // Seated legs facing the same direction as the torso: knees go toward the desk.
    addLimb([-0.18, 1.04, 0.56], [-0.34, 0.90, 0.12], 0.10, pants)
    addLimb([0.18, 1.04, 0.56], [0.34, 0.90, 0.12], 0.10, pants)
    addLimb([-0.34, 0.90, 0.12], [-0.34, 0.20, 0.06], 0.08, pants)
    addLimb([0.34, 0.90, 0.12], [0.34, 0.20, 0.06], 0.08, pants)

    const shoeG = new THREE.BoxGeometry(0.18, 0.11, 0.27)
    add(shoeG, phong(C.shoe), -0.34, 0.08, -0.02, 0, 0, 0)
    add(shoeG, phong(C.shoe),  0.34, 0.08, -0.02, 0, 0, 0)

    this.stage.add(g)
    this.refs.charGroup = g
  }

  /* ─── Floating code snippets ────────────────────── */
  buildFloatingCode() {
    // Small glowing cubes keep the technical ambience without competing with the terminal.
    const cubeData = [
      { x:  1.55, y: 2.75, z: 0.2, scale: 0.08, color: 0x34bfff, speed: 1.1, amp: 0.14 },
      { x:  1.9,  y: 2.25, z:-0.3, scale: 0.06, color: 0xff8400, speed: 0.8, amp: 0.16 },
      { x: -0.35, y: 2.35, z: 0.0, scale: 0.06, color: 0x34bfff, speed: 1.4, amp: 0.12 },
      { x:  2.05, y: 3.08, z: 0.5, scale: 0.05, color: 0xff8400, speed: 0.9, amp: 0.14 },
    ]

    this.refs.floatCubes = cubeData.map(d => {
      const mat = new THREE.MeshBasicMaterial({
        color: d.color,
        transparent: true,
        opacity: 0.55,
      })
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(d.scale, d.scale, d.scale), mat)
      mesh.position.set(d.x, d.y, d.z)
      mesh.userData = { baseY: d.y, speed: d.speed, amp: d.amp, phase: Math.random() * Math.PI * 2 }
      this.stage.add(mesh)
      return mesh
    })

    const badges = [
      { label: 'Python',     x:  0.12, y: 3.02, z: 0.15, s: 0.40, accent: '#34bfff', phase: 0.0 },
      { label: 'SQL',        x:  1.78, y: 2.72, z: 0.08, s: 0.34, accent: '#ff8400', phase: 1.0 },
      { label: 'DATA',       x:  2.18, y: 3.10, z:-0.12, s: 0.38, accent: '#34bfff', phase: 2.0 },
      { label: 'PostgreSQL', x:  0.10, y: 2.30, z:-0.18, s: 0.38, accent: '#34bfff', phase: 3.0 },
      { label: 'Docker',     x:  1.05, y: 3.24, z: 0.30, s: 0.34, accent: '#34bfff', phase: 5.0 },
    ]

    this.refs.floatBadges = badges.map(d => {
      const material = new THREE.SpriteMaterial({
        map: makeBadgeTexture(d.label, d.accent),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(material)
      sprite.position.set(d.x, d.y, d.z)
      sprite.scale.set(d.s * 2.55, d.s, 1)
      sprite.userData = {
        ...d,
        homeX: d.x,
        homeY: d.y,
        homeZ: d.z,
        homeScale: d.s,
        baseX: d.x,
        baseY: d.y,
        cycle: 7.2,
      }
      this.stage.add(sprite)
      return sprite
    })

    this.applyFloatingLayout(window.innerWidth)
  }

  /* ─── Events ─────────────────────────────────────── */
  listen() {
    window.addEventListener('resize', this.onResizeBound, { passive: true })
  }

  onResize() {
    const w = this.canvas.offsetWidth
    const h = this.canvas.offsetHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.applyViewportLayout(window.innerWidth)
    this.camera.updateProjectionMatrix()
  }

  /* ─── Animation loop ─────────────────────────────── */
  tick() {
    this.raf = requestAnimationFrame(() => this.tick())
    const t = performance.now() * 0.001

    // Subtle head movement while looking at the terminal.
    if (this.refs.head) {
      this.refs.head.position.y = 2.46 + Math.sin(t * 1.1) * 0.01
      this.refs.head.rotation.x = -0.06 + Math.sin(t * 0.55) * 0.018
      this.refs.head.rotation.y = Math.sin(t * 0.35) * 0.018
    }

    // Typing movement only on fingers so the arms stay visually connected.
    if (this.refs.leftFinger)
      this.refs.leftFinger.position.y = 1.18 + Math.abs(Math.sin(t * 10.0)) * 0.018
    if (this.refs.rightFinger)
      this.refs.rightFinger.position.y = 1.18 + Math.abs(Math.sin(t * 10.0 + 1.3)) * 0.018

    // Screen glow pulse
    if (this.refs.screenLight)
      this.refs.screenLight.intensity = 0.85 + Math.sin(t * 2.2) * 0.2
    if (this.refs.screenMat)
      this.refs.screenMat.emissiveIntensity = 0.40 + Math.sin(t * 2.2) * 0.12

    // Floating cubes
    if (this.refs.floatCubes) {
      this.refs.floatCubes.forEach(c => {
        const d = c.userData
        c.position.y = d.baseY + Math.sin(t * d.speed + d.phase) * d.amp
        c.rotation.x += 0.012
        c.rotation.y += 0.018
      })
    }

    if (this.refs.floatBadges) {
      this.refs.floatBadges.forEach(badge => {
        const d = badge.userData
        const p = ((t + d.phase) % d.cycle) / d.cycle
        const fadeIn = smoothstep(0.08, 0.22, p)
        const fadeOut = 1 - smoothstep(0.68, 0.92, p)
        const opacity = 0.88 * fadeIn * fadeOut

        badge.visible = opacity > 0.025
        badge.material.opacity = opacity
        badge.position.y = d.baseY + Math.sin(t * 0.8 + d.phase) * 0.08
        badge.position.x = d.baseX + Math.cos(t * 0.45 + d.phase) * 0.035
        const pulse = 1 + opacity * 0.08
        badge.scale.set(d.s * 2.55 * pulse, d.s * pulse, 1)
      })
    }

    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResizeBound)
    this.renderer.dispose()
  }
}
