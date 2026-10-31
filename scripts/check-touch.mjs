/**
 * Touch navigation check, on real WebKit with real touch emulation.
 *
 * The deck is driven by a clicker in the room, but it gets handed round on a
 * phone beforehand, and until now it answered only to a keyboard. This walks
 * the whole deck forwards by tapping, comes back three steps by swiping, and
 * asserts the hash moved on every single press — because a tap that silently
 * does nothing is exactly the failure that would not show up in a screenshot.
 *
 *   node scripts/check-touch.mjs        (needs dist-single/, so build first)
 */
import { webkit, devices } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, mkdirSync } from 'node:fs'
import { SCENES, TOTAL_STEPS } from '../src/content/scenes.ts'

const HTML = readFileSync('dist-single/index.html')
const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(HTML)
}).listen(4457)

mkdirSync('.shots', { recursive: true })

const TARGETS = ['iPhone 15', 'iPad Pro 11']
let failed = 0

const browser = await webkit.launch()

for (const name of TARGETS) {
  const device = devices[name]
  if (!device) {
    console.log(`SKIP ${name} — not in this Playwright's device list`)
    continue
  }

  const ctx = await browser.newContext({ ...device, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4457/#/s/1/0')
  await page.waitForSelector('.stage', { timeout: 15000 })
  await page.waitForTimeout(400)

  const vw = page.viewportSize()
  const portrait = vw.height > vw.width
  const landscape = portrait ? { width: vw.height, height: vw.width } : vw
  // A portrait phone shows the rotate overlay by design, so the walk-through
  // happens the way it would be presented: sideways.
  await page.setViewportSize(landscape)
  await page.waitForTimeout(300)

  const hash = () => page.evaluate(() => location.hash)
  const tapNext = () =>
    page.touchscreen.tap(Math.round(landscape.width * 0.75), Math.round(landscape.height * 0.5))

  /** A real touch swipe: pointer events, as the browser would send them. */
  const swipe = (dx) =>
    page.evaluate(
      ([dx, cx, cy]) => {
        const box = document.querySelector('.letterbox')
        const mk = (type, x) =>
          box.dispatchEvent(
            new PointerEvent(type, {
              bubbles: true,
              cancelable: true,
              pointerId: 7,
              pointerType: 'touch',
              isPrimary: true,
              clientX: x,
              clientY: cy,
            }),
          )
        mk('pointerdown', cx)
        mk('pointermove', cx + dx / 2)
        mk('pointerup', cx + dx)
      },
      [dx, Math.round(landscape.width * 0.5), Math.round(landscape.height * 0.5)],
    )

  // ── forwards, by tapping ────────────────────────────────────────────────
  let moved = 0
  let stuck = []
  for (let k = 1; k < TOTAL_STEPS; k++) {
    const before = await hash()
    await tapNext()
    await page.waitForTimeout(90)
    const after = await hash()
    if (after === before) stuck.push(`${before} (tap ${k})`)
    else moved++
  }
  const end = await hash()
  const lastSheet = `#/s/${SCENES.length}/${SCENES[SCENES.length - 1].steps - 1}`

  // ── back three, by swiping right ───────────────────────────────────────
  const backFrom = await hash()
  const backTrail = []
  for (let k = 0; k < 3; k++) {
    await swipe(120)
    await page.waitForTimeout(90)
    backTrail.push(await hash())
  }

  // ── and forward once by swiping left, to prove both directions ─────────
  await swipe(-120)
  await page.waitForTimeout(90)
  const afterLeft = await hash()

  // ── a vertical drag must do nothing ────────────────────────────────────
  const beforeDrag = await hash()
  await page.evaluate(
    ([cx, cy]) => {
      const box = document.querySelector('.letterbox')
      const mk = (type, y) =>
        box.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true, cancelable: true, pointerId: 9,
            pointerType: 'touch', isPrimary: true, clientX: cx, clientY: y,
          }),
        )
      mk('pointerdown', cy)
      mk('pointerup', cy - 180)
    },
    [Math.round(landscape.width * 0.5), Math.round(landscape.height * 0.6)],
  )
  await page.waitForTimeout(90)
  const afterDrag = await hash()

  // ── the control strip ──────────────────────────────────────────────────
  const strip = await page.evaluate(() => {
    const el = document.querySelector('.tctl')
    if (!el) return null
    const cs = getComputedStyle(el)
    return {
      shown: cs.display !== 'none',
      buttons: [...el.querySelectorAll('button')].map((b) => b.textContent.trim()),
      idleAfter: null,
    }
  })
  // Wait out the idle timer and confirm it dims rather than disappears.
  await page.waitForTimeout(3400)
  const idleOpacity = await page.evaluate(() => {
    const el = document.querySelector('.tctl')
    return el ? getComputedStyle(el).opacity : null
  })

  // ── the portrait overlay ───────────────────────────────────────────────
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(250)
  const portraitHint = await page.evaluate(() => {
    const el = document.querySelector('.rotate-hint')
    return el ? getComputedStyle(el).display !== 'none' : null
  })
  await page.setViewportSize(landscape)
  await page.waitForTimeout(250)
  const landscapeHint = await page.evaluate(() => {
    const el = document.querySelector('.rotate-hint')
    return el ? getComputedStyle(el).display !== 'none' : null
  })

  // ── the stage fills the viewport, not the layout viewport ──────────────
  const fit = await page.evaluate(() => {
    const box = document.querySelector('.letterbox').getBoundingClientRect()
    const st = document.querySelector('.stage').getBoundingClientRect()
    return {
      box: [Math.round(box.width), Math.round(box.height)],
      stage: [Math.round(st.width), Math.round(st.height)],
      inside: st.height <= box.height + 1 && st.width <= box.width + 1,
    }
  })

  // ── screenshots: sheet 1 and sheet 6 ───────────────────────────────────
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  for (const s of [1, 6]) {
    await page.evaluate((s) => { location.hash = `#/s/${s}/0` }, s)
    await page.waitForTimeout(2600)
    await page.screenshot({ path: `.shots/touch-${slug}-s${s}.png` })
  }

  // ── report ─────────────────────────────────────────────────────────────
  const ok = (b) => (b ? 'ok  ' : 'FAIL')
  const checks = [
    [`taps advanced ${moved}/${TOTAL_STEPS - 1} steps`, stuck.length === 0],
    [`landed on the last sheet (${end})`, end === lastSheet],
    [`swipe right went back three (${backFrom} → ${backTrail.join(' → ')})`, backTrail[2] !== backFrom],
    [`swipe left went forward (${afterLeft})`, afterLeft !== backTrail[2]],
    [`vertical drag did nothing (${afterDrag})`, afterDrag === beforeDrag],
    [`control strip shown, buttons: ${strip?.buttons.join(' ')}`, strip?.shown === true],
    [`strip dims when idle (opacity ${idleOpacity})`, Number(idleOpacity) < 0.2],
    [`portrait hint shows at 390px`, portraitHint === true],
    [`portrait hint hides in landscape`, landscapeHint === false],
    [`stage fits the viewport ${fit.stage} in ${fit.box}`, fit.inside],
  ]

  console.log(`\n${name}  ${landscape.width}×${landscape.height}`)
  for (const [label, pass] of checks) {
    if (!pass) failed++
    console.log(`  ${ok(pass)} ${label}`)
  }
  if (stuck.length) console.log(`       stuck at: ${stuck.slice(0, 5).join(', ')}`)

  await ctx.close()
}

await browser.close()
server.close()

console.log(failed ? `\n${failed} check(s) failed` : '\nall touch checks passed')
process.exit(failed ? 1 : 0)
