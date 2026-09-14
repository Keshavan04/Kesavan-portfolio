import { scroller } from 'react-scroll'
import useReveal from '../hooks/useReveal'
import useParallax from '../hooks/useParallax'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import Corner from './ui/Corner'
import { about, person } from '../data/content'

/**
 * Renders inline markers from content.js:
 *   **bold**  -> brighter white
 *   ==text==  -> accent colour
 */
function RichText({ children }) {
  const parts = String(children).split(/(\*\*[^*]+\*\*|==[^=]+==)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white/90 font-medium">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <span key={i} className="text-accent font-medium">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function About() {
  const [ref, shown] = useReveal(0.12)
  const [offsets, register] = useParallax({ frame: -25 })

  return (
    <section
      ref={ref}
      className="relative w-full overflow-x-clip"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #020815 40%, #050a30 80%, #020815 100%)',
      }}
    >
      {/* faint blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.016]"
        style={{
          backgroundImage:
            'linear-gradient(#6cbafa 1px, transparent 1px), linear-gradient(90deg, #6cbafa 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24 md:py-32">
        <Reveal show={shown} direction="left">
          <h2
            id="Aboutme"
            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.35em] sm:tracking-[0.45em] text-accent/60 mb-8 sm:mb-12 md:mb-16"
          >
            [02] — About
          </h2>
        </Reveal>

        <div className="grid grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
          {/* ---------- portrait card ---------- */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 order-1 md:order-2 overflow-hidden flex justify-center md:justify-end">
            <Reveal
              show={shown}
              direction="right"
              delay={150}
              className="w-full min-[400px]:w-[65%] sm:w-[55%] md:w-full"
            >
              <div
                ref={register('frame')}
                style={{
                  transform: `translateY(${offsets.frame}px)`,
                  willChange: 'transform',
                }}
              >
                <TiltCard>
                  <div className="relative p-4 md:p-5" style={{ borderRadius: '1rem' }}>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        border: '1px solid rgba(108,186,250,0.08)',
                        borderRadius: '1rem',
                      }}
                    />
                    <Corner position="tl" />
                    <Corner position="tr" />
                    <Corner position="bl" />
                    <Corner position="br" />

                    <div
                      className="relative"
                      style={{ aspectRatio: '3 / 4', borderRadius: '0.5rem', overflow: 'hidden' }}
                    >
                      <img
                        src={about.portrait}
                        alt={about.portraitAlt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        style={{ filter: 'contrast(1.1) brightness(0.75)', objectPosition: about.portraitPosition || 'center' }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          borderRadius: '0.5rem',
                          boxShadow: 'inset 0 0 0 1px rgba(108,186,250,0.1)',
                        }}
                      />
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          </div>

          {/* ---------- copy ---------- */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7 space-y-5 sm:space-y-7 order-2 md:order-1">
            {about.paragraphs.map((para, i) => (
              <Reveal key={i} show={shown} delay={i * 120}>
                <p className="text-sm sm:text-base md:text-lg text-white/55 leading-[1.8] sm:leading-[1.9]">
                  <RichText>{para}</RichText>
                </p>
              </Reveal>
            ))}

            <Reveal show={shown} delay={about.paragraphs.length * 120}>
              <p className="text-sm font-mono text-white/25 leading-relaxed pt-4 border-t border-white/[0.06]">
                {about.footnote.lead}{' '}
                <span className="text-white/[0.38]">{about.footnote.leadStrong}</span>{' '}
                {about.footnote.tail}{' '}
                <span className="text-white/[0.38]">{about.footnote.tailStrong}</span>
              </p>
            </Reveal>

            <p className="sr-only">{person.seoSummary}</p>

            <Reveal show={shown} delay={about.paragraphs.length * 120 + 120}>
              <div className="pt-6">
                <button
                  onClick={() =>
                    scroller.scrollTo('Projects', { smooth: true, duration: 700, offset: -80 })
                  }
                  className="group inline-flex items-center gap-3 text-sm font-mono text-accent/60 hover:text-accent transition-colors duration-300 cursor-pointer"
                >
                  <span className="w-8 h-px bg-accent/40 group-hover:w-12 transition-all duration-300" />
                  View my work
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
