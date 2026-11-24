import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { QR } from '../kit/QR.tsx'
import { WidthType } from '../kit/WidthType.tsx'
import { FramedDrawing } from '../kit/FramedDrawing.tsx'
import shotDfu from '../assets/shot-dfu.webp'
import shotDfuPi from '../assets/shot-dfu-pi.webp'
import type { SceneProps } from './index.ts'
import './deeplearninglab.css'

const c = sceneContent('deep-learning-lab')

const SHOTS = { dfu: shotDfu, 'dfu-pi': shotDfuPi }
/** The app's own column, 640 × 900, shown at phone size. */
const SHOT_W = 240
const SHOT_H = Math.round((SHOT_W * 900) / 640)

/**
 * Oxford. Press 1: Wound Vision, its two arms and who each is built with,
 * a code to try each one and the app itself beside it. Press 2: the
 * safeguards, which is what the Akal Budi panel asked about.
 */
export function DeepLearningLab({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const guards = step >= 1

  return (
    <div className="sc dll">
      <motion.p
        className="dll__kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 * t }}
      >
        {c.kicker}
      </motion.p>
      <h1 className="dll__head">
        <WidthType from={{ wdth: 62, wght: 700 }} to={{ wdth: 108, wght: 680 }} duration={0.8} delay={0.2 * t}>
          {c.heading}
        </WidthType>
      </h1>
      <motion.p
        className="dll__lead"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 * t }}
      >
        {c.lead}
      </motion.p>

      <ol className="dll__arms">
        {c.arms.map((a, i) => (
          <motion.li
            key={a.name}
            initial={{ opacity: 0, y: 12 * t }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (1.1 + i * 0.4) * t, ease: [0.16, 1, 0.3, 1] }}
          >
            <QR code={a.qr} size={118} delay={(1.3 + i * 0.4) * t} />
            <div className="dll__arm-text">
              <span className="dll__arm-name">{a.name}</span>
              <span className="dll__arm-with">{a.partners}</span>
              <span className="dll__arm-url">{a.url}</span>
            </div>
          </motion.li>
        ))}
      </ol>

      {c.arms.map((a, i) => (
        <div key={a.shot} className="dll__shot" style={{ left: 1140 + i * (SHOT_W + 40) }}>
          <FramedDrawing
            src={SHOTS[a.shot]}
            alt={`Wound Vision, ${a.name.toLowerCase()} arm`}
            width={SHOT_W}
            height={SHOT_H}
            delay={(1.0 + i * 0.3) * t}
          />
          <span className="dll__shot-cap">{a.name}</span>
        </div>
      ))}

      <motion.div
        className="dll__guards"
        initial={false}
        animate={{ opacity: guards ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        aria-hidden={!guards}
      >
        <p className="dll__guards-head">{c.safeguardsHeading}</p>
        <ul>
          {c.safeguards.map((g, i) => (
            <motion.li
              key={g}
              initial={false}
              animate={{ opacity: guards ? 1 : 0, x: guards ? 0 : -10 * t }}
              transition={{ duration: 0.4, delay: guards ? (0.2 + i * 0.18) * t : 0 }}
            >
              {g}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
