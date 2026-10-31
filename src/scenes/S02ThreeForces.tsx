import { AnimatePresence, motion } from 'motion/react'
import { sceneContent } from './content.ts'
import { CountUp } from '../kit/CountUp.tsx'
import { MarginNote } from '../kit/MarginNote.tsx'
import { DrawPath } from '../kit/DrawPath.tsx'
import type { SceneProps } from './index.ts'
import './s02.css'

const c = sceneContent('three-forces')

/**
 * One force per click. The +128% is the scene's moment and the only place
 * --alert appears on this sheet; the other two forces stay quiet so the
 * number carries the weight. The births figure lands beside it after the
 * count-up, smaller and in chalk: a second pressure, not a second moment.
 */
export function S02ThreeForces({ step }: SceneProps) {
  return (
    <div className="sc s02">
      {c.forces.map((f, i) => {
        const shown = step >= i
        return (
          <div className="s02__row" key={f.name}>
            <svg className="s02__rule" viewBox="0 0 1560 2" aria-hidden="true">
              {shown && (
                <DrawPath
                  d="M 0 1 L 1560 1"
                  duration={0.55}
                  opacity={0.28}
                />
              )}
            </svg>

            <span className="s02__name">{f.name}</span>

            <div className="s02__body">
              <AnimatePresence>
                {shown && (
                  <motion.div
                    key="in"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {f.figure ? (
                      <>
                        <CountUp
                          {...f.figure}
                          className="s02__figure"
                          delay={0.2}
                          duration={1.1}
                        />
                        <p className="s02__caption">{f.caption}</p>
                        {f.change && (
                          <motion.div
                            className="s02__change"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                          >
                            <span className="s02__change-fig">
                              {f.change.from}
                              <span className="s02__change-arrow"> → </span>
                              <span className="s02__change-to">{f.change.to}</span>
                            </span>
                            <p className="s02__change-cap">{f.change.caption}</p>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <p className="s02__text">{f.body}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      })}

      {step >= c.forces.length - 1 && (
        <MarginNote className="s02__note" delay={0.5} width={1180} rotate={-0.8}>
          {c.footer}
        </MarginNote>
      )}
    </div>
  )
}
