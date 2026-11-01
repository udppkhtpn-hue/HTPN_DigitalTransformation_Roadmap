import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DOTS } from '../kit/dots.ts'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './s08.css'

const c = sceneContent('the-gap')

/**
 * Fifty apps, scattered and unconnected.
 *
 * These are the same fifty dots, in the same positions, that S-10 pulls into
 * six streams — the gap and the answer to it are one object seen twice. The
 * drift is a slow transform on each circle inside a single SVG, so the fifty
 * of them share one paint rather than taking fifty compositor layers.
 */
export function S08TheGap({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const open = step >= 1
  // One gap per click, in the order the speaker names them; the lens
  // arrives with the last, because it is the verdict on all four.
  const allIn = step >= c.gaps.length

  return (
    <div className="sc s08">
      <svg className="sc__svg s08__field" viewBox="0 0 1920 1080" aria-hidden="true">
        <motion.g animate={{ opacity: open ? 0.3 : 1 }} transition={{ duration: 0.6 }}>
          {DOTS.map((d, i) => (
            <motion.circle
              key={d.id}
              cx={d.x}
              cy={d.y}
              r={7}
              fill="var(--line)"
              className={reduced ? undefined : 's08__dot'}
              style={
                reduced
                  ? undefined
                  : {
                      animationDuration: `${9 + (d.id % 7)}s`,
                      animationDelay: `${-(d.id % 11)}s`,
                    }
              }
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.012 }}
            />
          ))}
        </motion.g>
      </svg>

      <h1 className="s08__head">
        <WidthType
          from={{ wdth: 62, wght: 700 }}
          to={{ wdth: 104, wght: 650 }}
          duration={0.8}
          delay={0.35}
        >
          {c.headline}
        </WidthType>
      </h1>

      <div className="s08__gaps">
        {c.gaps.map((g, i) =>
          step > i ? (
            <motion.div
              className="s08__gap"
              key={g.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="s08__gap-name">{g.name}</span>
              <span className="s08__gap-body">{g.body}</span>
            </motion.div>
          ) : (
            <span className="s08__gap-slot" key={g.name} aria-hidden="true" />
          ),
        )}
      </div>

      {allIn && (
        <motion.p
          className="s08__lens"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {c.lens}
        </motion.p>
      )}
    </div>
  )
}
