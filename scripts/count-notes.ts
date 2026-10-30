/** Word count of the spoken script, per scene and in total. Target 620–700. */
import { SCENES, PLANNED_SECONDS, TOTAL_STEPS } from '../src/content/scenes.ts'

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

let total = 0
console.log('sheet  steps  secs  words  wpm   title')
for (const s of SCENES) {
  const w = words(s.notes)
  total += w
  const wpm = Math.round((w / s.seconds) * 60)
  console.log(
    `${s.sheet}   ${String(s.steps).padStart(2)}    ${String(s.seconds).padStart(3)}   ${String(w).padStart(4)}   ${String(wpm).padStart(3)}   ${s.title}`,
  )
}
console.log('')
console.log(`total words      ${total}`)
console.log(`planned time     ${PLANNED_SECONDS}s  (${Math.floor(PLANNED_SECONDS / 60)}:${String(PLANNED_SECONDS % 60).padStart(2, '0')})`)
console.log(`clicker presses  ${TOTAL_STEPS}`)
console.log(`overall pace     ${Math.round((total / PLANNED_SECONDS) * 60)} wpm`)
console.log(`target 620–700   ${total >= 620 && total <= 700 ? 'IN RANGE' : total < 620 ? `UNDER by ${620 - total}` : `OVER by ${total - 700}`}`)
