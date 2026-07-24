import { lazy, Suspense, useState } from 'react'

// three.js is heavy — load it only when this section renders
const Orbit3D = lazy(() => import('./Orbit3D.jsx'))

export default function Lab({ t }) {
  const [variant, setVariant] = useState('chip')
  return (
    <div className="lab" id="lab">
      <div className="lab-head">
        <div className="kicker"><span className="accent">✦</span> {t.labKicker}</div>
        <h2>{t.labTitle}</h2>
        <p>{t.labSub}</p>
        <div className="lab-tabs">
          {t.labTabs.map((tab) => (
            <button key={tab.id} className={variant === tab.id ? 'on' : ''} onClick={() => setVariant(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lab-stage">
        <div className="lab-stage-glow" />
        <Suspense fallback={<div className="orbit-canvas" />}>
          <Orbit3D variant={variant} />
        </Suspense>
        <div className="lab-hint">{t.labHint}</div>
      </div>
    </div>
  )
}
