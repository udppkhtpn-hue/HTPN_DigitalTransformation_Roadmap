import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './measuringsuccess.css'

const c = sceneContent('measuring-success')

const X0 = 200
const X1 = 1760
const COL2 = 700 // where the indicators column starts
const TOP = 252
const HEAD_H = 46
const ROW_H = 98

/**
 * A schedule, the table an architect puts in the corner of a drawing.
 *
 * Its ruled lines draw on row by row, top to bottom, with each row's text
 * arriving as its rule lands. Phase 1 is the only row in --signal: it is
 * the only one that has already happened.
 */
export function MeasuringSuccess(_: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const rowsTop = TOP + HEAD_H
  const bottom = rowsTop + c.rows.length * ROW_H

  return (
    <div className="sc ms">
      <h1 className="ms__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 108, wght: 650 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {/* the schedule's frame: heavy top and bottom, a hairline under the header */}
        <DrawPath d={`M ${X0} ${TOP} H ${X1}`} delay={0.5 * t} duration={0.8} width={2} stroke="var(--chalk)" opacity={0.85} />
        <DrawPath d={`M ${X0} ${rowsTop} H ${X1}`} delay={0.7 * t} duration={0.8} width={1.4} opacity={0.7} />
        {c.rows.map((r, i) => (
          <DrawPath
            key={r.n}
            d={`M ${X0} ${rowsTop + (i + 1) * ROW_H} H ${X1}`}
            delay={(0.95 + i * 0.32) * t}
            duration={0.7}
            width={i === c.rows.length - 1 ? 2 : 1}
            stroke={i === c.rows.length - 1 ? 'var(--chalk)' : 'var(--line)'}
            opacity={i === c.rows.length - 1 ? 0.85 : 0.4}
          />
        ))}
        {/* the column rule */}
        <DrawPath d={`M ${COL2 - 24} ${TOP} V ${bottom}`} delay={0.8 * t} duration={1.4} width={1} opacity={0.4} />
      </svg>

      <motion.div
        className="ms__cols"
        style={{ top: TOP + 6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 * t }}
      >
        <span style={{ left: X0 + 4 }}>{c.columns[0]}</span>
        <span style={{ left: COL2 }}>{c.columns[1]}</span>
      </motion.div>

      {c.rows.map((r, i) => (
        <motion.div
          key={r.n}
          className={`ms__row${r.achieved ? ' is-achieved' : ''}`}
          style={{ top: rowsTop + i * ROW_H, height: ROW_H }}
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (1.0 + i * 0.32) * t }}
        >
          <span className="ms__phase">
            <i>{r.n}</i>
            <b>{r.name}</b>
            {r.achieved && <em>achieved</em>}
          </span>
          <span className="ms__ind">{r.indicators}</span>
        </motion.div>
      ))}

      <motion.p
        className="ms__note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.8 * t }}
      >
        {c.note}
      </motion.p>
    </div>
  )
}
