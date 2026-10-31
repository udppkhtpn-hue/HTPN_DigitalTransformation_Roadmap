import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import type { SceneProps } from './index.ts'
import './risks.css'

const c = sceneContent('risks')

const X0 = 200
const X1 = 1760
const COL2 = 840
const FIRST_TOP = 240
const FIRST_H = 112
const HEAD_TOP = 390
const HEAD_H = 40
const ROW_H = 80

/**
 * A rubber stamp lands on the sheet, and under it the first line of the
 * register, in red: the risk is already here, and it is people.
 *
 * Press 2 draws the rest of the register as a schedule. Red appears twice on
 * this sheet and nowhere else in the deck outside the dengue figure: the
 * stamp and the one row it points at.
 */
export function Risks({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const rowsTop = HEAD_TOP + HEAD_H
  const bottom = rowsTop + c.rest.length * ROW_H

  return (
    <div className="sc rk">
      <motion.p
        className="rk__stamp"
        initial={{ opacity: 0, scale: reduced ? 1 : 1.7, rotate: reduced ? -2 : -10 }}
        animate={{ opacity: 0.96, scale: 1, rotate: -2 }}
        transition={{ duration: reduced ? 0.18 : 0.5, delay: 0.35 * t, ease: [0.3, 1.35, 0.5, 1] }}
      >
        {c.stamp}
      </motion.p>

      {/* the first register row, in red */}
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <DrawPath d={`M ${X0} ${FIRST_TOP} H ${X1}`} delay={1.1 * t} duration={0.7} width={2} stroke="var(--alert)" opacity={0.9} />
        <DrawPath d={`M ${X0} ${FIRST_TOP + FIRST_H} H ${X1}`} delay={1.3 * t} duration={0.7} width={2} stroke="var(--alert)" opacity={0.9} />

        {step >= 1 && (
          <g>
            <DrawPath d={`M ${X0} ${HEAD_TOP} H ${X1}`} duration={0.7} width={2} stroke="var(--chalk)" opacity={0.85} />
            <DrawPath d={`M ${X0} ${rowsTop} H ${X1}`} delay={0.15} duration={0.7} width={1.4} opacity={0.7} />
            {c.rest.map((_, i) => (
              <DrawPath
                key={i}
                d={`M ${X0} ${rowsTop + (i + 1) * ROW_H} H ${X1}`}
                delay={0.3 + i * 0.25}
                duration={0.6}
                width={i === c.rest.length - 1 ? 2 : 1}
                stroke={i === c.rest.length - 1 ? 'var(--chalk)' : 'var(--line)'}
                opacity={i === c.rest.length - 1 ? 0.85 : 0.4}
              />
            ))}
            <DrawPath d={`M ${COL2 - 24} ${HEAD_TOP} V ${bottom}`} delay={0.3} duration={1.2} width={1} opacity={0.4} />
          </g>
        )}
      </svg>

      <motion.div
        className="rk__first"
        style={{ top: FIRST_TOP, height: FIRST_H }}
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 * t }}
      >
        <span className="rk__first-risk">
          <i>{c.first.severity}</i>
          {c.first.risk}
        </span>
        <span className="rk__first-mit">{c.first.mitigation}</span>
      </motion.div>

      {/* press 2: the rest of the register */}
      {step >= 1 && (
        <>
          <motion.div
            className="rk__cols"
            style={{ top: HEAD_TOP + 5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span style={{ left: X0 + 4 }}>{c.columns[0]}</span>
            <span style={{ left: COL2 }}>{c.columns[1]}</span>
          </motion.div>
          {c.rest.map((r, i) => (
            <motion.div
              key={r.risk}
              className="rk__row"
              style={{ top: rowsTop + i * ROW_H, height: ROW_H }}
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.25 }}
            >
              <span className="rk__risk">{r.risk}</span>
              <span className="rk__mit">{r.mitigation}</span>
            </motion.div>
          ))}
        </>
      )}
    </div>
  )
}
