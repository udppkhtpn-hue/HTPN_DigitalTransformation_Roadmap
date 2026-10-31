/**
 * Home-screen icons, drawn in headless Chromium's canvas.
 *
 * "Add to Home Screen" on iPhone and iPad takes its icon from
 * apple-touch-icon.png; without one it shows a blank screenshot. The mark is
 * the deck's own: blueprint navy, a hairline cyan drawing frame, and the
 * name in chalk with a ruled line under it, like a title block.
 *
 *   node scripts/make-icons.mjs
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const SIZES = [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const [out, size] of SIZES) {
  const b64 = await page.evaluate((s) => {
    const c = document.createElement('canvas')
    c.width = c.height = s
    const g = c.getContext('2d')
    g.fillStyle = '#10233f' // --drafting, full bleed: iOS rounds the corners itself
    g.fillRect(0, 0, s, s)
    g.strokeStyle = '#7cc4f2' // --line
    g.lineWidth = Math.max(2, s / 90)
    const m = s * 0.12
    g.strokeRect(m, m, s - 2 * m, s - 2 * m)
    g.fillStyle = '#eef3f6' // --chalk
    g.font = `800 ${s * 0.27}px "Archivo", "Helvetica Neue", Arial, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('HTPN', s / 2, s * 0.46)
    g.strokeStyle = '#f5a524' // --signal
    g.lineWidth = Math.max(2, s / 60)
    g.beginPath()
    g.moveTo(s * 0.3, s * 0.64)
    g.lineTo(s * 0.7, s * 0.64)
    g.stroke()
    return c.toDataURL('image/png').split(',')[1]
  }, size)
  writeFileSync(out, Buffer.from(b64, 'base64'))
  console.log(`${out}  ${size}x${size}`)
}
await browser.close()
