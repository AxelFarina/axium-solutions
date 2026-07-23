import { useEffect, useRef, useState } from 'react'
import Chip from './Chip.jsx'

/*
 * Intro splash: the big chip assembles center-screen, then "flies" down/shrinks
 * into the hero circuit-board chip while the page fades in behind it.
 * Timing mirrors the design prototype.
 */
export default function Splash({ onDone }) {
  const chipRef = useRef(null)
  const bgRef = useRef(null)
  const rootRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const timers = []
    timers.push(setTimeout(() => {
      const chip = chipRef.current
      const hero = document.querySelector('.hero-chip')
      const bg = bgRef.current
      if (chip && hero) {
        const cr = chip.getBoundingClientRect()
        const hr = hero.getBoundingClientRect()
        const s = hr.width / cr.width
        const dx = hr.left - cr.left
        const dy = hr.top - cr.top
        chip.style.animation = 'none'
        void chip.offsetWidth
        chip.style.transition = 'transform 3.2s cubic-bezier(.45,.05,.3,1)'
        void chip.offsetWidth
        requestAnimationFrame(() => {
          chip.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`
        })
      }
      if (bg) {
        bg.style.transition = 'opacity 2.6s ease 1.2s'
        bg.style.opacity = '0'
      }
      if (rootRef.current) rootRef.current.style.pointerEvents = 'none'
      onDone?.()
    }, 2700))
    timers.push(setTimeout(() => setGone(true), 6800))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  if (gone) return null
  return (
    <div className="splash" ref={rootRef}>
      <div className="splash-bg" ref={bgRef}>
        <div className="splash-glow" />
      </div>
      <div className="splash-chip" ref={chipRef}>
        <Chip markParts />
      </div>
    </div>
  )
}
