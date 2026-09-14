import { scroller } from 'react-scroll'
import ParticleCanvas from './ParticleCanvas'
import CtaButton from './ui/CtaButton'
import { heroPortrait, marqueeItems, person } from '../data/content'

const scrollTo = (name) =>
  scroller.scrollTo(name, { smooth: true, duration: 700, offset: -80 })

const marqueeHalf = [...marqueeItems, ...marqueeItems]

function Portrait({ className, glowClass }) {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute top-[15%] left-1/2 -translate-x-1/2 rounded-full bg-accent/20 blur-[70px] pointer-events-none ${glowClass}`} />
      <img
        src={heroPortrait.src}
        alt={heroPortrait.alt}
        className="relative w-full h-auto"
        fetchpriority="high"
      />
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="Home"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(at 65% 40%, rgba(108,186,250,0.09) 0%, #050a30 35%, #020815 65%, #000000 100%)',
      }}
    >
      <ParticleCanvas />

      <div className="relative z-10 flex-1 min-h-0 flex flex-col sm:flex-row sm:items-center">
        <div className="relative z-10 w-full max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16 pt-24 sm:pt-16 pb-6 sm:pb-0 flex-1 flex items-center sm:flex-none sm:block">
          <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* ------------ copy column ------------ */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-7 flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
              <p className="text-[10px] font-mono uppercase tracking-[0.45em] text-accent/55">
                [01] — Home
              </p>

              <h1
                className="font-black tracking-tight"
                style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', lineHeight: 1.1 }}
              >
                <span className="block">
                  <span className="block text-txt">{person.firstName}</span>
                </span>
                <span className="block">
                  <span className="block bg-gradient-to-r from-accent via-[#a8d8ff] to-accent bg-clip-text text-transparent">
                    {person.lastName}
                  </span>
                </span>
                <span className="sr-only"> — {person.role}</span>
              </h1>

              <div className="flex items-center gap-3">
                <span className="w-5 h-px bg-accent/60 flex-shrink-0" />
                <p className="text-sm md:text-base font-mono text-txt/60">{person.role}</p>
              </div>

              <p className="text-sm md:text-base text-txt/50 leading-[1.75] max-w-[46ch]">
                {person.tagline.map((seg, i) =>
                  seg.strong ? (
                    <span key={i} className="text-txt/80 font-medium">
                      {seg.text}
                    </span>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <CtaButton primary onClick={() => scrollTo('Projects')}>
                  See the work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </CtaButton>
                <CtaButton onClick={() => scrollTo('Contact')}>Get in touch</CtaButton>
              </div>
            </div>

            {/* ------------ portrait: tablet ------------ */}
            <div className="hidden sm:flex lg:hidden col-span-6 justify-end items-end">
              <Portrait className="w-full" glowClass="w-[80%] h-[50%]" />
            </div>

            {/* desktop: the grid column is only a spacer — the cutout itself
                is positioned against the section edge below so it can bleed
                to the bottom and under the copy, like the reference. */}
            <div className="hidden lg:block col-span-6 xl:col-span-5" aria-hidden="true" />
          </div>
        </div>

        {/* ------------ portrait: mobile — in flow, sits on the marquee ------------ */}
        <div className="sm:hidden relative w-full flex justify-center mt-auto">
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[70%] aspect-square rounded-full bg-accent/20 blur-[70px] pointer-events-none" />
          <img
            src={heroPortrait.src}
            alt={heroPortrait.alt}
            className="relative w-[150%] max-w-none max-h-[46vh] object-contain object-bottom"
            fetchpriority="high"
          />
        </div>

        {/* ------------ portrait: desktop ------------ */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-[10%] right-[22%] w-[520px] h-[520px] rounded-full bg-accent/20 blur-[120px]" />
          <img
            src={heroPortrait.src}
            alt={heroPortrait.alt}
            className="absolute bottom-0 right-0 w-[86%] max-w-[1560px] max-h-full object-contain object-right-bottom"
            fetchpriority="high"
          />
        </div>
      </div>

      {/* ------------ tech marquee ------------ */}
      <div
        className="relative z-10 border-t border-accent/10 overflow-hidden bg-dark/40 backdrop-blur-sm py-2"
        aria-hidden="true"
      >
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite] will-change-transform">
          {/* Two identical halves: the -50% loop lands exactly on the seam.
              Each half repeats the list twice so it out-widths any viewport. */}
          {[...marqueeHalf, ...marqueeHalf].map((label, i) => (
            <span
              key={i}
              className="flex items-center gap-12 text-base md:text-lg font-black tracking-tight text-txt/[0.15] hover:text-accent transition-colors duration-500"
            >
              {label}
              <span className="text-accent/35">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
