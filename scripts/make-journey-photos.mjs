/**
 * Photographs for the Oxford journey's stops, as cyan-duotone prints.
 *
 * The same treatment as make-kik.mjs ("never full colour"): luminance mapped
 * from --deep to --line, lifted a touch so faces do not sink. Done with sharp
 * here, since these are plain JPEGs and sharp loads on Windows.
 *
 *   node scripts/make-journey-photos.mjs
 */
import sharp from 'sharp'
import { statSync } from 'node:fs'

const SRC = 'media/More photos'
const JOBS = [
  { src: 'Files.jpeg', out: 'src/assets/journey-files.webp' },
  { src: 'Nurse BYOD.jpg', out: 'src/assets/journey-byod.webp' },
  { src: 'PreWorkshop.jpeg', out: 'src/assets/journey-preworkshop.webp' },
  { src: 'Judges.jpeg', out: 'src/assets/journey-judges.webp' },
]
const MAX = 1400
const DARK = [0x0a, 0x18, 0x30] // --deep
const LIGHT = [0x7c, 0xc4, 0xf2] // --line
const LIMIT = 300 * 1024

for (const { src, out } of JOBS) {
  const { data, info } = await sharp(`${SRC}/${src}`)
    .rotate()
    .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 3) {
    // Rec. 709 luma, lifted a touch so faces do not sink into the ground.
    let l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
    l = Math.min(1, Math.pow(l, 0.85) * 1.06)
    data[i] = DARK[0] + (LIGHT[0] - DARK[0]) * l
    data[i + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * l
    data[i + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * l
  }
  const img = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } })
  for (const quality of [82, 70, 60, 50, 40]) {
    const buf = await img.clone().webp({ quality }).toBuffer()
    if (buf.byteLength <= LIMIT || quality === 40) {
      await sharp(buf).toFile(out)
      console.log(`${out}  ${info.width}x${info.height}  ${(statSync(out).size / 1024).toFixed(0)}KB  q${quality}`)
      break
    }
  }
}
