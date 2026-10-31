import { AnimatePresence, motion } from 'motion/react'
import { useDeck } from './DeckProvider.tsx'
import { SCENES, PLANNED_SECONDS } from '../content/scenes.ts'
import { ScriptPanel } from './ScriptPanel.tsx'
import './presenter.css'

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * Notes, timer and pacing, as an overlay on the stage itself.
 *
 * Deliberately not a second window. Opened from the offline file the deck
 * runs on an opaque origin, where BroadcastChannel and localStorage cannot
 * sync between windows — so the path that has to work in the room is the
 * one with no cross-window dependency at all. Press N.
 */
export function Presenter() {
  const { scene, sceneIndex, step, notesOpen, elapsed } = useDeck()

  // Where the plan says you should be by the end of the current sheet.
  const planned = SCENES.slice(0, sceneIndex + 1).reduce(
    (n, s) => n + s.seconds,
    0,
  )
  const drift = elapsed - planned
  const pace = drift > 20 ? 'late' : drift < -20 ? 'early' : 'on'

  const next = SCENES[sceneIndex + 1]

  return (
    <AnimatePresence>
      {notesOpen && (
        <motion.aside
          className="pres"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pres__panel">
            <header className="pres__top">
              <span className="pres__sheet">
                {scene.sheet} · {scene.title}
              </span>
              <span className="pres__step">
                step {step + 1} of {scene.steps}
              </span>
            </header>

            <div className="pres__notes">
              <ScriptPanel scene={scene} step={step} show="near" />
            </div>

            {scene.cues && <p className="pres__cues">{scene.cues}</p>}

            {next && (
              <p className="pres__next">
                Next — {next.sheet} {next.title}
              </p>
            )}

            <footer className="pres__clock">
              <span className={`pres__elapsed pres__elapsed--${pace}`}>
                {mmss(elapsed)}
              </span>
              <span className="pres__plan">
                plan {mmss(planned)} · total {mmss(PLANNED_SECONDS)}
              </span>
              <span className="pres__keys">
                → next · ← back · N notes · P presenter window · B blank · F fullscreen · R reset
              </span>
            </footer>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
