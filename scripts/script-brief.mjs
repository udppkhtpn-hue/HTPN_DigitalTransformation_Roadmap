/**
 * Emit SCRIPT_BRIEF.md: everything an LLM needs to write the spoken script.
 *
 * Paste the whole file into a chat. It carries its own instructions, the
 * occasion and audience, and then every sheet in order: what appears on
 * each clicker press, the on-screen text and figures, the planned time and
 * word budget, and the current notes as a starting draft.
 *
 * Generated from scenes.ts so it cannot drift from the deck. The press-by-
 * press descriptions below are written by hand, so the script checks that
 * each sheet lists exactly as many presses as the sheet really has, and
 * stops if a sheet has been added, removed or re-stepped without updating
 * them.
 *
 *   npm run script-brief
 */
import { writeFileSync } from 'node:fs'
import { SCENES, TOTAL_STEPS, PLANNED_SECONDS, SHEET_COUNT } from '../src/content/scenes.ts'

const SLOT = '5:00'
const WPM = 140

/** What the room sees on each press. Press 1 is the sheet arriving. */
const PRESSES = {
  'cold-open': [
    'The sheet arrives on its own and runs for about seven seconds: three lines land one after another, then fade; the original 1889 hospital building draws in behind; the title, subtitle and byline appear.',
  ],
  'three-forces': [
    'Pressure: +128% in red, dengue admissions, June 2026 vs the year before; then, under it, births a month 200+ → 500+, almost tripled since the move from the old building to the new Women & Child Centre.',
    'Vendor lock-in.',
    'Opportunity, then the footer line underneath all three.',
  ],
  'ahead-of-mandate': [
    'The Cabinet directive of 5 June 2026: the headline set large, with the newspaper cutting pinned beside it.',
    'The timeline draws back to April 2025, measures the 14 months between, and the three reasons appear one by one.',
  ],
  'how-we-led-it': [
    "Kotter's 8-Step Change Model, as a single drawn graphic (eight rising steps: sense of urgency, guiding coalition, strategic vision, volunteer army, removing barriers, easy wins, increase the pace, institute change; grouped as create the right climate, engage and enable others, implement and sustain), alone on the sheet.",
    'The model goes. The framework is named and four numbered boxes are pencilled in; only stage 1, "Leaders learn first", fills in. Over the empty boxes 2 to 4 a panel runs the team as a looping kinetic sequence, one large card at a time: the Healthcare Intelligence Office (established April 2025, a dedicated in-house team); each of the six with portrait, name and role; "Clinicians and nursing staff leading digital transformation from within — Insourcing."; the seven programmes they studied, each stamped Completed or Ongoing with the faces of who took it; then "Credibility before capability transfer". Under it a strip of photographs from 11 Apr – 29 May 2025 (Monash, the EDLP group, certificates) drifts slowly across the sheet, with a leader line back up to box 1.',
    'Stage 2, "Our own syllabus" (Google Workspace, vibe coding and web application development), fills in, and the tentative two-day syllabus (Day 1: AI literacy, NotebookLM, productivity prompting, interactive dashboard; Day 2: AI pipeline concepts, landing page, group quick-win projects, presentations, closing) is pinned up on the right. The photographs keep drifting.',
    'The syllabus goes. Stage 3, "Quick wins" (everyone leaves having built something), fills in, with a screenshot of the workshop Padlet and a QR code to it beside the photographs.',
    'Stage 4, "Reward the builders", fills in.',
    'The photographs give way to "85% outsourced", which a split-flap board turns into "85% insourced" after a beat, then the DBS Bank caption.',
  ],
  results: [
    'All four figures count up in sequence, then the footnote. A column of photographs from in-house training sessions (Oct 2025 – May 2026) drifts upwards on the right the whole time. One press for the whole sheet.',
  ],
  'where-weve-taught': [
    'A map of Malaysia draws itself; dashed arcs fly from Kajang to each of the 15 sites in date order while a month counter and a 1-to-15 tally tick, each site naming itself as it lands; a magnifier labelled KLANG VALLEY separates the nine sites clustered there; then the subline. The arcs run at half speed (about 16 seconds for all 15), hold for 4 seconds, then fly again from the start, looping until the next click. Beside the headline, a small strip of photographs taken on the dates of the external sessions (Nov 2025 – Oct 2026) drifts across.',
    'Cyan rings pulse on the sites now running tools built on the model, and "We taught. They built." appears.',
  ],
  portfolio: [
    'A split-flap departures board, every character its own flipping tile, ten rows a page: "Apps 01–10 of 50", each row with its number, name and category (Patient journey in amber, Clinician journey in white, Management productivity in blue). App names built at HTPN are white, those built by the hospitals we taught are blue, with a key: 17 built at HTPN, 33 built by the hospitals we taught. The showcase QR code and "Built by clinicians, for clinicians." sit underneath.',
    'The same board turns over to apps 11–20, clinician journey.',
    'Apps 21–30, into management productivity.',
    'Apps 31–40.',
    'Apps 41–50.',
  ],
  innovathon: [
    'The Innovathon reel plays, framed, alone on the sheet. It runs for about a minute.',
    'The reel expands behind a dark scrim and keeps running; the event title, date and the four counters build in front of it, then press coverage and the list of adopting sites.',
  ],
  'the-gap': [
    'Fifty drifting dots, one per app, under the headline "50 apps ≠ one hospital".',
    'The dots dim and the first gap, "Fragmentation", appears.',
    'The second gap, "Sustainability".',
    'The third gap, "Governance".',
    'The fourth gap, "Evidence", then the MIT CISR lens line.',
  ],
  'national-picture': [
    '155 circles, one per MOH hospital; the 20 that have THIS fill in; the counters 20 and 135.',
    'The rest light up year by year in four tones (+16, +26, +44, +49) until all 155 are lit; RM 1 billion appears.',
    'The circles dim; the line about work-process coverage, the three sites, and the closing line in amber.',
  ],
  'vision-2028': [
    'The vision sentence writes itself in, line by line.',
    'A scale line draws across the sheet and four hospital outlines stand on it, smallest to largest, labelled by type; "One ministry. Very different hospitals."',
    'Three concentric reach rings draw out from an HTPN marker, each labelled; "Build locally. Scale what travels."',
    'The five objectives appear along the bottom, each verb slamming in.',
  ],
  roadmap: [
    'Phase 1, Ignite, with an ACHIEVED stamp; two rails: HTPN above, KKM below.',
    'A pin drops on Phase 2, Protect & Showcase; a card opens beside it with two photos from the 19 October workshop, the speakers, and a "Follow-up done" stamp.',
    'Phase 3, Consolidate & Govern.',
    'Phase 4, Integrate.',
    'Phase 5, Predict & Scale.',
  ],
  'phase-registry': [
    'The fifty dots from the gap sheet return scattered, then sort into three tier bands, ruled lighter to heavier, each labelled.',
    'The footer line in amber.',
  ],
  'phase-foundations': [
    'The hospital drawn as a section view; four piles drive down under it one at a time, each labelled; an amber tick on Registration.',
    'A dimension line across the base stamps the "Done when" line.',
  ],
  'command-centre': [
    'The fifty dots are pulled onto six streams that converge on a hub labelled HTPN Command Centre; pulses travel along the streams.',
    'The hub turns red with an alert, and the evidence lines appear.',
  ],
  'command-centre-build': [
    'A twelve-month dimension line, Jul 2027 to Jun 2028; two milestones stamped in order.',
    'Four governance rules appear as pencilled notes, then the "Done when" line.',
  ],
  'predict-and-scale': [
    'The headline widens from "seeing now" to "anticipating next", then the list beneath it.',
  ],
  'measuring-success': [
    'A schedule table draws on row by row: five phases and their indicators, Phase 1 in amber because it has happened; then the note underneath.',
  ],
  risks: [
    'A red rubber stamp lands: "The biggest risk is already here: key people." The first register row appears in red beneath it.',
    'The rest of the risk register draws in as a table: risk and mitigation.',
  ],
  'lesson-and-close': [
    'The lesson: "Phase 1 was won through culture."',
    '"culture" is struck through by hand; the corrected sentence and the three lines appear.',
    'The close: "Built from within. Shared with all of KKM.", "Thank you.", and two QR codes.',
  ],
}

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** Content as terse `key: value` lines. Asset filenames are implementation, not content. */
/** Content fields that exist in the data but are not drawn on that sheet. */
const OFF_SCREEN = {
  // On the roadmap, "done when" lives in the speaker cues: it did not fit at 28px.
  roadmap: ['doneWhen'],
  // Photo date ranges: an accessible label there, not printed on the sheet.
  results: ['photos'],
  'where-weve-taught': ['photos'],
}

