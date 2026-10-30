import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { DrawPath } from '../kit/DrawPath.tsx'
import './s05.css'

const c = sceneContent('results')

const X0 = 200
const COL = 760
const ROW_Y = [470, 760]

/**
 * Four figures landing on a measured baseline, 0.6s apart.
 *
 * They are dimensions on the drawing rather than stat cards: a rule, a tick
 * down to it from each figure, and the number sitting above the tick. The
 * whole scene is one step — the sequence runs itself while the room reads.
 */
export function S05Results() {
  return (
    <div className="sc s05">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {ROW_Y.map((y, r) => (
          <DrawPath
            key={y}
            d={`M ${X0} ${y} L ${X0 + 1500} ${y}`}
            delay={r * 1.2}
            duration={1.0}
            opacity={0.45}
          />
        ))}
        {c.figures.map((_, i) => (
          <DrawPath
            key={i}
            d={`M ${X0 + (i % 2) * COL} ${ROW_Y[Math.floor(i / 2)] - 42} L ${X0 + (i % 2) * COL} ${ROW_Y[Math.floor(i / 2)]}`}
            delay={0.25 + i * 0.6}
            duration={0.3}
            opacity={0.7}
          />
        ))}
      </svg>

      {c.figures.map((f, i) => (
        <div
          className="s05__col"
          key={f.label}
          style={{
            left: X0 + (i % 2) * COL,
            top: ROW_Y[Math.floor(i / 2)] - 196,
          }}
        >
          <CountUp
            {...f}
            className="s05__num"
            delay={0.25 + i * 0.6}
            duration={1.25}
          />
          <motion.span
            className="s05__label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.75 + i * 0.6 }}
          >
            {f.label}
          </motion.span>
        </div>
      ))}

      <motion.p
        className="s05__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 3.1 }}
      >
        {c.footnote}
      </motion.p>
    </div>
  )
}
