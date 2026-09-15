import { useCallback, useEffect, useRef, useState } from 'react'
import GlitchText from './ui/GlitchText'
import { person, projects as staticProjects } from '../data/content'
import { api } from '../lib/api'

/* ---------------------------------------------------------------------------
 * 3D carousel geometry
 *
 * Cards sit on a vertical cylinder of radius R. Scroll drives the ring's
 * rotation. Only the arc on the FAR side of the ring is shown (dist > 120°) —
 * each card carries a final rotateY(180deg) so it faces the camera from there.
 * That puts the visible cards at a natural distance instead of exploding
 * through the near plane.
 * ------------------------------------------------------------------------- */

const START_ROT = 180 // ring starts with card 0 facing the camera

// 40° between cards (the reference's spacing at nine projects). With fewer
// projects the ring simply isn't closed, so neighbours stay in view instead
// of sitting on the far side of an empty circle.
function geometry(count) {
  const step = Math.min(40, 360 / Math.max(count, 1))
  return {
    count,
    step,
    sweep: Math.max((count - 1) * step, 1), // total rotation across the pinned scroll
    pinVh: 100 + (Math.max(count, 1) - 1) * 25, // 9 projects => 300vh, like the reference
  }
}

const VISIBLE_FROM = 120 // degrees of angular distance where a card fades in
const VISIBLE_RAMP = 60 // ...reaching full opacity at 180
const CARD_TOP_OFFSET = -85 // px, keeps the ring optically centred

const INFO_BLOCK_H = 300 // reserved height for the expanded card's text
const INFO_GAP = 24

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window === 'undefined' ? 1200 : window.innerWidth,
    h: typeof window === 'undefined' ? 800 : window.innerHeight,
  }))
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/* --------------------------- section background --------------------------- */
function GridBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(108,186,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(108,186,250,0.06) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'gridMove 8s linear infinite',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,10,48,0.5) 100%)' }}
      />
    </div>
  )
}

