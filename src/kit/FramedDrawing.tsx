import { motion, useReducedMotion } from 'motion/react'
import './frameddrawing.css'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  delay?: number
  rotate?: number
  /** Screenshots get a frame; the blueprint does not. */
  framed?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * A drawing on the sheet, revealed by a top-to-bottom wipe so it reads as
 * being drawn rather than fading in.
 *
 * `framed` adds the thin drawn border used for the two site screenshots.
 * The blueprint of the building is not framed — it is line work in the same
 * palette as the sheet, so it belongs directly on the grid.
 */
export function FramedDrawing({
  src,
  alt,
  width,
  height,
  delay = 0,
  rotate = 0,
  framed = true,
  className,
  style,
}: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={`drawing ${framed ? 'drawing--framed' : ''} ${className ?? ''}`}
      style={{ ...style, width, height, rotate }}
      initial={reduced ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.18 : 0.4, delay }}
    >
      <motion.div
        className="drawing__clip"
        initial={
          reduced ? { clipPath: 'inset(0 0 0% 0)' } : { clipPath: 'inset(0 0 100% 0)' }
        }
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{
          duration: reduced ? 0.18 : 1.1,
          delay: delay + 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <img src={src} alt={alt} width={width} height={height} draggable={false} />
      </motion.div>

      {framed && (
        <svg className="drawing__frame" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <motion.rect
            x="0.5"
            y="0.5"
            width={width - 1}
            height={height - 1}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
            animate={reduced ? { opacity: 0.55 } : { pathLength: 1 }}
            transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
            opacity={0.55}
          />
        </svg>
      )}
    </motion.div>
  )
}
