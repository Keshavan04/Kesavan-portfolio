import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Scroll-linked vertical parallax.
 *
 * `strengths` maps a key -> pixels of travel per unit of viewport offset.
 * Negative values move the element against the scroll direction.
 * Returns [offsets, registerRef].
 */
export default function useParallax(strengths) {
  const keys = Object.keys(strengths)
  const nodes = useRef({})
  const [offsets, setOffsets] = useState(() =>
    keys.reduce((acc, k) => ({ ...acc, [k]: 0 }), {})
  )

  const register = useCallback((key) => (node) => {
    nodes.current[key] = node
  }, [])

  useEffect(() => {
    let queued = false

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        const vh = window.innerHeight
        const next = {}
        let any = false

        for (const key of keys) {
          const node = nodes.current[key]
          if (!node) {
            next[key] = 0
            continue
          }
          const r = node.getBoundingClientRect()
          // -0.5 .. 0.5 as the element travels through the viewport
          const centered = (r.top + r.height / 2) / vh - 0.5
          next[key] = Math.round(centered * strengths[key] * 10) / 10
          any = true
        }

        if (any) setOffsets(next)
        queued = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [offsets, register]
}
