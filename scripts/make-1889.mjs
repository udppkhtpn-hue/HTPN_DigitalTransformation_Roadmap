/**
 * The 1889 building, as line work on the sheet.
 *
 * The source is white wireframe on its own navy, which would print as a
 * visibly different rectangle on the deck's ground. So, as with the
 * blueprint before it: brightness becomes alpha, the colour becomes --line,
 * and what is left is cyan drawing on the grid.
 *
 * One more thing happens on the way: the source carries a small grey
 * four-point sparkle in its bottom-right corner, the kind an image
 * generator stamps on its output. It is painted out before anything else,
 * because a full-bleed first sheet is the last place to leave it.
 *
 * Done in headless Chromium's canvas; sharp is stuck in a macOS dlopen here.
 *
 *   node scripts/make-1889.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, statSync } from 'node:fs'

const SRC = 'media/HTPN 1889 Animation.png'
const OUT = 'src/assets/htpn-1889.webp'
// Drawn at 1600 wide and shown at 1920 on a sheet that is already screened
// at ~60%: the softening is invisible, and the file is a third the size.
const W = 1600
const Q = 0.5
const LINE = [0x7c, 0xc4, 0xf2] // --line
const SPARKLE = { x: 2480, y: 1296, r: 62 } // in source pixels

const browser = await chromium.launch()
const page = await browser.newPage()
const b64 = readFileSync(SRC).toString('base64')

const result = await page.evaluate(
  async ([b64, W, LINE, SPARKLE, Q]) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const sw = img.naturalWidth
    const sh = img.naturalHeight

    // 1. at full size: paint the watermark out with the background beside it
    const src = document.createElement('canvas')
    src.width = sw
    src.height = sh
    const sg = src.getContext('2d', { willReadFrequently: true })
    sg.drawImage(img, 0, 0)
    const bgPx = sg.getImageData(sw - 40, sh - 40, 1, 1).data
    const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const x0 = SPARKLE.x - SPARKLE.r
    const y0 = SPARKLE.y - SPARKLE.r
    const patch = sg.getImageData(x0, y0, SPARKLE.r * 2, SPARKLE.r * 2)
    let painted = 0
    for (let y = 0; y < SPARKLE.r * 2; y++) {
      for (let x = 0; x < SPARKLE.r * 2; x++) {
        if (Math.hypot(x - SPARKLE.r, y - SPARKLE.r) > SPARKLE.r) continue
        const i = (y * SPARKLE.r * 2 + x) * 4
        const l = lum(patch.data[i], patch.data[i + 1], patch.data[i + 2])
        // the sparkle is mid-grey; the drawing's own lines are near white
        if (l > 45 && l < 215) {
          patch.data[i] = bgPx[0]
          patch.data[i + 1] = bgPx[1]
          patch.data[i + 2] = bgPx[2]
          painted++
        }
      }
    }
    sg.putImageData(patch, x0, y0)

    // 2. down to stage width, smoothly
    const H = Math.round((sh / sw) * W)
    const out = document.createElement('canvas')
    out.width = W
    out.height = H
    const og = out.getContext('2d', { willReadFrequently: true })
    og.imageSmoothingQuality = 'high'
    og.drawImage(src, 0, 0, W, H)

    // 3. brightness -> alpha, colour -> --line
    const d = og.getImageData(0, 0, W, H)
    const p = d.data
    const floor = lum(bgPx[0], bgPx[1], bgPx[2]) + 6
    for (let i = 0; i < p.length; i += 4) {
      const l = lum(p[i], p[i + 1], p[i + 2])
      // a touch of gain: thin lines lose strength in the downscale
      const a = Math.min(1, Math.max(0, ((l - floor) / (255 - floor)) * 1.35))
      p[i] = LINE[0]
      p[i + 1] = LINE[1]
      p[i + 2] = LINE[2]
      // alpha in coarse steps: far fewer distinct values, a far smaller file
      p[i + 3] = Math.round((a * 255) / 8) * 8 > 255 ? 255 : Math.round((a * 255) / 8) * 8
    }
    og.putImageData(d, 0, 0)
    return { H, painted, bg: [...bgPx].slice(0, 3), url: out.toDataURL('image/webp', Q) }
  },
  [b64, W, LINE, SPARKLE, Q],
)

writeFileSync(OUT, Buffer.from(result.url.split(',')[1], 'base64'))
console.log(`${OUT}  ${W}x${result.H}  ${(statSync(OUT).size / 1024).toFixed(0)}KB`)
console.log(`sparkle pixels painted out: ${result.painted}   background sampled: rgb(${result.bg.join(',')})`)
await browser.close()