function flat(v, depth = 0, hide = []) {
  const pad = '  '.repeat(depth)
  if (v == null) return ''
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== 'object')) return v.join(' · ')
    return '\n' + v.map((x) => `${pad}- ${flat(x, depth + 1, hide).replace(/^\n/, '')}`).join('\n')
  }
  if (typeof v === 'object') {
    return Object.entries(v)
      .filter(([k, x]) => x !== '' && x !== undefined && !['video', 'image', 'speed', ...hide].includes(k))
      .map(([k, x]) => {
        const body = flat(x, depth + 1, hide)
        return body.startsWith('\n') ? `${k}:${body}` : `${k}: ${body}`
      })
      .join(depth ? '; ' : `\n${pad}`)
  }
  return String(v)
}

// Stop if the hand-written press list has drifted from the deck.
const problems = []
for (const s of SCENES) {
  const p = PRESSES[s.id]
  if (!p) problems.push(`${s.sheet} ${s.id}: no press description`)
  else if (p.length !== s.steps) problems.push(`${s.sheet} ${s.id}: ${p.length} described, ${s.steps} real`)
}
if (problems.length) {
  console.error('SCRIPT_BRIEF.md not written; press descriptions are out of date:\n  ' + problems.join('\n  '))
  process.exit(1)
}

// The cover credits the office; the person on stage is still named here.
const speaker =
  'Dr Ferwahn Fairis bin Ab Karim · Acting Deputy Director, Hospital Tengku Permaisuri Norashikin, Kajang · Ministry of Health Malaysia, presenting for the Healthcare Intelligence Office'
