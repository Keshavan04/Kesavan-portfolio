import { useCallback, useEffect, useRef, useState } from 'react'
import Logo from './ui/Logo'

/**
 * Full-screen curtain that draws the logo, holds, then slides up off-screen.
 * Scrolling is locked until it finishes (1.6s animation, 1.8s hard fallback).
 */
export default function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true)
  const done = useRef(false)
  const cb = useRef(onDone)
  cb.current = onDone

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    document.documentElement.classList.remove('no-scroll')
    document.documentElement.style.top = ''
    setVisible(false)
    cb.current?.()
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('no-scroll')
    const t = setTimeout(finish, 1800)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('no-scroll')
      document.documentElement.style.top = ''
    }
  }, [finish])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, #0a1a45 0%, #050a30 50%, #020815 100%)',
        animation: 'entrySlideUp 1.6s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      }}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) finish()
      }}
    >
      <Logo size={120} animated />
    </div>
  )
}
