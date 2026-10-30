import { useEffect } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import type { Figure } from '../content/scenes.ts'

interface Props extends Figure {
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

const toneVar: Record<string, string> = {
  chalk: 'var(--chalk)',
  line: 'var(--line)',
  signal: 'var(--signal)',
  alert: 'var(--alert)',
}

/**
 * A number that counts up while its width axis expands.
 *
 * Rendered with tabular figures so the digits never shift the layout while
 * they run — on a dimension line a jittering number is immediately obvious.
 */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  tone = 'chalk',
  delay = 0,
  duration = 1.4,
  className,
  style,
}: Props) {
  const reduced = useReducedMotion()
  const n = useMotionValue(reduced ? value : 0)
  const wdth = useMotionValue(reduced ? 118 : 74)
  const settings = useMotionTemplate`'wdth' ${wdth}, 'wght' 600`

  const text = useTransform(n, (v) =>
    Math.round(v).toLocaleString('en-MY'),
  )

  useEffect(() => {
    if (reduced) {
      n.set(value)
      wdth.set(118)
      return
    }
    n.set(0)
    wdth.set(74)
    const ease = [0.16, 1, 0.3, 1] as const
    const a = animate(n, value, { duration, delay, ease })
    const b = animate(wdth, 118, { duration, delay, ease })
    return () => {
      a.stop()
      b.stop()
    }
  }, [reduced, value, duration, delay, n, wdth])

  return (
    <motion.span
      className={className}
      style={{
        ...style,
        color: toneVar[tone],
        fontVariationSettings: settings,
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-flex',
        alignItems: 'baseline',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.18 : 0.35, delay }}
    >
      {prefix && <span>{prefix}</span>}
      <motion.span>{text}</motion.span>
      {suffix && <span>{suffix}</span>}
    </motion.span>
  )
}
