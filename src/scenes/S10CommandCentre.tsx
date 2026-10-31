import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DOTS, HUB, STREAM_ORIGINS, streamPosition, tierPosition } from '../kit/dots.ts'
import type { SceneProps } from './index.ts'
import './s10.css'

const c = sceneContent('command-centre')

/**
 * The peak.
 *
 * The fifty dots enter at exactly the positions the registry sheet filed
 * them in (its three tiers) and are pulled onto six streams running into
 * the hub — the same objects, finally organised. The travelling pulses are six animated dash offsets rather than
 * sixty moving elements, which keeps a continuous animation affordable.
 */
export function S10CommandCentre({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const alert = step >= 1

  return (
    <div className="sc s10">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {/* stream lines */}
        {STREAM_ORIGINS.map((o, i) => (
          <g key={i}>
            <motion.line
              x1={o.x}
              y1={o.y}
              x2={HUB.x}
              y2={HUB.y}
              stroke="var(--line)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 0.35 }}
              animate={reduced ? { opacity: 0.35 } : { pathLength: 1, opacity: 0.35 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.07 }}
            />
            {!reduced && (
              <line
                className="s10__pulse"
                x1={o.x}
                y1={o.y}
                x2={HUB.x}
                y2={HUB.y}
                stroke="var(--line)"
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            )}
          </g>
        ))}

        {/* the fifty, pulled onto their streams */}
        {DOTS.map((d) => {
          const p = streamPosition(d)
          const from = tierPosition(d)
          return (
            <motion.circle
              key={d.id}
              r={6}
              fill="var(--line)"
              initial={{ cx: from.x, cy: from.y, opacity: 0.85 }}
              animate={{ cx: p.x, cy: p.y, opacity: 0.95 }}
              transition={{
                duration: reduced ? 0.2 : 1.15,
                delay: reduced ? 0 : 0.2 + (d.id % 9) * 0.035,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )
        })}

        {/* hub */}
        <motion.circle
          cx={HUB.x}
          cy={HUB.y}
          r={92}
          fill="var(--drafting)"
          stroke={alert ? 'var(--alert)' : 'var(--signal)'}
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
        />
        {alert && !reduced && (
          <motion.circle
            cx={HUB.x}
            cy={HUB.y}
            r={92}
            fill="none"
            stroke="var(--alert)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut', repeat: 2 }}
            style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
          />
        )}
      </svg>

      {/* stream labels */}
      {c.streams.map((s, i) => {
        const o = STREAM_ORIGINS[i]
        const right = i >= 3
        return (
          <motion.div
            className={`s10__stream ${right ? 'is-right' : 'is-left'}`}
            key={s.name}
            style={right ? { left: o.x + 58, top: o.y - 36 } : { right: 1920 - o.x + 58, top: o.y - 36 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
          >
            <span className="s10__stream-name">{s.name}</span>
            <span className="s10__stream-src">{s.source}</span>
          </motion.div>
        )
      })}

      <motion.div
        className="s10__hub-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <span className="s10__hub-name">{c.hub.name}</span>
        <span className="s10__hub-strap">{c.hub.strapline}</span>
      </motion.div>

      {alert && (
        <motion.p
          className="s10__alert"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {c.alert}
        </motion.p>
      )}

      {alert && (
        <motion.div
          className="s10__evidence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {c.evidence.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </motion.div>
      )}

      <motion.p
        className="s10__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        {c.footer}
      </motion.p>
    </div>
  )
}
