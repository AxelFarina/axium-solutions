import { useEffect, useRef } from 'react'

/*
 * Scroll-driven transformation showcase. The section is 320vh tall; a sticky
 * full-viewport stage pins while scrolling. Act 1 (0–0.3): the browser card
 * rises from tilted/small to flat/full. Act 2 (0.38–0.92): a light beam sweeps
 * left→right, revealing the "after" site via clip-path, while a spirit orb
 * flies from the BEFORE pill to the AFTER pill. All scrubbed by scroll.
 */

// background drift paths: 18 layered curves fading in brightness
const DRIFT_PATHS = Array.from({ length: 18 }, (_, i) => {
  const o = i * 14, y = i * 9
  const colors = ['237,78,34', '255,138,80', '245,231,214']
  return {
    d: `M${-80 - o} ${420 + y} C ${340 - o} ${200 + y * 1.2}, ${620 + o} ${530 + y * 0.9}, ${960 + o} ${300 + y * 1.1} S ${1400 + o} ${320 + y * 1.2}, ${1560 + o} ${410 + y * 0.9}`,
    stroke: `rgba(${colors[i % 3]},${(0.04 + i * 0.011).toFixed(3)})`,
    width: (0.6 + i * 0.045).toFixed(2),
    dur: (14 + i * 1.3).toFixed(1),
  }
})

const clamp = (v) => Math.max(0, Math.min(1, v))
const ease = (v) => v * v * (3 - 2 * v)

