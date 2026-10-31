/** Fails the build if the offline file outgrows what a venue laptop should carry. */
import { statSync } from 'node:fs'

// 3.1MB since the 1889 building joined sheet 1 (a 284KB drawing, inlined).
// Images decode during the boot screen, not on stage, and perf is re-run
// against the bigger file, so the limit moves rather than the drawing.
const LIMIT = 3.1 * 1024 * 1024
const size = statSync('dist-single/index.html').size
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`

console.log(`offline file: ${mb(size)} of ${mb(LIMIT)}`)
if (size > LIMIT) {
  console.error(`over budget by ${mb(size - LIMIT)}`)
  process.exit(1)
}
