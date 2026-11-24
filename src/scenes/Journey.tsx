import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from 'motion/react'
import { sceneContent } from './content.ts'
import { WidthType } from '../kit/WidthType.tsx'
import { CountUp } from '../kit/CountUp.tsx'
import { DrawPath } from '../kit/DrawPath.tsx'
import { LEADERS, SESSIONS, TRAINING } from '../content/photos.ts'
import type { JourneyChart, JourneyEvent, JourneyPhoto } from '../content/scenes.ts'
import type { SceneProps } from './index.ts'
import news from '../assets/news-cutting.webp'
import innovathon from '../assets/innovathon-still.webp'
import myipo from '../assets/kik-ipo-1.webp'
import blueprint from '../assets/blueprint-htpn.webp'
import files from '../assets/journey-files.webp'
import byod from '../assets/journey-byod.webp'
import preworkshop from '../assets/journey-preworkshop.webp'
import judges from '../assets/journey-judges.webp'
import woundVision from '../assets/shot-dfu.webp'
import './journey.css'

const c = sceneContent('journey')
const N = c.events.length

const PHOTO: Record<JourneyPhoto, string> = {
  files,
  byod,
  preworkshop,
  judges,
  woundVision,
  hio: LEADERS[4].src,
  syllabus: TRAINING[0].src,
  sessions: SESSIONS[0].src,
  news,
  innovathon,
  myipo,
  nationwide: LEADERS[3].src,
}

// ─── The road ───────────────────────────────────────────────────────────────
//
// One road on one large drawing, and the drawing is the new Women & Children
// Centre. The road is traced off the wireframe on the closing sheet, along
// the line marked up on media/Outline Road.jpeg: up the curved tower, along
// the roof, down the east wing to the podium roof, and in along it to the
// entrance block. Each chapter is one stretch; at a corner the road bends and
// the camera rolls with it. The twelve stops sit on it, spaced by the time
// between them. The road behind is paved amber; the road ahead is outlined
// and dashed.
//
// The wireframe is under the road on the overview presses, when the camera
// is pulled back over the whole building; while driving, it is only the road.
//
// Lengths are drawing pixels; the sheet is 1920 × 1080 of them. The outline
// is in wireframe pixels and scaled up by K, worked out below so that every
// chapter's side is long enough for its stops.

/** The wireframe, in its own pixels. */
const WIRE = { w: 1500, h: 1220 }
/**
 * The line on the wireframe, clockwise from the foot of the tower; points
 * 1–5 are the ones marked on media/Outline Road.jpeg. The roof is one side
 * but two chapters, handed over at the courtyard's ridge.
 */
const OUTLINE = [
  { x: 152, y: 985 }, // 1 · foot of the curved tower
  { x: 98, y: 418 }, // 2 · top of the tower
  { x: 1442, y: 412 }, // 3 · east end of the roof
  { x: 1430, y: 735 }, // 4 · east wing, at the podium roof
  { x: 1055, y: 720 }, // 5 · in along the podium roof, to the entrance block
]
/** Where chapter 2 hands the roof to chapter 3: the ridge, x on the wireframe. */
const RIDGE_X = 900
/** Which side of the line each chapter drives. */
const SIDE_OF_CHAPTER = [0, 1, 1, 2, 3]

/** Road width. The dates sit on it. */
const ROAD = 230
/** Corner radius: tight enough that the corners read as a building's. */
const R = 600
/** Straight road before a chapter's first stop and after its last, at least. */
const LEAD = 1100
/** Spacing between stops in a chapter: a floor, then more road per month. */
const GAP_MIN = 2100
const GAP_PER_MONTH = 260
const GAP_MAX = 4500
/** Camera centre sits this far off the road, so the road runs along an edge. */
const OFF = 330
/** Road either side of a chapter change over which the camera crosses over. */
const CROSS = 900

type Seg =
  | { kind: 'line'; s0: number; len: number; x: number; y: number; h: number }
  | { kind: 'arc'; s0: number; len: number; cx: number; cy: number; h0: number; turn: number }

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI
const months = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / (30.44 * 864e5)
const gap = (a: string, b: string) => Math.min(GAP_MAX, GAP_MIN + GAP_PER_MONTH * Math.max(0, months(a, b)))

