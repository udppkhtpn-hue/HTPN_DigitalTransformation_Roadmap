/**
 * The tentative two-day syllabus (media/Sylabus tentative.png), as a cyan
 * duotone print for S-04. Same mapping as make-kik.mjs and make-photos.mjs:
 * the white page becomes --line, the black type --deep. It is a document,
 * not a photograph, so it is kept sharp: 2x of its on-stage size, high quality.
 *
 *   node scripts/make-syllabus.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, statSync } from 'node:fs'

const SRC = 'media/Sylabus tentative.png'
const OUT = 'src/assets/syllabus.webp'
const DARK = [0x0a, 0x18, 0x30]
const LIGHT = [0x7c, 0xc4, 0xf2]

const browser = await chromium.launch()
const page = await browser.newPage()
const b64 = readFileSync(SRC).toString('base64')
const r = await page.evaluate(
  async ([b64, DARK, LIGHT]) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    // Shown 490px wide on the stage; 1020 is 2x, enough for a projector.
    const k = Math.min(1, 1020 / img.naturalWidth)
    const c = document.createElement('canvas')
    c.width = Math.round(img.naturalWidth * k)
    c.height = Math.round(img.naturalHeight * k)
    const g = c.getContext('2d')
    g.imageSmoothingQuality = 'high'
    g.drawImage(img, 0, 0, c.width, c.height)
    const d = g.getImageData(0, 0, c.width, c.height)
    const p = d.data
    for (let i = 0; i < p.length; i += 4) {
      const l = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255
      p[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
      p[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
      p[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
    }
    g.putImageData(d, 0, 0)
    return { w: c.width, h: c.height, url: c.toDataURL('image/webp', 0.72) }
  },
  [b64, DARK, LIGHT],
)
writeFileSync(OUT, Buffer.from(r.url.split(',')[1], 'base64'))
console.log(`${OUT}  ${r.w}x${r.h}  ${(statSync(OUT).size / 1024).toFixed(0)}KB`)
await browser.close()
