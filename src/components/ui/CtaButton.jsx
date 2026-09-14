import { useState } from 'react'

const BASE =
  'group relative inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3.5 ' +
  'rounded-full font-medium text-xs sm:text-sm tracking-wide cursor-pointer select-none ' +
  'overflow-hidden transition-all duration-500'

/**
 * Two button treatments:
 *  - primary: solid accent + a skewed light sweep across on hover
 *  - ghost:   outlined, with a circle that expands from the left to fill it
 * Both squash briefly on click.
 */
export default function CtaButton({ children, onClick, primary = false }) {
  const [pushed, setPushed] = useState(false)

  const handle = (e) => {
    setPushed(true)
    setTimeout(() => setPushed(false), 700)
    onClick?.(e)
  }

  const skin = primary
    ? 'bg-accent text-dark hover:shadow-[0_0_30px_rgba(108,186,250,0.4)]'
    : 'bg-transparent border border-txt/15 text-txt/70'

  const label = primary
    ? 'relative z-10 flex items-center gap-2.5'
    : 'relative z-10 flex items-center gap-2.5 transition-colors duration-[400ms] delay-[600ms] group-hover:text-dark'

  return (
    <button
      onClick={handle}
      data-dark-cursor={primary ? true : undefined}
      className={`${BASE} ${skin} ${pushed ? 'animate-push' : ''}`}
    >
      {primary ? (
        <span
          className="absolute inset-0 z-[1] -translate-x-full skew-x-[-20deg] opacity-0 group-hover:translate-x-[200%] group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            width: '40%',
            borderRadius: 'inherit',
          }}
        />
      ) : (
        <span className="absolute top-1/2 left-[15%] z-[1] w-[380%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full scale-0 transition-transform duration-[1600ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-100 bg-accent" />
      )}
      <span className={label}>{children}</span>
    </button>
  )
}
