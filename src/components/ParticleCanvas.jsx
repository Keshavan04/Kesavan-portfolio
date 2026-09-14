import { useEffect, useRef } from 'react'

const RGB = [108, 186, 250]
const REPEL_RADIUS = 200
const REPEL_FORCE = 0.3
const RETURN_EASE = 0.02

/**
 * Drifting particle field with proximity-linked lines.
 * The pointer pushes particles away; they ease back to their base velocity.
 * Fills its positioned parent.
 */
export default function ParticleCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w, h
    const resize = () => {
      w = canvas.width = canvas.parentElement.clientWidth
      h = canvas.height = canvas.parentElement.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const mobile = window.innerWidth < 768
    const count = mobile ? 50 : 160
    const linkDist = mobile ? 100 : 140

    const mouse = { x: -9999, y: -9999, active: false }
    const particles = Array.from({ length: count }, () => {
      const baseVx = (Math.random() - 0.5) * 0.4
      const baseVy = (Math.random() - 0.5) * 0.4
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: baseVx,
        vy: baseVy,
        r: 1.2 + Math.random() * 1.8,
        baseVx,
        baseVy,
      }
    })

    let idleTimer = null
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = true
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        mouse.active = false
      }, 100)
    }
    canvas.parentElement.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < count; i++) {
        const p = particles[i]

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < REPEL_RADIUS && d > 0) {
            const push = (REPEL_RADIUS - d) / REPEL_RADIUS
            p.vx += (dx / d) * push * REPEL_FORCE
            p.vy += (dy / d) * push * REPEL_FORCE
          }
        }

        p.vx += (p.baseVx - p.vx) * RETURN_EASE
        p.vy += (p.baseVy - p.vy) * RETURN_EASE
        p.x += p.vx
        p.y += p.vy

        // wrap around the edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${RGB[0]}, ${RGB[1]}, ${RGB[2]}, 0.25)`
        ctx.fill()

        for (let j = i + 1; j < count; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < linkDist) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${RGB[0]}, ${RGB[1]}, ${RGB[2]}, ${(1 - d / linkDist) * 0.12})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      window.removeEventListener('resize', resize)
      canvas.parentElement?.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
