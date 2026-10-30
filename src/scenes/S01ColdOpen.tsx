import { motion, useReducedMotion } from 'motion/react'
import { SCENES } from '../content/scenes.ts'
import { WidthType } from '../kit/WidthType.tsx'
import { FramedDrawing } from '../kit/FramedDrawing.tsx'
import blueprint from '../assets/blueprint-htpn.webp'
import './s01.css'

const { content } = SCENES[0] as Extract<
  (typeof SCENES)[number],
  { id: 'cold-open' }
>

/**
 * The building is drawn onto the sheet while the first three lines land.
 *
 * The wireframe is already cyan line work on blueprint navy, so it is
 * screened straight onto the grid rather than framed — the drawing in the
 * deck and the drawing on the wall are the same drawing.
 */
export function S01ColdOpen() {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1

  return (
    <div className="s01">
      <div className="s01__building">
        <FramedDrawing
          src={blueprint}
          alt="Wireframe drawing of Hospital Tengku Permaisuri Norashikin"
          width={1640}
          height={1334}
          framed={false}
          className="drawing--blueprint"
          delay={2.9 * t}
        />
      </div>

      <motion.div
        className="s01__lines"
        animate={{ opacity: [1, 1, 0] }}
        transition={{
          duration: reduced ? 0.2 : 3.6,
          times: [0, 0.82, 1],
          ease: 'easeOut',
        }}
      >
        {content.lines.map((line, i) => (
          <WidthType
            key={line}
            className="s01__line"
            from={{ wdth: 62, wght: 300 }}
            to={{ wdth: 108, wght: 400 }}
            delay={(0.25 + i * 0.78) * t}
            duration={0.85}
          >
            {line}
          </WidthType>
        ))}
      </motion.div>

      <div className="s01__title-group">
        <WidthType
          className="s01__title"
          from={{ wdth: 62, wght: 800 }}
          to={{ wdth: 118, wght: 700 }}
          delay={4.1 * t}
          duration={0.75}
        >
          {content.title}
        </WidthType>

        <motion.p
          className="s01__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 4.8 * t }}
        >
          {content.subtitle}
        </motion.p>

        <motion.p
          className="s01__byline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 5.2 * t }}
        >
          {content.byline}
        </motion.p>
      </div>
    </div>
  )
}