const out = []
out.push(`# Script brief: "Built From Within", HTPN Digital Roadmap 2025–2028`)
out.push(``)
out.push(`Paste this whole file into an LLM. It contains instructions, then the deck sheet by sheet: what appears on each clicker press, the text and figures on screen, the time planned, and the current notes as a starting draft.`)
out.push(``)
out.push(`## Instructions for the LLM`)
out.push(``)
out.push(`You are writing the spoken script for a closing keynote. The speaker presents a web-based slide deck and advances it with a clicker. Every line you write must be cued to a press.`)
out.push(``)
out.push(`**Target length: ${SLOT}** ← the speaking slot. Change this line if you want a different length.`)
out.push(``)
out.push(`1. **Facts.** Use only the facts and figures in this file. Do not add, estimate, round or update any number, name or date. If something seems missing, say so instead of filling it in.`)
out.push(`2. **Numbers aloud.** Write numbers the way they are spoken ("a hundred and thirty-five", "one billion ringgit"), as the current notes do.`)
out.push(`3. **Voice.** First person, plain, confident, short sentences. A clinician-leader speaking to industry leaders, not a vendor pitching. No jargon, no hype words, no rhetorical questions to the audience.`)
out.push(`4. **Screen and voice.** The audience reads the screen. Don't read the on-screen text out word for word; say what it means, and let the screen carry the detail.`)
out.push(`5. **Pace.** Write at ${WPM} words a minute (about ${Math.round(WPM / 60 * 10) / 10} words a second). For every sheet give its word count and spoken time, and give the total at the end.`)
out.push(`6. **Fit the target.** The planned times below add up to **${mmss(PLANNED_SECONDS)}**, against a target of ${SLOT}. If they don't fit, first propose which sheets to shorten, merge or skip (and why), wait for approval, then write. Don't silently drop a sheet.`)
out.push(`7. **Format.** For each sheet:`)
out.push(``)
out.push('```')
out.push(`### S-07 The portfolio  (12s, 28 words)`)
out.push(`[Press 1: three lanes of app names and the showcase QR code]`)
out.push(`These are real tools, used every day...`)
out.push('```')
out.push(``)
out.push(`8. **Hand-overs.** Make the last line of each sheet lead into the next press, so the speaker clicks on a natural beat.`)
out.push(``)
out.push(`## The occasion`)
out.push(``)
out.push(`- **Event:** closing keynote of the Executive Digital Leadership Programme.`)
out.push(`- **Audience:** senior industry leaders (Microsoft, Grab, Shopee and others), some of whom judged the Innovathon. Not clinicians; they know platforms and scale, not Malaysian public hospitals.`)
out.push(`- **Speaker:** ${speaker}.`)
out.push(`- **The argument in one line:** a 135-year-old public hospital built its own digital tools from within, ahead of national policy; the next phases must turn that culture into structure, and share it with every KKM hospital.`)
out.push(`- **The deck:** ${SHEET_COUNT} sheets, ${TOTAL_STEPS} clicker presses, planned ${mmss(PLANNED_SECONDS)}. "Press 1" on each sheet is the click that brings the sheet up.`)
out.push(``)
out.push(`## The sheets`)
out.push(``)

for (const s of SCENES) {
  const budget = Math.round((s.seconds / 60) * WPM)
  out.push(`### ${s.sheet} ${s.title}`)
  out.push(`${s.steps} press${s.steps > 1 ? 'es' : ''} · planned ${s.seconds}s · about ${budget} words at ${WPM} wpm · current notes ${words(s.notes)} words`)
  out.push(``)
  out.push(`What the room sees:`)
  PRESSES[s.id].forEach((p, i) => out.push(`- Press ${i + 1}: ${p}`))
  out.push(``)
  out.push(`On screen (text and figures, exactly as shown):`)
  out.push(flat(s.content, 0, OFF_SCREEN[s.id] ?? []))
  out.push(``)
  out.push(`Current notes (draft to improve, not to copy):`)
  out.push(`> ${s.notes}`)
  if (s.cues) {
    out.push(``)
    out.push(`For the speaker only, not on screen (facts you may use): ${s.cues}`)
  }
  out.push(``)
}

out.push(`## Totals`)
out.push(``)
out.push(`- ${SHEET_COUNT} sheets, ${TOTAL_STEPS} presses.`)
out.push(`- Planned time ${mmss(PLANNED_SECONDS)} against a ${SLOT} slot.`)
out.push(`- Current notes total ${SCENES.reduce((n, s) => n + words(s.notes), 0)} words.`)
const inno = SCENES.find((s) => s.id === 'innovathon')
if (inno) out.push(`- ${inno.sheet} plays a reel of about ${Math.round(inno.content.videoSeconds)} seconds; the speaker can talk over it or advance early to cut it short.`)
out.push(``)

writeFileSync('SCRIPT_BRIEF.md', out.join('\n'))
console.log(`SCRIPT_BRIEF.md written: ${SHEET_COUNT} sheets, ${out.join('\n').length} chars, ~${words(out.join(' '))} words`)
