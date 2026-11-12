import { AnimatePresence, motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { QR } from '../kit/QR.tsx'
import { SheetVideo } from '../kit/SheetVideo.tsx'
import still from '../assets/innovathon-still.webp'
import clin1 from '../assets/win-clin-1.webp'
import clin2 from '../assets/win-clin-2.webp'
import clin3 from '../assets/win-clin-3.webp'
import pat1 from '../assets/win-pat-1.webp'
import pat2 from '../assets/win-pat-2.webp'
import pat3 from '../assets/win-pat-3.webp'
import mgmt1 from '../assets/win-mgmt-1.webp'
import mgmt2 from '../assets/win-mgmt-2.webp'
import mgmt3 from '../assets/win-mgmt-3.webp'
import type { SceneProps } from './index.ts'
import './s07.css'

const c = sceneContent('innovathon')

/**
 * The reel leads.
 *
 * It arrives framed and crisp with an empty sheet behind it, and for those
 * first seconds it is the only thing in the room. On your press it expands
 * to fill the sheet and drops back under a scrim — still running — and the
 * figures build in front of it. The video stops being an object on the
 * drawing and becomes the ground the drawing sits on.
 *
 * The expansion is one composited transform on a layer that is already
 * full-stage, so the video is never re-laid-out, only scaled.
 *
 * The still behind it is not decoration: the 14MB reel is published only
 * with the offline build, so on the shared Pages copy — and on any machine
 * where the file does not load — this sheet shows the hall as a photograph
 * and everything else behaves exactly the same. The text
 * keeps the entrance timings it always had, shifted behind the recede.
 *
 * The poster is gone. Once the reel is running behind it, a dense A3 of
 * breakout-session tables was competing with the thing it was evidence for,
 * and losing. The figures now hang off the drawing margin like every other
 * sheet, and the right half of the sheet is left to the video.
 *
 * Losing the poster also lost the only place the event was named, so the
 * title carries it instead — as printed on the delegate badge.
 */

/** 1160/1920 — the framed panel, expressed as a scale of the full stage. */
const PANEL = 0.604

/** Shift applied to the original text delays, so they follow the recede. */
const T = 0.5

const PHOTO: Record<string, string> = {
  'clin-1': clin1, 'clin-2': clin2, 'clin-3': clin3,
  'pat-1': pat1, 'pat-2': pat2, 'pat-3': pat3,
  'mgmt-1': mgmt1, 'mgmt-2': mgmt2, 'mgmt-3': mgmt3,
}
const CAT_TONE: Record<string, string> = {
  'Clinician journey': 'clinician',
  'Patient journey': 'patient',
  'Management productivity': 'management',
}
const ORD = ['', 'st', 'nd', 'rd']
/** Seconds between one category starting and the next. */
const COL_GAP = 1.5

export function S07Innovathon({ step }: SceneProps) {
  const back = step >= 1
  const stats = step === 1
  const winners = step >= 2

  return (
    <div className="sc s07">
      <motion.div
        className="s07__vlayer"
        initial={{ scale: PANEL }}
        animate={{ scale: back ? 1 : PANEL }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <SheetVideo
          src={`${import.meta.env.BASE_URL}${c.video}`}
          poster={still}
          width={1920}
          height={1080}
          delay={0.1}
          startDelay={0.35}
          frameVisible={!back}
          strokeWidth={1.7}
        />
      </motion.div>

      <motion.div
        className="s07__scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: back ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {/* Press 3: the room goes darker still, and the winners take the sheet. */}
      <motion.div
        className="s07__scrim s07__scrim--deep"
        initial={{ opacity: 0 }}
        animate={{ opacity: winners ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {back && (
        <motion.div
          className="s07__stats"
          initial={false}
          animate={{ opacity: stats ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ pointerEvents: 'none' }}
        >
          <div className="s07__right">
            <motion.h2
              className="s07__title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: T + 0.2 }}
            >
              {c.title}
            </motion.h2>

            <motion.span
              className="s07__date"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: T + 0.35 }}
            >
              {c.date}
            </motion.span>

            <div className="s07__counters">
              {c.counters.map((f, i) => (
                <div className="s07__counter" key={f.label}>
                  <CountUp
                    {...f}
                    tone="signal"
                    className="s07__num"
                    delay={T + 0.45 + i * 0.16}
                    duration={1.1}
                  />
                  <motion.span
                    className="s07__clabel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: T + 0.75 + i * 0.16 }}
                  >
                    {f.label}
                  </motion.span>
                </div>
              ))}
            </div>

            <motion.p
              className="s07__coverage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: T + 1.2 }}
            >
              {c.coverage}
            </motion.p>
          </div>

          <motion.div
            className="s07__spread"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: T + 1.4 }}
          >
            <span className="s07__spread-intro">{c.spreadIntro}</span>
            <ul className="s07__spread-list">
              {c.spread.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </motion.div>

          <QR
            code="innovathon"
            size={158}
            delay={T + 1.6}
            caption="innovathon2026"
            className="s07__qr"
          />
        </motion.div>
      )}

      <AnimatePresence>
        {winners && (
          <motion.div
            className="s07__winners"
            key="winners"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.h2
              className="s07__winners-head"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {c.winnersHeading}
            </motion.h2>
            {/* One category at a time, left to right; within each, first
                place lands large, then second and third beneath it. */}
            {c.winners.map((col, i) => {
              const at = 0.5 + i * COL_GAP
              return (
                <div className={`s07__wcol s07__wcol--${CAT_TONE[col.category]}`} key={col.category} style={{ left: 200 + i * 515 }}>
                  <motion.div
                    className="s07__wcat"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: at, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span>{col.category}</span>
                  </motion.div>
                  {col.entries.map((e, k) => (
                    <motion.div
                      className={`s07__win s07__win--${e.rank}`}
                      key={e.app}
                      initial={{ opacity: 0, y: 22, scale: e.rank === 1 ? 0.96 : 1 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.55, delay: at + 0.35 + k * 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="s07__rank">
                        {e.rank}
                        <small>{ORD[e.rank]}</small>
                      </span>
                      <img
                        className="s07__wphoto"
                        src={PHOTO[e.photo]}
                        alt=""
                        width={e.rank === 1 ? 462 : 135}
                        height={e.rank === 1 ? 236 : 90}
                      />
                      <span className="s07__wtext">
                        <b>{e.app}</b>
                        <i>{e.team}</i>
                      </span>
                    </motion.div>
                  ))}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
