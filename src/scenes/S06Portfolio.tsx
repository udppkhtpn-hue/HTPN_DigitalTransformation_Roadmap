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
  { width: 23 },
]
const ROWS = Math.max(...c.pages.map((p) => p.rows.length))
/** Left edge of each column on the stage: tile 22px, gap 2px, column gap 28px. */
const PITCH = 24
const COL_X = COLUMNS.reduce<number[]>((xs, _, k) => {
  xs.push(k === 0 ? 200 : xs[k - 1] + COLUMNS[k - 1].width * PITCH - 2 + 28)
  return xs
}, [])
const CAT_TONE: Record<string, string> = {
  'Patient journey': 'fb--patient',
  'Clinician journey': 'fb--clinician',
  'Management productivity': 'fb--management',
}

/**
 * The registry as a departures board, one page a press.
 *
 * All fifty in showcase order, 01 to 50, ten to a page in tiles large
 * enough to read from the back, so the
 * categories come round in turn: patient journey, clinician journey,
 * management productivity, each in its own colour in the last column. The
 * app name says who built it: chalk for HTPN, cyan for the hospitals we
 * taught. Each press re-flaps the same board in place, so the next page
 * ripples down it the way a station board turns over.
 */
export function S06Portfolio({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const page = c.pages[Math.min(step, c.pages.length - 1)]

  const data = useMemo<FlapCell[][]>(
    () =>
      page.rows.map((r) => [
        { text: r.no, tone: 'fb--dim' },
        { text: r.name, tone: r.by === 'partner' ? 'fb--partner' : '' },
        { text: r.category, tone: CAT_TONE[r.category] },
      ]),
    [page],
  )


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
          {page.title} <span className="s06__count">of 50</span>
        </motion.h1>
      </AnimatePresence>

      <motion.p
        className="s06__legend"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 * t }}
      >
        <span className="s06__key s06__key--htpn">{c.legend.htpn}</span>
        <span className="s06__key s06__key--partner">{c.legend.partner}</span>
      </motion.p>

      <motion.p
        className="s06__page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 * t }}
      >
        Page {step + 1} / {c.pages.length}
      </motion.p>

      <div className="s06__heads" aria-hidden="true">
        {[c.columns.no, c.columns.name, c.columns.category].map((h, k) => (
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
            {r.no} {r.name}, {r.category}, {r.by === 'htpn' ? 'built at HTPN' : 'built by a partner hospital'}
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
