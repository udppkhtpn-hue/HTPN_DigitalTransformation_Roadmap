/**
 * Frame budget check against the built offline file.
 *
 * Runs with the CPU throttled 4× to stand in for an average office laptop
 * driving a projector, and reports long tasks (>50ms blocking the main
 * thread) plus frame pacing for each scene's orchestrated moment.
 *
 * Long tasks are the measure that matters here: frame cadence in a headless
 * browser is not a faithful proxy for a real display, but a long task is a
 * long task anywhere, and it is what makes an animation visibly stutter.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { SCENES } from '../src/content/scenes.ts'

const HTML = readFileSync('dist-single/index.html')
const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(HTML)
}).listen(4456)

// Sheets are found by scene id, not hard-coded: moving a sheet renumbers
// everything after it, and the labels here used to go quietly wrong.
const at = (id, step = 0) => {
  const n = SCENES.findIndex((s) => s.id === id) + 1
  if (!n) throw new Error(`no scene "${id}"`)
  return [`S-${String(n).padStart(2, '0')}`, `#/s/${n}/${step}`]
}
const moment = (id, step, label, ms) => {
  const [s, hash] = at(id, step)
  return [`${s} ${label}`, hash, ms]
}
const MOMENTS = [
  moment('cold-open', 0, 'title + blueprint draw', 6500),
  moment('three-forces', 0, '+128% count-up', 2500),
  moment('how-we-led-it', 1, 'split-flap', 2000),
  moment('results', 0, 'four count-ups', 4000),
  moment('where-weve-taught', 0, 'map + 15 arcs', 9000),
  moment('portfolio', 0, 'three marquees', 3000),
  moment('the-gap', 0, 'fifty drifting dots', 3000),
  moment('national-picture', 1, '155 hospitals light up', 6500),
  moment('vision-2028', 1, 'hospitals on the line', 4000),
  moment('vision-2028', 2, 'reach rings', 3500),
  moment('roadmap', 1, 'pin drop + prints', 3500),
  moment('roadmap', 0, 'ACHIEVED stamp', 2000),
  moment('phase-registry', 0, 'dots sort into tiers', 4800),
  moment('phase-foundations', 0, 'piles drive down', 5000),
  moment('command-centre', 0, 'converge + pulses', 3000),
  moment('command-centre-build', 0, 'timeline + stamps', 4000),
  moment('predict-and-scale', 0, 'width-axis headline', 3000),
  moment('lesson-and-close', 1, 'strike-through', 2500),
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
const cdp = await page.context().newCDPSession(page)

await page.goto('http://localhost:4456/')
await page.waitForFunction(() => !!document.querySelector('.stage'), null, {
  timeout: 15_000,
})

await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
console.log('CPU throttled 4×\n')
console.log('moment                          longTasks  worstTask  frames  p95')

let worstOverall = 0
for (const [label, hash, ms] of MOMENTS) {
  const r = await page.evaluate(
    async ([hash, ms]) => {
      const tasks = []
      const po = new PerformanceObserver((l) => {
        for (const e of l.getEntries()) tasks.push(e.duration)
      })
      po.observe({ entryTypes: ['longtask'] })

      location.hash = hash
      await new Promise((r) => setTimeout(r, 60))

      const deltas = []
      let last = performance.now()
      const t0 = last
      await new Promise((res) => {
        const tick = (now) => {
          deltas.push(now - last)
          last = now
          if (now - t0 < ms) requestAnimationFrame(tick)
          else res()
        }
        requestAnimationFrame(tick)
      })
      po.disconnect()
      deltas.shift()
      const sorted = [...deltas].sort((a, b) => a - b)
      return {
        longTasks: tasks.length,
        worstTask: tasks.length ? Math.max(...tasks) : 0,
        frames: deltas.length,
        p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
      }
    },
    [hash, ms],
  )
  worstOverall = Math.max(worstOverall, r.worstTask)
  console.log(
    `${label.padEnd(32)}${String(r.longTasks).padStart(5)}` +
      `${r.worstTask.toFixed(0).padStart(11)}ms` +
      `${String(r.frames).padStart(8)}` +
      `${r.p95.toFixed(1).padStart(7)}ms`,
  )
}

console.log(`\nworst long task across the deck: ${worstOverall.toFixed(0)}ms`)
await browser.close()
server.close()
