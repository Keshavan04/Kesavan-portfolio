import { useEffect, useState } from 'react'

/**
 * RGB-split glitch. Every 100ms there is a 10% chance of a 100-300ms burst
 * where three colour channels offset and clip into horizontal bands.
 */
export default function GlitchText({ text, className = '' }) {
  const [glitching, setGlitching] = useState(false)
  const [shift, setShift] = useState({ r: 0, g: 0, b: 0 })

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitching(true)
        setShift({
          r: (Math.random() - 0.5) * 10,
          g: (Math.random() - 0.5) * 10,
          b: (Math.random() - 0.5) * 10,
        })
        setTimeout(() => setGlitching(false), 100 + Math.random() * 200)
      }
    }, 100)
    return () => clearInterval(id)
  }, [])

  const channel = (color, dx, dy, band) => (
    <span
      className={`absolute inset-0 ${color} opacity-70`}
      style={{
        transform: glitching ? `translate(${dx}px, ${dy}px)` : 'none',
        clipPath: glitching ? band : 'none',
        mixBlendMode: 'screen',
        transition: 'none',
      }}
      aria-hidden="true"
    >
      {text}
    </span>
  )

  return (
    <div className={`relative ${className}`}>
      {channel('text-red-500', shift.r, -shift.r * 0.5, 'polygon(0 15%, 100% 15%, 100% 40%, 0 40%)')}
      {channel('text-green-500', shift.g, shift.g * 0.5, 'polygon(0 40%, 100% 40%, 100% 65%, 0 65%)')}
      {channel('text-blue-500', shift.b, -shift.b * 0.3, 'polygon(0 65%, 100% 65%, 100% 85%, 0 85%)')}
      <span className="relative z-10 text-white">{text}</span>
    </div>
  )
}
