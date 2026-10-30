import { motion, useReducedMotion } from 'motion/react'
import './marginnote.css'

interface Props {
  children: React.ReactNode
  /** Degrees. Small — this is a pencilled note, not a sticker. */
  rotate?: number
  delay?: number
  width?: number
  className?: string
  style?: React.CSSProperties
  /** Draw a leader line from the note toward what it refers to. */
  leader?: 'left' | 'right' | 'none'
}

/**
 * An architect's note in the margin of the print.
 *
 * The only place a full human sentence appears, the only place Instrument
 * Serif appears, and — with the achieved figures — the only place --signal
 * appears. Everything inside the drawing margin is Archivo.
 */
export function MarginNote({
  children,
  rotate = -1.2,
  delay = 0,
  width = 560,
  className,
  style,
  leader = 'none',
}: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={`mnote ${className ?? ''}`}
      style={{ ...style, width }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, rotate }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: reduced ? 0.18 : 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {leader !== 'none' && (
        <svg
          className={`mnote__leader mnote__leader--${leader}`}
          viewBox="0 0 120 20"
          aria-hidden="true"
        >
          <motion.path
            d={leader === 'left' ? 'M 118 10 L 2 10' : 'M 2 10 L 118 10'}
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
            animate={reduced ? { opacity: 0.6 } : { pathLength: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.25 }}
            opacity={0.6}
          />
        </svg>
      )}
      <span className="mnote__text">{children}</span>
    </motion.div>
  )
}
