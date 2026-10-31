import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Photo } from '../content/photos.ts'
import './photoreel.css'

interface Props {
  photos: Photo[]
  /** 'x' runs right to left, 'y' runs upwards. */
  axis?: 'x' | 'y'
  /** The fixed side of every frame: height on 'x', width on 'y'. */
  size: number
  gap?: number
  /** Stage pixels per second. Slow enough to see a face, not to study it. */
  speed?: number
  delay?: number
  label: string
  className?: string
}

/**
 * Photographs drifting past a window, on a loop that never visibly restarts.
 *
 * The set is laid out twice and the track slides by exactly one set's
 * length, so the second copy arrives where the first began. It is a CSS
 * animation on transform alone: the compositor runs it, and nothing on the
 * sheet's own timeline has to wait for it. It is never the thing the room is
 * reading, so it never starts or stops with a press.
 *
 * Reduced motion: one copy, held still.
 */
export function PhotoReel({
  photos,
  axis = 'x',
  size,
  gap = 16,
  speed = 34,
  delay = 0,
  label,
  className,
}: Props) {
  const reduced = useReducedMotion()
  const along = photos.map((p) => Math.round(axis === 'x' ? (size * p.w) / p.h : (size * p.h) / p.w))
  const run = along.reduce((a, b) => a + b, 0) + gap * photos.length
  const frames = reduced ? photos : [...photos, ...photos]

  return (
    <motion.div
      className={`reel reel--${axis} ${className ?? ''}`}
      role="img"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: reduced ? 0 : delay }}
    >
      <div
        className="reel__track"
        style={
          {
            gap,
            '--reel-run': `${-run}px`,
            animationDuration: `${(run / speed).toFixed(1)}s`,
          } as CSSProperties
        }
      >
        {frames.map((p, i) => {
          const n = along[i % photos.length]
          return (
            <img
              key={i}
              className="reel__frame"
              src={p.src}
              alt=""
              draggable={false}
              decoding="async"
              width={axis === 'x' ? n : size}
              height={axis === 'x' ? size : n}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
