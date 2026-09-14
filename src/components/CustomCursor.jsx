import { useEffect, useRef } from 'react'

const IDLE_RING = 18
const HOVER_RING = 26
const IDLE_DOT = 5
const HOVER_DOT = 2
const ACCENT = { r: 108, g: 186, b: 250 }
const ON_LIGHT = { r: 15, g: 40, b: 90 } // darkens over accent-filled surfaces

/**
 * Canvas cursor: a filled dot that tracks the pointer exactly, plus a ring
 * that lags behind it. The ring grows and the dot shrinks over interactive
 * elements; both darken over elements marked `data-dark-cursor`.
 */
export default function CustomCursor() {
  const canvasRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const eased = useRef({ x: -100, y: -100 })
  const raf = useRef(0)
  const hovering = useRef(false)
  const onDark = useRef(false)
  const ring = useRef(IDLE_RING)
  const dot = useRef(IDLE_DOT)
  const color = useRef({ ...ACCENT })

  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    if (isTouch) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      if (eased.current.x === -100) {
        eased.current.x = e.clientX
        eased.current.y = e.clientY
      }
    }
    window.addEventListener('mousemove', onMove)

    const onOver = (e) => {
      hovering.current = !!e.target.closest(
        "a, button, [role='button'], input, textarea, select, [onclick]"
      )
      onDark.current = !!e.target.closest('[data-dark-cursor]')
    }
    document.addEventListener('mouseover', onOver)

    const draw = () => {
      raf.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      eased.current.x += (target.current.x - eased.current.x) * 0.18
      eased.current.y += (target.current.y - eased.current.y) * 0.18

      ring.current += ((hovering.current ? HOVER_RING : IDLE_RING) - ring.current) * 0.15
      dot.current += ((hovering.current ? HOVER_DOT : IDLE_DOT) - dot.current) * 0.15

      const want = onDark.current ? ON_LIGHT : ACCENT
      const c = color.current
      c.r += (want.r - c.r) * 0.12
      c.g += (want.g - c.g) * 0.12
      c.b += (want.b - c.b) * 0.12

      if (target.current.x < 0) return
      const rgb = `${c.r | 0}, ${c.g | 0}, ${c.b | 0}`

      ctx.beginPath()
      ctx.arc(eased.current.x, eased.current.y, ring.current, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rgb}, 0.7)`
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(target.current.x, target.current.y, dot.current, 0, Math.PI * 2)
      ctx.fillStyle = `rgb(${rgb})`
      ctx.fill()
    }
    draw()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 10000 }}
      aria-hidden="true"
    />
  )
}
