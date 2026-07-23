export default function Nav({ t, lang, setLang }) {
  return (
    <nav className="nav" data-intro>
      <a href="#top"><img src="assets/logo-white-crop.png" alt="Axium Solutions" className="nav-logo" /></a>
      <div className="nav-links">
        <a href="#services">{t.navServices}</a>
        <a href="#top">{t.navPlatforms}</a>
        <a href="#process">{t.navProcess}</a>
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <a href="#contact" className="btn-ghost">{t.navContact}</a>
        <a href="#contact" className="btn-primary">{t.navCta}</a>
      </div>
    </nav>
  )
}
