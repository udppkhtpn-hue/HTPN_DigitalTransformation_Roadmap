import { motion, useReducedMotion } from 'motion/react'
import { SCENES } from '../content/scenes.ts'
import { WidthType } from '../kit/WidthType.tsx'
import { FramedDrawing } from '../kit/FramedDrawing.tsx'
import oldBuilding from '../assets/htpn-1889.webp'
import './s01.css'

const { content } = SCENES[0] as Extract<
  (typeof SCENES)[number],
  { id: 'cold-open' }
>

/**
 * The hospital's first building, 1889, is drawn onto the sheet behind the
 * title once the first three lines have been read.
 *
 * It is full-bleed cyan line work with no ground of its own (scripts/
 * make-1889.mjs turns the source's navy into transparency), so it sits
 * directly on the grid rather than in a frame. The sheet opens on a hospital
 * that is a hundred and thirty-five years old; this is the building it
 * started in.
 */
export function S01ColdOpen() {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1

  return (
    <div className="s01">
      <div className="s01__building">
        <FramedDrawing
          src={oldBuilding}
          alt="Wireframe drawing of the original 1889 building of Hospital Tengku Permaisuri Norashikin"
          width={1920}
          height={1084}
          framed={false}
          className="drawing--blueprint"
          delay={4.3 * t}
        />
      </div>

      <motion.div
        className="s01__lines"
        animate={{ opacity: [1, 1, 0] }}
        transition={{
          // The third line only finishes arriving at ~2.2s. Holding the
          // group until 4.2s gives "No vendor to wait for." two seconds to
          // be read before the building starts drawing over it.
          duration: reduced ? 0.2 : 5.4,
          times: [0, 0.78, 1],
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
          delay={5.5 * t}
          duration={0.75}
        >
          {content.title}
        </WidthType>

        <motion.p
          className="s01__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 6.2 * t }}
        >
          {content.subtitle}
        </motion.p>

        <motion.p
          className="s01__byline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 6.6 * t }}
        >
          {content.byline}
        </motion.p>
      </div>
    </div>
  )
}
