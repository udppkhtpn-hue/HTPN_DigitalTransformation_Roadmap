/**
 * Two documents for S-04, as cyan duotone prints: the tentative two-day
 * syllabus (media/Sylabus tentative.png) and a screenshot of the workshop
 * Padlet (media/Padlet HPD Screenshot.png), cropped to the board itself. Same mapping as make-kik.mjs and make-photos.mjs:
 * the white page becomes --line, the black type --deep. It is a document,
 * not a photograph, so it is kept sharp: 2x of its on-stage size, high quality.
 *
 *   node scripts/make-syllabus.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, statSync } from 'node:fs'

const JOBS = [
  { src: 'media/Sylabus tentative.png', out: 'src/assets/syllabus.webp', maxW: 1020, q: 0.72 },
  // Browser tabs above and empty beach below are cut away; 2x of its 540px.
  { src: 'media/Padlet HPD Screenshot.png', out: 'src/assets/padlet.webp', maxW: 1080, q: 0.7, crop: [0, 190, 2880, 1050] },
]
const DARK = [0x0a, 0x18, 0x30]
const LIGHT = [0x7c, 0xc4, 0xf2]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const { src, out, maxW, q, crop } of JOBS) {
  const b64 = readFileSync(src).toString('base64')
  const r = await page.evaluate(
    async ([b64, DARK, LIGHT, maxW, q, crop]) => {
      const img = new Image()
      img.src = `data:image/png;base64,${b64}`
      await img.decode()
      const [sx, sy, sw, sh] = crop ?? [0, 0, img.naturalWidth, img.naturalHeight]
      const k = Math.min(1, maxW / sw)
      const c = document.createElement('canvas')
      c.width = Math.round(sw * k)
      c.height = Math.round(sh * k)
      const g = c.getContext('2d')
      g.imageSmoothingQuality = 'high'
      g.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height)
      const d = g.getImageData(0, 0, c.width, c.height)
      const p = d.data
      for (let i = 0; i < p.length; i += 4) {
        const l = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255
        p[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
        p[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
        p[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
      }
      g.putImageData(d, 0, 0)
      return { w: c.width, h: c.height, url: c.toDataURL('image/webp', q) }
    },
    [b64, DARK, LIGHT, maxW, q, crop ?? null],
  )
  writeFileSync(out, Buffer.from(r.url.split(',')[1], 'base64'))
  console.log(`${out}  ${r.w}x${r.h}  ${(statSync(out).size / 1024).toFixed(0)}KB`)
}
await browser.close()
