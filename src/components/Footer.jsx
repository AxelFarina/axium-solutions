import { useState } from 'react'

export default function Footer({ t }) {
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('Newsletter subscription')
    const body = encodeURIComponent(`Please subscribe: ${email}`)
    window.location.href = `mailto:hello@axiumsolutions.com?subject=${subject}&body=${body}`
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
              <a href="mailto:hello@axiumsolutions.com">hello@axiumsolutions.com</a>
              <a href="mailto:support@axiumsolutions.com">support@axiumsolutions.com</a>
              <span>+1 (000) 000-0000</span>
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
