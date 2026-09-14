import { useEffect, useRef, useState } from 'react'

/**
 * Fires once when `ratio` of the element is inside the viewport.
 * Backed by IntersectionObserver, with a manual scroll check so elements that
 * are already on screen at mount (or restored scroll positions) reveal too.
 */
export default function useReveal(ratio = 0.12) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const r = el.getBoundingClientRect()
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
      if (r.height > 0 && visible / r.height >= ratio) setShown(true)
    }

    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown(true),
      { threshold: ratio }
    )
    io.observe(el)

    check()
    requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', check)
    }
  }, [ratio])

  return [ref, shown]
}
