import { useEffect, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { sceneContent } from './content.ts'
import { HOME, SITES, type SiteKind } from '../content/sites.ts'
import { MAP } from '../content/map.ts'
import { WidthType } from '../kit/WidthType.tsx'
import { PhotoReel } from '../kit/PhotoReel.tsx'
import { SESSIONS } from '../content/photos.ts'
import type { SceneProps } from './index.ts'
import './wheretaught.css'

const c = sceneContent('where-weve-taught')

// Timings below are in "base" seconds; every one is multiplied by SLOW, so
// the whole sheet runs at half speed (0.5x) from this one number.
const SLOW = 2
const MAP_IN = 1.2
const FIRST = 1.5
const GAP = 0.4
const FLIGHT = 0.45
const LAST = FIRST + (SITES.length - 1) * GAP + FLIGHT
/** When the arcs replay, the map is already drawn, so they start sooner. */
const REPLAY_FIRST = 0.6
/** Seconds the finished tally sits before the arcs fly again. */
const HOLD = 4

/** Kajang to the nearest point on the magnifier's rim, not to a fixed corner. */
const LEADER = (() => {
  const dx = MAP.inset.cx - MAP.home.mainX
  const dy = MAP.inset.cy - MAP.home.mainY
  const d = Math.hypot(dx, dy)
  const x = MAP.inset.cx - (dx / d) * MAP.inset.r
  const y = MAP.inset.cy - (dy / d) * MAP.inset.r
  return `M ${MAP.home.mainX} ${MAP.home.mainY} L ${x.toFixed(1)} ${y.toFixed(1)}`
})()

/** End a leader 15px short of its label, so it never runs into the digits. */
const shorten = (x1: number, x2: number, y1: number, y2: number): [number, number] => {
  const d = Math.hypot(x2 - x1, y2 - y1) || 1
  const k = Math.max(0, d - 15) / d
  return [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthOf = (iso: string) => {
  const [y, m] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

/** Pin marks: the shape carries the kind, so the legend is read once. */
function Mark({ kind, x, y, r = 9 }: { kind: SiteKind; x: number; y: number; r?: number }) {
  if (kind === 'hospital') return <circle cx={x} cy={y} r={r} />
  if (kind === 'community') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} />
  return <path d={`M ${x} ${y - r - 1} L ${x + r + 1} ${y} L ${x} ${y + r + 1} L ${x - r - 1} ${y} z`} />
}

/** A thrown arc from Kajang to a site: quadratic, bowed perpendicular. */
function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const d = Math.hypot(dx, dy) || 1
  const k = Math.min(0.3 * d, 150)
  const cx = (x1 + x2) / 2 - (dy / d) * k
  const cy = (y1 + y2) / 2 + (dx / d) * k
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
}

/**
 * Fifteen invitations, drawn in the order they arrived.
 *
 * Nine of the fifteen sit inside the Klang Valley, so the arcs all fly to
 * the real map — where those nine land on essentially one point, which is
 * the truth — and a magnifier below separates them.
 *
 * Names are not stamped permanently beside the pins. Fifteen labels, nine
 * of them inside a 256px circle, cannot be set at 28px without colliding,
 * and a label nobody can read is not evidence. Instead each site names
 * itself as its arc lands, in type large enough to read from the back.
 */
export function WhereTaught({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const adopted = step >= 1

  // Which pass of the arcs we are on. After the fifteenth lands and the
  // tally has held for a few seconds the arcs, pins and counter run again,
  // for as long as the sheet is on its first press. The second press is the
  // verdict, so from there everything stays finished.
  const [run, setRun] = useState(0)
  const first = run === 0 ? FIRST : REPLAY_FIRST
  const still = reduced || adopted

  // Drives the date counter, the tally and the "now arriving" line together.
  const i = useMotionValue(still ? SITES.length : 0)
  useEffect(() => {
    if (still) {
      i.set(SITES.length)
      return
    }
    i.set(0)
    const flight = (SITES.length - 1) * GAP + FLIGHT
    const a = animate(i, SITES.length, {
      duration: flight * SLOW,
      delay: first * SLOW,
      ease: 'linear',
    })
    const again = window.setTimeout(
      () => setRun((r) => r + 1),
      (first + flight) * SLOW * 1000 + HOLD * 1000,
    )
    return () => {
      a.stop()
      window.clearTimeout(again)
    }
  }, [i, still, run, first])

  const landed = useTransform(i, (v) => Math.min(SITES.length, Math.max(0, Math.ceil(v))))
  const tally = useTransform(landed, (v) => String(v).padStart(2, '0'))
  const dateLabel = useTransform(landed, (v) =>
    monthOf(SITES[Math.max(0, Math.min(SITES.length - 1, v - 1))].on),
  )
  const nowName = useTransform(landed, (v) => (v === 0 ? '' : SITES[v - 1].name))
  const nowDates = useTransform(landed, (v) => (v === 0 ? '' : SITES[v - 1].dates))

  const t = reduced ? 0 : SLOW

  return (
    <div className="sc wt">
      <h1 className="wt__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 112, wght: 660 }} duration={0.85} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>

      {/* The rooms themselves, small and to one side: the map is the claim. */}
      <PhotoReel
        photos={SESSIONS}
        size={150}
        gap={12}
        speed={70}
        label={`Photographs from the external sessions, ${c.photos}`}
        className="wt__reel"
        delay={MAP_IN * t}
      />

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {/* land */}
        <g className="wt__land">
          {[MAP.west, MAP.east].map((panel, p) => (
            <g key={p}>
              {panel.faint.map((d, k) => (
                <motion.path
                  key={k}
                  d={d}
                  className="wt__faint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.12 }}
                  transition={{ duration: 0.5 * t + 0.01, delay: 0.3 * t }}
                />
              ))}
              <motion.path
                d={panel.main}
                className="wt__outline"
                initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
                animate={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                transition={{ duration: MAP_IN * t + 0.01, delay: 0.25 * t, ease: [0.16, 1, 0.3, 1] }}
              />
            </g>
          ))}
        </g>

        {/* break line between the peninsula and Borneo */}
        <motion.path
          d={`M ${MAP.breakX} 240 L ${MAP.breakX} 790`}
          className="wt__break"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.4, delay: 0.9 * t }}
        />

        {/* Klang Valley magnifier */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 * t }}
        >
          <path d={LEADER} className="wt__leader" />
          <circle cx={MAP.inset.cx} cy={MAP.inset.cy} r={MAP.inset.r} className="wt__inset-plate" />
          <g clipPath="url(#wt-inset)">
            <path d={MAP.inset.path} className="wt__inset-land" />
          </g>
          <circle cx={MAP.inset.cx} cy={MAP.inset.cy} r={MAP.inset.r} className="wt__inset-ring" />
          <text x={MAP.inset.cx} y={MAP.inset.cy - MAP.inset.r - 16} className="wt__inset-label">
            KLANG VALLEY
          </text>
        </motion.g>
        <defs>
          <clipPath id="wt-inset">
            <circle cx={MAP.inset.cx} cy={MAP.inset.cy} r={MAP.inset.r - 1} />
          </clipPath>
        </defs>

        {/* home */}
        <motion.g
          className="wt__home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.1 * t }}
        >
          <circle cx={MAP.home.mainX} cy={MAP.home.mainY} r={6} />
          <circle cx={MAP.home.mainX} cy={MAP.home.mainY} r={15} className="wt__home-ring" />
        </motion.g>

        {/* arcs and pins, in date order */}
        {SITES.map((s, k) => {
          const pin = MAP.pins[k]
          const at = first + k * GAP
          // On the verdict press the arcs are simply there, already landed.
          const go = adopted ? 0 : t
          return (
            <g key={`${s.n}-${run}-${adopted ? 'f' : 'a'}`}>
              <motion.path
                d={arcPath(MAP.home.mainX, MAP.home.mainY, pin.x, pin.y)}
                className="wt__arc"
                initial={reduced || adopted ? { opacity: 0 } : { pathLength: 0, opacity: 0.75 }}
                animate={reduced || adopted ? { opacity: 0.75 } : { pathLength: 1, opacity: 0.75 }}
                transition={{ duration: FLIGHT * go + 0.01, delay: at * go, ease: 'easeOut' }}
              />
              <motion.g
                className="wt__pin"
                initial={{ opacity: 0, scale: reduced || adopted ? 1 : 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: adopted ? 0.01 : 0.3, delay: (at + FLIGHT) * go }}
                style={{ transformOrigin: `${pin.x}px ${pin.y}px` }}
              >
                <Mark kind={s.kind} x={pin.x} y={pin.y} r={7} />
              </motion.g>

              {pin.ix !== null && (
                <motion.g
                  className="wt__pin"
                  initial={{ opacity: 0, scale: reduced || adopted ? 1 : 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: adopted ? 0.01 : 0.3, delay: (at + FLIGHT) * go }}
                  style={{ transformOrigin: `${pin.ix}px ${pin.iy}px` }}
                >
                  <Mark kind={s.kind} x={pin.ix!} y={pin.iy!} r={9} />
                  {/* Nine sites sit within a few pixels of each other, so each
                      number is placed by the map script (relaxed off its
                      neighbours) and tied back to its pin by a short leader. */}
                  <line
                    x1={pin.ix!}
                    y1={pin.iy!}
                    x2={shorten(pin.ix!, pin.lx!, pin.iy!, pin.ly!)[0]}
                    y2={shorten(pin.ix!, pin.lx!, pin.iy!, pin.ly!)[1]}
                    className="wt__pin-lead"
                    style={{ display: Math.hypot(pin.lx! - pin.ix!, pin.ly! - pin.iy!) > 24 ? undefined : 'none' }}
                  />
                  <text x={pin.lx!} y={pin.ly!} className="wt__pin-n">
                    {s.n}
                  </text>
                </motion.g>
              )}

              {/* adopted: a cyan ring, pulsed once on the second press */}
              {adopted && s.adopted && (
                <motion.circle
                  cx={pin.ix ?? pin.x}
                  cy={pin.iy ?? pin.y}
                  r={pin.ix !== null ? 9 : 7}
                  className="wt__ring"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 2.6, 2.1], opacity: [0, 1, 0.9] }}
                  transition={{ duration: reduced ? 0.2 : 0.9, delay: 0.1 + k * 0.05 }}
                  style={{ transformOrigin: `${pin.ix ?? pin.x}px ${pin.iy ?? pin.y}px` }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* the ticker: month, tally, and whoever just invited us */}
      <div className="wt__ticker">
        <motion.span className="wt__month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FIRST * t }}>
          {dateLabel}
        </motion.span>
        <motion.span className="wt__tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FIRST * t }}>
          {tally}
        </motion.span>
        <span className="wt__tally-of">/ 15</span>
      </div>

      <div className="wt__now">
        <motion.span className="wt__now-name">{nowName}</motion.span>
        <motion.span className="wt__now-dates">{nowDates}</motion.span>
      </div>

      {/* the right-hand column: legend, then the verdict */}
      <div className="wt__aside">
        <ul className="wt__legend">
          <li><i className="wt__k wt__k--h" /> hospital</li>
          <li><i className="wt__k wt__k--n" /> national service / state department</li>
          <li><i className="wt__k wt__k--c" /> community organisation</li>
          {/* Always laid out, so the column does not shift on press 2. */}
          <li className={`wt__k-adopted${adopted ? ' is-on' : ''}`}>
            <i className="wt__k wt__k--r" /> {c.legendAdopted}
          </li>
        </ul>

        <motion.p
          className="wt__sub"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: (LAST + 0.2) * t }}
        >
          {c.subline}
        </motion.p>

        {adopted && (
          <motion.p
            className="wt__taught"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {c.adoptedLine}
          </motion.p>
        )}
      </div>

      <p className="wt__home-note">{HOME.name} · {HOME.note}</p>
    </div>
  )
}
