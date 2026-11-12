import { useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useDeck } from './DeckProvider.tsx'
import { useStageScale } from './useStageScale.ts'
import { usePointerNav } from './usePointerNav.ts'
import { Sheet } from '../system/Sheet.tsx'
import { TitleBlock } from '../system/TitleBlock.tsx'
import { SCENE_COMPONENTS } from '../scenes/index.ts'
import type { SceneId } from '../content/scenes.ts'
import './stage.css'

/**
 * The sheet's name sits large at the top-left, and its bottom edge is
 * TITLE_CLEAR. Sheets whose drawing reaches higher than that are scaled
 * down just enough to clear it, about the bottom-left drawing margin, so
 * their footers and the title block below stay where they were.
 *
 * The numbers are each sheet's highest edge at its last press, measured in
 * the built deck, not guessed. Sheets missing here already start below the
 * name. The cover carries the talk's own title and gets no sheet name; the
 * Innovathon reel runs full-bleed and is not scaled, its framed opening
 * already starting below the name.
 */
const TITLE_CLEAR = 150
const TOP_EDGE: Partial<Record<SceneId, number>> = {
  'three-forces': 130,
  'ahead-of-mandate': 123,
  'how-we-led-it': 136,
  'where-weve-taught': 116,
  'national-picture': 100,
  'vision-2028': 107,
  roadmap: 112,
  'phase-foundations': 100,
  'command-centre': 120,
  'command-centre-build': 100,
  'measuring-success': 108,
  risks: 75,
}
const FOOT = 1022
const fit = (id: SceneId) => {
  const top = TOP_EDGE[id]
  return top === undefined ? 1 : (FOOT - TITLE_CLEAR) / (FOOT - top)
}
const NO_NAME: SceneId[] = ['cold-open']

/**
 * The 1920×1080 stage, letterboxed in --deep and scaled to fit.
 *
 * The sheet and the title block live outside AnimatePresence so neither is
 * torn down on a scene change — the sheet is composited once for the whole
 * talk, and the title block only redraws its border.
 *
 * The letterbox, not the stage, carries the tap and swipe handlers: the
 * stage is scaled and centred, so the bands outside it are still screen the
 * presenter's thumb can land on.
 */
export function Stage() {
  const box = useRef<HTMLDivElement>(null)
  const scale = useStageScale(box)
  const { scene, sceneIndex, step, total, blackout, next, prev } = useDeck()
  const reduced = useReducedMotion()
  const nav = usePointerNav({ next, prev })

  const Scene = SCENE_COMPONENTS[scene.id]

  return (
    <div className="letterbox" ref={box} {...nav}>
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
              {!NO_NAME.includes(scene.id) && <h1 className="stage__name">{scene.title}</h1>}
              <div
                className="scene__fit"
                style={fit(scene.id) < 1 ? { transform: `scale(${fit(scene.id).toFixed(4)})` } : undefined}
              >
                <Scene step={step} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <TitleBlock sheet={scene.sheet} total={total} />

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
