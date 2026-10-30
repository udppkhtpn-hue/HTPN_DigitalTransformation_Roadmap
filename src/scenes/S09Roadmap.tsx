import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import type { SceneProps } from './index.ts'
import './s09.css'

const c = sceneContent('roadmap')

const X0 = 200
const COL = 390
const BOX_W = 354
const TOP = 206
const BOX_H = 580

/**
 * Four phases, one per click, numbered because the roadmap genuinely is a
 * sequence. Phase 1 lands with its stamp — the scene's one moment — and the
 * three that follow stay quiet, because they have not happened yet.
 */
export function S09Roadmap({ step }: SceneProps) {
  return (
    <div className="sc s09">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {c.phases.map((p, i) =>
          step >= i ? (
            <g key={p.n}>
              <DrawPath
                d={`M ${X0 + i * COL} ${TOP} h ${BOX_W} v ${BOX_H} h ${-BOX_W} z`}
                duration={0.65}
                opacity={p.achieved ? 0.65 : 0.35}
                stroke={p.achieved ? 'var(--signal)' : 'var(--line)'}
              />
              {i > 0 && (
                <DrawPath
                  d={`M ${X0 + i * COL - 36} ${TOP + BOX_H / 2} L ${X0 + i * COL} ${TOP + BOX_H / 2}`}
                  duration={0.25}
                  opacity={0.6}
                />
              )}
            </g>
          ) : null,
        )}
      </svg>

      {c.phases.map((p, i) =>
        step >= i ? (
          <motion.div
            className={`s09__phase ${p.achieved ? 'is-achieved' : ''}`}
            key={p.n}
            style={{ left: X0 + i * COL, top: TOP }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="s09__n">Phase {p.n}</span>
            <span className="s09__name">{p.name}</span>
            <span className="s09__dates">{p.dates}</span>
            <span className="s09__body">{p.body}</span>
            {p.doneWhen && (
              <span className="s09__done">
                <i>Done when</i> {p.doneWhen}
              </span>
            )}
            {p.achieved && (
              <motion.span
                className="s09__stamp"
                initial={{ opacity: 0, scale: 1.5, rotate: -11 }}
                animate={{ opacity: 1, scale: 1, rotate: -7 }}
                transition={{ duration: 0.45, delay: 0.5, ease: [0.3, 1.3, 0.5, 1] }}
              >
                ACHIEVED
              </motion.span>
            )}
          </motion.div>
        ) : null,
      )}

      <motion.ul
        className="s09__enablers"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {c.enablers.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </motion.ul>
    </div>
  )
}
