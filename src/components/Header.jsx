import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-scroll'
import Logo from './ui/Logo'
import RollText from './ui/RollText'
import SocialIcon from './ui/SocialIcon'
import { navLinks, person, socials } from '../data/content'

const SECTION_IDS = navLinks.map((l) => l.to)
const SCROLLED_AT = 80

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(-1)
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 })

  const navRef = useRef(null)
  const itemRefs = useRef([])

  /* ---------- scroll lock while the mobile menu is open ---------- */
  const lock = () => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.body.style.overscrollBehavior = 'none'
  }
  const unlock = () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.touchAction = ''
    document.body.style.overscrollBehavior = ''
  }
  const toggleMenu = () =>
    setMenuOpen((open) => {
      const next = !open
      next ? lock() : unlock()
      return next
    })
  const closeMenu = () => {
    if (!menuOpen) return
    setMenuOpen(false)
    unlock()
  }

  /* ---------- condensed header once past the fold ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= SCROLLED_AT)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------- which section is in view ---------- */
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.32
      let found = -1
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > 40) found = i
      })
      setActive(found)

      // keep the URL hash in step without adding history entries
      if (found >= 0) {
        const hash = `#${SECTION_IDS[found]}`
        if (window.location.hash !== hash) {
          window.history.replaceState(null, '', hash)
        }
      } else if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  /* ---------- sliding pill behind the active nav item ---------- */
  const measurePill = useCallback((index) => {
    const nav = navRef.current
    const item = itemRefs.current[index]
    if (!nav || !item) {
      setPill((p) => ({ ...p, opacity: 0 }))
      return
    }
    const navBox = nav.getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()
    setPill({ left: itemBox.left - navBox.left, width: itemBox.width, opacity: 1 })
  }, [])

  useEffect(() => {
    if (active >= 0) measurePill(active)
    else setPill((p) => ({ ...p, opacity: 0 }))
  }, [active, measurePill])

  useEffect(() => {
    const onResize = () => active >= 0 && measurePill(active)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active, measurePill])

  /**
   * Contact is below a 300vh pinned carousel. Jumping straight there would
   * skip the whole sequence, so scroll to the carousel first, then hand off.
   */
  const goToContact = () => {
    closeMenu()
    const carousel = document.getElementById('projects-carousel-wrapper')
    const contact = document.getElementById('Contact')
    if (!carousel) {
      contact?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (carousel.getBoundingClientRect().bottom < window.innerHeight + 50) {
      contact?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    carousel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const waitForPin = () => {
      if (carousel.getBoundingClientRect().top <= 5) {
        window.dispatchEvent(new CustomEvent('sequentialScrollToContact'))
      } else {
        requestAnimationFrame(waitForPin)
      }
    }
    setTimeout(() => requestAnimationFrame(waitForPin), 50)
  }

  const chip = (extra = '') =>
    `${extra} transition-all duration-700 ${
      scrolled ? 'bg-dark/80 backdrop-blur-xl border-accent/20' : 'bg-transparent border-transparent'
    }`

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${
        menuOpen ? 'h-screen' : 'h-auto'
      }`}
    >
      <nav className="relative z-50 mx-auto max-w-[1528px] px-6 md:px-12 lg:px-16 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* logo */}
          <Link spy smooth to="Home" className="flex-shrink-0" aria-label="Home">
            <div className={chip('w-11 h-11 rounded-full border flex items-center justify-center')}>
              <Logo size={28} className="hover:scale-110 transition-transform duration-500" />
            </div>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <div
              ref={navRef}
              className={chip('relative flex items-center gap-1 px-2 py-2 rounded-full border')}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full bg-accent/15 border border-accent/30 pointer-events-none"
                style={{
                  left: pill.left,
                  width: pill.width,
                  height: 'calc(100% - 8px)',
                  opacity: pill.opacity,
                  transition:
                    'left 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
                }}
              />
              {navLinks.map((item, i) => {
                const tone = active === i ? 'text-accent' : 'text-txt/70'
                const cls = `group flex text-sm px-5 py-1.5 rounded-full tracking-wide transition-colors duration-300 ${tone}`
                return (
                  <div
                    key={item.label}
                    ref={(node) => {
                      itemRefs.current[i] = node
                    }}
                    className="relative z-10"
                  >
                    {item.to === 'Contact' ? (
                      <button onClick={goToContact} className={cls}>
                        <RollText>{item.label}</RollText>
                      </button>
                    ) : (
                      <Link spy smooth hashSpy to={item.to} offset={-80} duration={700} className={cls}>
                        <RollText>{item.label}</RollText>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* availability badge */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <div className={chip('flex items-center gap-2 px-4 py-2 rounded-full border')}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-accent tracking-[0.2em] uppercase font-mono">
                {person.available ? 'Available' : 'Booked'}
              </span>
            </div>
          </div>

          {/* hamburger */}
          <div className="md:hidden">
            <label
              className={chip('hamburger rounded-full border flex items-center justify-center')}
              htmlFor="hamburger-checkbox"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <input
                type="checkbox"
                id="hamburger-checkbox"
                checked={menuOpen}
                onChange={toggleMenu}
              />
              <svg viewBox="0 0 32 32">
                <path
                  className="line line-top-bottom"
                  d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                />
                <path className="line" d="M7 16 27 16" />
              </svg>
            </label>
          </div>
        </div>
      </nav>

      {/* ---------------- mobile overlay menu ---------------- */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 z-40 ${menuOpen ? '' : 'pointer-events-none'}`}
        style={{
          // Fully hidden when closed (nothing peeks through the wrappers);
          // the delay lets the close animation finish first.
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: `visibility 0s linear ${menuOpen ? '0s' : '0.8s'}`,
        }}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-dark/[0.98] backdrop-blur-xl origin-right"
          style={{
            transform: menuOpen ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.7s cubic-bezier(0.76,0,0.24,1)',
          }}
        />
        <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none bg-accent/10" />
        <div className="absolute bottom-[20%] left-[5%] w-[250px] h-[250px] rounded-full blur-[100px] pointer-events-none bg-accent/[0.07]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none bg-accent/[0.05]" />

        <div className="relative h-full flex flex-col items-start justify-center gap-6 px-10">
          <div className="overflow-hidden">
            <p
              className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/50 mb-2"
              style={{
                transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.6s cubic-bezier(0.76,0,0.24,1) 0.25s',
              }}
            >
              Navigation
            </p>
          </div>

          {navLinks.map((item, i) => (
            <div key={item.label} className="overflow-hidden">
              <div
                style={{
                  transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
                  transition: `transform 0.7s cubic-bezier(0.76,0,0.24,1) ${0.3 + i * 0.08}s`,
                }}
              >
                {item.to === 'Contact' ? (
                  <button onClick={goToContact} className="group flex items-center gap-4">
                    <span className="text-[10px] font-mono text-accent/40 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-4xl sm:text-5xl font-light text-txt tracking-tight group-hover:text-accent transition-colors duration-500">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    spy
                    smooth
                    to={item.to}
                    offset={-80}
                    duration={700}
                    onClick={closeMenu}
                    className="group flex items-center gap-4 no-underline"
                  >
                    <span className="text-[10px] font-mono text-accent/40 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-4xl sm:text-5xl font-light text-txt tracking-tight group-hover:text-accent transition-colors duration-500">
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}

          <div
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s',
            }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-txt/50">
                Available for work
              </span>
            </div>
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-txt/50 hover:text-accent transition-colors duration-300"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
