/**
 * The fifty apps.
 *
 * Three sheets draw them and each begins where the previous one left them:
 * scattered on the gap sheet (S-10), filed into three risk tiers on the
 * registry (S-13), pulled onto six streams on the Command Centre (S-15).
 * The sheets between draw none. All of them read the coordinates in this
 * file, so a dot keeps its identity across the whole argument: the gap, the
 * governance and the answer are the same fifty objects seen three times.
 */

export interface Dot {
  id: number
  /** Scattered position, S-10. */
  x: number
  y: number
  /** Which of the six streams this app feeds on S-15. */
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

/**
 * The three risk tiers on the registry sheet.
 *
 * Fifty dots, three horizontal bands. The split is even by construction
 * (id mod 3) because nothing in the source says how many apps sit in each
 * tier, and a lopsided pyramid would quietly assert a number nobody gave.
 */
export const TIER_BANDS = [
  { y0: 370, h: 150 },
  { y0: 540, h: 150 },
  { y0: 710, h: 150 },
]

export const tierOf = (d: Dot) => d.id % 3

/** Where a dot sits once it has been filed into its tier. */
export function tierPosition(d: Dot): { x: number; y: number } {
  const k = Math.floor(d.id / 3)
  const b = TIER_BANDS[tierOf(d)]
  return {
    x: 860 + Math.floor(k / 2) * 105,
    y: b.y0 + b.h / 2 + (k % 2 ? 32 : -32),
  }
}