const ROUTE = (() => {
  const chapters = c.chapters.map((_, k) => c.events.filter((e) => e.chapter === k))
  const gaps = chapters.map((list) => list.slice(1).map((e, j) => gap(list[j].on, e.on)))
  const gapSum = gaps.map((g) => g.reduce((a, b) => a + b, 0))

  // The outline's sides: length in wireframe pixels, heading in degrees.
  const n = OUTLINE.length - 1
  const sideLen = Array.from({ length: n }, (_, i) => Math.hypot(OUTLINE[i + 1].x - OUTLINE[i].x, OUTLINE[i + 1].y - OUTLINE[i].y))
  const heading = Array.from({ length: n }, (_, i) => deg(Math.atan2(OUTLINE[i + 1].y - OUTLINE[i].y, OUTLINE[i + 1].x - OUTLINE[i].x)))
  const turn = (i: number) => {
    let t = heading[i] - heading[i - 1]
    while (t > 180) t -= 360
    while (t < -180) t += 360
    return t
  }
  /** Road a corner takes off each side it joins. */
  const cut = (i: number) => (i <= 0 || i >= n ? 0 : R * Math.tan(rad(Math.abs(turn(i))) / 2))
  const ridge = (RIDGE_X - OUTLINE[1].x) / (OUTLINE[2].x - OUTLINE[1].x)

  // The scale: the smallest at which every chapter's stretch of side holds
  // its stops with a lead either end.
  const need = gapSum.map((g) => g + 2 * LEAD)
  const K = Math.max(
    (need[0] + cut(1)) / sideLen[0],
    (need[1] + cut(1)) / (ridge * sideLen[1]),
    (need[2] + cut(2)) / ((1 - ridge) * sideLen[1]),
    (need[3] + cut(2) + cut(3)) / sideLen[2],
    (need[4] + cut(3)) / sideLen[3],
  )

  // Walk the outline: a straight per side, a corner between.
  const segs: Seg[] = []
  const straight: { s: number; len: number }[] = []
  const corner: number[] = []
  let x = OUTLINE[0].x * K
  let y = OUTLINE[0].y * K
  let s = 0
  let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const h = heading[i]
    const len = sideLen[i] * K - cut(i) - cut(i + 1)
    segs.push({ kind: 'line', s0: s, len, x, y, h })
    straight.push({ s, len })
    x += Math.cos(rad(h)) * len
    y += Math.sin(rad(h)) * len
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    s += len
    if (i < n - 1) {
      const t = turn(i + 1)
      const sg = Math.sign(t)
      const cx = x + R * Math.cos(rad(h + sg * 90))
      const cy = y + R * Math.sin(rad(h + sg * 90))
      const alen = R * rad(Math.abs(t))
      segs.push({ kind: 'arc', s0: s, len: alen, cx, cy, h0: h, turn: t })
      corner.push(s + alen / 2)
      x = cx - R * Math.cos(rad(h + t + sg * 90))
      y = cy - R * Math.sin(rad(h + t + sg * 90))
      d += ` A ${R} ${R} 0 0 ${sg > 0 ? 1 : 0} ${x.toFixed(1)} ${y.toFixed(1)}`
      s += alen
    }
  }

  // Each chapter's stretch of road, then its stops, centred on it.
  const ridgeS = straight[1].s + ridge * sideLen[1] * K - cut(1)
  const range = SIDE_OF_CHAPTER.map((side, k) => {
    const st = straight[side]
    if (k === 1) return { a: st.s, b: ridgeS }
    if (k === 2) return { a: ridgeS, b: st.s + st.len }
    return { a: st.s, b: st.s + st.len }
  })
  const stopS: number[] = []
  chapters.forEach((_, k) => {
    const { a, b } = range[k]
    let at = a + (b - a - gapSum[k]) / 2
    stopS.push(at)
    gaps[k].forEach((g) => stopS.push((at += g)))
  })

  /** Chapter changes along the road: the corners, and the ridge. */
  const changes = [corner[0], ridgeS, corner[1], corner[2]]
  /** Where the travelled road ends: point 5, the end of the line. */
  const travelled = range[chapters.length - 1].b
  return { segs, stopS, d, total: s, travelled, K, changes, range }
})()

/** Which chapter a point on the road belongs to. */
const chapterAt = (s: number) => ROUTE.changes.filter((b) => s > b).length

/** A point on the road, its heading, and which side of it the content sits. */
function along(sIn: number) {
  const s = Math.min(Math.max(sIn, 0), ROUTE.total)
  const seg = ROUTE.segs.find((g) => s <= g.s0 + g.len) ?? ROUTE.segs[ROUTE.segs.length - 1]
  const t = s - seg.s0
  // Odd chapters keep their words on the left of the road, even ones on the
  // right, so the road runs along the foot of one sheet and the head of the
  // next. Round a chapter change the camera crosses over.
  const sideOf = (k: number) => (k % 2 === 0 ? 1 : -1)
  const k = chapterAt(s)
  let side = sideOf(k)
  for (const [j, bnd] of ROUTE.changes.entries()) {
    if (Math.abs(s - bnd) < CROSS) {
      const f = (s - bnd + CROSS) / (2 * CROSS)
      const mix = (1 - Math.cos(Math.PI * f)) / 2
      side = sideOf(j) * (1 - mix) + sideOf(j + 1) * mix
    }
  }
  if (seg.kind === 'line') {
    return { x: seg.x + Math.cos(rad(seg.h)) * t, y: seg.y + Math.sin(rad(seg.h)) * t, h: seg.h, side }
  }
  const sg = Math.sign(seg.turn)
  const h = seg.h0 + seg.turn * (t / seg.len)
  return {
    x: seg.cx - R * Math.cos(rad(h + sg * 90)),
    y: seg.cy - R * Math.sin(rad(h + sg * 90)),
    h,
    side,
  }
}

