import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { SplitFlap } from '../kit/SplitFlap.tsx'
import type { SceneProps } from './index.ts'
import './s04.css'

const c = sceneContent('how-we-led-it')

const BOX_W = 372
const GAP = 36
const X0 = 200
const BOX_Y = 230
const BOX_H = 300

/**
 * Four connected blocks, numbered because this genuinely is a sequence —
 * each stage depends on the one before it. The split-flap on step 2 is the
 * scene's moment, and the only animation that runs here.
 */
export function S04HowWeLedIt({ step }: SceneProps) {
  const flipped = step >= 1

  return (
    <div className="sc s04">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {c.stages.map((_, i) => {
          const x = X0 + i * (BOX_W + GAP)
          return (
            <g key={i}>
              <DrawPath
                d={`M ${x} ${BOX_Y} h ${BOX_W} v ${BOX_H} h ${-BOX_W} z`}
                delay={i * 0.12}
                duration={0.7}
                opacity={0.4}
              />
              {i < c.stages.length - 1 && (
                <DrawPath
                  d={`M ${x + BOX_W} ${BOX_Y + BOX_H / 2} L ${x + BOX_W + GAP} ${BOX_Y + BOX_H / 2}`}
                  delay={0.3 + i * 0.12}
                  duration={0.3}
                  opacity={0.7}
                />
              )}
            </g>
          )
        })}
      </svg>

      {c.stages.map((s, i) => (
        <motion.div
          className="s04__stage"
          key={s.name}
          style={{ left: X0 + i * (BOX_W + GAP), top: BOX_Y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25 + i * 0.12 }}
        >
          <span className="s04__n">{i + 1}</span>
          <span className="s04__name">{s.name}</span>
          <span className="s04__detail">{s.detail}</span>
        </motion.div>
      ))}

      <motion.p
        className="s04__framework"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {c.framework}
      </motion.p>

      <div className="s04__flip">
        <SplitFlap
          from={c.flip.from}
          to={c.flip.to}
          flipped={flipped}
          className="s04__flip-text"
        />
        <motion.p
          className="s04__flip-caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: flipped ? 1 : 0 }}
          transition={{ duration: 0.5, delay: flipped ? 0.75 : 0 }}
        >
          {c.flip.caption}
        </motion.p>
      </div>
    </div>
  )
}
