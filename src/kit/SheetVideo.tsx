import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './sheetvideo.css'

interface Props {
  /** Path relative to the build base — the file sits next to the HTML. */
  src: string
  poster?: string
  width: number
  height: number
  /** When the empty frame draws on, with the rest of the sheet. */
  delay?: number
  /** When the picture wipes in and playback starts. */
  startDelay?: number
  /** The drawn frame, faded out once the video stops being an object. */
  frameVisible?: boolean
  /** Compensates when a CSS transform scales the whole element down. */
  strokeWidth?: number
  className?: string
}

/**
 * Video on the sheet, inside a drawn frame, with no player chrome.
 *
 * Muted by default, which is both correct (you talk over it) and the only
 * way autoplay is permitted without a click. The frame draws on first and
 * the picture wipes in behind it, the same entrance the screenshots use, so
 * the video belongs to the deck rather than sitting on top of it.
 *
 * The file is a sibling of the HTML rather than inlined: 13MB of base64
 * would triple the offline file and make it slow to parse, for no gain —
 * a folder on a USB stick is just as offline as a single file.
 */
export function SheetVideo({
  src,
  poster,
  width,
  height,
  delay = 0,
  startDelay,
  frameVisible = true,
  strokeWidth = 1,
  className,
}: Props) {
  const start = startDelay ?? delay
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    // autoPlay alone is unreliable when the element mounts mid-session;
    // asking explicitly covers it, and muted means it is never blocked.
    const t = setTimeout(() => {
      v.play().catch(() => {
        /* a paused poster frame is an acceptable outcome, not a failure */
      })
    }, start * 1000)
    return () => clearTimeout(t)
  }, [start, reduced])

  return (
    <motion.div
      className={`svid ${className ?? ''}`}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.18 : 0.4, delay }}
    >
      <motion.div
        className="svid__clip"
        initial={
          reduced ? { clipPath: 'inset(0 0 0% 0)' } : { clipPath: 'inset(0 0 100% 0)' }
        }
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{
          duration: reduced ? 0.18 : 0.9,
          delay: start,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* If the file is missing the poster still shows, so the sheet can
            never be blank in front of a room. */}
        {failed && poster ? (
          <img src={poster} alt="" />
        ) : (
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            controls={!!reduced}
            onError={() => setFailed(true)}
          />
        )}
      </motion.div>

      <svg className="svid__frame" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <motion.rect
          x="0.5"
          y="0.5"
          width={width - 1}
          height={height - 1}
          fill="none"
          stroke="var(--line)"
          strokeWidth={strokeWidth}
          initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 0.55 }}
          animate={{
            pathLength: reduced ? 1 : 1,
            opacity: frameVisible ? 0.55 : 0,
          }}
          transition={{
            pathLength: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.45 },
          }}
        />
      </svg>
    </motion.div>
  )
}