/** Where the camera looks, standing on the road at `s`. */
function cameraAt(s: number) {
  const p = along(s)
  // Left of travel, on screen: up when heading right.
  const nx = Math.sin(rad(p.h))
  const ny = -Math.cos(rad(p.h))
  return { x: p.x + nx * OFF * p.side, y: p.y + ny * OFF * p.side, r: -p.h, h: p.h, side: p.side }
}

/** 0 mid-chapter, rising to 1 at a chapter change: the camera pulls back there. */
function bendness(s: number) {
  let w = 0
  for (const bnd of ROUTE.changes) {
    const v = Math.max(0, 1 - Math.max(0, Math.abs(s - bnd) - 500) / 900)
    w = Math.max(w, v * v * (3 - 2 * v))
  }
  return w
}

/** The whole building, fitted under the heading, for the first and last press. */
const OVERVIEW = (() => {
  const xs: number[] = []
  const ys: number[] = []
  for (let s = 0; s <= ROUTE.total; s += 200) {
    const p = along(s)
    xs.push(p.x)
    ys.push(p.y)
  }
  const pad = ROAD
  const minX = Math.min(...xs) - pad
  const maxX = Math.max(...xs) + pad
  const minY = Math.min(...ys) - pad
  const maxY = Math.max(...ys) + pad
  // Fit into the band of the sheet below the heading.
  const box = { x: 160, y: 392, w: 1600, h: 500 }
  const k = Math.min(box.w / (maxX - minX), box.h / (maxY - minY))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const sx = box.x + box.w / 2
  const sy = box.y + box.h / 2
  return { k, x: cx - (sx - 960) / k, y: cy - (sy - 540) / k }
})()
const STOPS = ROUTE.stopS.map((s) => cameraAt(s))

/** How much road is paved ahead of the camera while you stand at a stop. */
const PAVE_AHEAD = 1000
const DRIFT = 130
const DRIFT_S = 16
const EASE_IO = [0.7, 0, 0.25, 1] as const
const EASE = [0.16, 1, 0.3, 1] as const

/** Travel time for a stretch of road: longer roads take a little longer. */
const travel = (dist: number) => Math.min(2.4, Math.max(1.1, 0.8 + Math.abs(dist) / 3200))

/** Seconds the road takes to draw itself across the building on press 1. */
const DRAW_S = 7

/**
 * The journey. Press 0 is the building alone; press 1 draws the road across
 * it, chapter by chapter, its stops and tags arriving as the line reaches
 * them; presses 2–13 drive to each stop; the last press pulls back over the
 * building and the road travelled. Renders purely from `step`.
 */
