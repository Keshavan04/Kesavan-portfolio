/**
 * Monogram mark — an accent stem + dot with a light "K".
 * `animated` staggers the three parts in on mount (used by the preloader).
 */
export default function Logo({ size = 28, animated = false, className = '' }) {
  const anim = (name, dur, delay) =>
    animated
      ? { animation: `${name} ${dur}s cubic-bezier(0.22,0.61,0.36,1) ${delay}s forwards` }
      : {}

  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={className}
      style={{ overflow: 'visible' }}
      role="img"
      aria-label="Logo"
    >
      {/* vertical stem */}
      <rect
        x="140"
        y="178"
        width="70"
        height="228"
        fill="#6CBAFA"
        style={{
          transformOrigin: '175px 406px',
          ...(animated ? { transform: 'scaleY(0)' } : {}),
          ...anim('logoStem', 0.4, 0.15),
        }}
      />
      {/* dot */}
      <circle
        cx="175"
        cy="128"
        r="35"
        fill="#6CBAFA"
        style={{
          ...(animated ? { opacity: 0, transform: 'translateY(-40px)' } : {}),
          ...anim('logoDot', 0.4, 0.35),
        }}
      />
      {/* upper arm */}
      <polygon
        points="210,262 322,178 402,178 210,340"
        fill="#F4F6FC"
        style={{
          ...(animated ? { opacity: 0, transform: 'translateX(-30px)' } : {}),
          ...anim('logoK', 0.35, 0.55),
        }}
      />
      {/* lower arm */}
      <polygon
        points="248,296 314,252 402,406 318,406"
        fill="#F4F6FC"
        style={{
          ...(animated ? { opacity: 0, transform: 'translateX(-30px)' } : {}),
          ...anim('logoK', 0.35, 0.65),
        }}
      />
    </svg>
  )
}
