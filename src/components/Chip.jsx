export default function Chip({ markParts = false }) {
  return (
    <>
      <div className="chip-pin-t" />
      <div className="chip-pin-b" />
      <div className="chip-pin-l" />
      <div className="chip-pin-r" />
      <div className="chip-body" />
      <div className="chip-die">
        {markParts ? (
          <div style={{ position: 'relative', width: '72%' }}>
            {[
              { clip: 'polygon(0 0, 58% 0, 58% 100%, 0 100%)', alt: 'AX', abs: false },
              { clip: 'polygon(58% 0, 74% 0, 74% 100%, 58% 100%)', alt: '', abs: true },
              { clip: 'polygon(74% 0, 88% 0, 88% 100%, 74% 100%)', alt: '', abs: true },
              { clip: 'polygon(88% 0, 100% 0, 100% 100%, 88% 100%)', alt: '', abs: true },
            ].map((p, i) => (
              <img
                key={i}
                src="assets/mark-white.png" alt={p.alt} aria-hidden={p.abs || undefined}
                className={`splash-part-${i + 1}`}
                style={{
                  display: 'block', width: '100%', height: 'auto',
                  ...(p.abs ? { position: 'absolute', inset: 0 } : {}),
                  clipPath: p.clip,
                  filter: 'drop-shadow(0 0 14px rgba(255,138,80,.45))',
                }}
              />
            ))}
          </div>
        ) : (
          <img src="assets/mark-white.png" alt="AX" className="chip-mark" />
        )}
      </div>
    </>
  )
}
