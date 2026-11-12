import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'
import { sceneContent } from './content.ts'
import { FlapBoard, type FlapCell, type FlapColumn } from '../kit/FlapBoard.tsx'
import { QR } from '../kit/QR.tsx'
import type { SceneProps } from './index.ts'
import './s06.css'

const c = sceneContent('portfolio')

const COLUMNS: FlapColumn[] = [
  { width: 2, align: 'right' },
  { width: 39 },
  { width: 27 },
  { width: 23 },
]
const ROWS = Math.max(...c.pages.map((p) => p.rows.length))
/** Left edge of each column on the stage: tile 15.5px, gap 1.5px, column gap 16px. */
const PITCH = 17
const COL_X = COLUMNS.reduce<number[]>((xs, _, k) => {
  xs.push(k === 0 ? 200 : xs[k - 1] + COLUMNS[k - 1].width * PITCH - 1.5 + 16)
  return xs
}, [])
const CAT_TONE: Record<string, string> = {
  'Patient journey': 'fb--patient',
  'Clinician journey': 'fb--clinician',
  'Management productivity': 'fb--management',
}

const PARTNERS = c.pages.slice(1).reduce((n, p) => n + p.rows.length, 0)

/**
 * The registry as a departures board, one page a press.
 *
 * Page 1 is what HTPN built, pages 2 and 3 what the hospitals we taught
 * built. Rows run in showcase order, so each page falls into the three
 * categories in turn: patient journey, clinician journey, management
 * productivity, each in its own colour in the last column. Each press re-flaps the same board in place, so the change of
 * page ripples down it the way a station board turns over: the room sees
 * the second and third pages arrive on the board the first one was on,
 * which is the argument, that most of the portfolio is not ours.
 */
export function S06Portfolio({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const page = c.pages[Math.min(step, c.pages.length - 1)]
  const htpn = step === 0

  const data = useMemo<FlapCell[][]>(
    () =>
      page.rows.map((r) => [
        { text: r.no, tone: 'fb--dim' },
        { text: r.name, tone: htpn ? '' : 'fb--partner' },
        { text: r.at, tone: 'fb--at' },
        { text: r.category, tone: CAT_TONE[r.category] },
      ]),
    [page, htpn],
  )

  const before = c.pages.slice(1, step).reduce((n, p) => n + p.rows.length, 0)
  const count = htpn
    ? String(page.rows.length)
    : `${before + 1}–${before + page.rows.length} of ${PARTNERS}`

  return (
    <div className="sc s06">
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1
          key={step}
          className="s06__title"
          initial={{ opacity: 0, y: 10 * t }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 * t, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {page.title} <span className="s06__count">{count}</span>
        </motion.h1>
      </AnimatePresence>

      <motion.p
        className="s06__page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 * t }}
      >
        Page {step + 1} / {c.pages.length} · {c.total}
      </motion.p>

      <div className="s06__heads" aria-hidden="true">
        {[c.columns.no, c.columns.name, c.columns.at, c.columns.category].map((h, k) => (
          <span key={h} style={{ left: COL_X[k] - 200 }}>
            {h}
          </span>
        ))}
      </div>

      <FlapBoard className="s06__board" columns={COLUMNS} rows={ROWS} data={data} delay={0.35 * t} />

      {/* the same rows, for anyone not watching the board */}
      <ul className="s06__sr">
        {page.rows.map((r) => (
          <li key={r.no}>
            {r.no} {r.name}, {r.at}, {r.category}
          </li>
        ))}
      </ul>

      <motion.div
        className="s06__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 * t }}
      >
        <QR code="showcase" size={124} />
        <div className="s06__foot-text">
          <span className="s06__url">htpn-showcase-v2.vercel.app</span>
          <span className="s06__line">{c.line}</span>
        </div>
      </motion.div>
    </div>
  )
}
