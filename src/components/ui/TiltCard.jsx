import { useCallback, useState } from 'react'

const REST = {
  transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
  transition: 'transform 0.6s cubic-bezier(0.22,0.61,0.36,1)',
}

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

/** Subtle ±3° 3D tilt that tracks the pointer. No-op on touch devices. */
export default function TiltCard({ children, className = '' }) {
  const [style, setStyle] = useState(REST)

  const onMove = useCallback((e) => {
    if (isTouch) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setStyle({
      transform: `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`,
      transition: 'transform 0.15s ease-out',
    })
  }, [])

  const onLeave = useCallback(() => setStyle(REST), [])

  return (
    <div className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>
      {children}
    </div>
  )
}
