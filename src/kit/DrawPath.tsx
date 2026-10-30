import { motion, useReducedMotion } from 'motion/react'

interface Props {
  d: string
  delay?: number
  duration?: number
  stroke?: string
  width?: number
  dashed?: boolean
  opacity?: number
}

/**
 * A line that draws itself on.
 *
 * Motion animates `pathLength` via stroke-dashoffset — a paint, not a layout,
 * so it stays cheap even with several running at once. `non-scaling-stroke`
 * keeps the hairline a hairline whatever the stage scale.
 */
export function DrawPath({
  d,
  delay = 0,
  duration = 0.8,
  stroke = 'var(--line)',
  width = 1.5,
  dashed = false,
  opacity = 0.75,
}: Props) {
  const reduced = useReducedMotion()
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '6 7' : undefined}
      vectorEffect="non-scaling-stroke"
      initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity }}
      animate={reduced ? { opacity } : { pathLength: 1, opacity }}
      transition={{
        duration: reduced ? 0.18 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  )
}
