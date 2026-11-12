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

import { REGISTRY } from '../content/registry.ts'

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
 * Dot `id` is app number `id + 1` in the HTPN App Registry, and each files
 * into the tier the registry proposes for it: 3 experimental, 30
 * departmental, 17 hospital-critical. The bands are sized to hold their
 * own apps, three to a row, so a dot lands on the slot beside its own name.
 * Index 0 is Tier 1, at the top; Tier 3, the heaviest, sits at the bottom.
 */
export const TIER_BANDS = [
  { y0: 254, h: 110 },
  { y0: 378, h: 280 },
  { y0: 672, h: 196 },
]

/** Three columns of app slots to the right of the tier descriptions. */
export const SLOT = { x0: 668, colW: 362, rowH: 27, cols: 3, pad: 16 }

export const tierOf = (d: Dot) => REGISTRY[d.id].tier - 1

/** Each app's place within its own tier, in registry order. */
const RANK = REGISTRY.map((a) => REGISTRY.filter((b) => b.tier === a.tier && b.no < a.no).length)

/** Where a dot sits once it has been filed into its tier: its slot's bullet. */
export function tierPosition(d: Dot): { x: number; y: number } {
  const k = RANK[d.id]
  const b = TIER_BANDS[tierOf(d)]
  const rows = Math.ceil(REGISTRY.filter((a) => a.tier === REGISTRY[d.id].tier).length / SLOT.cols)
  const top = b.y0 + (b.h - rows * SLOT.rowH) / 2
  return {
    x: SLOT.x0 + (k % SLOT.cols) * SLOT.colW,
    y: top + Math.floor(k / SLOT.cols) * SLOT.rowH + SLOT.rowH / 2,
  }
}
