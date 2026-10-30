import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { Dimension } from '../kit/Dimension.tsx'
import type { SceneProps } from './index.ts'
import './s03.css'

const c = sceneContent('ahead-of-mandate')

const LINE_Y = 556
const X1 = 330
const X2 = 1430

/**
 * The headline is typeset, not screenshotted. The original slide used a news
 * photograph of the Prime Minister; setting the words instead keeps the sheet
 * in one visual language and avoids putting a real person's photograph on a
 * slide to make a point about our own timing.
 */
export function S03AheadOfMandate({ step }: SceneProps) {
  const both = step >= 1

  return (
    <div className="sc s03">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <DrawPath
          d={`M ${X1} ${LINE_Y} L ${both ? X2 : X1 + 120} ${LINE_Y}`}
          duration={both ? 0.9 : 0.5}
          opacity={0.6}
        />
        {/* node ticks */}
        <DrawPath d={`M ${X1} ${LINE_Y - 26} L ${X1} ${LINE_Y + 26}`} duration={0.3} />
        {both && (
          <DrawPath
            d={`M ${X2} ${LINE_Y - 26} L ${X2} ${LINE_Y + 26}`}
            delay={0.75}
            duration={0.3}
          />
        )}
        {both && (
          <Dimension
            x1={X1}
            x2={X2}
            y={LINE_Y - 96}
            label={c.span}
            delay={1.0}
            tone="var(--signal)"
          />
        )}
      </svg>

      {c.nodes.map((n, i) => {
        if (i === 1 && !both) return null
        return (
          <motion.div
            className={`s03__node s03__node--${i}`}
            key={n.date}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i === 0 ? 0.2 : 0.85 }}
          >
            <span className="s03__date">{n.date}</span>
            <span className="s03__label">{n.label}</span>
          </motion.div>
        )
      })}

      {both && (
        <motion.figure
          className="s03__clipping"
          initial={{ opacity: 0, y: 16, rotate: -0.6 }}
          animate={{ opacity: 1, y: 0, rotate: -0.6 }}
          transition={{ duration: 0.6, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="s03__headline">{c.clipping.headline}</blockquote>
          <figcaption className="s03__source">{c.clipping.source}</figcaption>
        </motion.figure>
      )}

      {both && (
        <motion.ul
          className="s03__tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          {c.tags.map((t) => (
            <li key={t} className="s03__tag">
              {t}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
