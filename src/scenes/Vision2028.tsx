import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { WidthType, AXES } from '../kit/WidthType.tsx'
import type { SceneProps } from './index.ts'
import './vision2028.css'

const c = sceneContent('vision-2028')

/** Greedy wrap, so the vision can be stored as the one sentence it is. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const w of text.split(' ')) {
    if (line && (line + ' ' + w).length > max) {
      lines.push(line)
      line = w
    } else line = line ? line + ' ' + w : w
  }
  if (line) lines.push(line)
  return lines
}
const VISION = wrap(c.vision, 46)

// ── press 2: the hospitals, standing on one scale line ─────────────────────
const BASE = 600

/** A plain elevation: a block with floor lines. */
function block(cx: number, w: number, h: number, floors: number): string {
  const x0 = cx - w / 2
  const x1 = cx + w / 2
  let d = `M ${x0} ${BASE} V ${BASE - h} H ${x1} V ${BASE}`
  for (let f = 1; f < floors; f++) d += ` M ${x0} ${BASE - (h * f) / floors} H ${x1}`
  return d
}

// Heights are the argument: a 30-bed block and a 1,000-bed tower differ by
// roughly this much. They are drawn to read as "very different", not to scale.
const BUILDINGS: { cx: number; paths: string[] }[] = [
  { cx: 330, paths: [block(330, 150, 84, 2), 'M 318 600 v -24 h 24 v 24'] },
  { cx: 760, paths: [block(760, 200, 140, 3), 'M 730 460 v -18 h 60 v 18'] },
  { cx: 1220, paths: [block(1220, 270, 80, 2), block(1220, 150, 220, 5)] },
  {
    cx: 1570,
    paths: [block(1570, 360, 90, 2), block(1570, 200, 330, 9), 'M 1570 270 v -26'],
  },
]
const LABEL_X = [255, 660, 1085, 1390]

// ── press 3: the reach rings ───────────────────────────────────────────────
const R = { cx: 1110, cy: 460, radii: [70, 120, 165] }
const ring = (r: number) =>
  `M ${R.cx - r} ${R.cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`

/** A leader from a point on a ring, at an angle, out to a label. */
const leader = (r: number, deg: number, tx: number, ty: number) => {
  const a = (deg * Math.PI) / 180
  return `M ${(R.cx + r * Math.cos(a)).toFixed(1)} ${(R.cy + r * Math.sin(a)).toFixed(1)} L ${tx} ${ty}`
}
// ── press 4: the objectives strip ──────────────────────────────────────────
const STRIP_Y = 680
const COLS = [
  { x: 200, w: 250 },
  { x: 470, w: 270 },
  { x: 760, w: 230 },
  { x: 1010, w: 240 },
  { x: 1270, w: 490 },
]

/**
 * Vision 2028: a lighthouse, not an island.
 *
 * Four presses, each one a different layer of the same argument, so the
 * layers that would collide never share a press: the hospitals (press 2)
 * make way for the rings (press 3), which is why the band is rendered only
 * while step === 1. The vision sentence is the one thing that stays, and it
 * shrinks to a strap under the heading once there is something to look at
 * below it.
 */
