import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import type { SceneProps } from './index.ts'
import './dbs.css'

const c = sceneContent('dbs')

/** The split bar: 800 wide, insourced share grows from the left. */
const W = 800
const FROM = 15
const TO = 85
const BAR_MAX = 360
const PEAK = Math.max(...c.income.bars.map((b) => b.value))

/**
 * Oxford. The 85% insourcing figure, drawn as
 * one bar of DBS's tech capability, whose insourced share grows
 * from 15% to 85% while the outsourced share shrinks to make room.
 * Press 2 is what it bought: the algorithms, and income more than tripled.
 */
export function Dbs({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const results = step >= 1

  const share = useMotionValue(reduced ? TO : FROM)
  useEffect(() => {
    if (reduced) {
      share.set(TO)
      return
    }
    share.set(FROM)
    const a = animate(share, TO, { duration: 2.2, delay: 0.7, ease: [0.65, 0, 0.35, 1] })
    return () => a.stop()
  }, [reduced, share])
  const inW = useTransform(share, (v) => (v / 100) * W)
  const outW = useTransform(share, (v) => ((100 - v) / 100) * W)
  const inLabel = useTransform(share, (v) => `${Math.round(v)}%`)
  const outLabel = useTransform(share, (v) => `${Math.round(100 - v)}%`)

  return (
    <div className="sc dbs">
      <motion.p
        className="dbs__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 * t }}
      >
        {c.kicker}
      </motion.p>

      <motion.h1
        className="dbs__head"
        initial={{ opacity: 0, y: 10 * t }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 * t }}
      >
        <span className="dbs__from">{c.flip.from}</span>
        <span className="dbs__arrow">→</span>
        <span className="dbs__to">{c.flip.to}</span>
      </motion.h1>

      <div className="dbs__split" aria-hidden="true">
        <motion.div className="dbs__in" style={{ width: inW }}>
          <motion.span>{inLabel}</motion.span>
        </motion.div>
        <motion.div className="dbs__out" style={{ width: outW }}>
          <motion.span>{outLabel}</motion.span>
        </motion.div>
      </div>
      <p className="dbs__legend" aria-hidden="true">
        <span className="dbs__key dbs__key--in">insourced</span>
        <span className="dbs__key dbs__key--out">outsourced</span>
      </p>
      <motion.p
        className="dbs__caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.6 * t }}
      >
        {c.flip.caption}
      </motion.p>

      <ul className="dbs__how">
        {c.how.map((h, i) => (
          <motion.li
            key={h}
            initial={{ opacity: 0, y: 10 * t }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (2.9 + i * 0.15) * t, ease: [0.16, 1, 0.3, 1] }}
          >
            {h}
          </motion.li>
        ))}
      </ul>

      {/* press 2: what it bought */}
      {results && (
        <div className="dbs__results">
          <div className="dbs__algo">
            <CountUp {...c.algorithms} className="dbs__algo-num" delay={0.2 * t} duration={1.2} />
            <motion.span
              className="dbs__algo-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 * t }}
            >
              {c.algorithms.label}
            </motion.span>
            <motion.span
              className="dbs__cx"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 * t }}
            >
              {c.experience}
            </motion.span>
          </div>

          <motion.p
            className="dbs__income-head"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 * t }}
          >
            {c.income.caption}
          </motion.p>
          <ul className="dbs__income">
            {c.income.bars.map((b, i) => (
              <li key={b.year}>
                <span className="dbs__year">{b.year}</span>
                <motion.i
                  className={`dbs__bar${i === c.income.bars.length - 1 ? ' dbs__bar--now' : ''}`}
                  initial={{ width: reduced ? (b.value / PEAK) * BAR_MAX : 0 }}
                  animate={{ width: (b.value / PEAK) * BAR_MAX }}
                  transition={{ duration: 1.0 * t + 0.01, delay: (1.4 + i * 0.5) * t, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="dbs__amount"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: (2.0 + i * 0.5) * t }}
                >
                  {b.label}
                </motion.span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results && (
        <motion.p
          className="dbs__closer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.0 * t }}
        >
          {c.closer}
        </motion.p>
      )}
    </div>
  )
}
