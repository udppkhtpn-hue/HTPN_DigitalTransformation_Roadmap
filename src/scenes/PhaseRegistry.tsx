import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DOTS, TIER_BANDS, tierOf, tierPosition } from '../kit/dots.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './phaseregistry.css'

const c = sceneContent('phase-registry')

/** The dots hold where S-09 left them while the bands are ruled, then sort. */
const HOLD = 1.7
const BAND_X0 = 200
const BAND_X1 = 1760

/** Rule weight climbs with the tier: the structure is the argument. */
const RULES = [
  { width: 1, dashed: true, opacity: 0.5 },
  { width: 1.6, dashed: false, opacity: 0.75 },
  { width: 3, dashed: false, opacity: 0.95 },
]

/**
 * Governance in proportion to risk.
 *
 * The fifty dots enter at the exact scattered positions the gap sheet gave
 * them, wait while three bands are ruled across the sheet (lighter to
 * heavier), then file into their tier. The tier 3 band gets a second inner
 * rule — a double line, the way a drawing marks something load-bearing.
 */
export function PhaseRegistry({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1

  return (
    <div className="sc pr">
      <h1 className="pr__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 108, wght: 650 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>
      <motion.p
        className="pr__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 * t }}
      >
        {c.kicker}
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
              fill={tier === 2 ? 'var(--chalk)' : 'var(--line)'}
              initial={{ cx: d.x, cy: d.y, opacity: 0.85 }}
              animate={{ cx: p.x, cy: p.y, opacity: tier === 0 ? 0.8 : 1 }}
              transition={{
                duration: reduced ? 0.2 : 1.15,
                delay: reduced ? 0 : HOLD + (d.id % 11) * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )
        })}
      </svg>

      {c.tiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          className="pr__tier"
          style={{ top: TIER_BANDS[i].y0 + 14 }}
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (HOLD + 0.7 + i * 0.25) * t }}
        >
          <span className="pr__tier-name">
            <i>Tier {i + 1}</i> {tier.name}
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
