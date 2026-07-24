import { useState } from 'react'

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
              <a href="#top" title="LinkedIn">in</a>
              <a href="#top" title="X">x</a>
              <a href="#top" title="YouTube">yt</a>
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
