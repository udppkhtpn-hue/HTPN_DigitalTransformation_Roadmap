import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './workshopreach.css'

const c = sceneContent('workshop-reach')

/** One tick per workshop across the sheet: 40 ticks, 30 wide, 8 apart. */
const TICK = 30
const GAP = 8
const PITCH = TICK + GAP
const X0 = 200
const SPLIT = c.internal.n * PITCH

/**
 * Oxford. Press 1: forty workshops as forty ticks, the internal ones first
 * and then the invitations, which outnumber them. Press 2: who invited us,
 * grouped by the kind of host, the ticks folding away to make room.
 */
export function WorkshopReach({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const sites = step >= 1

  return (
    <div className="sc wr">
      <motion.p
        className="wr__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 * t }}
      >
        {c.kicker}
      </motion.p>
      <h1 className="wr__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 104, wght: 660 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>

      <AnimatePresence mode="wait" initial={false}>
        {!sites ? (
          <motion.div
            key="ticks"
            className="wr__count"
            exit={{ opacity: 0, y: -12 * t, transition: { duration: 0.3 } }}
          >
            <div className="wr__figs">
              <div className="wr__fig">
                <CountUp value={c.total} tone="chalk" className="wr__num" delay={0.5 * t} duration={1.6} />
                <span className="wr__fig-label">workshops conducted</span>
              </div>
              <div className="wr__fig">
                <CountUp {...c.trained} className="wr__num" delay={2.6 * t} duration={1.2} />
                <span className="wr__fig-label">{c.trained.label}</span>
              </div>
            </div>

            <svg className="wr__ticks" viewBox={`0 0 1520 200`} aria-hidden="true">
              {Array.from({ length: c.total }, (_, i) => {
                const ext = i >= c.internal.n
                return (
                  <motion.rect
                    key={i}
                    x={i * PITCH}
                    y={0}
                    width={TICK}
                    height={84}
                    className={ext ? 'wr__tick wr__tick--ext' : 'wr__tick'}
                    initial={{ scaleY: reduced ? 1 : 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.25, delay: (0.5 + i * 0.04) * t }}
                    style={{ transformOrigin: `${i * PITCH + TICK / 2}px 84px` }}
                  />
                )
              })}
              {/* brackets under each run */}
              {[
                { x1: 0, x2: SPLIT - GAP, d: 2.4 },
                { x1: SPLIT, x2: c.total * PITCH - GAP, d: 2.6 },
              ].map((b, k) => (
                <motion.path
                  key={k}
                  d={`M ${b.x1} 104 L ${b.x1} 118 L ${b.x2} 118 L ${b.x2} 104`}
                  className={k ? 'wr__bracket wr__bracket--ext' : 'wr__bracket'}
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: b.d * t }}
                />
              ))}
            </svg>

            {[
              { ...c.internal, left: X0, tone: 'chalk' as const, d: 2.5 },
              { ...c.external, left: X0 + SPLIT, tone: 'signal' as const, d: 2.7 },
            ].map((run) => (
              <motion.div
                key={run.label}
                className="wr__run"
                style={{ left: run.left }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: run.d * t }}
              >
                <span className={`wr__run-n wr__run-n--${run.tone}`}>{run.n}</span>
                <span className="wr__run-label">{run.label}</span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="sites"
            className="wr__sites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="wr__sites-head">
              <span className="wr__sites-n">{c.external.n}</span> {c.sitesHeading}
            </p>
            <div className="wr__groups">
              {c.groups.map((g, gi) => (
                <section key={g.name} className="wr__group">
                  <h2 className="wr__group-name">{g.name}</h2>
                  <ul>
                    {g.sites.map((s, si) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, x: reduced ? 0 : -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: (0.25 + gi * 0.35 + si * 0.08) * t }}
                      >
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="wr__closer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 3.2 * t }}
      >
        {c.closer}
      </motion.p>
    </div>
  )
}
