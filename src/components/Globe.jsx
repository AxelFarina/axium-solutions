import { useEffect, useRef } from 'react'
import { geoEquirectangular, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'

/*
 * Rotating dotted globe (real Natural Earth land data) with orange atmosphere.
 * Scroll-driven scale/opacity, as in the design prototype.
 */

function samplePoints() {
  const W = 720, H = 360
  const off = document.createElement('canvas')
  off.width = W
  off.height = H
  const ctx = off.getContext('2d', { willReadFrequently: true })
  const land = feature(world, world.objects.countries)
  const proj = geoEquirectangular().fitSize([W, H], { type: 'Sphere' })
  const path = geoPath(proj, ctx)
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  path(land)
  ctx.fill()
  const data = ctx.getImageData(0, 0, W, H).data
  const pts = []
  const step = 2.2
  for (let lat = -60; lat <= 85; lat += step) {
    for (let lon = -180; lon < 180; lon += step) {
      const p = proj([lon, lat])
      const px = Math.round(p[0]), py = Math.round(p[1])
      if (px < 0 || py < 0 || px >= W || py >= H) continue
      if (data[(py * W + px) * 4 + 3] > 128) {
        const phi = (lat * Math.PI) / 180, lam = (lon * Math.PI) / 180
        pts.push([Math.cos(phi) * Math.sin(lam), Math.sin(phi), Math.cos(phi) * Math.cos(lam)])
      }
    }
  }
  return pts
}

export default function Globe({ t }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const size = Math.min(860, Math.max(360, window.innerWidth - 40))
    canvas.width = size * 2
    canvas.height = size * 2
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const pts = samplePoints()
    const ctx = canvas.getContext('2d')
    const S = canvas.width, cx = S / 2, cy = S / 2, R = S * 0.36
    let rot = 0
    let raf

    const tick = () => {
      if (!canvas.isConnected) return
      const r = canvas.getBoundingClientRect()
      const vh = window.innerHeight || 900
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9)))
      canvas.style.transform = `scale(${0.72 + 0.28 * p})`
      canvas.style.opacity = String(0.25 + 0.75 * p)
      rot += 0.0035
      ctx.clearRect(0, 0, S, S)

      const glow = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.45)
      glow.addColorStop(0, 'rgba(237,78,34,0.34)')
      glow.addColorStop(0.55, 'rgba(237,78,34,0.13)')
      glow.addColorStop(1, 'rgba(237,78,34,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.45, 0, Math.PI * 2)
      ctx.fill()

      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R)
      body.addColorStop(0, 'rgba(44,33,26,0.95)')
      body.addColorStop(1, 'rgba(10,7,6,0.98)')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,138,80,0.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()

      const sinR = Math.sin(rot), cosR = Math.cos(rot)
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0, z0] = pts[i]
        const x = x0 * cosR + z0 * sinR
        const z = -x0 * sinR + z0 * cosR
        if (z <= 0.02) continue
        ctx.fillStyle = `rgba(245,231,214,${(0.18 + z * 0.72).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(cx + R * x, cy - R * y0, 1.4 + z * 2.1, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="globe-section">
      <div className="globe-copy">
        <div className="kicker"><span className="accent">✦</span> {t.globeKicker}</div>
        <h2>{t.globeTitle}</h2>
        <p>{t.globeSub}</p>
      </div>
      <div className="globe-canvas-wrap">
        <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto', transformOrigin: 'center' }} />
      </div>
      <div className="globe-fade" />
    </div>
  )
}
