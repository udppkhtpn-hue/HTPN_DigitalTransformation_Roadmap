/** Fails the build if the offline file outgrows what a venue laptop should carry. */
import { statSync } from 'node:fs'

const LIMIT = 2.6 * 1024 * 1024
const size = statSync('dist-single/index.html').size
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`

console.log(`offline file: ${mb(size)} of ${mb(LIMIT)}`)
if (size > LIMIT) {
  console.error(`over budget by ${mb(size - LIMIT)}`)
  process.exit(1)
}
