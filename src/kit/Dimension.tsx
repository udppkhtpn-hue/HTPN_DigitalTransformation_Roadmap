import { motion, useReducedMotion } from 'motion/react'
import { DrawPath } from './DrawPath.tsx'

interface Props {
  /** Span, in stage pixels, measured in the parent SVG's coordinates. */
  x1: number
  x2: number
  /** Baseline of the dimension line. */
  y: number
  /** How far the extension lines reach back toward the thing being measured. */
  extend?: number
  label: string
  delay?: number
  tone?: string
}

const ARROW = 11

/**
 * A measurement, drawn the way a drawing measures things: extension lines
 * out from the subject, an arrow-terminated dimension line between them,
 * and the figure sitting on the line in mono.
 *
 * This is why there are no stat cards anywhere in the deck — every number
 * arrives as a dimension on the drawing instead.
 */
export function Dimension({
  x1,
  x2,
  y,
  extend = 34,
  label,
  delay = 0,
  tone = 'var(--line)',
}: Props) {
  const reduced = useReducedMotion()
  const mid = (x1 + x2) / 2

  return (
    <g>
      {/* extension lines */}
      <DrawPath
        d={`M ${x1} ${y - extend} L ${x1} ${y + 10}`}
        delay={delay}
        duration={0.4}
        stroke={tone}
        opacity={0.45}
      />
      <DrawPath
        d={`M ${x2} ${y - extend} L ${x2} ${y + 10}`}
        delay={delay + 0.06}
        duration={0.4}
        stroke={tone}
        opacity={0.45}
      />

      {/* dimension line */}
      <DrawPath
        d={`M ${x1} ${y} L ${x2} ${y}`}
        delay={delay + 0.18}
        duration={0.5}
        stroke={tone}
        opacity={0.8}
      />

      {/* arrow terminators */}
      <motion.path
        d={`M ${x1} ${y} l ${ARROW} -4 l 0 8 z`}
        fill={tone}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
        style={{ transformOrigin: `${x1}px ${y}px` }}
      />
      <motion.path
        d={`M ${x2} ${y} l ${-ARROW} -4 l 0 8 z`}
        fill={tone}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
        style={{ transformOrigin: `${x2}px ${y}px` }}
      />

      {/* the figure, sitting on the line */}
      <motion.text
        x={mid}
        y={y - 16}
        textAnchor="middle"
        fill={tone}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-dim)',
          letterSpacing: '0.04em',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.6 }}
      >
        {label}
      </motion.text>
    </g>
  )
}
