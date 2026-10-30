import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useDeck } from './DeckProvider.tsx'
import { useStageScale } from './useStageScale.ts'
import { Sheet } from '../system/Sheet.tsx'
import { TitleBlock } from '../system/TitleBlock.tsx'
import { SCENE_COMPONENTS } from '../scenes/index.ts'
import './stage.css'

/**
 * The 1920×1080 stage, letterboxed in --deep and scaled to fit.
 *
 * The sheet and the title block live outside AnimatePresence so neither is
 * torn down on a scene change — the sheet is composited once for the whole
 * talk, and the title block only redraws its border.
 */
export function Stage() {
  const scale = useStageScale()
  const { scene, sceneIndex, step, total, blackout } = useDeck()
  const reduced = useReducedMotion()

  const Scene = SCENE_COMPONENTS[scene.id]

  return (
    <div className="letterbox">
      <div
        className="stage"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <Sheet />

        <div className="stage__content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scene.id}
              className="scene"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.18 : 0.32, ease: 'easeOut' }}
            >
              <Scene step={step} />
            </motion.div>
          </AnimatePresence>
        </div>

        <TitleBlock sheet={scene.sheet} title={scene.title} total={total} />

        {/* Blackout: '.' or B, for when you want the room looking at you. */}
        <AnimatePresence>
          {blackout && (
            <motion.div
              className="stage__blackout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            />
          )}
        </AnimatePresence>

        <span className="stage__sr" aria-live="polite">
          {`Sheet ${sceneIndex + 1} of ${total}: ${scene.title}`}
        </span>
      </div>
    </div>
  )
}
