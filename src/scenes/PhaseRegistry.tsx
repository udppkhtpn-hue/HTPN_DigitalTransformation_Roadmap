import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { REGISTRY } from '../content/registry.ts'
import { DOTS, SLOT, TIER_BANDS, tierOf, tierPosition } from '../kit/dots.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import type { SceneProps } from './index.ts'
import './phaseregistry.css'

const c = sceneContent('phase-registry')

/** The dots hold where S-09 left them while the bands are ruled, then sort. */
const HOLD = 1.7
const SORT = 1.15
const BAND_X0 = 200
const BAND_X1 = 1760

/** Rule weight climbs with the tier: the structure is the argument. */
const RULES = [
  { width: 1, dashed: true, opacity: 0.5 },
  { width: 1.6, dashed: false, opacity: 0.75 },
  { width: 3, dashed: false, opacity: 0.95 },
]

const COUNT = [1, 2, 3].map((n) => REGISTRY.filter((a) => a.tier === n).length)

/**
 * Governance in proportion to risk, applied to the real fifty.
 *
 * The dots enter at the scattered positions the gap sheet gave them, wait
 * while three bands are ruled (lighter to heavier), then each files into
 * the tier the registry proposes for its app and stops on a bullet. The
 * app's name writes itself in beside it, so every dot the room has followed
 * since the gap sheet turns out to be a named tool with a place: three
 * experimental, thirty departmental, seventeen hospital-critical. Tier 3
 * keeps its double rule, the way a drawing marks something load-bearing.
 */
export function PhaseRegistry({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const named = HOLD + SORT + 0.25

  return (
    <div className="sc pr">
      <motion.h1
        className="pr__head"
        initial={{ opacity: 0, y: 12 * t }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 * t, ease: [0.16, 1, 0.3, 1] }}
      >
        {c.heading}
      </motion.h1>
      <motion.p
        className="pr__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 * t }}
      >
        {c.kicker} <span>· {c.note}</span>
      </motion.p>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {TIER_BANDS.map((b, i) => (
          <g key={i}>
            <DrawPath
              d={`M ${BAND_X0} ${b.y0} H ${BAND_X1} V ${b.y0 + b.h} H ${BAND_X0} Z`}
              delay={(0.6 + i * 0.35) * t}
              duration={0.9}
              width={RULES[i].width}
              dashed={RULES[i].dashed}
              opacity={RULES[i].opacity}
            />
            {i === 2 && (
              <DrawPath
                d={`M ${BAND_X0 + 9} ${b.y0 + 9} H ${BAND_X1 - 9} V ${b.y0 + b.h - 9} H ${BAND_X0 + 9} Z`}
                delay={(0.6 + i * 0.35 + 0.3) * t}
                duration={0.9}
                width={1.2}
                opacity={0.6}
              />
            )}
          </g>
        ))}

        {DOTS.map((d) => {
          const p = tierPosition(d)
          const tier = tierOf(d)
          return (
            <motion.circle
              key={d.id}
              r={7}
              fill={tier === 2 ? 'var(--signal)' : tier === 1 ? 'var(--chalk)' : 'var(--line)'}
              initial={{ cx: d.x, cy: d.y, opacity: 0.85 }}
              animate={{ cx: p.x, cy: p.y, opacity: 1 }}
              transition={{
                duration: reduced ? 0.2 : SORT,
                delay: reduced ? 0 : HOLD + (d.id % 11) * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )
        })}
      </svg>

      {/* each app's name, beside the dot that has just landed on its slot */}
      {DOTS.map((d) => {
        const p = tierPosition(d)
        const a = REGISTRY[d.id]
        return (
          <motion.span
            key={d.id}
            className={`pr__app pr__app--t${a.tier}`}
            style={{ left: p.x + SLOT.pad, top: p.y - 11 }}
            initial={{ opacity: 0, x: reduced ? 0 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: (named + (3 - a.tier) * 0.35 + (d.id % 7) * 0.03) * t }}
          >
            {a.name}
          </motion.span>
        )
      })}

      {c.tiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          className="pr__tier"
          style={{ top: TIER_BANDS[i].y0 + 12 }}
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (HOLD + 0.7 + i * 0.25) * t }}
        >
          <span className="pr__tier-name">
            <i>Tier {i + 1}</i> {tier.name} <b className={`pr__count pr__count--t${i + 1}`}>{COUNT[i]}</b>
          </span>
          <span className="pr__tier-body">{tier.body}</span>
        </motion.div>
      ))}

      {step >= 1 && (
        <motion.p
          className="pr__footer"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {c.footer}
        </motion.p>
      )}
    </div>
  )
}
