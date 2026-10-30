import { motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { FramedDrawing } from '../kit/FramedDrawing.tsx'
import { QR } from '../kit/QR.tsx'
import { MarginNote } from '../kit/MarginNote.tsx'
import shot from '../assets/shot-showcase.webp'
import './s06.css'

const c = sceneContent('portfolio')

/**
 * Three lanes running at different speeds, with the live site sitting in the
 * middle of them. The marquees are the one continuous animation in the deck
 * and each is a single composited transform, so they cost a layer apiece and
 * nothing more.
 */
export function S06Portfolio() {
  const reduced = useReducedMotion()

  return (
    <div className="sc s06">
      {c.lanes.map((lane, i) => (
        <motion.div
          className="s06__lane"
          key={lane.name}
          style={{ top: 168 + i * 232 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
        >
          <span className="s06__lane-name">{lane.name}</span>
          <div className="s06__track-wrap">
            <div
              className="s06__track"
              style={{
                animationDuration: `${lane.speed}s`,
                animationDirection: i === 1 ? 'reverse' : 'normal',
                animationPlayState: reduced ? 'paused' : 'running',
              }}
            >
              {[...lane.items, ...lane.items, ...lane.items].map((item, k) => (
                <span className="s06__item" key={`${item}-${k}`}>
                  {item}
                  <i className="s06__dot" aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="s06__panel">
        <FramedDrawing
          src={shot}
          alt="The HTPN showcase site"
          width={640}
          height={360}
          delay={0.35}
        />
        <div className="s06__meta">
          <QR code="showcase" size={150} delay={0.9} />
          <span className="s06__url">htpn-showcase-v2.vercel.app</span>
        </div>
      </div>

      <MarginNote className="s06__note" delay={1.1} width={900} rotate={-0.9}>
        {c.line}
      </MarginNote>
    </div>
  )
}