export function Journey({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const press = Math.min(Math.max(step, 0), N + 2)
  // Position on the journey: 0 on the two opening presses, 1–N at a stop,
  // N + 1 pulled back at the end.
  const at = Math.max(0, press - 1)
  const stop = at === 0 ? 0 : Math.min(at, N) - 1
  const overview = at === 0 || at === N + 1
  // How much of the overview's road has drawn: none on the first press, all
  // of it once it has been drawn.
  const drawn = useMotionValue(press === 0 ? 0 : ROUTE.travelled)
  const drewFrom = useRef(press)
  useEffect(() => {
    const prev = drewFrom.current
    drewFrom.current = press
    if (press === 0) {
      drawn.set(0)
      return
    }
    if (press === 1 && prev !== 1 && !reduced) {
      drawn.set(0)
      const a = animate(drawn, ROUTE.travelled, { duration: DRAW_S, delay: 0.3, ease: [0.45, 0, 0.55, 1] })
      return () => a.stop()
    }
    drawn.set(ROUTE.travelled)
  }, [press, reduced, drawn])

  // Two dials drive the camera: how far along the road it stands, and how
  // far it has pulled back to the overview.
  const s = useMotionValue(at === 0 ? 0 : at === N + 1 ? ROUTE.travelled : ROUTE.stopS[stop])
  const b = useMotionValue(overview ? 1 : 0)
  const dip = useMotionValue(1)
  // The wireframe under the road: on the first and last press, pulled back.
  const wire = useMotionValue(overview ? 1 : 0)
  // Mounted only while it shows: a picture this size, even unseen, is
  // rasterised at every zoom of the dive and stalls the road.
  const [wireOn, setWireOn] = useState(overview)
  useEffect(() => {
    if (overview) setWireOn(true)
    return wire.on('change', (v) => {
      if (v === 0 && !overview) setWireOn(false)
    })
  }, [overview, wire])
  const from = useRef(at)

  useEffect(() => {
    const prev = from.current
    from.current = at
    const runs: { stop: () => void }[] = []
    if (overview) {
      if (reduced || prev === at) wire.set(1)
      else runs.push(animate(wire, 1, { duration: 1.2, delay: 1.5, ease: 'easeOut' }))
    } else if (reduced || wire.get() === 0) wire.set(0)
    else runs.push(animate(wire, 0, { duration: 0.5 }))

    if (at === 0 || at === N + 1) {
      const target = at === 0 ? 0 : ROUTE.travelled
      if (reduced || prev === at) {
        s.set(target)
        b.set(1)
      } else {
        runs.push(animate(b, 1, { duration: 2.2, ease: EASE_IO }))
        runs.push(animate(s, target, { duration: 2.2, ease: EASE_IO }))
      }
    } else {
      const target = ROUTE.stopS[stop]
      if (reduced) {
        s.set(target)
        b.set(0)
      } else if (b.get() > 0.5) {
        // Diving in from the overview: the road paves itself as you fall.
        const D = 2.3
        runs.push(animate(b, 0, { duration: D, ease: EASE_IO }))
        runs.push(
          animate(s, [s.get(), target, target + DRIFT], {
            duration: D + DRIFT_S,
            times: [0, D / (D + DRIFT_S), 1],
            ease: [EASE_IO, 'easeOut'],
          }),
        )
      } else {
        const D = prev === at ? 0 : travel(target - s.get())
        const T = D + DRIFT_S
        runs.push(
          animate(s, [s.get(), target, target + DRIFT], {
            duration: T,
            times: [0, D / T, 1],
            ease: [EASE_IO, 'easeOut'],
          }),
        )
        if (D > 0) runs.push(animate(dip, [1, 0.9, 1], { duration: D, times: [0, 0.5, 1], ease: ['easeOut', 'easeIn'] }))
      }
    }
    return () => runs.forEach((r) => r.stop())
  }, [at, stop, reduced, s, b, dip, wire, overview])

  // The camera, from the two dials. Zoom is blended in log space so the
  // dive from the overview feels even all the way down.
  const pose = (sv: number, bv: number, dv: number) => {
    const p = cameraAt(sv)
    const k = Math.exp(Math.log((1 - 0.4 * bendness(sv)) * dv) * (1 - bv) + Math.log(OVERVIEW.k) * bv)
    // Zoom towards the stop, not along a straight line between the two
    // centres: the stop keeps its place on the screen, sliding to the middle
    // as the camera falls, so the road never leaves the view on the way down
    // through the empty middle of the building.
    const w = bv * (OVERVIEW.k / k)
    return {
      x: p.x + (OVERVIEW.x - p.x) * w,
      y: p.y + (OVERVIEW.y - p.y) * w,
      r: p.r * (1 - bv),
      k,
    }
  }
  const camX = useTransform([s, b, dip], ([sv, bv, dv]: number[]) => 960 - pose(sv, bv, dv).x)
  const camY = useTransform([s, b, dip], ([sv, bv, dv]: number[]) => 540 - pose(sv, bv, dv).y)
  const camR = useTransform([s, b, dip], ([sv, bv, dv]: number[]) => pose(sv, bv, dv).r)
  const camK = useTransform([s, b, dip], ([sv, bv, dv]: number[]) => pose(sv, bv, dv).k)

  const paved = useTransform([s, b], ([sv, bv]: number[]) => {
    const p = Math.min(ROUTE.travelled, Math.max(0, sv + PAVE_AHEAD * (1 - bv)))
    return `${p} ${ROUTE.total + 10}`
  })
  // The road is drawn in its own screen-sized SVG with the camera applied as
  // an SVG transform, not inside the CSS camera. Chrome culls a CSS-
  // transformed layer to the area it worked out at the old zoom and does not
  // widen it as the camera pulls back, so the road — the one thing that
  // spans the whole drawing — would be painted only in patches. An SVG
  // transform is repainted, and re-culled, every frame.
  const roadM = useTransform([s, b, dip], ([sv, bv, dv]: number[]) => {
    const p = pose(sv, bv, dv)
    const cos = Math.cos(rad(p.r)) * p.k
    const sin = Math.sin(rad(p.r)) * p.k
    return `matrix(${cos} ${sin} ${-sin} ${cos} ${960 - (cos * p.x - sin * p.y)} ${540 - (sin * p.x + cos * p.y)})`
  })
  const roadG = useRef<SVGGElement>(null)
  useEffect(() => {
    roadG.current?.setAttribute('transform', roadM.get())
    return roadM.on('change', (v) => roadG.current?.setAttribute('transform', v))
  }, [roadM])

  const groundOpacity = useTransform(b, (v) => 1 - v)
  // From the overview the stops are specks; the road and its labels say it.
  const stopsOpacity = useTransform(b, (v) => 1 - Math.min(1, Math.max(0, (v - 0.55) / 0.35)))
  // Map labels are drawing-sized; they only make sense once the camera is
  // well back, or they sweep past enormous.
  const mapOpacity = useTransform(b, (v) => Math.max(0, (v - 0.75) / 0.25))

  const near = (i: number) => Math.abs(i - stop) <= 2

  return (
    <div className="sc jr">
      {/* Paper and grid that travel and turn with the drawing. */}
      <motion.div className="jr__cam" style={{ rotate: camR, scale: camK, opacity: groundOpacity }}>
        <motion.div className="jr__world" style={{ x: camX, y: camY }}>
          {STOPS.map((p, i) => (near(i) ? <div key={i} className="jr__ground" style={place(p)} /> : null))}
        </motion.div>
      </motion.div>

      <svg className="jr__road" viewBox="0 0 1920 1080" aria-hidden="true">
        <g ref={roadG}>
          <Road paved={paved} drawn={drawn} drive={groundOpacity} mapOpacity={mapOpacity} wire={wire} showWire={wireOn} />
        </g>
      </svg>

      <motion.div className="jr__cam" style={{ rotate: camR, scale: camK, opacity: stopsOpacity }}>
        <motion.div className="jr__world" style={{ x: camX, y: camY }}>
          {/* The chapter's name, painted on the road under each of its stops. */}
          {STOPS.map((p, i) =>
            near(i) ? (
              <div key={`sign${i}`} className={`jr__sheet ${layout(p.side)}`} style={place(p)} aria-hidden="true">
                <span className="jr__sign">
                  {String(c.events[i].chapter + 1).padStart(2, '0')} · {c.chapters[c.events[i].chapter]}
                </span>
              </div>
            ) : null,
          )}

          {STOPS.map((p, i) =>
            near(i) ? (
              <Station key={i} pose={p} e={c.events[i]} n={i + 1} at={at} lead={i ? travel(ROUTE.stopS[i] - ROUTE.stopS[i - 1]) * 0.5 : 1.4} />
            ) : null,
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {overview && (
          <motion.div
            key={at === 0 ? 'open' : 'close'}
            className="jr__over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: reduced ? 0 : at === 0 ? 0.1 : 1.4 }}
          >
            <p className="jr__kicker">{c.kicker}</p>
            <h1 className="jr__heading">
              <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 96, wght: 680 }} duration={1.0} delay={at === 0 ? 0.3 : 1.5}>
                {c.close.heading}
              </WidthType>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Sheet layout from the side the words sit on: road along the foot or the head. */
const layout = (side: number) => (side > 0 ? 'jr__st--foot' : 'jr__st--head')

/** A sheet's box on the drawing, turned to the road. */
const place = (p: { x: number; y: number; h: number }) => ({
  left: p.x - 960,
  top: p.y - 540,
  transform: `rotate(${p.h}deg)`,
})

/** One sheet pixel at the overview's zoom, in drawing pixels. */
const PX = 1 / OVERVIEW.k
/** How far along its stretch each chapter's tag is pinned. */
const TAG_AT = [0.25, 0.5, 0.35, 0.68, 0.5]
/** Tags hung outside their road rather than inside: 5 below the podium, leaving the east wing to 4. */
const TAG_OUT = [false, false, false, false, true]
/** Tag type size, height and inner padding, in sheet pixels. */
const TAG = { font: 28, h: 50, pad: 16, gap: 12, leader: 44 }

/** Width of a tag's text, estimated: Archivo runs about 0.53em a character. */
const textW = (t: string) => t.length * 0.47 * TAG.font

/**
 * A chapter's name in a navy tag with a cyan border, pinned to its stretch of
 * road by a short leader. Inside the building beside the tower and the east
 * wing, under the roof, over the podium; `out` sets it the other way.
 */
function Tag({ s, num, text, out }: { s: number; num?: string; text: string; out?: boolean }) {
  const p = along(s)
  // Right of travel: inside the building, going clockwise.
  let rx = -Math.sin(rad(p.h))
  let ry = Math.cos(rad(p.h))
  if (out) {
    rx = -rx
    ry = -ry
  }
  const numW = num ? textW(num) + TAG.gap : 0
  const w = (TAG.pad * 2 + numW + textW(text)) * PX
  const h = TAG.h * PX
  const lead = (TAG.leader + 8) * PX
  // The leader leaves the road's edge square to it; the tag hangs off its end.
  const x0 = p.x + rx * (ROAD / 2)
  const y0 = p.y + ry * (ROAD / 2)
  let x1 = x0
  let y1 = y0
  let bx: number
  let by: number
  if (Math.abs(rx) > 0.7) {
    x1 = x0 + Math.sign(rx) * lead
    bx = rx > 0 ? x1 : x1 - w
    by = y0 - h / 2
  } else {
    y1 = y0 + Math.sign(ry) * lead
    bx = x0 - w / 2
    by = ry > 0 ? y1 : y1 - h
  }
  const line = 'var(--line)'
  return (
    <g>
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={line} strokeWidth={2.5 * PX} />
      <rect
        x={bx}
        y={by}
        width={w}
        height={h}
        rx={4 * PX}
        fill="var(--drafting)"
        stroke={line}
        strokeWidth={2 * PX}
      />
      <text
        className="jr__tag"
        x={bx + TAG.pad * PX}
        y={by + h / 2}
        dominantBaseline="central"
        style={{ fontSize: TAG.font * PX }}
      >
        {num && <tspan className="jr__tag-n">{num}</tspan>}
        <tspan className="jr__tag-t" dx={num ? TAG.gap * PX : 0}>
          {text}
        </tspan>
      </text>
    </g>
  )
}

/** Road an item fades in over once the drawing reaches it, in drawing pixels. */
const REVEAL = 1500

/** Opacity for something on the road at `at`, as the overview drawing passes it. */
function useReached(drawn: MotionValue<number>, at: number) {
  return useTransform(drawn, (d) => Math.min(1, Math.max(0, (d - at) / REVEAL)))
}

function StopDot({ s, drawn }: { s: number; drawn: MotionValue<number> }) {
  const p = along(s)
  const opacity = useReached(drawn, s)
  return (
    <motion.circle
      cx={p.x}
      cy={p.y}
      r={6 * PX}
      fill="var(--chalk)"
      stroke="var(--drafting)"
      strokeWidth={2.5 * PX}
      style={{ opacity }}
    />
  )
}

function ChapterTag({ k, name, drawn }: { k: number; name: string; drawn: MotionValue<number> }) {
  const r = ROUTE.range[k]
  const s = r.a + (r.b - r.a) * TAG_AT[k]
  const opacity = useReached(drawn, s)
  return (
    <motion.g style={{ opacity }}>
      <Tag s={s} num={String(k + 1)} text={name} out={TAG_OUT[k]} />
    </motion.g>
  )
}

/**
 * The road itself: the wireframe it outlines (overview presses), the driving
 * road, then — seen only from the overview — the road again at the sheet's
 * scale, drawn as far as `drawn`, with its stops and the chapters' tags
 * arriving as the drawing reaches them.
 */
function Road({
  paved,
  drawn,
  drive,
  mapOpacity,
  wire,
  showWire,
}: {
  paved: MotionValue<string>
  drawn: MotionValue<number>
  drive: MotionValue<number>
  mapOpacity: MotionValue<number>
  wire: MotionValue<number>
  showWire: boolean
}) {
  const K = ROUTE.K
  const drawnDash = useTransform(drawn, (d) => `${d} ${ROUTE.total + 10}`)
  return (
    <>
      {showWire && (
        <motion.image
          href={blueprint}
          x={0}
          y={0}
          width={WIRE.w * K}
          height={WIRE.h * K}
          preserveAspectRatio="none"
          style={{ opacity: wire }}
        />
      )}

      {/* Ahead, while driving: a faint road with a dashed centre line, the
          way a proposed route is drawn on a plan. Not on the overview, where
          the building comes first and the road draws itself. */}
      <motion.g style={{ opacity: drive }}>
        <path d={ROUTE.d} fill="none" stroke="rgba(124, 196, 242, 0.16)" strokeWidth={ROAD} strokeLinejoin="round" />
        <path d={ROUTE.d} fill="none" stroke="rgba(124, 196, 242, 0.55)" strokeWidth={6} strokeDasharray="60 60" />
      </motion.g>
      {/* Paved: amber, as far as you have travelled. */}
      <motion.path d={ROUTE.d} fill="none" stroke="var(--signal)" strokeWidth={ROAD} style={{ strokeDasharray: paved }} />

      {/* The overview's road: amber, wide enough to read across the room,
          drawn as far as `drawn`. */}
      <motion.g style={{ opacity: mapOpacity }}>
        <motion.path
          d={ROUTE.d}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={22 * PX}
          strokeLinejoin="round"
          style={{ strokeDasharray: drawnDash }}
        />
        {ROUTE.stopS.map((sv, i) => (
          <StopDot key={i} s={sv} drawn={drawn} />
        ))}
        {c.chapters.map((name, k) => (
          <ChapterTag key={name} k={k} name={name} drawn={drawn} />
        ))}
      </motion.g>
    </>
  )
}

interface StationProps {
  pose: { x: number; y: number; h: number; side: number }
  e: JourneyEvent
  n: number
  at: number
  lead: number
}

/**
 * One stop's drawing. Drawn the moment the camera is sent here and left
 * drawn as it moves on: a stop behind you is finished, not erased. Stops
 * ahead are only the road.
 */
function Station({ pose, e, n, at, lead }: StationProps) {
  const reached = n <= at
  return (
    <section className={`jr__sheet jr__st ${layout(pose.side)}`} style={place(pose)} aria-hidden={n !== at}>
      <AnimatePresence>{reached && <Drawn key="drawn" e={e} n={n} still={n < at} lead={lead} />}</AnimatePresence>
    </section>
  )
}

/**
 * Everything at a stop. `still` is read once, at mount: a stop already
 * behind the camera when the deck opens is drawn finished; a stop the
 * camera is travelling to builds as it arrives.
 */
/** The stop's date as one line: "October 2024", "19–20 October 2026". */
const dateOf = (e: JourneyEvent) => `${e.when} ${e.year}`
/**
 * One size for the whole date, as large as fits on the road beside the
 * chapter's name: 150px for a month and year, stepping down for ranges.
 */
const dateSize = (t: string) => Math.round(Math.min(150, 940 / (t.length * 0.47)))

function Drawn({ e, n, still: initiallyStill, lead }: { e: JourneyEvent; n: number; still: boolean; lead: number }) {
  const [still] = useState(initiallyStill)
  const at = (t: number) => lead + t
  const from = (o: TargetAndTransition): TargetAndTransition | false => (still ? false : o)

  return (
    <motion.div
      className={`jr__drawn jr__drawn--${FRAMES[n - 1].name}`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* The date flies in large and settles on the road: month (and day)
          as large as the year, since the whole journey is 2024 to 2026. */}
      <div className="jr__date-row">
        <motion.div
          className="jr__date"
          initial={from({ opacity: 0, scale: 1.6, x: 220, y: -120 })}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.85, delay: at(-0.15), ease: EASE }}
        >
          <span className="jr__day" style={{ fontSize: dateSize(dateOf(e)) }}>
            <Scramble text={dateOf(e)} delay={at(0.1)} still={still} />
          </span>
          <span className="jr__idx">
            {String(n).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      <Scramble as="h2" className="jr__title" text={e.title} delay={at(0.3)} still={still} />
      <motion.p
        className="jr__text"
        initial={from({ opacity: 0, y: 10 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: at(0.7), ease: EASE }}
      >
        {e.body}
      </motion.p>

      {e.chart && (
        <div className="jr__chart">
          <Chart chart={e.chart} delay={at(0.85)} still={still} />
        </div>
      )}

      <Picture e={e} n={n} delay={at(0.45)} still={still} />
    </motion.div>
  )
}

/**
 * Letters arrive in a scattered order rather than left to right, the
 * template's reveal for its headings. Deterministic, so a stop always
 * builds the same way.
 */
function Scramble({
  text,
  delay,
  still,
  className,
  as = 'span',
}: {
  text: string
  delay: number
  still: boolean
  className?: string
  as?: 'span' | 'h2'
}) {
  const Tag = as === 'h2' ? motion.h2 : motion.span
  const words = text.split(' ')
  let k = 0
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="jr__word" aria-hidden="true">
          {[...w].map((ch, ci) => {
            const i = k++
            const t = ((i * 7919) % 23) / 23
            return (
              <motion.span
                key={ci}
                initial={still ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12, delay: delay + t * 0.55 }}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/**
 * How each stop shows its photograph. Twelve stops, twelve treatments, none
 * repeated: columns and panels that bleed off the sheet, backgrounds behind
 * the words, prints laid on the drawing, a strip, an arch, a phone. Each
 * arrives its own way; every one then lights from a dark silhouette, the
 * template's cut-out reveal.
 */
type Frame = { name: string; from: TargetAndTransition; to: TargetAndTransition }
const FRAMES: Frame[] = [
  // 01 case files: a tall column off the right and top edges
  { name: 'column', from: { opacity: 0, x: 160 }, to: { opacity: 1, x: 0 } },
  // 02 BYOD: the ward behind the ring, fading in from the left
  { name: 'fade', from: { opacity: 0, x: 80 }, to: { opacity: 1, x: 0 } },
  // 03 HIO: a large print, tilted
  { name: 'print', from: { opacity: 0, x: 140, rotate: -7 }, to: { opacity: 1, x: 0, rotate: -2.5 } },
  // 04 syllabus: a hard-edged panel off the right and bottom
  { name: 'panel', from: { opacity: 0, x: 200 }, to: { opacity: 1, x: 0 } },
  // 05 invited sessions: cut on a diagonal
  { name: 'diagonal', from: { opacity: 0, x: 120 }, to: { opacity: 1, x: 0 } },
  // 06 The Star: a mounted cutting, tilted the other way
  { name: 'mounted', from: { opacity: 0, y: -60, rotate: 8 }, to: { opacity: 1, y: 0, rotate: 3 } },
  // 07 Pre-Innovathon: the whole sheet, darkened behind the words
  { name: 'backdrop', from: { opacity: 0, scale: 1.08 }, to: { opacity: 1, scale: 1 } },
  // 08 judges: a cinematic strip across the sheet
  { name: 'strip', from: { opacity: 0, scaleY: 0.2 }, to: { opacity: 1, scaleY: 1 } },
  // 09 Innovathon: an arched window
  { name: 'arch', from: { opacity: 0, y: 80 }, to: { opacity: 1, y: 0 } },
  // 10 Wound Vision: the app, in a phone
  { name: 'phone', from: { opacity: 0, y: 90, rotate: 2 }, to: { opacity: 1, y: 0, rotate: -4 } },
  // 11 MyIPO: a print with its outline offset behind it
  { name: 'offset', from: { opacity: 0, x: 100, y: -40 }, to: { opacity: 1, x: 0, y: 0 } },
  // 12 nationwide: the whole sheet, fading into the road
  { name: 'horizon', from: { opacity: 0, scale: 1.08 }, to: { opacity: 1, scale: 1 } },
]

function Picture({ e, n, delay, still }: { e: JourneyEvent; n: number; delay: number; still: boolean }) {
  const src = e.image.photo && PHOTO[e.image.photo]
  const frame = FRAMES[n - 1]
  return (
    <motion.figure
      className={`jr__pic jr__pic--${frame.name}${src ? '' : ' jr__pic--todo'}`}
      initial={still ? false : frame.from}
      animate={frame.to}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {src ? (
        <motion.img
          src={src}
          alt={e.image.suggest}
          initial={still ? false : { filter: 'brightness(0)' }}
          animate={{ filter: 'brightness(1)' }}
          transition={{ duration: 0.8, delay: delay + 0.5, ease: 'easeOut' }}
        />
      ) : (
        <figcaption>
          <span className="jr__todo-tag">Image to add</span>
          {e.image.suggest}
        </figcaption>
      )}
    </motion.figure>
  )
}

function Chart({ chart, delay, still }: { chart: JourneyChart; delay: number; still: boolean }) {
  const from = (o: TargetAndTransition): TargetAndTransition | false => (still ? false : o)
  switch (chart.kind) {
    case 'counts':
      return (
        <ul className={`jr__counts jr__counts--${chart.items.length > 3 ? 'grid' : 'rows'}`}>
          {chart.items.map((f, i) => (
            <li key={f.label}>
              <CountUp {...f} className="jr__num" delay={delay + i * 0.3} duration={1.1} still={still} />
              <Scramble className="jr__label" text={f.label ?? ''} delay={delay + 0.25 + i * 0.3} still={still} />
            </li>
          ))}
        </ul>
      )

    case 'ring': {
      const RR = 112
      return (
        <div className="jr__ring">
          <svg viewBox="0 0 260 260" aria-hidden="true">
            <circle cx={130} cy={130} r={RR} fill="none" stroke="var(--line)" strokeOpacity={0.3} strokeWidth={14} />
            <motion.circle
              cx={130}
              cy={130}
              r={RR}
              fill="none"
              stroke="var(--signal)"
              strokeWidth={14}
              transform="rotate(-90 130 130)"
              initial={from({ pathLength: 0 })}
              animate={{ pathLength: chart.value / chart.of }}
              transition={{ duration: 1.3, delay, ease: EASE }}
            />
          </svg>
          <div className="jr__ring-mid">
            <CountUp value={chart.value} tone="signal" className="jr__ring-num" delay={delay} duration={1.3} still={still} />
            <span className="jr__ring-of">{chart.ofLabel}</span>
          </div>
          <Scramble className="jr__ring-label" text={chart.label} delay={delay + 0.8} still={still} />
        </div>
      )
    }

    case 'path': {
      // The template's circle-and-line: numbered stops on a zig-zag.
      const X = [40, 240, 440]
      const Y = [40, 190, 40]
      const d = X.map((x, i) => `${i ? 'L' : 'M'} ${x} ${Y[i]}`).join(' ')
      return (
        <div className="jr__path">
          <svg viewBox="0 0 680 300" aria-hidden="true">
            <DrawPath d={d} delay={delay} duration={1.2} opacity={0.6} still={still} />
          </svg>
          {chart.nodes.map((t, i) => (
            <motion.div
              key={t}
              className="jr__stop"
              style={{ left: X[i] - 34, top: Y[i] - 34 }}
              initial={from({ opacity: 0, scale: 0.6 })}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: delay + i * 0.4, ease: EASE }}
            >
              <span className="jr__stop-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="jr__stop-t">{t}</span>
            </motion.div>
          ))}
        </div>
      )
    }

    case 'tags':
      return (
        <ul className="jr__tags">
          {chart.items.map((t, i) => (
            <motion.li
              key={t}
              initial={from({ opacity: 0, y: 10 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: delay + i * 0.2, ease: EASE }}
            >
              {t}
            </motion.li>
          ))}
        </ul>
      )

    case 'list':
      return (
        <ul className="jr__list">
          {chart.items.map((t, i) => (
            <motion.li
              key={t.name}
              initial={from({ opacity: 0, x: -12 })}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + i * 0.3, ease: EASE }}
            >
              <span className="jr__list-name">{t.name}</span>
              <span className="jr__list-with">{t.with}</span>
            </motion.li>
          ))}
        </ul>
      )
  }
}
