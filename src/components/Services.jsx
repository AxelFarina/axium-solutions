import { useRef } from 'react'
import { useReveal } from '../hooks.js'

function SpotCard({ className = '', children }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const card = ref.current
    const glow = card?.querySelector('.spot-glow')
    if (!glow) return
    const r = card.getBoundingClientRect()
    glow.style.left = `${e.clientX - r.left - 170}px`
    glow.style.top = `${e.clientY - r.top - 170}px`
    glow.style.opacity = '1'
  }
  const onLeave = () => {
    const glow = ref.current?.querySelector('.spot-glow')
    if (glow) glow.style.opacity = '0'
  }
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="spot-glow" />
      {children}
    </div>
  )
}

function Reveal({ children, className = '' }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export default function Services({ t }) {
  return (
    <div className="services" id="services">
      <div className="section-head">
        <div className="kicker"><span className="accent">✦</span> {t.servicesKicker}</div>
        <h2>{t.featTitle}</h2>
      </div>

      <div className="bento-top">
        <Reveal>
          <SpotCard className="card card-lg">
            <div style={{ position: 'absolute', bottom: -100, left: -40, width: 380, height: 280, background: 'radial-gradient(closest-side, rgba(237,78,34,.4), transparent 70%)' }} />
            <div className="card-f1-grid">
              <div>
                <h3>{t.f1t}</h3>
                <p style={{ maxWidth: 440 }}>{t.f1d}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="load-bar"><div style={{ animation: 'axm-bar 2.6s ease-in-out infinite alternate' }} /></div>
                <div className="load-bar"><div style={{ animation: 'axm-bar 3.2s ease-in-out infinite alternate .5s' }} /></div>
                <div className="load-bar"><div style={{ animation: 'axm-bar 2.2s ease-in-out infinite alternate 1s' }} /></div>
                <div className="go-live">GO-LIVE ON TRACK</div>
              </div>
            </div>
          </SpotCard>
        </Reveal>

        <Reveal>
          <SpotCard className="card card-lg">
            <div style={{ position: 'absolute', top: -80, right: -60, width: 280, height: 240, background: 'radial-gradient(closest-side, rgba(237,78,34,.35), transparent 70%)' }} />
            <h3>{t.f2t}</h3>
            <p style={{ marginBottom: 22 }}>{t.f2d}</p>
            <svg viewBox="0 0 420 80" style={{ position: 'relative', width: '100%', height: 80, display: 'block' }}>
              <path d="M20 40 L150 40 L190 15 L400 15" fill="none" stroke="rgba(255,190,150,.15)" strokeWidth="2" />
              <path d="M20 40 L150 40 L190 65 L400 65" fill="none" stroke="rgba(255,190,150,.15)" strokeWidth="2" />
              <path d="M20 40 L150 40 L190 15 L400 15" fill="none" stroke="#ff8a50" strokeWidth="2" strokeLinecap="round" strokeDasharray="34 400"
                style={{ animation: 'axm-dash-v 2.8s linear infinite', filter: 'drop-shadow(0 0 4px rgba(255,138,80,.8))' }} />
              <path d="M20 40 L150 40 L190 65 L400 65" fill="none" stroke="#ff8a50" strokeWidth="2" strokeLinecap="round" strokeDasharray="34 400"
                style={{ animation: 'axm-dash-v 3.4s linear infinite 1.1s', filter: 'drop-shadow(0 0 4px rgba(255,138,80,.8))' }} />
              <circle cx="20" cy="40" r="7" fill="#1A1310" stroke="rgba(255,170,120,.6)" strokeWidth="2" />
              <circle cx="400" cy="15" r="7" fill="#1A1310" stroke="rgba(255,170,120,.6)" strokeWidth="2" />
              <circle cx="400" cy="65" r="7" fill="#1A1310" stroke="rgba(255,170,120,.6)" strokeWidth="2" />
            </svg>
          </SpotCard>
        </Reveal>
      </div>

      <div className="bento-grid">
        {[
          { icon: '◇', title: t.f3t, desc: t.f3d },
          { icon: '⟐', title: t.f4t, desc: t.f4d },
          { icon: '◎', title: t.f5t, desc: t.f5d },
          { icon: '✦', title: t.f6t, desc: t.f6d, hot: true, glow: { top: -60, right: -60 } },
          { icon: '⬡', title: t.f7t, desc: t.f7d, hot: true, glow: { top: -60, left: -60 } },
          { icon: '⇄', title: t.f8t, desc: t.f8d },
        ].map((c) => (
          <Reveal key={c.title}>
            <div className={`card ${c.hot ? 'hot' : ''}`} style={{ height: '100%' }}>
              {c.glow && (
                <div style={{ position: 'absolute', width: 200, height: 180, background: 'radial-gradient(closest-side, rgba(237,78,34,.3), transparent 70%)', ...c.glow }} />
              )}
              <div className="card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
