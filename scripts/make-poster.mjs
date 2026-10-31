/**
 * A still from the reel, used as S-07's poster frame.
 *
 * It shows before playback starts, and it is what the sheet falls back to
 * if the video cannot be loaded at all — which is the normal case on the
 * Pages build, where the 14MB file is deliberately not published.
 *
 * Taken from the final wide shot of the hall: the one frame that carries
 * the same argument as the reel.
 */
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const TMP = 'node_modules/.cache/poster.png'
execFileSync('ffmpeg', [
  '-nostdin', '-v', 'error', '-ss', '55.4', '-i', 'media/innovathon.mp4',
  '-frames:v', '1', '-y', TMP,
])
const buf = await sharp(TMP).webp({ quality: 80 }).toBuffer()
await sharp(buf).toFile('src/assets/innovathon-still.webp')
const m = await sharp(buf).metadata()
console.log(`poster ${m.width}x${m.height}  ${(buf.byteLength / 1024).toFixed(0)}KB`)
