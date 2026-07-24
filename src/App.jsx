import { useEffect, useState } from 'react'
import { dict } from './i18n.js'
import Splash from './components/Splash.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Lab from './components/Lab.jsx'
import Transform from './components/Transform.jsx'
import Process from './components/Process.jsx'
import Globe from './components/Globe.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [lang, setLang] = useState('en')
  const [showSplash] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const t = dict[lang]

  // While the splash plays, hold the nav/hero copy hidden, then stagger it in
  // (2700ms splash trigger + 2000ms, +260ms per element — same as the prototype).
  useEffect(() => {
    if (!showSplash) return
    const intros = Array.from(document.querySelectorAll('[data-intro]'))
    intros.forEach((el) => {
      el.style.opacity = '0'
      if (el.getAttribute('data-intro') !== 'fade') el.style.transform = 'translateY(26px)'
    })
    const timers = intros.map((el, i) =>
      setTimeout(() => {
        el.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.7,.2,1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 4700 + i * 260),
    )
    return () => timers.forEach(clearTimeout)
  }, [showSplash])

  return (
    <>
      {showSplash && <Splash />}
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Services t={t} />
      <Lab t={t} />
      <Transform t={t} />
      <Globe t={t} />
      <Process t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  )
}
