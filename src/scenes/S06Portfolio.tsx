import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { FramedDrawing } from '../kit/FramedDrawing.tsx'
import { QR } from '../kit/QR.tsx'
import { MarginNote } from '../kit/MarginNote.tsx'
import shot from '../assets/shot-showcase.webp'
import './s06.css'

const c = sceneContent('portfolio')

/** Seconds between one name landing and the next. */
const PACE = 0.07
const FIRST = 0.9

/**
 * The whole registry, set as one field of type.
 *
 * All fifty names arrive one after another, in registry order, each rising
 * into place, so the room watches the portfolio being assembled rather than
 * reading a list. The seventeen built at HTPN are set in chalk and come
 * first; the thirty-three built by the hospitals we taught follow in cyan,
 * which is the point the speaker makes: most of this was not built by us.
 *
 * Once every name is down the field keeps breathing: each name brightens
 * and settles on its own slow cycle, out of step with its neighbours, like
 * lights in a building at night. That is a CSS opacity animation per name,
 * which the compositor runs without touching layout or paint.
 */
export function S06Portfolio() {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const landed = FIRST + c.apps.length * PACE

  return (
    <div className="sc s06">
      <div className="s06__head">
        <CountUp {...c.total} className="s06__total" delay={0.2 * t} duration={1.2} />
        <motion.span
          className="s06__total-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 * t }}
        >
          {c.total.label}
        </motion.span>
      </div>

      <motion.p
        className="s06__legend"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 * t }}
      >
        <span className="s06__key s06__key--htpn">{c.legend.htpn}</span>
        <span className="s06__key s06__key--partner">{c.legend.partner}</span>
      </motion.p>

      <ul className="s06__field" aria-label="All fifty apps in the registry">
        {c.apps.map((a, i) => (
          <motion.li
            key={a.name}
            className={`s06__app s06__app--${a.by}`}
            title={a.facility}
            initial={{ opacity: 0, y: 18 * t }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: (FIRST + i * PACE) * t, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className={reduced ? undefined : 's06__glow'}
              style={{
                animationDelay: `${(landed + ((i * 7) % 13) * 0.55).toFixed(2)}s`,
                animationDuration: `${(5.5 + ((i * 5) % 9) * 0.45).toFixed(2)}s`,
              }}
            >
              {a.name}
            </span>
          </motion.li>
        ))}
      </ul>

      <motion.div
        className="s06__panel"
        initial={{ opacity: 0, y: 14 * t }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 * t }}
      >
        <FramedDrawing src={shot} alt="The HTPN showcase site" width={356} height={200} delay={0.5 * t} />
        <QR code="showcase" size={150} delay={0.9 * t} />
        <span className="s06__url">htpn-showcase-v2.vercel.app</span>
      </motion.div>

      <MarginNote className="s06__note" delay={landed * t} width={900} rotate={-0.9}>
        {c.line}
      </MarginNote>
    </div>
  )
}
