export default function Contact({ t }) {
  return (
    <div className="contact" id="contact">
      <div className="contact-glow" />
      <div className="contact-inner">
        <h2>{t.contactTitle}</h2>
        <p>{t.contactSub}</p>
        <a href="mailto:hello@axiumsolutions.com" className="btn-contact">{t.contactCta}</a>
      </div>
    </div>
  )
}
