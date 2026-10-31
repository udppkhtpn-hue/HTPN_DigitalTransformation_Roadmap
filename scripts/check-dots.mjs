/**
 * The fifty dots across sheets 9 to 14, forwards and backwards.
 *
 * Sheet 9 scatters them, sheet 12 files them into three tiers, sheet 14 pulls
 * them onto six streams, and the sheets between (10, 11, 13) do not draw
 * them. Each sheet has to begin from wherever the previous dot sheet left
 * the dots, in both directions, so this reads the real circle positions out
 * of the DOM at the moment each sheet mounts and again once it has settled.
 *
 *   node scripts/check-dots.mjs        (needs dist-single/)
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { DOTS, streamPosition, tierPosition } from '../src/kit/dots.ts'

const HTML = readFileSync('dist-single/index.html')
const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(HTML)
}).listen(4460)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await page.goto('http://localhost:4460/#/s/9/0')
await page.waitForSelector('.stage')

const SCATTER = DOTS.map((d) => [d.x, d.y])
const TIERS = DOTS.map((d) => [tierPosition(d).x, tierPosition(d).y])
const STREAMS = DOTS.map((d) => [streamPosition(d).x, streamPosition(d).y])

let failed = 0
const near = (a, b) => a.length === b.length && a.every((p, i) => Math.abs(p[0] - b[i][0]) < 2 && Math.abs(p[1] - b[i][1]) < 2)

/** Read the fifty dots' centres, in id order, from whichever sheet is up. */
const read = (root, r) =>
  page.evaluate(
    ([root, r]) =>
      [...document.querySelectorAll(`${root} circle`)]
        .filter((c) => c.getAttribute('r') === String(r))
        .map((c) => [parseFloat(c.getAttribute('cx')), parseFloat(c.getAttribute('cy'))]),
    [root, r],
  )

const go = async (sheet, rootSel, r, label, mountExpect, settleExpect, settleMs) => {
  await page.evaluate((s) => { location.hash = `#/s/${s}/0` }, sheet)
  await page.waitForFunction(([sel, r]) => [...document.querySelectorAll(`${sel} circle`)].filter((c) => c.getAttribute('r') === String(r)).length >= 50, [rootSel, r], { timeout: 8000 })
  const early = await read(rootSel, r)
  await page.waitForTimeout(settleMs)
  const late = await read(rootSel, r)
  const a = near(early, mountExpect)
  const b = near(late, settleExpect)
  if (!a) failed++
  if (!b) failed++
  console.log(`  ${a ? 'ok  ' : 'FAIL'} ${label}: begins where the last dot sheet left them`)
  console.log(`  ${b ? 'ok  ' : 'FAIL'} ${label}: settles in its own arrangement`)
}

console.log('forwards')
await go(9, '.s08', 7, 'S-09 gap       ', SCATTER, SCATTER, 800)
await go(12, '.pr', 7, 'S-12 registry  ', SCATTER, TIERS, 4600)
await go(14, '.s10', 6, 'S-14 command   ', TIERS, STREAMS, 3200)

console.log('backwards')
await go(12, '.pr', 7, 'S-12 registry  ', SCATTER, TIERS, 4600)
await go(9, '.s08', 7, 'S-09 gap       ', SCATTER, SCATTER, 800)

// A direct jump skips the sheets in between and must still be consistent.
console.log('direct jump 9 → 14')
await go(14, '.s10', 6, 'S-14 command   ', TIERS, STREAMS, 3200)

// The parked sheets draw no dots at all.
for (const [n, sel] of [[10, '.v28'], [11, '.rm'], [13, '.pf']]) {
  await page.evaluate((s) => { location.hash = `#/s/${s}/0` }, n)
  await page.waitForSelector(sel, { timeout: 8000 })
  await page.waitForTimeout(500)
  const count = await page.evaluate((sel) => document.querySelectorAll(`${sel} circle[r="6"], ${sel} circle[r="7"]`).length, sel)
  const ok = count < 50
  if (!ok) failed++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} S-${n} parks the dots (none of the fifty drawn)`)
}

await browser.close()
server.close()
console.log(failed ? `\n${failed} check(s) failed` : '\nall dot checks passed')
process.exit(failed ? 1 : 0)
