/**
 * The six portraits on the "Who we are" sheet, as cyan-duotone heads.
 *
 * Same print as the rest of the deck (--deep to --line by luminance). Each
 * source is a different shape and framing, so every head is cropped to a
 * square by hand: {x, y} is the centre of the face and s the side, both in
 * pixels of the source scaled so its height is 500. The sheet shows them
 * in 150px circles; 300px is 2x.
 *
 *   node scripts/make-team.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, statSync } from 'node:fs'

const IMAGES = '/Users/ferwahnfairis/innovathon2026/images'
const MORE = 'media/More photos'
const JOBS = [
  { out: 'team-azhar', src: `${IMAGES}/dr-azhar-black.png`, x: 232, y: 137, s: 321 },
  { out: 'team-fairis', src: `${IMAGES}/fairis-black.png`, x: 250, y: 172, s: 350 },
  { out: 'team-naim', src: `${IMAGES}/naim.png`, x: 179, y: 155, s: 321 },
  { out: 'team-syafiz', src: `${IMAGES}/syafiz.png`, x: 190, y: 167, s: 321 },
  { out: 'team-megat', src: `${MORE}/Megat Hafiz.jpg`, x: 179, y: 149, s: 321 },
  { out: 'team-kenny', src: `${MORE}/Kenny.png`, x: 188, y: 205, s: 345 },
]
const DARK = [0x0a, 0x18, 0x30]
const LIGHT = [0x7c, 0xc4, 0xf2]
const SIZE = 300

const browser = await chromium.launch()
const page = await browser.newPage()
for (const { out, src, x, y, s } of JOBS) {
  const mime = src.endsWith('.png') ? 'image/png' : 'image/jpeg'
  const b64 = readFileSync(src).toString('base64')
  const url = await page.evaluate(
    async ([b64, mime, x, y, s, SIZE, DARK, LIGHT]) => {
      const img = new Image()
      img.src = `data:${mime};base64,${b64}`
      await img.decode()
      const k = img.naturalHeight / 500
      let side = Math.min(s * k, img.naturalWidth, img.naturalHeight)
      let sx = Math.min(Math.max(x * k - side / 2, 0), img.naturalWidth - side)
      let sy = Math.min(Math.max(y * k - side / 2, 0), img.naturalHeight - side)
      const c = document.createElement('canvas')
      c.width = c.height = SIZE
      const g = c.getContext('2d')
      g.imageSmoothingQuality = 'high'
      g.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE)
      const d = g.getImageData(0, 0, SIZE, SIZE)
      const p = d.data
      for (let i = 0; i < p.length; i += 4) {
        let l = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255
        l = Math.min(1, Math.pow(l, 0.85) * 1.06)
        p[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
        p[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
        p[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
      }
      g.putImageData(d, 0, 0)
      return c.toDataURL('image/webp', 0.78)
    },
    [b64, mime, x, y, s, SIZE, DARK, LIGHT],
  )
  const file = `src/assets/${out}.webp`
  writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'))
  console.log(`${file}  ${(statSync(file).size / 1024).toFixed(0)}KB`)
}
await browser.close()
