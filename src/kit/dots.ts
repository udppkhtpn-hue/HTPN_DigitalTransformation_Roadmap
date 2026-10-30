/**
 * The fifty apps.
 *
 * Scattered on S-08 ("50 apps ≠ one hospital"), then pulled into six streams
 * on S-10. Both scenes read these exact coordinates, so a dot keeps its
 * identity across the scene change — the gap and the answer to it are the
 * same fifty objects, which is the argument the talk is making.
 */

export interface Dot {
  id: number
  /** Scattered position, S-08. */
  x: number
  y: number
  /** Which of the six streams this app feeds on S-10. */
  stream: number
  /** How far along its stream it sits, 0 at the outer end, 1 at the hub. */
  t: number
}

const COUNT = 50

/** Stage coordinates for the dot field. */
export const FIELD = { x: 200, y: 250, w: 1320, h: 560 }
export const HUB = { x: 960, y: 500 }

/** Six stream origins, fanned across the left and right of the hub. */
export const STREAM_ORIGINS = [
  { x: 470, y: 300 },
  { x: 430, y: 500 },
  { x: 470, y: 700 },
  { x: 1450, y: 300 },
  { x: 1490, y: 500 },
  { x: 1450, y: 700 },
]

function makeDots(): Dot[] {
  let seed = 7731
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

  return Array.from({ length: COUNT }, (_, id) => ({
    id,
    x: FIELD.x + rnd() * FIELD.w,
    y: FIELD.y + rnd() * FIELD.h,
    stream: id % STREAM_ORIGINS.length,
    // Spread along the stream, never right on top of the hub.
    t: 0.08 + rnd() * 0.78,
  }))
}

export const DOTS: Dot[] = makeDots()

/** Where a dot sits once it has been pulled onto its stream. */
export function streamPosition(d: Dot): { x: number; y: number } {
  const o = STREAM_ORIGINS[d.stream]
  return {
    x: o.x + (HUB.x - o.x) * d.t,
    y: o.y + (HUB.y - o.y) * d.t,
  }
}
