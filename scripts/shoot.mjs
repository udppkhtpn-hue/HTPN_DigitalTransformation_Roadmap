/**
 * Screenshot every press of the given sheets, at the sizes that matter.
 *
 *   node scripts/shoot.mjs 10,11            sheets (1-based), default sizes
 *   node scripts/shoot.mjs 10 1920x1080     one size
 *
 * Writes .shots/s<sheet>-p<press>-<width>.png from the offline build, after
 * letting each press's animation finish, so what is captured is what the
 * room would see once the beat has landed.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, mkdirSync } from 'node:fs'
import { SCENES } from '../src/content/scenes.ts'

const sheets = (process.argv[2] ?? '').split(',').filter(Boolean).map(Number)
const sizes = (process.argv[3] ?? '1920x1080,1366x768').split(',').map((s) => s.split('x').map(Number))
const WAIT = Number(process.env.WAIT ?? 4200)

const HTML = readFileSync('dist-single/index.html')
const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(HTML)
}).listen(4459)

mkdirSync('.shots', { recursive: true })
const browser = await chromium.launch()

for (const [w, h] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto('http://localhost:4459/')
  await page.waitForSelector('.stage', { timeout: 15000 })
  for (const n of sheets) {
    const scene = SCENES[n - 1]
    for (let step = 0; step < scene.steps; step++) {
      // Walk there press by press so entrances behave as they would live.
      if (step === 0) {
        await page.evaluate((n) => { location.hash = `#/s/${n}/0` }, n)
      } else {
        await page.keyboard.press('ArrowRight')
      }
      await page.waitForTimeout(WAIT)
      await page.screenshot({ path: `.shots/s${n}-p${step + 1}-${w}.png` })
    }
    console.log(`s${n} ${scene.title}: ${scene.steps} presses @ ${w}x${h}`)
  }
  await page.close()
}
await browser.close()
server.close()
