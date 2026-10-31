import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import blueprint from '../assets/blueprint-htpn.webp'
import type { SceneProps } from './index.ts'
import './phasefoundations.css'

const c = sceneContent('phase-foundations')

// The blueprint is 1500×1220. Shown at 1560 wide (×1.04), the rows from
// 780 to 1040 are the ground floor, canopies and kerb: the part of the
// building that stands on something.
const SCALE = 1560 / 1500
const CROP_Y = 780
const SECTION = { x: 200, y: 290, w: 1560, h: Math.round(260 * SCALE) }
const GROUND = SECTION.y + SECTION.h // 560

const PILE_X = [380, 770, 1160, 1550]
const PILE_TIP = GROUND + 130
const PILE_W = 22
const FIRST = 1.0
const GAP = 0.75

const BASE_Y = 915

/**
 * What the building stands on.
 *
 * The hospital is cropped to its ground floor and drawn as a section: a cut
 * line across the top, hatched ground beneath it, and four piles driven down
 * one at a time. Nobody sees the foundations, which is the point of the
 * sheet, so they are the only thing that moves.
 */
export function PhaseFoundations({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1

  return (
    <div className="sc pf">
      <h1 className="pf__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 108, wght: 650 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>

      <motion.div
        className="pf__section"
        style={{ left: SECTION.x, top: SECTION.y, width: SECTION.w, height: SECTION.h }}
        initial={{ clipPath: reduced ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: reduced ? 0.18 : 1.1, delay: 0.4 * t, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={blueprint}
          alt=""
          aria-hidden="true"
          style={{ top: -CROP_Y * SCALE, width: SECTION.w }}
          draggable={false}
        />
      </motion.div>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <pattern id="pf-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="var(--line)" strokeWidth="1" opacity="0.28" />
          </pattern>
        </defs>

        {/* the cut, and the ground it exposes */}
        <DrawPath d={`M ${SECTION.x} ${SECTION.y} H ${SECTION.x + SECTION.w}`} delay={0.3 * t} duration={0.9} width={1} dashed opacity={0.5} />
        <motion.rect
          x={SECTION.x}
          y={GROUND}
          width={SECTION.w}
          height={PILE_TIP - GROUND + 14}
          fill="url(#pf-hatch)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 * t }}
        />
        <DrawPath d={`M ${SECTION.x} ${GROUND} H ${SECTION.x + SECTION.w}`} delay={0.8 * t} duration={0.9} width={2} opacity={0.9} stroke="var(--chalk)" />

        {PILE_X.map((x, i) => {
          const at = (FIRST + i * GAP) * t
          const d = `M ${x - PILE_W} ${GROUND} V ${PILE_TIP - 48} L ${x} ${PILE_TIP} L ${x + PILE_W} ${PILE_TIP - 48} V ${GROUND}`
          return (
            <g key={x}>
              {/* the pile clears the hatch behind it */}
              <motion.path
                d={`${d} Z`}
                fill="var(--drafting)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: at }}
              />
              <DrawPath d={d} delay={at} duration={0.85} width={1.8} stroke="var(--chalk)" opacity={0.95} />
              {c.piles[i].tick && (
                <motion.path
                  d={`M ${x - 11} ${GROUND + 50} l 8 9 l 15 -19`}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
                  animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
                  transition={{ duration: 0.4, delay: at + 0.9 * t }}
                />
              )}
            </g>
          )
        })}

        {/* press 2: the base dimension */}
        {step >= 1 && (
          <g>
            <DrawPath d={`M 200 ${BASE_Y} H 1240`} duration={0.9} opacity={0.8} />
            <DrawPath d={`M 200 ${BASE_Y - 16} v 32`} duration={0.3} opacity={0.7} />
            <DrawPath d={`M 1240 ${BASE_Y - 16} v 32`} delay={0.7} duration={0.3} opacity={0.7} />
          </g>
        )}
      </svg>

      {c.piles.map((p, i) => (
        <motion.div
          key={p.name}
          className="pf__pile"
          style={{ left: PILE_X[i] - 175 }}
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (FIRST + i * GAP + 0.55) * t }}
        >
          <span className="pf__pile-name">{p.name}</span>
          <span className="pf__pile-body">{p.body}</span>
          {p.tick && <span className="pf__pile-tick">{p.tick}</span>}
        </motion.div>
      ))}

      {step >= 1 && (
        <motion.p
          className="pf__done"
          initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 * t, ease: [0.3, 1.3, 0.5, 1] }}
        >
          <i>Done when:</i> {c.doneWhen.replace(/^Done when:\s*/, '')}
        </motion.p>
      )}
    </div>
  )
}
