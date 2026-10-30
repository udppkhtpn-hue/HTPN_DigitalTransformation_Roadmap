import { motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { WidthType } from '../kit/WidthType.tsx'
import { DrawPath } from '../kit/DrawPath.tsx'
import './s11.css'

const c = sceneContent('predict-and-scale')

/**
 * The headline is the moment: "From seeing now" arrives condensed and holds,
 * then "to anticipating next" opens out to full width underneath it. The
 * width axis carries the meaning — the sentence literally widens.
 */
export function S11PredictAndScale() {
  return (
    <div className="sc s11">
      <h1 className="s11__head">
        <WidthType
          className="s11__from"
          from={{ wdth: 62, wght: 400 }}
          to={{ wdth: 78, wght: 400 }}
          duration={0.7}
          delay={0.25}
        >
          {c.headline.from}
        </WidthType>
        <WidthType
          className="s11__to"
          from={{ wdth: 62, wght: 700 }}
          to={{ wdth: 104, wght: 680 }}
          duration={1.05}
          delay={0.95}
        >
          {c.headline.to}
        </WidthType>
      </h1>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <DrawPath
          d="M 200 600 L 1720 600"
          delay={1.5}
          duration={0.9}
          opacity={0.4}
        />
      </svg>

      <ul className="s11__items">
        {c.items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.75 + i * 0.13,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
