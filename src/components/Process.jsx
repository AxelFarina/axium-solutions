import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks.js'

const LOOP_SECONDS = 16 // one full signal crossing

/*
 * Dark process section with a circuit trace. A glowing signal draws along the
 * main trace on a 16s loop; the active step follows the signal. Clicking a
 * chip or card jumps the signal to that step.
 */
export default function Process({ t }) {
  const [step, setStep] = useState(0)
  const litRef = useRef(null)
  const startRef = useRef(0)
  const headRef = useReveal()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    startRef.current = performance.now() / 1000
    let raf
    let current = 0
    const tick = () => {
      const line = litRef.current
      if (line) {
        const now = performance.now() / 1000
        const p = reduced ? 0.999 : (((now - startRef.current) % LOOP_SECONDS) / LOOP_SECONDS)
        const pct = p * 100
        const total = line.getTotalLength ? line.getTotalLength() : 1245
        line.style.strokeDasharray = String(total)
        line.style.strokeDashoffset = String(total * (1 - p))
        const st = pct < 12.5 ? 0 : Math.min(3, Math.floor((pct - 12.5) / 25))
        if (st !== current) { current = st; setStep(st) }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // jump the signal so it has just reached chip i
  const select = (i) => {
    startRef.current = performance.now() / 1000 - ((12.5 + i * 25) / 100) * LOOP_SECONDS
    setStep(i)
  }

  return (
    <div className="process" id="process">
      <div className="process-halo" />
      <div className="process-head reveal" ref={headRef}>
        <div className="kicker"><span className="accent">✦</span> {t.processKicker}</div>
        <h2>{t.processTitle}</h2>
        <p>{t.processSub}</p>
      </div>
      <div className="process-wrap">
        <div className="process-trace">
          <svg viewBox="0 0 1180 140" preserveAspectRatio="none">
            <path d="M0 116 L64 116 L110 70 L1180 70" fill="none" stroke="rgba(245,239,230,.14)" strokeWidth="2" />
            <path d="M240 70 L280 30 L360 30" fill="none" stroke="rgba(245,239,230,.09)" strokeWidth="1.5" />
            <path d="M560 70 L600 110 L680 110" fill="none" stroke="rgba(245,239,230,.09)" strokeWidth="1.5" />
            <path d="M880 70 L920 30 L990 30" fill="none" stroke="rgba(245,239,230,.09)" strokeWidth="1.5" />
            <circle cx="360" cy="30" r="4" fill="none" stroke="rgba(245,239,230,.18)" strokeWidth="1.5" />
            <circle cx="680" cy="110" r="4" fill="none" stroke="rgba(245,239,230,.18)" strokeWidth="1.5" />
            <circle cx="990" cy="30" r="4" fill="none" stroke="rgba(245,239,230,.18)" strokeWidth="1.5" />
            <path ref={litRef} d="M0 116 L64 116 L110 70 L1180 70" fill="none" stroke="url(#axm-trace-grad)" strokeWidth="3" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,138,80,.8))' }} />
            <defs>
              <linearGradient id="axm-trace-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ED4E22" />
                <stop offset="1" stopColor="#ffb08a" />
              </linearGradient>
            </defs>
          </svg>
          {t.steps.map((p, i) => (
            <div
              key={p.num}
              className={`step-chip ${i === step ? 'active' : ''} ${i < step ? 'passed' : ''}`}
              style={{ left: `${12.5 + i * 25}%` }}
              onClick={() => select(i)}
            >
              <div className="step-chip-pins-t" />
              <div className="step-chip-pins-b" />
              <div className="step-chip-face">{p.num}</div>
            </div>
          ))}
        </div>
        <div className="process-grid">
          {t.steps.map((p, i) => (
            <div key={p.num} className={`step-card ${i === step ? 'active' : ''}`} onClick={() => select(i)}>
              <div className="step-head">
                <div className="step-num">{p.num}</div>
                <div className="step-dot" />
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
