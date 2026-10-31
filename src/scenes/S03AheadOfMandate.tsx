import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import { Dimension } from '../kit/Dimension.tsx'
import type { SceneProps } from './index.ts'
import cutting from '../assets/news-cutting.webp'
import './s03.css'

const c = sceneContent('ahead-of-mandate')

/** April 2025 finishes landing at ~1.35s; the tags follow it. */
const TAGS_IN = 1.55

const LINE_Y = 556
const X1 = 330
const X2 = 1430

/**
 * The headline is typeset so it reads from the back of the room, with the
 * cutting pinned beside it as corroboration — the claim set large, the
 * article it came from next to it.
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
            y={LINE_Y - 86}
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

      {/* The article cut out of the page: section, headline, date, the
          press photograph and the lead paragraph that names the Prime
          Minister. The sidebar, share icons and unrelated headlines are not
          part of the story, so they are not part of the cutting. */}
      <motion.figure
        className="s03__photo"
        initial={{ opacity: 0, y: 14, rotate: -2.4 }}
        animate={{ opacity: 1, y: 0, rotate: -1.6 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={cutting}
          alt="The Star, 5 June 2026: Anwar directs all government digital services to be developed in-house"
        />
      </motion.figure>

      {/* The three reasons the directive gives, landing one at a time once
          April 2025 is on the sheet — they are what the two dates have in
          common, so they arrive after both are there. */}
      {back && (
        <ul className="s03__tags">
          {c.tags.map((t, i) => (
            <motion.li
              key={t}
              className="s03__tag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: TAGS_IN + i * 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {t}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
