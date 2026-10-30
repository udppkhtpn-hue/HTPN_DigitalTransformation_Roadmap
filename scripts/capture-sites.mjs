/**
 * 1600×900 screenshots of the two live sites, for the framed drawings on
 * S-06 and S-07. Waits for the network to settle and then gives the scroll
 * and entrance animations time to finish, so nothing is caught mid-fade.
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SITES = [
  { out: 'shot-showcase', url: 'https://htpn-showcase-v2.vercel.app/' },
  { out: 'shot-innovathon', url: 'https://udppkhtpn-hue.github.io/innovathon2026/' },
]

const OUT = 'src/assets'
const BUDGET = 400 * 1024
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  // These decks animate on scroll; let them run rather than freezing them.
  reducedMotion: 'no-preference',
})

for (const site of SITES) {
  const page = await ctx.newPage()
  try {
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60_000 })
  } catch {
    console.warn(`${site.out}: networkidle timed out, carrying on`)
  }
  await page.evaluate(() => document.fonts.ready)
  // Entrance and scroll-reveal animations settle.
  await page.waitForTimeout(4000)

  const png = await page.screenshot({ type: 'png' })
  let written = false
  for (const quality of [88, 84, 80, 76, 72]) {
    const buf = await sharp(png).webp({ quality, effort: 6 }).toBuffer()
    if (buf.byteLength <= BUDGET || quality === 72) {
      await sharp(buf).toFile(`${OUT}/${site.out}.webp`)
      console.log(
        `${site.out.padEnd(18)} 1600×900  q${quality}  ${(buf.byteLength / 1024).toFixed(0)}KB`,
      )
      written = true
      break
    }
  }
  if (!written) console.error(`${site.out}: could not meet budget`)
  await page.close()
}

await browser.close()
