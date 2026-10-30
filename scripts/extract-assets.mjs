/**
 * Pull the two images we use out of the original deck and optimise them.
 *
 *   ppt/media/image18.png → blueprint-htpn.webp    (the building wireframe)
 *   ppt/media/image17.png → innovathon-poster.webp (the breakout poster)
 *
 * image4.png is the news screenshot with the minister's photo. It is never
 * read, never copied, and never referenced — S-03 typesets that headline.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const PPTX =
  process.env.PPTX ??
  `${process.env.HOME}/Downloads/Dr Ferwahn Fairis HTPN Kajang_Built From Within HTPN Digital Roadmap 2025–2028.pptx`

const TMP = 'node_modules/.cache/pptx-media'
const OUT = 'src/assets'
const MAX = 1800
const BUDGET = 350 * 1024
// The blueprint is the one image carrying an alpha channel, which roughly
// doubles its weight, and it is the hero of S-01 and S-12. It gets its own
// width and a larger allowance; everything else stays at 350KB.
const BLUEPRINT_W = 1500
const BLUEPRINT_BUDGET = 420 * 1024

if (!existsSync(PPTX)) {
  console.error(`Deck not found:\n  ${PPTX}\nSet PPTX=/path/to/deck.pptx`)
  process.exit(1)
}

rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })
mkdirSync(OUT, { recursive: true })

execFileSync('unzip', [
  '-j', '-o', PPTX,
  'ppt/media/image18.png', 'ppt/media/image17.png',
  '-d', TMP,
], { stdio: 'ignore' })

/** Encode at the highest quality that still fits the budget. */
async function encode(pipeline, out, label, budget = BUDGET) {
  // Alpha is where the line detail lives, so it is stepped down alongside
  // the colour quality rather than held at maximum.
  const ladder = [
    [86, 92], [82, 86], [78, 78], [74, 70], [72, 60], [68, 52], [64, 45],
  ]
  for (const [quality, alphaQuality] of ladder) {
    const buf = await pipeline.clone().webp({ quality, effort: 6, alphaQuality }).toBuffer()
    if (buf.byteLength <= budget || quality === 64) {
      // Write the encoded bytes straight out. Re-reading them through sharp
      // just to save the file re-encodes and drops the alpha channel.
      writeFileSync(join(OUT, out), buf)
      const { width, height, hasAlpha } = await sharp(buf).metadata()
      if (hasAlpha === false && out.startsWith('blueprint'))
        throw new Error('blueprint lost its alpha channel')
      console.log(
        `${label.padEnd(24)} ${width}×${height}  q${quality}/a${alphaQuality}  ${(buf.byteLength / 1024).toFixed(0)}KB`,
      )
      return
    }
  }
}

// The building. Crop 160px off the right edge, which is empty road and
// carries the generator's watermark, then fit inside MAX.
const b = sharp(join(TMP, 'image18.png'))
const bm = await b.metadata()
const cropped = b
  .extract({ left: 0, top: 0, width: bm.width - 160, height: bm.height })
  .resize({ width: BLUEPRINT_W, height: BLUEPRINT_W, fit: 'inside', withoutEnlargement: true })

// The drawing is cyan line work on a navy field. Turning that field into
// transparency — alpha taken from luminance — lets the building sit directly
// on the sheet's own grid with no plate behind it and no blend mode. A blend
// mode cannot do this: `screen` lightens the navy instead of removing it,
// which leaves a visible rectangle around the drawing.
const rgb = await cropped
  .clone()
  .ensureAlpha()
  .toColourspace('srgb')
  .raw()
  .toBuffer({ resolveWithObject: true })
const { width: bw, height: bh, channels } = rgb.info

// Write alpha straight into the RGBA buffer. Going through removeAlpha() and
// joinChannel() silently left the image fully opaque; setting the fourth byte
// per pixel is unambiguous, and the assertion in encode() catches a regression.
const FLOOR = 46 // the navy field measures ~40, so the floor has to clear it
const CEIL = 205
for (let i = 0; i < bw * bh; i++) {
  const o = i * channels
  const lum =
    0.2126 * rgb.data[o] + 0.7152 * rgb.data[o + 1] + 0.0722 * rgb.data[o + 2]
  const a = Math.max(0, (lum - FLOOR) / (CEIL - FLOOR))
  rgb.data[o + 3] = Math.round(Math.min(1, Math.pow(a, 0.72)) * 255)
}

await encode(
  sharp(rgb.data, { raw: { width: bw, height: bh, channels } }),
  'blueprint-htpn.webp',
  'blueprint-htpn',
  BLUEPRINT_BUDGET,
)

// The poster, as shot.
await encode(
  sharp(join(TMP, 'image17.png')).resize({
    width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true,
  }),
  'innovathon-poster.webp',
  'innovathon-poster',
)

rmSync(TMP, { recursive: true, force: true })
