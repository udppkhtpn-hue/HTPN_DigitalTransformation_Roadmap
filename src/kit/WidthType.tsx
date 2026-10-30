import { useEffect } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'

export interface Axes {
  wdth: number
  wght: number
}

interface Props {
  children: string
  from?: Axes
  to?: Axes
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
  /** Restart the animation when this changes. */
  replay?: string | number
}

const CONDENSED: Axes = { wdth: 62, wght: 700 }
const RELAXED: Axes = { wdth: 112, wght: 500 }

/**
 * The deck's signature: display type that animates its width axis.
 *
 * Driven from a MotionValue and written as a string each frame rather than
 * keyframed in CSS, because `font-variation-settings` does not interpolate
 * reliably across engines.
 *
 * This is the expensive animation in the whole deck — every glyph
 * re-rasterises every frame — so it is capped at roughly 16 glyphs at once,
 * never runs on body copy, and never overlaps a heavy transform.
 */
export function WidthType({
  children,
  from = CONDENSED,
  to = RELAXED,
  delay = 0,
  duration = 0.9,
  className,
  style,
  replay,
}: Props) {
  const reduced = useReducedMotion()
  const wdth = useMotionValue(reduced ? to.wdth : from.wdth)
  const wght = useMotionValue(reduced ? to.wght : from.wght)
  const settings = useMotionTemplate`'wdth' ${wdth}, 'wght' ${wght}`

  useEffect(() => {
    if (reduced) {
      wdth.set(to.wdth)
      wght.set(to.wght)
      return
    }
    wdth.set(from.wdth)
    wght.set(from.wght)
    const ease = [0.16, 1, 0.3, 1] as const
    const a = animate(wdth, to.wdth, { duration, delay, ease })
    const b = animate(wght, to.wght, { duration, delay, ease })
    return () => {
      a.stop()
      b.stop()
    }
    // from/to are plain objects recreated each render; depend on their values.
  }, [
    reduced,
    replay,
    from.wdth,
    from.wght,
    to.wdth,
    to.wght,
    duration,
    delay,
    wdth,
    wght,
  ])

  return (
    <motion.span
      className={className}
      style={{ ...style, fontVariationSettings: settings }}
      // Not `initial={false}` — that paints at the animate values on the
      // first frame, so every delay was ignored and all of a scene's lines
      // arrived at once with only their widths staggered.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.18 : 0.4, delay }}
    >
      {children}
    </motion.span>
  )
}

export const AXES = { CONDENSED, RELAXED }
