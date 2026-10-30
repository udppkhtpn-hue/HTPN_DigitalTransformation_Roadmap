/**
 * Copy large media into the build output, after Vite has finished.
 *
 * The video deliberately does not live in public/. Vite's css-post pass
 * scans whatever is in the output directory and spent 176 seconds on this
 * one 13.5MB file — the same build takes 77ms without it. Copying it in
 * afterwards keeps the build instant and the bundler out of the way of a
 * binary it has no reason to touch.
 */
import { cpSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const out = process.argv[2]
if (!out) {
  console.error('usage: copy-media.mjs <outDir>')
  process.exit(1)
}

mkdirSync(out, { recursive: true })
for (const name of readdirSync('media')) {
  cpSync(join('media', name), join(out, name))
  const kb = statSync(join('media', name)).size / 1024
  console.log(`media  ${name}  ${(kb / 1024).toFixed(1)}MB`)
}