export function Vision2028({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const big = step === 0

  return (
    <div className="sc v28">
      <h1 className="v28__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 112, wght: 660 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>

      <motion.p
        className="v28__vision"
        initial={false}
        animate={{ fontSize: big ? 62 : 40, y: big ? 70 : 0 }}
        transition={{ duration: reduced ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {VISION.map((l, i) => (
          <motion.span
            key={i}
            className="v28__vline"
            initial={reduced ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: reduced ? 0.18 : 0.8, delay: (0.6 + i * 0.55) * t, ease: 'easeOut' }}
          >
            {l}
          </motion.span>
        ))}
      </motion.p>

      {/* press 2 — the signature moment */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            key="band"
            className="v28__layer"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
              <DrawPath d={`M 200 ${BASE} H 1760`} duration={1.1} opacity={0.8} />
              <DrawPath d={`M 200 ${BASE - 16} v 32`} delay={0.05} duration={0.3} opacity={0.6} />
              <DrawPath d={`M 1760 ${BASE - 16} v 32`} delay={1.0} duration={0.3} opacity={0.6} />
              {BUILDINGS.map((b, i) =>
                b.paths.map((d, k) => (
                  <DrawPath
                    key={`${i}-${k}`}
                    d={d}
                    delay={0.7 + i * 0.35}
                    duration={0.9}
                    stroke="var(--chalk)"
                    opacity={0.85}
                  />
                )),
              )}
            </svg>

            {c.hospitals.map((h, i) => (
              <motion.div
                key={h.type}
                className="v28__hosp"
                style={{ left: LABEL_X[i], width: [330, 330, 290, 370][i] }}
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (1.2 + i * 0.35) * t }}
              >
                <span className="v28__hosp-type">{h.type}</span>
                <span className="v28__hosp-detail">{h.detail}</span>
              </motion.div>
            ))}

            <div className="v28__caption">
              <WidthType from={AXES.CONDENSED} to={AXES.RELAXED} duration={0.9} delay={0.3 * t}>
                {c.hospitalsCaption}
              </WidthType>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* press 3 — reach rings, held through press 4 */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            key="rings"
            className="v28__layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
              <DrawPath d={ring(R.radii[0])} delay={0.1} duration={0.8} stroke="var(--chalk)" opacity={0.9} />
              <DrawPath d={ring(R.radii[1])} delay={0.5} duration={0.9} opacity={0.8} />
              <DrawPath d={ring(R.radii[2])} delay={0.9} duration={1.0} opacity={0.55} dashed />
              <motion.circle
                cx={R.cx}
                cy={R.cy - 8}
                r={7}
                fill="var(--chalk)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* leaders, one per ring */}
              <DrawPath d={leader(R.radii[0], 180, 770, R.cy + 32)} delay={0.5} duration={0.6} opacity={0.4} />
              <DrawPath d={leader(R.radii[1], -40, 1320, 325)} delay={0.9} duration={0.6} opacity={0.4} />
              <DrawPath d={leader(R.radii[2], 40, 1320, 558)} delay={1.3} duration={0.6} opacity={0.4} />
            </svg>

            <motion.span
              className="v28__marker"
              style={{ left: R.cx, top: R.cy + 10 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 * t }}
            >
              HTPN
            </motion.span>

            {c.rings.map((r, i) => {
              const pos = [
                { left: 200, top: 472, width: 560 },
                { left: 1330, top: 280, width: 430 },
                { left: 1330, top: 520, width: 430 },
              ][i]
              return (
                <motion.div
                  key={r.name}
                  className="v28__ring"
                  style={pos}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (0.7 + i * 0.4) * t }}
                >
                  <span className="v28__ring-name">{r.name}</span>
                  <span className="v28__ring-body">{r.body}</span>
                </motion.div>
              )
            })}

            <motion.p
              className="v28__footer"
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.9 * t }}
            >
              {c.footer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* press 4 — five objectives, each verb slamming condensed then relaxing */}
      {step >= 3 && (
        <div className="v28__layer">
          <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
            {COLS.map((col, i) => (
              <DrawPath
                key={i}
                d={`M ${col.x} ${STRIP_Y} H ${col.x + col.w - 22}`}
                delay={0.1 + i * 0.12}
                duration={0.5}
                opacity={0.6}
              />
            ))}
          </svg>
          {c.objectives.map((o, i) => (
            <div key={o.verb} className="v28__obj" style={{ left: COLS[i].x, top: STRIP_Y + 14, width: COLS[i].w - 22 }}>
              <span className="v28__obj-verb">
                <WidthType from={AXES.CONDENSED} to={{ wdth: 100, wght: 600 }} duration={0.7} delay={(0.25 + i * 0.16) * t}>
                  {o.verb}
                </WidthType>
              </span>
              <motion.span
                className="v28__obj-rest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: (0.5 + i * 0.16) * t }}
              >
                {o.rest}
              </motion.span>
              {o.note && (
                <motion.span
                  className="v28__obj-note"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: (0.9 + i * 0.16) * t }}
                >
                  {o.note}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
