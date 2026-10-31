/**
 * The two KIK IPO photographs, as cyan-duotone prints.
 *
 * The brief is "never full colour": the photos sit on a blueprint, so they
 * are mapped from dark (--drafting) to light (--line) by luminance, the way
 * a cyanotype would print them, and nothing in them is left in its own
 * colour. Done in headless Chromium's canvas rather than sharp, which here
 * is stuck in a macOS dlopen — and Chromium is already a dependency of the
 * perf check, so this adds nothing to install.
 *
 *   node scripts/make-kik.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, statSync } from 'node:fs'

const JOBS = [
  { src: 'media/KIK IPO.jpeg', out: 'src/assets/kik-ipo-1.webp' },
  { src: 'media/KIK IPO 2.jpeg', out: 'src/assets/kik-ipo-2.webp' },
]
const MAX = 1400
const DARK = [0x0a, 0x18, 0x30] // --deep
const LIGHT = [0x7c, 0xc4, 0xf2] // --line
const LIMIT = 300 * 1024

const browser = await chromium.launch()
const page = await browser.newPage()

for (const { src, out } of JOBS) {
  const b64 = readFileSync(src).toString('base64')
  for (const q of [0.82, 0.7, 0.6, 0.5, 0.4]) {
    const url = await page.evaluate(
      async ([b64, MAX, DARK, LIGHT, q]) => {
        const img = new Image()
        img.src = `data:image/jpeg;base64,${b64}`
        await img.decode()
        const k = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
        const w = Math.round(img.naturalWidth * k)
        const h = Math.round(img.naturalHeight * k)
        const c = document.createElement('canvas')
        c.width = w
        c.height = h
        const g = c.getContext('2d')
        g.drawImage(img, 0, 0, w, h)
        const d = g.getImageData(0, 0, w, h)
        const p = d.data
        for (let i = 0; i < p.length; i += 4) {
          // Rec. 709 luma, lifted a touch so faces do not sink into the ground.
          let l = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255
          l = Math.min(1, Math.pow(l, 0.85) * 1.06)
          p[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
          p[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
          p[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
        }
        g.putImageData(d, 0, 0)
        return { w, h, url: c.toDataURL('image/webp', q) }
      },
      [b64, MAX, DARK, LIGHT, q],
    )
    const buf = Buffer.from(url.url.split(',')[1], 'base64')
    if (buf.byteLength <= LIMIT || q === 0.4) {
      writeFileSync(out, buf)
      console.log(`${out}  ${url.w}x${url.h}  ${(statSync(out).size / 1024).toFixed(0)}KB  q=${q}`)
      break
    }
  }
}
await browser.close()
