import { useEffect, useRef } from 'react'

/* Fade-and-rise an element in when it scrolls into view. */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('shown')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
