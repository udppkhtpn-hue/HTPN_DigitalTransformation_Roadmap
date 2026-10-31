/**
 * What the deck looks like on the devices it will be handed round on.
 *
 *   node scripts/shoot-mobile.mjs 1,7,10,19
 *
 * Real WebKit with iPhone 15 and iPad Pro 11 emulation, each in both
 * orientations, touch on. Writes .shots/mobile-<device>-<orientation>-s<N>.png.
 */
import { webkit, devices } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, mkdirSync } from 'node:fs'

const sheets = (process.argv[2] ?? '1').split(',').map(Number)
const HTML = readFileSync('dist-single/index.html')
const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(HTML)
}).listen(4461)
mkdirSync('.shots', { recursive: true })

const browser = await webkit.launch()
const TARGETS = [
  ['iphone', 'iPhone 15', 'portrait'],
  ['iphone', 'iPhone 15 landscape', 'landscape'],
  ['ipad', 'iPad Pro 11', 'portrait'],
  ['ipad', 'iPad Pro 11 landscape', 'landscape'],
]
for (const [slug, name, orient] of TARGETS) {
  const ctx = await browser.newContext({ ...devices[name] })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4461/#/s/1/0')
  await page.waitForSelector('.stage', { timeout: 20000 })
  for (const n of sheets) {
    await page.evaluate((n) => { location.hash = `#/s/${n}/0` }, n)
    await page.waitForTimeout(orient === 'portrait' && slug === 'iphone' ? 800 : 5500)
    await page.screenshot({ path: `.shots/mobile-${slug}-${orient}-s${n}.png` })
  }
  const vp = page.viewportSize()
  const info = await page.evaluate(() => ({
    hint: getComputedStyle(document.querySelector('.rotate-hint')).display,
    strip: getComputedStyle(document.querySelector('.tctl')).display,
    stage: (() => { const r = document.querySelector('.stage').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)] })(),
  }))
  console.log(`${name.padEnd(24)} ${vp.width}x${vp.height}  rotate-hint:${info.hint}  strip:${info.strip}  stage:${info.stage}`)
  await ctx.close()
}
await browser.close()
server.close()
