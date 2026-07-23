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
            <img
              src="assets/mark-white.png" alt=""
              className="splash-part-1"
              style={{ display: 'block', width: '100%', height: 'auto', clipPath: 'polygon(0 0, 58% 0, 58% 100%, 0 100%)', filter: 'drop-shadow(0 0 14px rgba(255,138,80,.45))' }}
            />
            <img
              src="assets/mark-white.png" alt="AX"
              className="splash-part-2"
              style={{ display: 'block', width: '100%', height: 'auto', position: 'absolute', inset: 0, clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 58% 100%)', filter: 'drop-shadow(0 0 14px rgba(255,138,80,.45))' }}
            />
          </div>
        ) : (
          <img src="assets/mark-white.png" alt="AX" className="chip-mark" />
        )}
      </div>
    </>
  )
}
