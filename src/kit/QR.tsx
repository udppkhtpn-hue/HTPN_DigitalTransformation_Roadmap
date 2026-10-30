import { motion, useReducedMotion } from 'motion/react'
import { QR as CODES } from '../content/qr.ts'

interface Props {
  code: keyof typeof CODES | string
  size?: number
  delay?: number
  /** Printed under the code. Omit to show nothing. */
  caption?: string
  className?: string
}

/**
 * An inline SVG QR code, generated at build time.
 *
 * Drawn in --chalk on a --drafting plate with a quiet zone, which is the
 * contrast scanners want, and the only place in the deck where a solid
 * light shape is allowed.
 */
export function QR({ code, size = 190, delay = 0, caption, className }: Props) {
  const reduced = useReducedMotion()
  const qr = CODES[code]
  if (!qr) return null

  const quiet = 2
  const span = qr.size + quiet * 2

  return (
    <motion.div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.18 : 0.5, delay }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${span} ${span}`}
        shapeRendering="crispEdges"
        role="img"
        aria-label={`QR code for ${qr.url}`}
      >
        <rect width={span} height={span} fill="var(--chalk)" />
        <g transform={`translate(${quiet} ${quiet})`} fill="var(--drafting)">
          <path d={qr.d} />
        </g>
      </svg>
      {caption && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
            color: 'var(--line)',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          {caption}
        </span>
      )}
    </motion.div>
  )
}
