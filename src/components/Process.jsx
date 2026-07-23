import { useEffect, useRef, useState } from 'react'

export default function Process({ t }) {
  const [step, setStep] = useState(0)
  const timerRef = useRef(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setStep((s) => (s + 1) % 4), 3400)
  }

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) resetTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="process" id="process">
      <div className="process-head">
        <h2>{t.processTitle}</h2>
        <p>{t.processSub}</p>
      </div>
      <div className="process-track">
        <div className="process-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>
      <div className="process-grid">
        {t.steps.map((p, i) => (
          <div
            key={p.num}
            className={`step-card ${i === step ? 'active' : ''}`}
            onClick={() => { setStep(i); resetTimer() }}
          >
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
  )
}
