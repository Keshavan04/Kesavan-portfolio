import useReveal from '../hooks/useReveal'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import Corner from './ui/Corner'
import GlitchText from './ui/GlitchText'
import { skillCategories } from '../data/content'

function GridBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(108,186,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108,186,250,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }}
      />
    </div>
  )
}

const CATEGORY_ICONS = {
  'Backend Frameworks': '⚙️',
  'Languages': '💻',
  'AI / ML': '🤖',
  'Databases': '🗄️',
  'Web & Front-end': '🎨',
  'Core Concepts & Tools': '🛠️',
}

export default function Skills() {
  const [ref, shown] = useReveal(0.12)

  return (
    <section
      id="Skills"
      ref={ref}
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #020815 50%, #050a30 100%)',
      }}
    >
      <GridBackdrop />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 right-[-5%] w-[450px] h-[450px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-[-5%] w-[400px] h-[400px] bg-secondary/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16 space-y-16">
        {/* Header */}
        <div className="border-b border-accent/10 pb-10">
          <Reveal show={shown} direction="left">
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.35em] sm:tracking-[0.45em] text-accent/70 mb-4">
              [02] — Technical Skills
            </p>
          </Reveal>
          <Reveal show={shown} direction="up" delay={100}>
            <h2
              className="font-black leading-[0.9] tracking-tight text-txt"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}
            >
              Technical{' '}
              <GlitchText
                text="Capabilities"
                className="bg-gradient-to-r from-accent via-accent/90 to-secondary bg-clip-text text-transparent"
              />
              <span className="italic font-light text-txt/30" style={{ fontFamily: "'Times New Roman', serif" }}>
                .
              </span>
            </h2>
          </Reveal>
        </div>

        {/* Skills Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillCategories.map((cat, idx) => (
            <Reveal key={cat.category} show={shown} delay={120 + idx * 100}>
              <TiltCard>
                <div className="relative h-full group rounded-2xl border border-accent/15 bg-gradient-to-br from-dark/90 via-primary/15 to-dark/60 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:border-accent/40 hover:shadow-[0_10px_35px_rgba(108,186,250,0.1)]">
                  <Corner position="tl" />
                  <Corner position="tr" />
                  <Corner position="bl" />
                  <Corner position="br" />

                  <div>
                    {/* Category Title with Emoji Icon */}
                    <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4 mb-6">
                      <span className="text-xl p-2 rounded-lg bg-accent/10 border border-accent/20">
                        {CATEGORY_ICONS[cat.category] || '⚡'}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-txt group-hover:text-accent transition-colors duration-300">
                        {cat.category}
                      </h3>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2.5">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-xl border border-accent/20 bg-accent/5 text-txt/80 group-hover:border-accent/40 group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-accent/40">
                    <span>{cat.skills.length} competencies</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
