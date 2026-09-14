import { Link } from 'react-scroll'
import Logo from './ui/Logo'
import RollText from './ui/RollText'
import { footer, footerNavLinks, person, socials } from '../data/content'

export default function Footer() {
  const year = new Date().getFullYear()
  const fullName = `${person.firstName} ${person.lastName}`
  const ticker = `${fullName.toUpperCase()}  ·  `.repeat(6)

  return (
    <footer
      className="relative w-full overflow-hidden border-t border-accent/15"
      style={{ background: 'linear-gradient(180deg, #020815 0%, #000000 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#6cbafa 1px, transparent 1px), linear-gradient(90deg, #6cbafa 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] bg-accent/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16">
        {/* ---------------- call to action ---------------- */}
        <div className="pt-12 sm:pt-16 pb-8 sm:pb-10 border-b border-accent/10">
          <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 md:items-end">
            <div className="md:col-span-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/70 mb-3 sm:mb-4">
                [05] — Footer
              </p>
              <h2 className="font-black leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5.5vw, 4.5rem)' }}>
                <span className="text-txt">{footer.headline} </span>
                <span className="italic font-light text-txt/30" style={{ fontFamily: "'Times New Roman', serif" }}>
                  {footer.headlineItalic}
                </span>
              </h2>
            </div>
            <div className="md:col-span-4 md:text-right mt-2 md:mt-0">
              <a
                href={`mailto:${person.email}`}
                className="group inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-txt hover:text-accent transition-colors duration-300 break-all sm:break-normal"
              >
                <span className="font-mono">{person.email}</span>
                <span className="text-accent/60 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- columns ---------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-6 sm:gap-8 py-10 sm:py-12">
          <div className="col-span-2 sm:col-span-12 md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-accent/30 bg-dark/60 flex items-center justify-center flex-shrink-0">
                <Logo size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-txt font-bold text-sm tracking-wide">{fullName}</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-accent/70">
                  {person.role}
                </p>
              </div>
            </div>
            <p className="text-txt/50 text-xs sm:text-sm leading-relaxed max-w-sm">{footer.blurb}</p>
          </div>

          <div className="col-span-1 sm:col-span-6 md:col-span-2 space-y-3 sm:space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">◆ Navigate</p>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerNavLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    spy
                    smooth
                    to={l.to}
                    offset={-80}
                    duration={700}
                    className="group inline-flex text-txt/60 text-xs sm:text-sm cursor-pointer"
                  >
                    <RollText>{l.label}</RollText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-6 md:col-span-2 space-y-3 sm:space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">◆ Elsewhere</p>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm" data-dark-cursor>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-txt/60 hover:text-accent transition-colors duration-300"
                  >
                    <span>{s.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-accent">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-12 md:col-span-3 space-y-3 sm:space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">◆ Status</p>
            <div className="space-y-2 sm:space-y-2.5 text-sm max-w-full min-[770px]:max-w-[280px]">
              <div className="flex items-center gap-2 text-txt/70">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                <span>{person.available ? 'Open for work' : 'Currently booked'}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-txt/50 font-mono text-xs pt-1">
                <span>Reply within</span>
                <span className="text-accent/80">{person.responseTime}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-txt/50 font-mono text-xs">
                <span>Remote</span>
                <span className="text-accent/80">{person.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- name ticker ---------------- */}
        <div className="py-8 sm:py-10 border-t border-accent/10 overflow-hidden" aria-hidden="true">
          <div
            className="whitespace-nowrap flex w-max"
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'rgba(108,186,250,0.07)',
              letterSpacing: '-0.02em',
              animation: 'marquee 20s linear infinite',
            }}
          >
            <span>{ticker}</span>
            <span>{ticker}</span>
          </div>
        </div>

        {/* ---------------- legal ---------------- */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 py-5 sm:py-6 pb-8 sm:pb-6 border-t border-accent/10 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-txt/35">
          <div className="flex items-center gap-3 sm:gap-4">
            <span>© {year} {fullName}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span>{footer.builtWith}</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-txt/35 hover:text-accent transition-colors duration-300 cursor-pointer w-full sm:w-auto justify-center sm:justify-start pt-3 sm:pt-0 mt-1 sm:mt-0 border-t border-accent/5 sm:border-0"
          >
            <span>Back to top</span>
            <svg className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
