const PATHS = {
  tl: 'M0 28 L0 0 L28 0',
  tr: 'M0 0 L28 0 L28 28',
  bl: 'M0 0 L0 28 L28 28',
  br: 'M0 28 L28 28 L28 0',
}

const INSET = 10
const POS = {
  tl: { top: INSET, left: INSET },
  tr: { top: INSET, right: INSET },
  bl: { bottom: INSET, left: INSET },
  br: { bottom: INSET, right: INSET },
}

/** Thin viewfinder bracket used on the About portrait frame. */
export default function Corner({ position = 'tl' }) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      className="absolute pointer-events-none"
      style={POS[position]}
      aria-hidden="true"
    >
      <path d={PATHS[position]} stroke="rgba(108,186,250,0.45)" strokeWidth="1.5" />
    </svg>
  )
}
