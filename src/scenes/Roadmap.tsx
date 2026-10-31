import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import type { SceneProps } from './index.ts'
import kik1 from '../assets/kik-ipo-1.webp'
import kik2 from '../assets/kik-ipo-2.webp'
import './roadmap.css'

const c = sceneContent('roadmap')

// Four columns across the 1560px drawing, 30px gutters.
const COLS = [
  { x: 200, w: 380 },
  { x: 610, w: 400 },
  { x: 1040, w: 340 },
  { x: 1410, w: 350 },
]
/** Press on which each phase arrives. Press 2 (step 1) is the pin, between 1 and 2. */
const PHASE_STEP = [0, 2, 3, 4]

const UPPER = 300 // y of the HTPN rail
const LOWER = 530 // y of the KKM rail
const PIN = { x: 595, y: UPPER }

/**
 * Two tracks, one roadmap.
 *
 * Each phase carries an upper rail (HTPN, the lighthouse, in chalk) and a
 * lower one (KKM, what travels, in cyan), tied together by a thin amber
 * line. The sheet's moment is press 2: a pin drops into the gap between
 * Phase 1 and Phase 2 for a workshop that has already happened, because the
 * strongest thing a roadmap can show is that it has started.
 *
 * "Done when" lines do not appear here. At 28px, with two rails per phase,
 * they cost the sheet its legibility, so they live in the presenter cues.
 */
export function Roadmap({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const m = c.milestone

  return (
    <div className="sc rm">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {COLS.map((col, i) =>
          step >= PHASE_STEP[i] ? (
            <g key={i}>
              <DrawPath d={`M ${col.x} ${UPPER} H ${col.x + col.w}`} duration={0.8} stroke="var(--chalk)" opacity={0.6} />
              <DrawPath d={`M ${col.x} ${LOWER} H ${col.x + col.w}`} duration={0.8} delay={0.15} opacity={0.6} />
              {/* the thin amber link between the two rails */}
              <DrawPath d={`M ${col.x + 5} ${UPPER} V ${LOWER}`} duration={0.7} delay={0.3} stroke="var(--signal)" width={1.2} opacity={0.75} />
              <circle cx={col.x + 5} cy={UPPER} r={4.5} fill="var(--signal)" />
              <circle cx={col.x + 5} cy={LOWER} r={4.5} fill="var(--signal)" />
            </g>
          ) : null,
        )}

        {/* the pin between Phase 1 and Phase 2 */}
        {step >= 1 && (
          <motion.g
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0.18 }
                : { type: 'spring', stiffness: 260, damping: 15, mass: 0.9, delay: 0.1 }
            }
          >
            <path
              d={`M ${PIN.x} ${PIN.y} L ${PIN.x - 9} ${PIN.y - 22} a 11 11 0 1 1 18 0 z`}
              fill="var(--signal)"
            />
            <circle cx={PIN.x} cy={PIN.y - 28} r={3.6} fill="var(--drafting)" />
          </motion.g>
        )}
      </svg>

      {/* phase text */}
      {COLS.map((col, i) => {
        const p = c.phases[i]
        if (step < PHASE_STEP[i]) return null
        return (
          <motion.div
            key={p.n}
            className="rm__col"
            style={{ left: col.x, width: col.w }}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`rm__head ${p.achieved ? 'is-achieved' : ''}`}>
              <span className="rm__n">Phase {p.n}</span>
              <span className="rm__name">{p.name}</span>
              <span className="rm__dates">{p.dates}</span>
            </div>

            <p className="rm__rail rm__rail--htpn" style={{ top: UPPER + 12 }}>
              {i === 0 && <i className="rm__rail-name">{c.rails.htpn}</i>}
              {p.htpn}
            </p>
            <p className="rm__rail rm__rail--kkm" style={{ top: LOWER + 12 }}>
              {i === 0 && <i className="rm__rail-name">{c.rails.kkm}</i>}
              {p.kkm}
            </p>

            {p.achieved && (
              <motion.span
                className="rm__stamp"
                initial={{ opacity: 0, scale: reduced ? 1 : 1.5, rotate: -11 }}
                animate={{ opacity: 1, scale: 1, rotate: -7 }}
                transition={{ duration: 0.45, delay: 0.5 * t, ease: [0.3, 1.3, 0.5, 1] }}
              >
                ACHIEVED
              </motion.span>
            )}
          </motion.div>
        )
      })}

      {/* press 2: the pin's label and the workshop it marks */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            key="milestone"
            className="rm__ms"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.span
              className="rm__pin-date"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 * t }}
            >
              {m.pin}
            </motion.span>

            <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
              <DrawPath d="M 720 170 H 1760 V 810 H 720 Z" delay={0.5} duration={1.1} opacity={0.3} />
            </svg>

            {/* two prints held by drafting clips, never in full colour */}
            <motion.figure
              className="rm__print rm__print--a"
              initial={{ opacity: 0, y: reduced ? 0 : 20, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.7 * t, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={kik1} alt="" width={220} height={293} />
              <i className="rm__clip" />
            </motion.figure>
            <motion.figure
              className="rm__print rm__print--b"
              initial={{ opacity: 0, y: reduced ? 0 : 20, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.95 * t, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={kik2} alt="" width={290} height={218} />
              <i className="rm__clip" />
            </motion.figure>

            <motion.div
              className="rm__card"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 * t }}
            >
              <span className="rm__card-title">{m.title}</span>
              <span className="rm__card-where">{m.where}</span>
              <span className="rm__card-att">{m.attendance}</span>
              {m.speakers.map((s) => (
                <span className="rm__speaker" key={s.name}>
                  <b>{s.name}</b>
                  {s.role}
                </span>
              ))}
              <span className="rm__card-line">{m.line}</span>
              <motion.span
                className="rm__done"
                initial={{ opacity: 0, scale: reduced ? 1 : 1.4, rotate: -9 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                transition={{ duration: 0.4, delay: 1.7 * t, ease: [0.3, 1.3, 0.5, 1] }}
              >
                {m.stamp}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.ul
        className="rm__enablers"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {c.enablers.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </motion.ul>
    </div>
  )
}
