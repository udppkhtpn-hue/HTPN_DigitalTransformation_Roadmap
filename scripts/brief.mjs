/**
 * Emit BRIEF.md — a compact, content-only handoff for planning elsewhere
 * (a chat with no access to this repo). Generated from scenes.ts so it
 * cannot drift from what the deck actually says. Re-run after content
 * changes: `npm run brief`.
 */
import { writeFileSync } from 'node:fs'
import { SCENES, TOTAL_STEPS, PLANNED_SECONDS, SHEET_COUNT } from '../src/content/scenes.ts'

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** Render a content object as terse `key: value` lines, no JSON noise. */
function flat(v, depth = 0) {
  const pad = '  '.repeat(depth)
  if (v == null) return ''
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== 'object')) return v.join(' · ')
    return '\n' + v.map((x) => `${pad}- ${flat(x, depth + 1).replace(/^\n/, '')}`).join('\n')
  }
  if (typeof v === 'object') {
    return Object.entries(v)
      // Asset filenames are implementation, not content.
      .filter(([k, x]) => x !== '' && x !== undefined && k !== 'video')
      .map(([k, x]) => {
        const body = flat(x, depth + 1)
        return body.startsWith('\n') ? `${k}:${body}` : `${k}: ${body}`
      })
      .join(depth ? '; ' : `\n${pad}`)
  }
  return String(v)
}

const out = []
out.push(`# Built From Within — HTPN Digital Roadmap 2025–2028`)
out.push(``)
out.push(`Five-minute closing keynote, built as a web app. Audience: senior industry`)
out.push(`leaders (Microsoft, Grab, Shopee) at the Executive Digital Leadership Programme.`)
out.push(`Speaker: Dr Ferwahn Fairis bin Ab Karim, Acting Deputy Director, Hospital Tengku`)
out.push(`Permaisuri Norashikin (HTPN), Kajang, Ministry of Health Malaysia.`)
out.push(``)
out.push(`${SHEET_COUNT} sheets · ${TOTAL_STEPS} clicker presses · planned ${mmss(PLANNED_SECONDS)} against a 5:00 slot`)
out.push(``)
out.push(`## Ground rules for this deck`)
out.push(``)
out.push(`- Every figure below is quoted from the source deck. Nothing is estimated or invented.`)
out.push(`- All copy and figures live in one file (\`src/content/scenes.ts\`); the screens read`)
out.push(`  from it and hold no copy of their own.`)
out.push(`- \`steps\` is how many clicker presses happen inside a sheet. Scenes render purely`)
out.push(`  from the step number, so going backwards mid-talk works.`)
out.push(`- Deliberately not used: a news screenshot carrying the Prime Minister's photograph.`)
out.push(`  S-03 typesets that headline and pins the cut-out article beside it instead.`)
out.push(``)
out.push(`## Look, in one paragraph`)
out.push(``)
out.push(`"Blueprint": the hospital is drawn as an architectural sheet while he speaks. Dark`)
out.push(`navy ground, cyan line work, amber for achieved results and the human voice, red`)
out.push(`only for the dengue figure. Numbers arrive as dimensions on a drawing rather than`)
out.push(`stat cards. A title block bottom-right carries the sheet number instead of a`)
out.push(`progress bar. One orchestrated animation per sheet; everything else holds still.`)
out.push(``)
out.push(`## The twelve sheets`)
out.push(``)

for (const s of SCENES) {
  const w = words(s.notes)
  out.push(`### ${s.sheet} ${s.title}`)
  out.push(`${s.steps} press${s.steps > 1 ? 'es' : ''} · ${s.seconds}s · ${w} words spoken (${Math.round((w / s.seconds) * 60)} wpm)`)
  out.push(``)
  out.push(`On screen —`)
  out.push(flat(s.content))
  out.push(``)
  out.push(`Script — ${s.notes}`)
  out.push(``)
}

out.push(`## Totals`)
out.push(``)
out.push(`${SCENES.reduce((n, s) => n + words(s.notes), 0)} words spoken · ${mmss(PLANNED_SECONDS)} planned · ${TOTAL_STEPS} presses`)
out.push(``)
out.push(`## Known open points`)
out.push(``)
out.push(`- Planned running time is over the 5:00 slot. S-07's reel runs 55.9s against ~20s`)
out.push(`  of script, so most of the overrun is there; it sits on its own press and can be`)
out.push(`  cut short by advancing early.`)
out.push(`- S-01 (168 wpm) and S-12 (160 wpm) are the fastest sheets and are the open and`)
out.push(`  the close — the two that most need room to breathe.`)
out.push(`- S-09 phase 1 has no "done when" line; it carries an ACHIEVED stamp instead.`)
out.push(``)

writeFileSync('BRIEF.md', out.join('\n'))
console.log(`BRIEF.md written — ${out.join('\n').length} chars`)
