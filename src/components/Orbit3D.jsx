import { useEffect, useRef } from 'react'
import * as T from 'three'

/*
 * Interactive 3D object — drag to orbit, mouse parallax.
 * Variants: 'chip' (CPU), 'orb' (plexus network), 'knot' (particle wave field).
 */

function buildChip(g) {
  const body = new T.Mesh(
    new T.BoxGeometry(3, 0.35, 3),
    new T.MeshStandardMaterial({ color: 0x1a1310, roughness: 0.35, metalness: 0.6 }),
  )
  g.add(body)

  // procedural circuit texture on the top face
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const x = c.getContext('2d')
  x.fillStyle = '#14100c'
  x.fillRect(0, 0, 512, 512)
  x.strokeStyle = 'rgba(255,138,80,.28)'
  x.lineWidth = 2
  for (let i = 0; i < 26; i++) {
    x.beginPath()
    let a = 40 + Math.random() * 432, b = 40 + Math.random() * 432
    x.moveTo(a, b)
    for (let s = 0; s < 3; s++) {
      if (Math.random() > 0.5) a = 40 + Math.random() * 432
      else b = 40 + Math.random() * 432
      x.lineTo(a, b)
    }
    x.stroke()
    x.fillStyle = 'rgba(255,170,120,.5)'
    x.beginPath()
    x.arc(a, b, 4, 0, 7)
    x.fill()
  }
  x.strokeStyle = 'rgba(237,78,34,.6)'
  x.strokeRect(96, 96, 320, 320)
  const tex = new T.CanvasTexture(c)
  const top = new T.Mesh(
    new T.PlaneGeometry(2.9, 2.9),
    new T.MeshStandardMaterial({ map: tex, roughness: 0.5, metalness: 0.3 }),
  )
  top.rotation.x = -Math.PI / 2
  top.position.y = 0.2
  g.add(top)

  const img = new Image()
  img.src = 'assets/mark-white.png'
  img.onload = () => {
    const s = 260, r = img.height / img.width
    x.drawImage(img, (512 - s) / 2, (512 - s * r) / 2, s, s * r)
    tex.needsUpdate = true
  }

  const die = new T.Mesh(
    new T.BoxGeometry(2.2, 0.05, 2.2),
    new T.MeshStandardMaterial({ color: 0x2c211a, emissive: 0xed4e22, emissiveIntensity: 0.35, roughness: 0.4 }),
  )
  die.position.y = 0.165
  g.add(die)

  const pinMat = new T.MeshStandardMaterial({ color: 0xc9a05e, roughness: 0.3, metalness: 0.9 })
  for (let i = 0; i < 9; i++) {
    const off = -1.2 + i * 0.3
    ;[[off, 0, 1.62, 0], [off, 0, -1.62, 0], [1.62, 0, off, Math.PI / 2], [-1.62, 0, off, Math.PI / 2]].forEach((p) => {
      const pin = new T.Mesh(new T.BoxGeometry(0.1, 0.08, 0.28), pinMat)
      pin.position.set(p[0], -0.05, p[2])
      pin.rotation.y = p[3]
      g.add(pin)
    })
  }
  g.rotation.x = 0.5
  return (t) => {
    die.material.emissiveIntensity = 0.3 + Math.sin(t * 2.2) * 0.18
    g.position.y = Math.sin(t * 0.8) * 0.08
  }
}

function buildOrb(g) {
  const N = 120, nodes = []
  for (let i = 0; i < N; i++) {
    const th = Math.acos(2 * Math.random() - 1), ph = Math.random() * Math.PI * 2
    const rad = 1.9 + Math.random() * 0.35
    nodes.push(new T.Vector3(Math.sin(th) * Math.cos(ph) * rad, Math.cos(th) * rad, Math.sin(th) * Math.sin(ph) * rad))
  }
  const edgePos = []
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 1.05) edgePos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
    }
  }
  const eGeo = new T.BufferGeometry()
  eGeo.setAttribute('position', new T.Float32BufferAttribute(edgePos, 3))
  const edges = new T.LineSegments(eGeo, new T.LineBasicMaterial({ color: 0xff8a50, transparent: true, opacity: 0.28 }))
  g.add(edges)

  const nGeo = new T.BufferGeometry().setFromPoints(nodes)
  g.add(new T.Points(nGeo, new T.PointsMaterial({ color: 0xf5e7d6, size: 0.06, transparent: true, opacity: 0.95 })))

  const hubs = []
  const hubMat = new T.MeshStandardMaterial({ color: 0x1a1310, emissive: 0xed4e22, emissiveIntensity: 1.2, roughness: 0.3 })
  for (let i = 0; i < 9; i++) {
    const hub = new T.Mesh(new T.SphereGeometry(0.09, 16, 16), hubMat.clone())
    hub.position.copy(nodes[Math.floor(Math.random() * N)])
    hubs.push(hub)
    g.add(hub)
  }

  const pulseMat = new T.MeshBasicMaterial({ color: 0xffb08a })
  const pulses = []
  const edgeCount = edgePos.length / 6
  for (let i = 0; i < 14; i++) {
    const m = new T.Mesh(new T.SphereGeometry(0.045, 8, 8), pulseMat)
    pulses.push({ m, e: Math.floor(Math.random() * edgeCount), t: Math.random(), s: 0.4 + Math.random() * 0.8 })
    g.add(m)
  }
  return (t) => {
    hubs.forEach((h, i) => { h.material.emissiveIntensity = 0.8 + Math.sin(t * 2 + i * 1.7) * 0.6 })
    pulses.forEach((p) => {
      p.t += p.s * 0.016
      if (p.t > 1) { p.t = 0; p.e = Math.floor(Math.random() * edgeCount) }
      const o = p.e * 6
      p.m.position.set(
        edgePos[o] + (edgePos[o + 3] - edgePos[o]) * p.t,
        edgePos[o + 1] + (edgePos[o + 4] - edgePos[o + 1]) * p.t,
        edgePos[o + 2] + (edgePos[o + 5] - edgePos[o + 2]) * p.t,
      )
    })
    edges.material.opacity = 0.22 + Math.sin(t * 1.3) * 0.08
  }
}

