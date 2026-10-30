import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { QR } from '../kit/QR.tsx'
import { SheetVideo } from '../kit/SheetVideo.tsx'
import type { SceneProps } from './index.ts'
import poster from '../assets/innovathon-poster.webp'
import './s07.css'

const c = sceneContent('innovathon')

/**
 * The poster as an artefact, pinned to the sheet at an angle. It is far too
 * dense to read from the back of a room, and it is not meant to be read —
 * it is evidence that the day happened. The figures beside it carry the
 * argument.
 *
 * The reel is on its own step. It arrives on a clicker press rather than a
 * timer, so the sheet waits as long as you do — and it comes up over a
 * dimmed sheet without anything in the composition moving or resizing to
 * accommodate it.
 *
 * Stepping back unmounts the video, which stops it; stepping forward again
 * starts it from the beginning. That is what you want in a rehearsal, and
 * what you want if you lose your place.
 */
export function S07Innovathon({ step }: SceneProps) {
  const playing = step >= 1

  return (
    <div className="sc s07">
      <motion.figure
        className="s07__poster"
        initial={{ opacity: 0, y: -28, rotate: c.rotation - 2 }}
        animate={{ opacity: 1, y: 0, rotate: c.rotation }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={poster} alt="Innovathon 2026 breakout session allocation poster" />
      </motion.figure>

      <div className="s07__right">
        <motion.span
          className="s07__date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
                delay={0.45 + i * 0.16}
                duration={1.1}
              />
              <motion.span
                className="s07__clabel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.16 }}
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
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {c.coverage}
        </motion.p>

      </div>

      <motion.div
        className="s07__spread"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
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
        delay={1.6}
        caption="innovathon2026"
        className="s07__qr"
      />

      {playing && (
        <>
          <motion.div
            className="s07__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          <SheetVideo
            className="s07__video"
            src={`${import.meta.env.BASE_URL}${c.video}`}
            width={1160}
            height={653}
            delay={0.1}
            startDelay={0.35}
          />
        </>
      )}
    </div>
  )
}
