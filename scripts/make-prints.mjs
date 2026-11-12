/**
 * Photographs for S-03 (pressure), as cyan-duotone prints like the rest of
 * the deck, and S-08 (Innovathon winners), kept in their own colour: the
 * awards are the one moment the deck shows the people as they were. Each
 * first place is shown larger, so it is encoded larger.
 *
 * The winners' originals are 15MB camera files; sips shrinks each first so
 * Chromium is not handed 6000px JPEGs. Everything is cropped to 3:2.
 *
 *   node scripts/make-prints.mjs
 */
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const WIN = `${process.env.HOME}/Documents/Innovathon 2026/Winner Images`
const JOBS = [
  { src: 'media/fogging', out: 'src/assets/pressure-fogging.webp', w: 600 },
  { src: 'media/hospital admission.webp', out: 'src/assets/pressure-admission.webp', w: 600 },
  // Matched to "media/winners ALL.png" by who is on stage.
  { src: `${WIN}/DSC08634_HTPN.jpg`, out: 'src/assets/win-clin-1.webp', w: 924, color: true },
  { src: `${WIN}/DSC08629_HTPN.jpg`, out: 'src/assets/win-clin-2.webp', w: 300, color: true },
  { src: `${WIN}/DSC08626_HTPN.jpg`, out: 'src/assets/win-clin-3.webp', w: 300, color: true },
  { src: `${WIN}/DSC08622_HTPN.jpg`, out: 'src/assets/win-pat-1.webp', w: 924, color: true },
  { src: `${WIN}/DSC08616_HTPN.jpg`, out: 'src/assets/win-pat-2.webp', w: 300, color: true },
  { src: `${WIN}/DSC08609_HTPN.jpg`, out: 'src/assets/win-pat-3.webp', w: 300, color: true },
  { src: `${WIN}/DSC08605_HTPN.jpg`, out: 'src/assets/win-mgmt-1.webp', w: 924, color: true },
  { src: `${WIN}/DSC08601_HTPN.jpg`, out: 'src/assets/win-mgmt-2.webp', w: 300, color: true },
  { src: `${WIN}/DSC08596_HTPN.jpg`, out: 'src/assets/win-mgmt-3.webp', w: 300, color: true },
]
const DARK = [0x0a, 0x18, 0x30]
const LIGHT = [0x7c, 0xc4, 0xf2]

const tmp = mkdtempSync(join(tmpdir(), 'prints-'))
const browser = await chromium.launch()
const page = await browser.newPage()
for (const [k, { src, out, w, color }] of JOBS.entries()) {
  const jpg = join(tmp, `${k}.jpg`)
  execFileSync('sips', ['-s', 'format', 'jpeg', '-Z', '1400', src, '--out', jpg], { stdio: 'ignore' })
  const b64 = readFileSync(jpg).toString('base64')
  const url = await page.evaluate(
    async ([b64, W, DARK, LIGHT, color]) => {
      const img = new Image()
      img.src = `data:image/jpeg;base64,${b64}`
      await img.decode()
      let sw = img.naturalWidth
      let sh = img.naturalHeight
      let sx = 0
      let sy = 0
      if (sw / sh > 1.5) { const n = sh * 1.5; sx = (sw - n) / 2; sw = n } else { const n = sw / 1.5; sy = (sh - n) / 2; sh = n }
      const H = Math.round(W / 1.5)
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      const g = c.getContext('2d')
      g.imageSmoothingQuality = 'high'
      g.drawImage(img, sx, sy, sw, sh, 0, 0, W, H)
      const d = g.getImageData(0, 0, W, H)
      const p = d.data
      for (let i = 0; !color && i < p.length; i += 4) {
        let l = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255
        l = Math.min(1, Math.pow(l, 0.85) * 1.06)
        p[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
        p[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
        p[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
      }
      g.putImageData(d, 0, 0)
      return c.toDataURL('image/webp', color ? 0.72 : 0.62)
    },
    [b64, w, DARK, LIGHT, !!color],
  )
  writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'))
  console.log(`${out}  ${(statSync(out).size / 1024).toFixed(0)}KB`)
}
await browser.close()
rmSync(tmp, { recursive: true, force: true })