function buildKnot(g) {
  const W = 110, D = 60, N = W * D
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
  const cA = new T.Color(0xf5e7d6), cB = new T.Color(0xed4e22), cC = new T.Color(0xff8a50)
  let k = 0
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < D; j++) {
      pos[k * 3] = (i / (W - 1) - 0.5) * 7.2
      pos[k * 3 + 2] = (j / (D - 1) - 0.5) * 4.4
      const r = Math.random()
      const c = r > 0.93 ? cB : r > 0.85 ? cC : cA
      col[k * 3] = c.r
      col[k * 3 + 1] = c.g
      col[k * 3 + 2] = c.b
      k++
    }
  }
  const geo = new T.BufferGeometry()
  geo.setAttribute('position', new T.BufferAttribute(pos, 3))
  geo.setAttribute('color', new T.BufferAttribute(col, 3))
  g.add(new T.Points(geo, new T.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.9 })))
  g.rotation.x = 0.42
  return (t) => {
    const a = geo.attributes.position.array
    for (let n = 0; n < N; n++) {
      const x = a[n * 3], z = a[n * 3 + 2]
      a[n * 3 + 1] = Math.sin(x * 1.1 + t * 1.6) * 0.35 + Math.cos(z * 1.6 + t * 1.1) * 0.3 + Math.sin((x + z) * 0.7 + t * 0.7) * 0.22
    }
    geo.attributes.position.needsUpdate = true
  }
}

const BUILDERS = { chip: buildChip, orb: buildOrb, knot: buildKnot }

export default function Orbit3D({ variant }) {
  const hostRef = useRef(null)
  const sceneRef = useRef(null)   // { scene, group, animate }
  const variantRef = useRef(variant)

  variantRef.current = variant

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true })
    const size = () => ({ w: host.clientWidth || 900, h: host.clientHeight || 560 })
    let { w, h } = size()
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.domElement.style.cssText = 'display:block; width:100%; height:100%;'
    host.appendChild(renderer.domElement)

    const scene = new T.Scene()
    const cam = new T.PerspectiveCamera(38, w / h, 0.1, 100)
    cam.position.set(0, 0.6, 7)
    scene.add(new T.AmbientLight(0xfff1e0, 0.5))
    const key = new T.PointLight(0xed4e22, 60)
    key.position.set(4, 3, 4)
    scene.add(key)
    const rim = new T.PointLight(0xffc9a0, 30)
    rim.position.set(-4, -2, 3)
    scene.add(rim)

    sceneRef.current = { scene, group: null, animate: null }

    const state = { drag: false, px: 0, py: 0, vx: 0.004, vy: 0, mx: 0, my: 0 }
    const onDown = (e) => {
      state.drag = true
      state.px = e.clientX
      state.py = e.clientY
      host.style.cursor = 'grabbing'
      host.setPointerCapture(e.pointerId)
    }
    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      state.mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      state.my = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (!state.drag) return
      state.vy = (e.clientX - state.px) * 0.006
      state.vx = (e.clientY - state.py) * 0.006
      state.px = e.clientX
      state.py = e.clientY
    }
    const onEnd = () => { state.drag = false; host.style.cursor = 'grab' }
    host.addEventListener('pointerdown', onDown)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerup', onEnd)
    host.addEventListener('pointercancel', onEnd)

    const onResize = () => {
      const s = size()
      renderer.setSize(s.w, s.h)
      cam.aspect = s.w / s.h
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let raf
    const tick = (t) => {
      const ref = sceneRef.current
      const g = ref?.group
      if (g) {
        g.rotation.y += state.vy || 0
        g.rotation.x += state.vx || 0
        g.rotation.x = Math.max(-1.1, Math.min(1.1, g.rotation.x))
        state.vy *= 0.95
        state.vx *= 0.95
        if (Math.abs(state.vy) < 0.0035 && !state.drag) g.rotation.y += 0.0035
        if (ref.animate) ref.animate(t / 1000)
        cam.position.x += (state.mx * 0.5 - cam.position.x) * 0.04
        cam.position.y += (0.6 - state.my * 0.4 - cam.position.y) * 0.04
        cam.lookAt(0, 0, 0)
      }
      renderer.render(scene, cam)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerup', onEnd)
      host.removeEventListener('pointercancel', onEnd)
      renderer.dispose()
      renderer.domElement.remove()
      sceneRef.current = null
    }
  }, [])

  // (re)build the object when the variant changes
  useEffect(() => {
    const ref = sceneRef.current
    if (!ref) return
    if (ref.group) ref.scene.remove(ref.group)
    const g = new T.Group()
    ref.scene.add(g)
    ref.group = g
    ref.animate = (BUILDERS[variant] || buildChip)(g)
  }, [variant])

  return <div ref={hostRef} className="orbit-canvas" />
}