export default function Transform({ t }) {
  const secRef = useRef(null)
  const cardRef = useRef(null)
  const afterRef = useRef(null)
  const beamRef = useRef(null)
  const headRef = useRef(null)
  const lblARef = useRef(null)
  const lblBRef = useRef(null)
  const spiritRef = useRef(null)
  const trailRef = useRef(null)
  const rowRef = useRef(null)

  useEffect(() => {
    let raf
    const tick = () => {
      const sec = secRef.current, card = cardRef.current, after = afterRef.current, beam = beamRef.current
      const head = headRef.current, la = lblARef.current, lb = lblBRef.current
      if (sec && card && after && beam) {
        const vh = window.innerHeight || 900
        const r = sec.getBoundingClientRect()
        const p = clamp(-r.top / ((r.height - vh) || 1))

        // act 1: card rises from tilted/small to flat/full
        const tilt = ease(clamp(p / 0.3))
        card.style.transform = `rotateX(${(1 - tilt) * 24}deg) scale(${0.78 + tilt * 0.22})`
        if (head) {
          const hp = ease(clamp(p / 0.18))
          head.style.opacity = String(0.25 + hp * 0.75)
          head.style.transform = `translateY(${(1 - hp) * 30}px)`
        }

        // act 2: beam sweeps old → new
        const sw = ease(clamp((p - 0.38) / 0.54))
        after.style.clipPath = `inset(0 ${(1 - sw) * 100}% 0 0)`
        beam.style.left = `calc(${sw * 100}% - 1.5px)`
        beam.style.opacity = sw > 0.005 && sw < 0.995 ? '1' : '0'

        // spirit orb flies from pill A to pill B
        const spirit = spiritRef.current, trail = trailRef.current, row = rowRef.current
        if (spirit && trail && row && la && lb) {
          const rr = row.getBoundingClientRect()
          const ra = la.getBoundingClientRect(), rb = lb.getBoundingClientRect()
          const x0 = ra.right - rr.left - 30, x1 = rb.left - rr.left - 16
          const sx = x0 + (x1 - x0) * sw
          const arc = -Math.sin(sw * Math.PI) * 26
          const alive = sw > 0.02 && sw < 0.98
          spirit.style.opacity = alive ? String(0.65 + Math.sin(sw * Math.PI) * 0.35) : '0'
          spirit.style.transform = `translate(${sx}px, ${arc - 11}px) scale(${0.7 + Math.sin(sw * Math.PI) * 0.6}) rotate(${sw * 30 - 15}deg)`
          trail.style.opacity = alive ? String(0.8 * Math.sin(sw * Math.PI)) : '0'
          trail.style.width = `${Math.max(0, sx - x0)}px`
          trail.style.transform = `translate(${x0}px, ${arc * 0.5 - 1.5}px)`
          la.style.opacity = String(1 - sw * 0.45)
          lb.style.opacity = String(0.7 + sw * 0.3)
        }

        // pills swap emphasis at the midpoint
        if (la && lb) {
          const on = sw > 0.5
          la.style.color = on ? 'rgba(245,239,230,.45)' : '#F5EFE6'
          la.style.borderColor = on ? 'rgba(245,239,230,.14)' : 'rgba(245,239,230,.35)'
          la.style.background = on ? 'transparent' : 'rgba(245,239,230,.09)'
          lb.style.color = on ? '#FBF4E8' : 'rgba(245,239,230,.45)'
          lb.style.borderColor = on ? 'rgba(237,78,34,.8)' : 'rgba(245,239,230,.14)'
          lb.style.background = on ? 'linear-gradient(135deg, rgba(237,78,34,.35), rgba(255,122,60,.2))' : 'transparent'
          lb.style.boxShadow = on ? '0 0 28px rgba(237,78,34,.45)' : 'none'
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="tx-section" id="transform" ref={secRef}>
      <div className="tx-pin">
        <svg className="tx-bg" viewBox="0 0 1440 700" preserveAspectRatio="none">
          {DRIFT_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={p.width} strokeDasharray="240 340"
              style={{ animation: `axm-path-drift ${p.dur}s linear infinite` }} />
          ))}
        </svg>

        <div className="tx-head" ref={headRef}>
          <div className="kicker"><span className="accent">✦</span> {t.txKicker}</div>
          <h2>{t.txTitle}</h2>
          <p>{t.txSub}</p>
        </div>

        <div className="tx-persp">
          <div className="tx-card" ref={cardRef}>
            <div className="tx-chrome">
              <span className="tx-chrome-dot" /><span className="tx-chrome-dot" /><span className="tx-chrome-dot" />
              <div className="tx-chrome-url">yourcompany.com</div>
            </div>
            <div className="tx-stage">
              {/* BEFORE: dated site */}
              <div className="tx-before">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #b8b2a6', paddingBottom: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 'bold' }}>Your Company Inc.</span>
                  <span className="tx-before-links" style={{ fontSize: 12, color: '#777' }}>Home&nbsp;|&nbsp;About Us&nbsp;|&nbsp;Products&nbsp;|&nbsp;Contact</span>
                </div>
                <div className="tx-before-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, marginTop: 22 }}>
                  <div>
                    <div style={{ fontSize: 26, marginBottom: 12 }}>Welcome to our website!</div>
                    <div style={{ height: 9, background: '#c9c3b8', marginBottom: 8, width: '92%' }} />
                    <div style={{ height: 9, background: '#c9c3b8', marginBottom: 8, width: '86%' }} />
                    <div style={{ height: 9, background: '#c9c3b8', marginBottom: 8, width: '95%' }} />
                    <div style={{ height: 9, background: '#c9c3b8', marginBottom: 24, width: '60%' }} />
                    <div style={{ display: 'inline-block', background: '#8a8478', color: '#fff', padding: '8px 18px', fontSize: 13 }}>Click Here</div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
                      <div style={{ flex: 1, height: 86, background: '#d5cfc4', border: '1px solid #b8b2a6' }} />
                      <div style={{ flex: 1, height: 86, background: '#d5cfc4', border: '1px solid #b8b2a6' }} />
                      <div style={{ flex: 1, height: 86, background: '#d5cfc4', border: '1px solid #b8b2a6' }} />
                    </div>
                  </div>
                  <div className="tx-before-news" style={{ background: '#d5cfc4', border: '1px solid #b8b2a6', padding: 16, fontSize: 12, color: '#6a6458' }}>
                    <b>News</b>
                    <div style={{ height: 7, background: '#bfb9ad', marginTop: 10 }} />
                    <div style={{ height: 7, background: '#bfb9ad', marginTop: 6 }} />
                    <div style={{ height: 7, background: '#bfb9ad', marginTop: 6, width: '70%' }} />
                  </div>
                </div>
              </div>

              {/* AFTER: transformed site, revealed by the sweep */}
              <div className="tx-after" ref={afterRef}>
                <div style={{ position: 'absolute', top: -120, right: -60, width: 420, height: 420, background: 'radial-gradient(closest-side, rgba(237,78,34,.55), transparent 70%)', filter: 'blur(10px)' }} />
                <div className="tx-after-inner" style={{ position: 'relative', padding: '30px 44px', fontFamily: "'Archivo', sans-serif" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src="assets/logo-white-crop.png" alt="" style={{ height: 34, width: 'auto' }} />
                    <div className="tx-after-links" style={{ display: 'flex', gap: 18, fontSize: 12, color: 'rgba(245,239,230,.7)', alignItems: 'center' }}>
                      <span>Services</span><span>Platforms</span><span>Process</span>
                      <span style={{ background: 'linear-gradient(135deg,#ED4E22,#ff7a3c)', padding: '7px 16px', borderRadius: 999, color: '#FBF4E8', fontWeight: 600, boxShadow: '0 0 16px rgba(237,78,34,.5)' }}>Get started</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 44 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(245,239,230,.2)', borderRadius: 999, padding: '4px 12px', fontSize: 10, color: 'rgba(245,239,230,.75)' }}>
                      <span style={{ color: '#ED4E22' }}>✦</span> MODERN. FAST. YOURS.
                    </div>
                    <div style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 600, letterSpacing: '-1.5px', marginTop: 14, lineHeight: 1.15 }}>
                      A site your customers<br />actually <span className="grad-text" style={{ backgroundImage: 'linear-gradient(135deg,#ED4E22,#ff9a60)' }}>remember.</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                      <div style={{ width: 'min(150px, 26vw)', height: 74, borderRadius: 12, background: 'linear-gradient(160deg,#1A1310,#0F0B09)', border: '1px solid rgba(237,78,34,.4)', boxShadow: '0 0 24px rgba(237,78,34,.25)' }} />
                      <div style={{ width: 'min(150px, 26vw)', height: 74, borderRadius: 12, background: 'linear-gradient(160deg,#1A1310,#0F0B09)', border: '1px solid rgba(245,239,230,.14)' }} />
                      <div style={{ width: 'min(150px, 26vw)', height: 74, borderRadius: 12, background: 'linear-gradient(160deg,#1A1310,#0F0B09)', border: '1px solid rgba(245,239,230,.14)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="tx-beam" ref={beamRef} />
            </div>
          </div>
        </div>

        <div className="tx-lblrow" ref={rowRef}>
          <span className="tx-lbl-a" ref={lblARef}>{t.txBefore}</span>
          <span className="tx-lbl-b" ref={lblBRef}>{t.txAfter}</span>
          <div className="tx-spirit" ref={spiritRef}>
            <div className="tx-spirit-core" />
            <div className="tx-spirit-l" />
            <div className="tx-spirit-r" />
          </div>
          <div className="tx-spirit-trail" ref={trailRef} />
        </div>
      </div>
    </div>
  )
}
