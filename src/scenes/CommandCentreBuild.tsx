import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { Dimension } from '../kit/Dimension.tsx'
import { DrawPath } from '../kit/DrawPath.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './commandcentrebuild.css'

const c = sceneContent('command-centre-build')

const X0 = 200
const X1 = 1760
const LINE_Y = 430

/**
 * Where the two milestones sit on the line.
 *
 * Positions are ordinal, not dated: nothing in the source says which month
 * either lands in, and a marker placed on a month tick would assert one.
 * "First" and "before the dengue season" are the whole claim.
 */
const MARKS = [
  { x: 543, w: 560 },
  { x: 1167, w: 590 },
]

const STAMP_AT = [1.4, 2.5]

/**
 * Small first, governed from day one.
 *
 * Press 1 draws the twelve months of Phase 4 as a dimension and stamps two
 * milestones onto it in order. Press 2 adds the four rules the build runs
 * under, as pencilled notes beneath, and the test for done.
 */
export function CommandCentreBuild({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1

  return (
    <div className="sc cb">
      <h1 className="cb__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 108, wght: 650 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>
      <motion.p
        className="cb__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 * t }}
      >
        {c.kicker}
      </motion.p>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <Dimension x1={X0} x2={X1} y={LINE_Y} extend={40} label="12 months" delay={0.7 * t} />
        {MARKS.map((m, i) => (
          <DrawPath
            key={i}
            d={`M ${m.x} ${LINE_Y - 12} V ${LINE_Y}`}
            delay={(STAMP_AT[i] + 0.1) * t}
            duration={0.2}
            stroke="var(--signal)"
            width={2}
            opacity={0.9}
          />
        ))}
      </svg>

      <motion.span
        className="cb__end cb__end--from"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 * t }}
      >
        {c.range.from}
      </motion.span>
      <motion.span
        className="cb__end cb__end--to"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 * t }}
      >
        {c.range.to}
      </motion.span>

      {c.milestones.map((text, i) => (
        <div key={text}>
          <motion.span
            className="cb__stamp"
            style={{ left: MARKS[i].x - 28, top: LINE_Y - 72 }}
            initial={{ opacity: 0, scale: reduced ? 1 : 1.6, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            transition={{ duration: 0.45, delay: STAMP_AT[i] * t, ease: [0.3, 1.3, 0.5, 1] }}
          >
            {i + 1}
          </motion.span>
          <motion.p
            className="cb__milestone"
            style={{ left: MARKS[i].x, width: MARKS[i].w, top: LINE_Y + 62 }}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (STAMP_AT[i] + 0.2) * t }}
          >
            {text}
          </motion.p>
        </div>
      ))}

      {step >= 1 && (
        <>
          <div className="cb__rules">
            {c.rules.map((r, i) => (
              <motion.p
                key={r}
                className="cb__rule"
                initial={{ opacity: 0, y: reduced ? 0 : 12, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 ? 0.5 : -0.5 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {r}
              </motion.p>
            ))}
          </div>
          <motion.p
            className="cb__done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 * t }}
          >
            <i>Done when:</i> {c.doneWhen.replace(/^Done when:\s*/, '')}
          </motion.p>
        </>
      )}
    </div>
  )
}