function ActionIcon({ kind }) {
  if (kind === 'github') {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.82 1.19 1.85 1.19 3.11 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.07.79 2.15v3.19c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

/* ================================ section ================================= */
export default function Projects() {
  // Start with the static list so the page renders instantly, then swap in
  // whatever the admin has saved once the API answers.
  const [projects, setProjects] = useState(staticProjects)
  useEffect(() => {
    api
      .projects()
      .then((list) => Array.isArray(list) && list.length && setProjects(list))
      .catch(() => {})
  }, [])
  const { count: COUNT, step: STEP, sweep: SWEEP, pinVh: PIN_VH } = geometry(projects.length)

  const [rotation, setRotation] = useState(0)
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState(false) // card has flown to centre
  const [overlay, setOverlay] = useState(false) // carousel is full-screen
  const [infoVisible, setInfoVisible] = useState(false)
  const [infoBox, setInfoBox] = useState(null)

  const wrapperRef = useRef(null)
  const frozenRotation = useRef(null) // rotation held while a card is open
  const locked = useRef(false)
  const returnScrollY = useRef(null)

  const { w: vw, h: vh } = useViewport()
  const isMobile = vw < 768

  const cardW = isMobile ? 320 : 550
  const perspective = isMobile ? 1000 : 1400
  const stageZ = isMobile ? 350 : 500
  const radius = isMobile ? 400 : 700
  const yScatter = isMobile ? 140 : 240
  const detailW = Math.max(
    280,
    Math.min(isMobile ? vw - 32 : 640, vw - 48, Math.floor((vh - 340) * (16 / 9)))
  )

  /* ---------------- scroll -> rotation ---------------- */
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    let queued = false

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        if (locked.current) {
          queued = false
          return
        }
        const rect = el.getBoundingClientRect()
        const track = el.offsetHeight - window.innerHeight
        if (track > 0) {
          const p = Math.max(0, Math.min(1, -rect.top / track))
          setRotation(START_ROT + p * SWEEP)
          frozenRotation.current = null
        }
        queued = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [SWEEP])

  const rot = selected !== null && frozenRotation.current !== null ? frozenRotation.current : rotation

  /* ---------------- header "Contact" hand-off ---------------- */
  useEffect(() => {
    const jump = () => document.getElementById('Contact')?.scrollIntoView({ behavior: 'smooth' })
    window.addEventListener('sequentialScrollToContact', jump)
    return () => window.removeEventListener('sequentialScrollToContact', jump)
  }, [])

  /* ---------------- expanded-card layout maths ---------------- */
  const measureInfo = useCallback(() => {
    const w = Math.min(detailW, window.innerWidth - 48)
    const imgH = (w * 9) / 16
    const stackH = imgH + INFO_GAP + INFO_BLOCK_H
    const top = Math.max(20, (window.innerHeight - stackH) / 2) + imgH + INFO_GAP
    setInfoBox({ top, left: (window.innerWidth - w) / 2, width: w })
  }, [detailW])

  /* ---------------- open ---------------- */
  const open = useCallback(
    (project) => {
      frozenRotation.current = rotation
      locked.current = true

      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.scrollbarWidth = 'none'
      document.documentElement.classList.add('hide-scrollbar')
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

      const reveal = () => {
        document.body.style.overflow = 'hidden'
        setSelected(project)
        setOverlay(true)
        setTimeout(() => {
          setExpanded(true)
          setTimeout(() => {
            measureInfo()
            requestAnimationFrame(() => setInfoVisible(true))
          }, 700)
        }, 30)
      }

      // If the carousel isn't pinned yet, glide it into place first so the
      // card expands from where the user actually sees it.
      const el = wrapperRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const pinned = rect.top <= 0 && rect.bottom >= window.innerHeight
        if (!pinned) {
          const track = el.offsetHeight - window.innerHeight
          const p = Math.max(0, Math.min(1, (rotation - START_ROT) / SWEEP))
          const targetY = rect.top + window.scrollY + p * track
          const fromY = window.scrollY
          const delta = targetY - fromY
          const start = performance.now()
          const step = (now) => {
            const t = Math.min(1, (now - start) / 250)
            window.scrollTo(0, fromY + delta * easeOutCubic(t))
            t < 1 ? requestAnimationFrame(step) : reveal()
          }
          requestAnimationFrame(step)
          returnScrollY.current = targetY
          return
        }
      }

      returnScrollY.current = window.scrollY
      reveal()
    },
    [rotation, measureInfo, SWEEP]
  )

  /* ---------------- close ---------------- */
  const close = useCallback(() => {
    setInfoVisible(false)
    setExpanded(false)
    setTimeout(() => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.documentElement.style.scrollbarWidth = ''
      document.documentElement.classList.remove('hide-scrollbar')
      if (returnScrollY.current !== null) window.scrollTo(0, returnScrollY.current)
      if (frozenRotation.current !== null) setRotation(frozenRotation.current)
      setOverlay(false)
      setSelected(null)
      setInfoBox(null)
      locked.current = false
      frozenRotation.current = null
      returnScrollY.current = null
    }, 700)
  }, [])

  /* ---------------- prev / next while open ---------------- */
  const step = useCallback(
    (dir) => {
      if (!selected) return
      const i = projects.indexOf(selected)
      const next = dir === 'next' ? (i + 1) % COUNT : (i - 1 + COUNT) % COUNT

      setInfoVisible(false)
      setTimeout(() => {
        setSelected(projects[next])
        frozenRotation.current = START_ROT + (next / (COUNT - 1)) * SWEEP
        setTimeout(() => {
          measureInfo()
          requestAnimationFrame(() => setInfoVisible(true))
        }, 400)
      }, 350)
    },
    [selected, measureInfo, projects, COUNT, SWEEP]
  )

  /* ---------------- keyboard + scroll trapping while open ---------------- */
  useEffect(() => {
    if (!overlay) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') step('prev')
      if (e.key === 'ArrowRight') step('next')
    }
    const block = (e) => e.preventDefault()
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', block, { passive: false })
    window.addEventListener('touchmove', block, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', block)
      window.removeEventListener('touchmove', block)
    }
  }, [overlay, close, step])

  /* ---------------- expanded-card transform ---------------- */
  // Push the card to the Z depth where it renders exactly `detailW` wide.
  const detailZ = (cardW * perspective) / detailW - (perspective - stageZ)
  const detailScale = perspective / (perspective - stageZ + detailZ)
  const detailImgH = (detailW * 9) / 16
  const stackH = detailImgH + INFO_GAP + INFO_BLOCK_H
  const wantCentreY = Math.max(20, (vh - stackH) / 2) + detailImgH / 2
  const originY = vh * 0.45
  const perspOriginY = vh * 0.42
  const cardImgH = (cardW * 9) / 16
  const detailY =
    (wantCentreY - originY) / detailScale + originY - perspOriginY - CARD_TOP_OFFSET - cardImgH / 2

  const activeIdx = Math.round((rot - START_ROT) / STEP)

  return (
    <section id="Projects" className="relative">
      {/* ------------------------- heading ------------------------- */}
      <div
        className="relative pt-24 md:pt-32 pb-32 md:pb-40"
        style={{ background: 'linear-gradient(180deg, #050a30 0%, #020815 100%)' }}
      >
        <GridBackdrop />
        <div className="max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-12 gap-8 items-end border-b border-accent/10 pb-10">
            <div className="col-span-12 md:col-span-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent/70">
                [04] — Projects
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2
                className="font-black leading-[0.9] tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
              >
                <span className="text-txt">Things I&apos;ve </span>
                <GlitchText
                  text="shipped"
                  className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent"
                />
                <span className="italic font-light text-txt/30" style={{ fontFamily: "'Times New Roman', serif" }}>
                  .
                </span>
                <span className="sr-only">
                  {' '}
                  — Portfolio projects by {person.firstName} {person.lastName}
                </span>
              </h2>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.25em] text-txt/40">
            <span className="flex items-center gap-3">
              <span className="w-6 h-px bg-accent/50" />
              Scroll to explore · Tap to open
            </span>
            <span className="hidden md:inline">{COUNT} projects</span>
          </div>
        </div>
      </div>

      {/* ------------------------- pinned carousel ------------------------- */}
      <div
        id="projects-carousel-wrapper"
        ref={wrapperRef}
        className="relative"
        style={{
          height: `${PIN_VH}vh`,
          background: 'linear-gradient(180deg, #020815 0%, #050a14 50%, #020815 100%)',
        }}
      >
        <div
          className={overlay ? 'fixed inset-0 overflow-hidden' : 'sticky top-0 h-screen overflow-hidden'}
          style={{
            zIndex: overlay ? 9999 : 2,
            background: overlay ? '#020815' : 'transparent',
            transition: 'background 0.5s ease',
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(108,186,250,0.04) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* click-anywhere scrim behind the expanded card */}
          {overlay && (
            <div
              className="absolute inset-0"
              style={{
                background: expanded ? 'rgba(2,8,21,0.88)' : 'rgba(2,8,21,0)',
                transition: 'background 0.5s ease',
                zIndex: 80,
                cursor: 'pointer',
              }}
              onClick={close}
            />
          )}

          {/* ---------------- the ring ---------------- */}
          <div
            className="absolute inset-0"
            style={{ perspective: `${perspective}px`, perspectiveOrigin: '50% 45%', zIndex: 90 }}
          >
            <div
              className="absolute top-[42%] left-1/2"
              style={{ transformStyle: 'preserve-3d', transform: `translateZ(${stageZ}px)` }}
            >
              {projects.map((project, i) => {
                const even = i % 2 === 0
                const angle = -STEP * i + rot
                const norm = ((angle % 360) + 360) % 360
                const dist = norm > 180 ? 360 - norm : norm

                const y = (even ? -yScatter : yScatter) + Math.sin((angle * Math.PI) / 180) * 10
                const near = Math.abs(i - activeIdx) <= 3
                const visible = dist > VISIBLE_FROM && near
                const fade = visible ? Math.min(1, (dist - VISIBLE_FROM) / VISIBLE_RAMP) : 0

                const isSelected = selected === project
                const isExpanded = isSelected && expanded

                let opacity
                if (isSelected) opacity = 1
                else if (overlay) opacity = expanded ? 0 : visible ? Math.max(0.15, fade) : 0
                else opacity = visible ? Math.max(0.15, fade) : 0

                const ringTransform = `rotateY(${angle}deg) translateZ(${radius}px) translateY(${y}px) rotateY(180deg)`
                const detailTransform = `rotateY(180deg) translateZ(${detailZ}px) translateY(${detailY}px) rotateY(180deg)`

                return (
                  <div
                    key={i}
                    className="absolute cursor-pointer"
                    role="button"
                    tabIndex={visible && !overlay ? 0 : -1}
                    aria-label={`View project: ${project.title}`}
                    onClick={() => open(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        open(project)
                      }
                    }}
                    style={{
                      transform: isExpanded ? detailTransform : ringTransform,
                      width: `${cardW}px`,
                      marginLeft: `${-cardW / 2}px`,
                      marginTop: `${CARD_TOP_OFFSET}px`,
                      opacity,
                      zIndex: isSelected ? 200 : Math.round(50 - dist),
                      transition: isSelected
                        ? 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1), opacity 0.3s ease'
                        : 'transform 0.15s ease-out, opacity 0.25s ease',
                      backfaceVisibility: 'hidden',
                      pointerEvents: visible && !overlay ? 'auto' : 'none',
                    }}
                  >
                    <div
                      className="rounded-xl overflow-hidden relative group"
                      style={{
                        boxShadow: isExpanded
                          ? '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,186,250,0.15)'
                          : '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                        transition: 'box-shadow 0.4s ease, transform 0.3s ease',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
                        style={{
                          boxShadow: '0 0 25px rgba(108,186,250,0.3), 0 0 0 1px rgba(108,186,250,0.25)',
                          transition: 'opacity 0.3s ease',
                          zIndex: 10,
                        }}
                      />
                      <img
                        src={project.src}
                        alt={project.alt}
                        loading="lazy"
                        className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500"
                        style={{ opacity: isExpanded ? 0 : 1 }}
                      />
                      <span
                        className="absolute top-2.5 left-3.5 font-mono text-[9px] text-white/20 tracking-widest transition-opacity duration-300"
                        style={{ opacity: isExpanded ? 0 : 1 }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div
                        className="absolute bottom-0 left-0 right-0 p-3.5 transition-opacity duration-300"
                        style={{ opacity: isExpanded ? 0 : 1 }}
                      >
                        <h3 className="font-bold text-white leading-tight text-sm">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ---------------- overlay chrome ---------------- */}
          {overlay && (
            <>
              <button
                onClick={close}
                className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 cursor-pointer"
                style={{ zIndex: 150, opacity: infoVisible ? 1 : 0, transition: 'opacity 0.4s ease 0.6s' }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {['prev', 'next'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => step(dir)}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    dir === 'prev' ? 'left-4 md:left-8' : 'right-4 md:right-8'
                  } w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 cursor-pointer`}
                  style={{ zIndex: 150, opacity: infoVisible ? 1 : 0, transition: 'opacity 0.4s ease 0.6s' }}
                  aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                    />
                  </svg>
                </button>
              ))}

              {/* ---------------- detail text ---------------- */}
              {selected && infoBox && (
                <div
                  className="absolute text-center pointer-events-auto max-h-[calc(100vh-top-12px)] overflow-y-auto px-2 pb-4 scrollbar-none"
                  style={{ ...infoBox, zIndex: 160 }}
                >
                  <SlideUp visible={infoVisible} delay={0.15}>
                    <h3
                      className="font-black tracking-tight text-txt"
                      style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
                    >
                      {selected.title}
                    </h3>
                  </SlideUp>

                  <SlideUp visible={infoVisible} delay={0.25}>
                    <p className="text-txt/65 text-xs sm:text-sm md:text-base leading-relaxed mt-2 sm:mt-3 max-w-xl mx-auto">
                      {selected.description}
                    </p>
                  </SlideUp>

                  <SlideUp visible={infoVisible} delay={0.32}>
                    <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
                      {selected.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 text-[10px] sm:text-[11px] font-mono font-medium tracking-wide rounded-full border border-accent/40 text-accent bg-accent/10 shadow-[0_0_12px_rgba(108,186,250,0.15)] hover:border-accent hover:bg-accent/20 transition-all duration-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </SlideUp>

                  <SlideUp visible={infoVisible} delay={0.45}>
                    <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-5">
                      <a
                        href={selected.live}
                        target="_blank"
                        rel="noreferrer"
                        data-dark-cursor
                        className="group flex items-center gap-2.5 px-6 py-3 bg-accent text-dark font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/30 cursor-pointer text-xs sm:text-sm"
                      >
                        <ActionIcon kind="live" />
                        Live Demo
                      </a>
                      <a
                        href={selected.code}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2.5 px-6 py-3 bg-white/5 border border-white/10 text-txt font-bold rounded-xl hover:border-accent/50 hover:bg-accent/10 hover:scale-105 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                      >
                        <ActionIcon kind="github" />
                        View Code
                      </a>
                    </div>
                  </SlideUp>
                </div>
              )}
            </>
          )}

          {/* ---------------- progress dots ---------------- */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3"
            style={{ opacity: overlay ? 0 : 1, transition: 'opacity 0.3s ease' }}
          >
            <span className="text-[10px] font-mono text-white/30 tracking-wider tabular-nums">01</span>
            <div className="flex gap-1.5">
              {projects.map((_, i) => {
                const on = i === Math.max(0, Math.min(COUNT - 1, activeIdx))
                return (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: on ? 20 : 6,
                      height: 6,
                      background: on ? 'rgba(108,186,250,0.8)' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                )
              })}
            </div>
            <span className="text-[10px] font-mono text-white/30 tracking-wider tabular-nums">
              {String(COUNT).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Crawlable copy of the same projects — the 3D stage is not readable. */}
      <div className="sr-only">
        <ul>
          {projects.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p>Technologies: {p.tech.join(', ')}</p>
              <a href={p.live}>Live demo of {p.title}</a>
              <a href={p.code}>Source code for {p.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Rises into place on open, drops away faster on close. */
function SlideUp({ children, visible, delay }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: visible
          ? `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,0.61,0.36,1) ${delay}s`
          : `opacity 0.3s ease 0.05s, transform 0.35s cubic-bezier(0.55,0,1,0.45) 0.05s`,
      }}
    >
      {children}
    </div>
  )
}
