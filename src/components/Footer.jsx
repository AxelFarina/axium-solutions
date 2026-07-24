import { useState } from 'react'

const SOCIALS = [
  {
    title: 'LinkedIn',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    title: 'X',
    d: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
  },
  {
    title: 'YouTube',
    d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
]

export default function Footer({ t }) {
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('Newsletter subscription')
    const body = encodeURIComponent(`Please subscribe: ${email}`)
    window.location.href = `mailto:axfarina@axiumsolutions.net?subject=${subject}&body=${body}`
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <img src="assets/logo-white-crop.png" alt="Axium Solutions" className="footer-logo" />
            <p className="footer-blurb">{t.footBlurb}</p>
            <div className="footer-social">
              {SOCIALS.map((s) => (
                <a key={s.title} href="#top" title={s.title} aria-label={s.title}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">{t.colServices}</div>
            <div className="footer-links">
              {t.footServices.map((s) => <a key={s} href="#services">{s}</a>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">{t.colCompany}</div>
            <div className="footer-links">
              <a href="#top">{t.footHome}</a>
              <a href="#process">{t.navProcess}</a>
              <a href="#top">{t.navPlatforms}</a>
              <a href="#contact">{t.navContact}</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">{t.colContact}</div>
            <div className="footer-links">
              <a href="mailto:axfarina@axiumsolutions.net">axfarina@axiumsolutions.net</a>
              <a href="tel:+15133994175">+1 513-399-4175</a>
              <span>6545 Market Ave. North, STE 100<br />Canton, OH 44721</span>
            </div>
          </div>
        </div>

        <div className="footer-news">
          <div className="footer-news-title">{t.newsTitle}</div>
          <form className="footer-news-form" onSubmit={subscribe}>
            <input
              type="email"
              required
              placeholder={t.newsPh}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">{t.newsBtn}</button>
          </form>
        </div>

        <div className="footer-legal">
          <span>© 2026 AXIUM SOLUTIONS. {t.rights}</span>
          <span>{t.footerTag}</span>
        </div>
      </div>
    </footer>
  )
}
