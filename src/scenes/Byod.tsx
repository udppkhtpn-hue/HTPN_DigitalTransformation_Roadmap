import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './byod.css'

const c = sceneContent('byod')

const R = 190
const CIRC = 2 * Math.PI * R
const SHARE = c.users / c.total
const PERCENT = (SHARE * 100).toFixed(1)
const MAX = Math.max(...c.roles.map((r) => r.n))
/** Longest bar, for the largest role. */
const BAR = 270

/**
 * Oxford. Press 1: the share, as a ring that closes to 643 of 1,406.
 * Press 2: the denominator itself, role by role, so the room sees that
 * "clinical staff" means everyone on the wards, not a pilot group.
 */
export function Byod({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const roles = step >= 1

  return (
    <div className="sc byod">
      <motion.p
        className="byod__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 * t }}
      >
        {c.kicker}
      </motion.p>
      <h1 className="byod__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 100, wght: 640 }} duration={0.8} delay={0.2 * t}>
          {c.definition}
        </WidthType>
      </h1>

      {/* the ring */}
      <svg className="byod__ring" viewBox="0 0 440 440" aria-hidden="true">
        <circle cx="220" cy="220" r={R} className="byod__track" />
        <motion.circle
          cx="220"
          cy="220"
          r={R}
          className="byod__arc"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: reduced ? CIRC * (1 - SHARE) : CIRC }}
          animate={{ strokeDashoffset: CIRC * (1 - SHARE) }}
          transition={{ duration: 1.6 * t + 0.01, delay: 0.6 * t, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 220 220)"
        />
      </svg>
      <div className="byod__mid">
        <CountUp value={c.users} tone="signal" className="byod__num" delay={0.6 * t} duration={1.6} />
        <span className="byod__of">of {c.total.toLocaleString('en-MY')}</span>
      </div>

      <motion.div
        className="byod__share"
        initial={{ opacity: 0, x: reduced ? 0 : -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.9 * t }}
      >
        <span className="byod__pct">{PERCENT}%</span>
        <span className="byod__label">{c.usersLabel}</span>
      </motion.div>

      {/* the denominator, by role */}
      <motion.div
        className="byod__roles"
        initial={false}
        animate={{ opacity: roles ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        aria-hidden={!roles}
      >
        <p className="byod__roles-head">{c.rolesHeading}</p>
        <ul>
          {c.roles.map((r, i) => (
            <li key={r.role}>
              <span className="byod__role">{r.role}</span>
              <span className="byod__bar-row">
                <motion.i
                  className="byod__bar"
                  initial={false}
                  animate={{ width: roles ? (r.n / MAX) * BAR : 0 }}
                  transition={{ duration: 0.8 * t + 0.01, delay: roles ? (0.2 + i * 0.1) * t : 0, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="byod__n">{r.n.toLocaleString('en-MY')}</span>
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
