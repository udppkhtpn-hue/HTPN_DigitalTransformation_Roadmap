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

const HTML = readFileSync('dist-single/index.html')
const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(HTML)
}).listen(4456)

const MOMENTS = [
  ['S-01 title + blueprint draw', '#/s/1/0', 6500],
  ['S-02 +128% count-up', '#/s/2/0', 2500],
  ['S-04 split-flap', '#/s/4/1', 2000],
  ['S-05 four count-ups', '#/s/5/0', 4000],
  ['S-06 three marquees', '#/s/6/0', 3000],
  ['S-08 fifty drifting dots', '#/s/8/0', 3000],
  ['S-09 ACHIEVED stamp', '#/s/9/0', 2000],
  ['S-10 converge + pulses', '#/s/10/0', 3000],
  ['S-11 width-axis headline', '#/s/11/0', 3000],
  ['S-12 strike-through', '#/s/12/1', 2500],
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
