const CLIPS = {
  up: { hidden: 'inset(100% 0 0 0)', visible: 'inset(0 0 0 0)' },
  left: { hidden: 'inset(0 100% 0 0)', visible: 'inset(0 0 0 0)' },
  right: { hidden: 'inset(0 0 0 100%)', visible: 'inset(0 0 0 0)' },
}

/**
 * Clip-path wipe + fade. `show` is driven by useReveal().
 * `direction` controls which edge the content is uncovered from.
 */
export default function Reveal({
  children,
  show,
  delay = 0,
  className = '',
  direction = 'up',
}) {
  const clip = CLIPS[direction]

  return (
    <div
      className={className}
      style={{
        clipPath: show ? clip.visible : clip.hidden,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : direction === 'up' ? 'translateY(20px)' : 'none',
        transition:
          `clip-path 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms,` +
          ` opacity 0.6s ease ${delay}ms,` +
          ` transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
