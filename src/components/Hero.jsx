import { useEffect, useRef } from 'react'
import Chip from './Chip.jsx'

const TRACES = [
  'M172 80 L330 80 L390 140 L535 140',
  'M92 180 L535 180',
  'M182 290 L360 290 L425 225 L535 225',
  'M1028 80 L870 80 L810 140 L665 140',
  'M1108 180 L665 180',
  'M1018 290 L840 290 L775 225 L665 225',
  'M575 245 L575 360',
  'M600 245 L600 380',
  'M625 245 L625 340',
]

const LIT = [
  { d: TRACES[0], dur: '3.4s', delay: '0s' },
  { d: TRACES[2], dur: '4.6s', delay: '1.2s' },
  { d: TRACES[3], dur: '3.9s', delay: '.6s' },
  { d: TRACES[4], dur: '5.2s', delay: '2s' },
  { d: TRACES[1], dur: '4.2s', delay: '2.6s' },
]

export default function Hero({ t }) {
  const circuitRef = useRef(null)
  const outerRef = useRef(null)

  // the circuit is fixed 1200px art — scale it down on narrow viewports
  useEffect(() => {
    const fit = () => {
      const w = Math.min(window.innerWidth - 40, 1200)
      const scale = w / 1200
      if (circuitRef.current) circuitRef.current.style.transform = `scale(${scale})`
      if (outerRef.current) outerRef.current.style.height = `${380 * scale}px`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <header className="hero" id="top">
      <div className="hero-corner-glow" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-badge" data-intro>
          <span className="accent">✦</span> {t.badge}
        </div>
        <h1 data-intro>
          {t.title1} <span className="grad-text">{t.title2}</span>
        </h1>
        <p className="hero-sub" data-intro>{t.sub}</p>
        <div className="hero-ctas" data-intro>
          <a href="#contact" className="btn-hero">{t.heroCta1}</a>
          <a href="#services" className="btn-hero-ghost">{t.heroCta2}</a>
        </div>
      </div>

      <div className="circuit-outer" ref={outerRef} data-intro="fade" style={{ overflow: 'visible' }}>
        <div className="circuit" ref={circuitRef}>
          <svg viewBox="0 0 1200 380">
            {TRACES.map((d) => <path key={d} className="trace" d={d} />)}
            {LIT.map((p, i) => (
              <path key={i} className="trace-lit" d={p.d}
                style={{ animation: `axm-dash ${p.dur} linear infinite ${p.delay}` }} />
            ))}
            <path className="trace-lit" d="M600 245 L600 380" strokeDasharray="40 400"
              style={{ animation: 'axm-dash-v 3s linear infinite 1s' }} />
          </svg>

          <div className="hero-chip">
            <Chip />
          </div>

          <div className="platform-chip" title="SAP" style={{ left: 108, top: 48 }}>
            <img src="assets/sap.svg" alt="SAP" style={{ width: 34, height: 34 }} />
          </div>
          <div className="platform-chip" title="Epicor" style={{ left: 28, top: 148, fontSize: 24 }}>E</div>
          <div className="platform-chip" title="Prophet 21" style={{ left: 118, top: 258, fontSize: 17 }}>P21</div>
          <div className="platform-chip" title="Acumatica" style={{ left: 996, top: 48, fontSize: 24 }}>A</div>
          <div className="platform-chip" title="OpenAI" style={{ left: 1076, top: 148 }}>
            <img src="assets/openai.svg" alt="OpenAI" style={{ width: 32, height: 32 }} />
          </div>
          <div className="platform-chip" title="Claude" style={{ left: 986, top: 258 }}>
            <img src="assets/claude.svg" alt="Claude" style={{ width: 32, height: 32 }} />
          </div>
        </div>
      </div>
    </header>
  )
}
