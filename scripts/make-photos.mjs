/**
 * The photo reels on S-04, S-05 and S-06, as cyan-duotone prints.
 *
 * Same treatment as make-kik.mjs ("never full colour"): luminance mapped from
 * --deep to --line. Sources are the phone originals in media/More photos,
 * mostly HEIC, which Chromium cannot decode, so macOS's own sips converts
 * each to a JPEG first. Order within a reel is capture order.
 *
 * Extreme shapes are centre-cropped into 3:4 … 16:9 (portraits keep their
 * upper part, where the faces are), so no frame in a strip is a sliver.
 *
 * Writes src/assets/photos/*.webp and src/content/photos.ts, which the
 * scenes import. Re-run after changing the lists below.
 *
 *   node scripts/make-photos.mjs
 */
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SRC = 'media/More photos'
const OUT = 'src/assets/photos'

// `box` is the encoded size along the reel's fixed side: height for the
// horizontal strips, width for the vertical reel. About 2x what is shown.
const REELS = {
  // 11 Apr – 29 May 2025: Monash, EDLP, LSE.
  leaders: {
    box: { h: 480 },
    files: [
      'IMG_9259.heic',
      'IMG_9261.heic',
      'IMG_9266.heic',
      'FullSizeRender.HEIC',
      'IMG_9649.HEIC',
      '964e60f4-f79f-4a55-914f-9467ad42e484 2.JPG',
      'IMG_0194.HEIC',
    ],
  },
  // Oct 2025 – May 2026, on days with no external session on S-06. Two
  // near-identical frames are left out: IMG_3815 (of IMG_3812) and IMG_4369
  // (of IMG_4364), taken seconds apart; side by side in a reel they read
  // as a stutter.
  training: {
    box: { w: 860 },
    files: [
      'IMG_2199 3.HEIC',
      'IMG_3166 3.HEIC',
      '3175e7d9-61f9-44b6-a009-1beefbee2f4e 3.jpg',
      'IMG_3739 3.HEIC',
      'eedf493c-c739-4f03-966a-76599dac8a8e 3.JPG',
      'IMG_3812.HEIC',
      'CBC38D8B-C57F-45B6-9DF3-985F166D43A6 3.JPG',
      'IMG_3860 3.HEIC',
      '8ced4153-1b28-418f-88cb-1c2d408df95c 3.JPG',
      'IMG_4364.HEIC',
      'IMG_5002.HEIC',
    ],
  },
  // Nov 2025 – Oct 2026, each taken on the dates of an external session.
  sessions: {
    box: { h: 320 },
    files: [
      'IMG_2332 3.HEIC', // 1  Kepala Batas, 5–6 Nov 2025
      'IMG_3353 3.HEIC', // 2  Sultanah Aminah, 5 Feb 2026
      'IMG_4233.HEIC', // 4  Pulau Pinang, 30–31 Mar 2026
      'IMG_4247.jpg', // 4
      'c4c3a7f6-173a-41ae-b8c3-4ca5f9351968.jpg', // 6  Kuching, 12–13 May 2026
      'IMG_5396.HEIC', // 9  Alor Setar, 23–24 Jun 2026
      'IMG_5413.heic', // 9
      'IMG_5515.HEIC', // 10 Family Medicine, 6–7 Jul 2026
      'IMG_7101.heic', // 14 Johor Bahru, 8–9 Oct 2026
      'IMG_7112.HEIC', // 14
    ],
  },
}

const MIN_AR = 3 / 4
const MAX_AR = 16 / 9
const DARK = [0x0a, 0x18, 0x30] // --deep
const LIGHT = [0x7c, 0xc4, 0xf2] // --line
const Q = 0.55

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
const tmp = mkdtempSync(join(tmpdir(), 'photos-'))

const browser = await chromium.launch()
const page = await browser.newPage()
const manifest = {}
let total = 0

for (const [reel, { box, files }] of Object.entries(REELS)) {
  manifest[reel] = []
  for (const [k, file] of files.entries()) {
    const jpg = join(tmp, `${reel}-${k}.jpg`)
    execFileSync('sips', ['-s', 'format', 'jpeg', '-Z', '2400', join(SRC, file), '--out', jpg], {
      stdio: 'ignore',
    })
    const b64 = readFileSync(jpg).toString('base64')
    const r = await page.evaluate(
      async ([b64, box, MIN_AR, MAX_AR, DARK, LIGHT, Q]) => {
        const img = new Image()
        img.src = `data:image/jpeg;base64,${b64}`
        await img.decode()
        let sw = img.naturalWidth
        let sh = img.naturalHeight
        let sx = 0
        let sy = 0
        if (sw / sh > MAX_AR) {
          const w = sh * MAX_AR
          sx = (sw - w) / 2
          sw = w
        } else if (sw / sh < MIN_AR) {
          const h = sw / MIN_AR
          sy = (sh - h) * 0.3
          sh = h
        }
        const k = box.h ? box.h / sh : box.w / sw
        const w = Math.round(sw * k)
        const h = Math.round(sh * k)
        const c = document.createElement('canvas')
        c.width = w
        c.height = h
        const g = c.getContext('2d')
        g.imageSmoothingQuality = 'high'
        g.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
        const d = g.getImageData(0, 0, w, h)
        const p = d.data
        for (let i = 0; i < p.length; i += 4) {
          let l = (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255
          l = Math.min(1, Math.pow(l, 0.85) * 1.06)
          p[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
          p[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
          p[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
        }
        g.putImageData(d, 0, 0)
        return { w, h, url: c.toDataURL('image/webp', Q) }
      },
      [b64, box, MIN_AR, MAX_AR, DARK, LIGHT, Q],
    )
    const name = `${reel}-${String(k + 1).padStart(2, '0')}.webp`
    writeFileSync(join(OUT, name), Buffer.from(r.url.split(',')[1], 'base64'))
    const kb = statSync(join(OUT, name)).size / 1024
    total += kb
    console.log(`${name}  ${r.w}x${r.h}  ${kb.toFixed(0)}KB  ← ${file}`)
    manifest[reel].push({ name, w: r.w, h: r.h })
  }
}
await browser.close()
rmSync(tmp, { recursive: true, force: true })

const ident = (n) => n.replace(/\.webp$/, '').replace(/-(\w)/g, (_, c) => c.toUpperCase())
const lines = [
  '// Generated by scripts/make-photos.mjs. Do not edit by hand.',
  '',
  'export interface Photo {',
  '  src: string',
  '  w: number',
  '  h: number',
  '}',
  '',
]
for (const list of Object.values(manifest)) {
  for (const p of list) lines.push(`import ${ident(p.name)} from '../assets/photos/${p.name}'`)
}
lines.push('')
for (const [reel, list] of Object.entries(manifest)) {
  lines.push(`export const ${reel.toUpperCase()}: Photo[] = [`)
  for (const p of list) lines.push(`  { src: ${ident(p.name)}, w: ${p.w}, h: ${p.h} },`)
  lines.push(']', '')
}
writeFileSync('src/content/photos.ts', lines.join('\n'))
console.log(`total ${total.toFixed(0)}KB`)
