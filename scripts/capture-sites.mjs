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
  // Oxford deck: the Deep Learning Lab's two arms, and app 51.
  // The tool sits behind a consent gate; it is hidden for the picture, never ticked.
  { out: 'shot-dfu', url: 'https://htpn-clinical-checker.vercel.app/dfu/', hide: '#gate', crop: { left: 480, top: 0, width: 640, height: 900 } },
  { out: 'shot-dfu-pi', url: 'https://htpn-clinical-checker.vercel.app/dfu/?arm=pi', hide: '#gate', crop: { left: 480, top: 0, width: 640, height: 900 } },
  { out: 'shot-patient-journey', url: 'https://patient-journey-by-htpn.vercel.app' },
]

// `npm run shots -- shot-dfu` re-shoots only the named ones.
const only = process.argv.slice(2)
const wanted = only.length ? SITES.filter((s) => only.includes(s.out)) : SITES

const OUT = 'src/assets'
const BUDGET = 400 * 1024
mkdirSync(OUT, { recursive: true })

// PW_CHANNEL=chrome uses the installed Chrome when Playwright's own is not downloaded.
const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {})
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  // These decks animate on scroll; let them run rather than freezing them.
  reducedMotion: 'no-preference',
})

for (const site of wanted) {
  const page = await ctx.newPage()
  try {
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60_000 })
  } catch {
    console.warn(`${site.out}: networkidle timed out, carrying on`)
  }
  await page.evaluate(() => document.fonts.ready)
  if (site.hide) await page.addStyleTag({ content: `${site.hide} { display: none !important; }` })
  // Entrance and scroll-reveal animations settle.
  await page.waitForTimeout(4000)

  let png = await page.screenshot({ type: 'png' })
  // A narrow app column: keep the column, not the empty margins.
  if (site.crop) png = await sharp(png).extract(site.crop).toBuffer()
  let written = false
  for (const quality of [88, 84, 80, 76, 72]) {
    const buf = await sharp(png).webp({ quality, effort: 6 }).toBuffer()
    if (buf.byteLength <= BUDGET || quality === 72) {
      await sharp(buf).toFile(`${OUT}/${site.out}.webp`)
      console.log(
        `${site.out.padEnd(18)} ${site.crop ? `${site.crop.width}×${site.crop.height}` : '1600×900'}  q${quality}  ${(buf.byteLength / 1024).toFixed(0)}KB`,
      )
      written = true
      break
    }
  }
  if (!written) console.error(`${site.out}: could not meet budget`)
  await page.close()
}

await browser.close()
