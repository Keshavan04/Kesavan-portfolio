/**
 * Per-letter "roll up" hover effect.
 * The original line slides out the top while an accent-coloured duplicate
 * slides in from below, each letter staggered by 30ms.
 * Requires `group` on an ancestor.
 */
export default function RollText({ children }) {
  const letters = String(children).split('')

  const row = (accent) => (
    <span className={accent ? 'flex absolute top-full left-0' : 'flex'}>
      {letters.map((ch, i) => (
        <span
          key={i}
          className={`inline-block transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full${
            accent ? ' text-accent' : ''
          }`}
          style={{ transitionDelay: `${i * 30}ms` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )

  return (
    <span className="relative inline-block overflow-hidden">
      {row(false)}
      {row(true)}
    </span>
  )
}
