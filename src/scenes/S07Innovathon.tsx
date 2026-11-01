import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { QR } from '../kit/QR.tsx'
import { SheetVideo } from '../kit/SheetVideo.tsx'
import still from '../assets/innovathon-still.webp'
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

export function S07Innovathon({ step }: SceneProps) {
  const back = step >= 1

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

      {back && (
        <>
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
        </>
      )}
    </div>
  )
}
