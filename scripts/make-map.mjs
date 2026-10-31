/**
 * Project Malaysia once, at build time, into plain SVG path strings.
 *
 * Doing this here rather than at runtime keeps d3-geo, topojson and a 10m
 * world atlas out of the bundle entirely — the deck ships a few kilobytes
 * of path data instead of a megabyte of machinery it would only ever run
 * once, on a laptop driving a projector.
 *
 * It also verifies every pin: a point outside Malaysia's own polygon is a
 * coordinate error, and this is the one kind of error a build can catch.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { geoMercator, geoPath, geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
import { HOME, SITES } from '../src/content/sites.ts'

// 10m for Malaysia, where the coastline is the drawing. 50m for the faint
// neighbours at 10% opacity, where 10m costs hundreds of kilobytes that
// nobody can see — Indonesia alone is most of the file.
const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-10m.json', 'utf8'))
const coarse = JSON.parse(readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'))
const all = feature(topo, topo.objects.countries).features
const allCoarse = feature(coarse, coarse.objects.countries).features
const byId = (id) => all.find((f) => f.id === id)
const byIdCoarse = (id) => allCoarse.find((f) => f.id === id)

const MY = byId('458')
const NEIGHBOURS = ['764', '702', '360', '096'].map(byIdCoarse).filter(Boolean)
if (!MY) throw new Error('Malaysia (458) not found in world-atlas')

/** Split Malaysia into the peninsula and the Borneo states. */
const split = (f, west) => ({
  type: 'MultiPolygon',
  coordinates: f.geometry.coordinates.filter((poly) => {
    const lons = poly[0].map((c) => c[0])
    const mid = lons.reduce((a, b) => a + b, 0) / lons.length
    return west ? mid < 106 : mid >= 106
  }),
})
const clip = (f, west) =>
  f.geometry.type === 'Polygon'
    ? { type: 'MultiPolygon', coordinates: [f.geometry.coordinates] }
    : split(f, west)

/** Stage boxes. The peninsula sits left, Borneo right, a break line between. */
//
// The Kuching arc leaves Kajang, bows south and crosses the sea to Sarawak.
// The magnifier therefore sits in the open water above that arc, not in
// its path, and the break line passes behind it.
const WEST_BOX = [[200, 240], [660, 790]]
const EAST_BOX = [[990, 380], [1440, 760]]
const INSET = { cx: 830, cy: 410, r: 140 } // Klang Valley detail circle
const BREAK_X = 830

function panel(box, geom, extraFeatures) {
  const [[x0, y0], [x1, y1]] = box
  const proj = geoMercator().fitExtent([[x0, y0], [x1, y1]], geom)
  // Discard everything outside the panel instead of emitting paths for it.
  proj.clipExtent([[x0 - 2, y0 - 2], [x1 + 2, y1 + 2]])
  // One decimal is ~0.1px at stage scale: invisible, and a tenth the bytes.
  const path = geoPath(proj).digits(1)
  return {
    main: path(geom),
    faint: extraFeatures.map((f) => path(f)).filter(Boolean),
    project: (lon, lat) => proj([lon, lat]),
  }
}

const westGeom = split(MY, true)
const eastGeom = split(MY, false)

const west = panel(WEST_BOX, westGeom, NEIGHBOURS.map((f) => clip(f, true)))
const east = panel(EAST_BOX, eastGeom, NEIGHBOURS.map((f) => clip(f, false)))

// Klang Valley magnifier: same projection machinery, clipped to the circle.
// A MultiPoint, not a Polygon: d3-geo reads a ring's winding order on the
// sphere, and a clockwise rectangle means "everything except this box".
// Two corner points carry the same extent with no winding to get wrong.
const kvGeom = { type: 'MultiPoint', coordinates: [[101.45, 2.45], [101.95, 3.30]] }
const insetProj = geoMercator().fitExtent(
  [[INSET.cx - INSET.r, INSET.cy - INSET.r], [INSET.cx + INSET.r, INSET.cy + INSET.r]],
  kvGeom,
)
insetProj.clipExtent([
  [INSET.cx - INSET.r, INSET.cy - INSET.r],
  [INSET.cx + INSET.r, INSET.cy + INSET.r],
])
const insetPath = geoPath(insetProj).digits(1)(westGeom) || ''

/** Everything in the Klang Valley box goes in the magnifier instead. */
const inKV = (s) => s.lon > 101.45 && s.lon < 101.95 && s.lat > 2.45 && s.lat < 3.30

