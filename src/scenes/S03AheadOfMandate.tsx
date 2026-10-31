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
 *
 * The reveal runs backwards, the way the script tells it: the Cabinet
 * directive of 5 June 2026 lands first, and only then does the timeline
 * draw back to April 2025 and dimension the fourteen months. Telling it
 * forwards made the punchline arrive before the setup.
 */
export function S03AheadOfMandate({ step }: SceneProps) {
  /** Step 2 goes back in time to April 2025. */
  const back = step >= 1

  return (
    <div className="sc s03">
      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {/* Drawn from the directive backwards, the direction you tell it. */}
        <DrawPath
          d={`M ${X2} ${LINE_Y} L ${back ? X1 : X2 - 120} ${LINE_Y}`}
          duration={back ? 0.9 : 0.5}
          opacity={0.6}
        />
        {/* node ticks */}
        <DrawPath d={`M ${X2} ${LINE_Y - 26} L ${X2} ${LINE_Y + 26}`} duration={0.3} />
        {back && (
          <DrawPath
            d={`M ${X1} ${LINE_Y - 26} L ${X1} ${LINE_Y + 26}`}
            delay={0.75}
            duration={0.3}
          />
        )}
        {back && (
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
        if (i === 0 && !back) return null
        return (
          <motion.div
            className={`s03__node s03__node--${i}`}
            key={n.date}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i === 1 ? 0.2 : 0.85 }}
          >
            <span className="s03__date">{n.date}</span>
            <span className="s03__label">{n.label}</span>
          </motion.div>
        )
      })}

      <motion.figure
          className="s03__clipping"
          initial={{ opacity: 0, y: 16, rotate: -0.6 }}
          animate={{ opacity: 1, y: 0, rotate: -0.6 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="s03__headline">{c.clipping.headline}</blockquote>
          <figcaption className="s03__source">{c.clipping.source}</figcaption>
        </motion.figure>

      <motion.ul
          className="s03__tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {c.tags.map((t) => (
            <li key={t} className="s03__tag">
              {t}
            </li>
          ))}
        </motion.ul>
    </div>
  )
}
