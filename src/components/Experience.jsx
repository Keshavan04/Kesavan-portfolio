import useReveal from '../hooks/useReveal'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import Corner from './ui/Corner'
import GlitchText from './ui/GlitchText'
import { experiences } from '../data/content'

function GridBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(108,186,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,186,250,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(2,8,21,0.8) 100%)' }}
      />
    </div>
  )
}

export default function Experience() {
  const [ref, shown] = useReveal(0.12)

  return (
    <section
      id="Experience"
      ref={ref}
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020815 0%, #050a30 50%, #020815 100%)',
      }}
    >
      <GridBackdrop />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[450px] h-[450px] bg-secondary/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16 space-y-16">
        {/* Section Header */}
        <div className="border-b border-accent/10 pb-10">
          <Reveal show={shown} direction="left">
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.35em] sm:tracking-[0.45em] text-accent/70 mb-4">
              [03] — Experience
            </p>
          </Reveal>
          <Reveal show={shown} direction="up" delay={100}>
            <h2
              className="font-black leading-[0.9] tracking-tight text-txt"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}
            >
              Work{' '}
              <GlitchText
                text="Experience"
                className="bg-gradient-to-r from-accent via-accent/90 to-secondary bg-clip-text text-transparent"
              />
              <span className="italic font-light text-txt/30" style={{ fontFamily: "'Times New Roman', serif" }}>
                .
              </span>
            </h2>
          </Reveal>
        </div>

        {/* Timeline / Cards Grid */}
        <div className="relative max-w-4xl mx-auto space-y-8">
          {/* Vertical subtle timeline bar for desktop */}
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

          {experiences.map((exp, idx) => (
            <Reveal key={exp.company + exp.role} show={shown} delay={150 + idx * 150}>
              <div className="relative md:pl-20">
                {/* Timeline node icon */}
                <div className="hidden md:flex absolute left-5 top-8 -translate-x-1/2 w-6 h-6 rounded-full border border-accent/50 bg-dark items-center justify-center shadow-[0_0_12px_rgba(108,186,250,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>

                <TiltCard>
                  <div className="relative group rounded-2xl border border-accent/15 bg-gradient-to-br from-dark/90 via-primary/20 to-dark/70 backdrop-blur-md p-6 sm:p-8 md:p-10 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_10px_40px_rgba(108,186,250,0.08)]">
                    <Corner position="tl" />
                    <Corner position="tr" />
                    <Corner position="bl" />
                    <Corner position="br" />

                    {/* Top Row: Role, Type Badge, and Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-6">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold text-txt group-hover:text-accent transition-colors duration-300">
                            {exp.role}
                          </h3>
                          <span className="px-3 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-full border border-accent/30 bg-accent/10 text-accent font-semibold">
                            {exp.type}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-medium text-accent/80 mt-1">
                          {exp.company} <span className="text-txt/40 font-normal">· {exp.location}</span>
                        </p>
                      </div>

                      <div className="font-mono text-xs sm:text-sm text-txt/50 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] self-start sm:self-auto">
                        📅 {exp.period}
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="mt-6 space-y-3">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-txt/70 leading-relaxed">
                          <span className="text-accent mt-1 flex-shrink-0">◆</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech / Skills Tags */}
                    {exp.tech && exp.tech.length > 0 && (
                      <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-wrap gap-2">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 text-xs font-mono rounded-full border border-accent/20 bg-accent/5 text-accent/90"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