const problems = []
const pins = SITES.map((s) => {
  if (!geoContains(MY, [s.lon, s.lat])) problems.push(`#${s.n} ${s.name}`)
  const kv = inKV(s)
  const east_ = s.lon >= 106
  // Arcs always fly to the main map. The nine Klang Valley sites land on
  // essentially one point there, which is the truth; the magnifier below
  // separates them.
  const m = east_ ? east.project(s.lon, s.lat) : west.project(s.lon, s.lat)
  const i = kv ? insetProj([s.lon, s.lat]) : null
  return {
    n: s.n, kind: s.kind, east: east_,
    x: +m[0].toFixed(1), y: +m[1].toFixed(1),
    ix: i ? +i[0].toFixed(1) : null, iy: i ? +i[1].toFixed(1) : null,
  }
})

// Number labels for the magnifier. Nine sites sit within a few pixels of
// each other (two share a point exactly), so a fixed offset per pin cannot
// keep them apart. Relax the labels instead: each wants to sit ~38px from
// its own pin, and is pushed off every other label and every pin, inside
// the circle. Leader lines tie each label back to its pin.
{
  const kv = pins.filter((p) => p.ix !== null)
  const cx = kv.reduce((a, p) => a + p.ix, 0) / kv.length
  const cy = kv.reduce((a, p) => a + p.iy, 0) / kv.length
  const R = INSET.r - 24
  const L = kv.map((p, i) => {
    // Fan outward from the cluster's centre; coincident pins get distinct angles.
    let a = Math.atan2(p.iy - cy, p.ix - cx)
    a += (i % 2 ? 1 : -1) * 0.35 * Math.floor((i + 1) / 2)
    return { p, x: p.ix + Math.cos(a) * 38, y: p.iy + Math.sin(a) * 38 }
  })
  const W = 46, H = 36 // label box incl. breathing room (28px mono, two digits)
  for (let it = 0; it < 600; it++) {
    for (const a of L) {
      // pull toward its own ring around the pin
      const dx = a.x - a.p.ix, dy = a.y - a.p.iy, d = Math.hypot(dx, dy) || 1
      const k = (d - 38) * 0.04
      a.x -= (dx / d) * k; a.y -= (dy / d) * k
      // keep off every pin
      for (const q of kv) {
        const ex = a.x - q.ix, ey = a.y - q.iy, e = Math.hypot(ex, ey) || 1
        if (e < 30) { a.x += (ex / e) * (30 - e) * 0.3; a.y += (ey / e) * (30 - e) * 0.3 }
      }
      // keep off every other label (axis-aligned boxes)
      for (const b of L) {
        if (a === b) continue
        const ox = W - Math.abs(a.x - b.x), oy = H - Math.abs(a.y - b.y)
        if (ox > 0 && oy > 0) {
          if (ox < oy) { const sx = Math.sign(a.x - b.x) || 1; a.x += sx * ox * 0.25; b.x -= sx * ox * 0.25 }
          else { const sy = Math.sign(a.y - b.y) || 1; a.y += sy * oy * 0.25; b.y -= sy * oy * 0.25 }
        }
      }
      // stay inside the circle
      const rx = a.x - INSET.cx, ry = a.y - INSET.cy, r = Math.hypot(rx, ry)
      if (r > R) { a.x = INSET.cx + (rx / r) * R; a.y = INSET.cy + (ry / r) * R }
    }
  }
  for (const a of L) { a.p.lx = +a.x.toFixed(1); a.p.ly = +a.y.toFixed(1) }
}

const homeKV = inKV(HOME)
const hp = homeKV ? insetProj([HOME.lon, HOME.lat]) : west.project(HOME.lon, HOME.lat)
// The arc origin on the main map, so arcs to distant sites start sensibly.
const homeMain = west.project(HOME.lon, HOME.lat)

const out = `// Generated by scripts/make-map.mjs — do not edit by hand.
// Natural Earth 10m via world-atlas, Mercator, projected at build time.

export const MAP = {
  west: ${JSON.stringify({ main: west.main, faint: west.faint })},
  east: ${JSON.stringify({ main: east.main, faint: east.faint })},
  inset: ${JSON.stringify({ ...INSET, path: insetPath })},
  breakX: ${BREAK_X},
  home: { x: ${hp[0].toFixed(1)}, y: ${hp[1].toFixed(1)}, mainX: ${homeMain[0].toFixed(1)}, mainY: ${homeMain[1].toFixed(1)}, inset: ${homeKV} },
  pins: ${JSON.stringify(pins)},
} as const
`
writeFileSync('src/content/map.ts', out)

console.log(`map.ts written — ${(out.length / 1024).toFixed(0)}KB`)
console.log(`pins: ${pins.length}  in Klang Valley inset: ${pins.filter((p) => p.ix !== null).length}  east: ${pins.filter((p) => p.east).length}`)
console.log(problems.length ? `OUTSIDE MALAYSIA: ${problems.join(', ')}` : 'all pins inside Malaysia')
