import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { Dimension } from '../kit/Dimension.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './nationalpicture.css'

const c = sceneContent('national-picture')

// 155 hospitals as 155 marks: 31 across, 5 down.
const COLS = 31
const X0 = 213
const Y0 = 440
const PITCH_X = 50
const PITCH_Y = 52
const R = 13
const COUNT = c.total.value

/** Which rollout year each mark belongs to, in the order the hospitals light up. */
const YEAR_OF: number[] = (() => {
  const out: number[] = []
  for (let i = 0; i < c.withThis.value; i++) out.push(-1) // already live
  c.rollout.years.forEach((y, k) => {
    for (let i = 0; i < y.add; i++) out.push(k)
  })
  return out
})()

/** When each year's marks start lighting on press 2. */
const YEAR_AT = [0.3, 1.5, 2.7, 3.9]

/**
 * Where the apps are needed.
 *
 * One hospital, one mark. A hundred and fifty-five of them stand on the
 * sheet as outlines; the twenty that already have THIS fill in. On press 2
 * the rollout lights the rest in the four years it is planned for, and by
 * the end every mark is lit, because that is what the numbers add up to.
 * Press 3 puts the second argument on top: a hospital being lit is not the
 * same as its work being covered.
 *
 * No running totals are printed anywhere. Only the figures that were given
 * (20, 135, 155, and +16, +26, +44, +49) appear; the marks do the adding.
 */
export function NationalPicture({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1

  return (
    <div className="sc np">
      <h1 className="np__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 108, wght: 650 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <Dimension x1={200} x2={X0 + (COLS - 1) * PITCH_X + R} y={400} extend={22} label={`${c.total.value} ${c.total.label}`} delay={0.6 * t} />

        <motion.g animate={{ opacity: step >= 2 ? 0.2 : 1 }} transition={{ duration: 0.6 }}>
          {Array.from({ length: COUNT }, (_, i) => {
            const cx = X0 + (i % COLS) * PITCH_X
            const cy = Y0 + Math.floor(i / COLS) * PITCH_Y
            const y = YEAR_OF[i]
            const live = y === -1
            // a mark fills when its turn comes: today for the twenty, and by
            // year on press 2 for the rest, a few milliseconds apart within a year
            const fillAt = live
              ? 1.3 + i * 0.03
              : YEAR_AT[y] + (i - (c.withThis.value + c.rollout.years.slice(0, y).reduce((a, b) => a + b.add, 0))) * 0.012
            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={R}
                fill={live ? 'var(--line)' : 'var(--signal)'}
                stroke="var(--line)"
                strokeWidth={1.4}
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0, fillOpacity: 0 }}
                animate={{
                  opacity: 1,
                  strokeOpacity: live || step >= 1 ? 0.9 : 0.5,
                  fillOpacity: live || step >= 1 ? 1 : 0,
                }}
                transition={{
                  opacity: { duration: 0.3, delay: (0.9 + (i % COLS) * 0.012 + Math.floor(i / COLS) * 0.05) * t },
                  // Lights on its turn going forwards; goes dark at once going back.
                  fillOpacity: { duration: reduced ? 0.2 : 0.35, delay: (live ? step === 0 : step >= 1) ? fillAt * t : 0 },
                  strokeOpacity: { duration: 0.35 },
                }}
              />
            )
          })}
        </motion.g>
      </svg>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" className="np__layer" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="np__stat np__stat--a">
              <CountUp value={c.withThis.value} tone="chalk" delay={1.3 * t} duration={1.2} className="np__num" />
              <span className="np__cap">{c.withThis.label}</span>
            </div>
            <div className="np__stat np__stat--b">
              <CountUp value={c.manual.value} tone="signal" delay={1.3 * t} duration={1.4} className="np__num" />
              <span className="np__cap">{c.manual.label}</span>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" className="np__layer" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="np__rollcap">{c.rollout.caption}</p>
            <div className="np__years">
              {c.rollout.years.map((y, k) => (
                <motion.div
                  key={y.year}
                  className="np__year"
                  initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: (YEAR_AT[k] - 0.1) * t }}
                >
                  <span className="np__year-n">{y.year}</span>
                  <span className="np__year-add">+{y.add}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="np__budget"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 4.4 * t }}
            >
              <span className="np__budget-amt">{c.budget.amount}</span>
              <span className="np__cap">{c.budget.label}</span>
            </motion.div>
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div key="s2" className="np__layer" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <motion.p
              className="np__depth"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 * t }}
            >
              {c.depth.line}
            </motion.p>
            <motion.div
              className="np__sites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 * t }}
            >
              <span className="np__found">{c.depth.foundAt}</span>
              {c.depth.sites.map((s) => (
                <span className="np__site" key={s}>{s}</span>
              ))}
            </motion.div>
            <motion.p
              className="np__closer"
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.6 * t }}
            >
              {c.depth.closer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
