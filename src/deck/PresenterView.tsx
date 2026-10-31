import { useDeck } from './DeckProvider.tsx'
import { ScriptPanel } from './ScriptPanel.tsx'
import { SCENES, PLANNED_SECONDS } from '../content/scenes.ts'
import { SCRIPT } from '../content/script.ts'
import './presenterview.css'

const mmss = (s: number) =>
  `${Math.floor(Math.abs(s) / 60)}:${String(Math.floor(Math.abs(s) % 60)).padStart(2, '0')}`

/**
 * The presenter's own window, opened with P from the audience window.
 *
 * No stage in it: the sheet is on the projector. This shows the script for
 * the press you are on, a clock against the plan, what comes next, and a
 * jump list for questions. It drives the same deck, so a click here moves
 * the audience's sheet too.
 */
export function PresenterView() {
  const { scene, sceneIndex, step, next, prev, goto, elapsed, reset, blackout, toggleBlackout, linked, running } =
    useDeck()

  const planned = SCENES.slice(0, sceneIndex + 1).reduce((n, s) => n + s.seconds, 0)
  const drift = elapsed - planned
  const pace = !running ? 'idle' : drift > 20 ? 'late' : drift < -20 ? 'early' : 'on'
  const nextScene = SCENES[sceneIndex + 1]
  const nextScript = nextScene && SCRIPT[nextScene.sheet]
  const here = SCRIPT[scene.sheet]
  const remaining = PLANNED_SECONDS - elapsed

  // A clicked button keeps focus, and Space or Enter on a focused button
  // would then fire it as well as the deck's own key handler: two presses.
  const tap = (fn: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    fn()
  }

  return (
    <div className="pv">
      <header className="pv__head">
        <div>
          <span className="pv__sheet">{scene.sheet}</span>
          <span className="pv__title">{scene.title}</span>
        </div>
        <span className="pv__meta">
          press {step + 1} of {scene.steps} · {here ? `${here.words} words · ${mmss(scene.seconds)}` : ''}
          {here?.reel ? ` (incl. ${here.reel}s reel)` : ''}
        </span>
      </header>

      <main className="pv__main">
        <ScriptPanel scene={scene} step={step} show="all" onPress={(s) => goto(sceneIndex, s)} />
      </main>

      <aside className="pv__side">
        <div className={`pv__clock pv__clock--${pace}`}>
          <span className="pv__elapsed">{mmss(elapsed)}</span>
          <span className="pv__pace">
            {pace === 'idle' ? 'starts on the first click' : pace === 'late' ? `${mmss(drift)} behind` : pace === 'early' ? `${mmss(drift)} ahead` : 'on pace'}
          </span>
          <span className="pv__plan">
            plan {mmss(planned)} · {remaining >= 0 ? `${mmss(remaining)} left` : `${mmss(remaining)} over`}
          </span>
        </div>

        <div className="pv__buttons">
          <button type="button" onClick={tap(prev)}>‹ Back</button>
          <button type="button" className="pv__go" onClick={tap(next)}>Next ›</button>
        </div>
        <div className="pv__buttons pv__buttons--small">
          <button type="button" onClick={tap(toggleBlackout)} className={blackout ? 'is-on' : ''}>
            {blackout ? 'Screen blank: show' : 'Blank screen'}
          </button>
          <button type="button" onClick={tap(reset)}>Reset clock</button>
        </div>

        {nextScene && (
          <div className="pv__next">
            <span className="pv__label">
              {step < scene.steps - 1 ? `Next press · ${scene.sheet}` : 'Next sheet'}
            </span>
            {step < scene.steps - 1 ? (
              <p>{here?.blocks[step + 1]?.cue}</p>
            ) : (
              <p>
                <b>{nextScene.sheet} {nextScene.title}</b>
                {nextScript ? ` — ${nextScript.blocks[0].cue}` : ''}
              </p>
            )}
          </div>
        )}

        <div className="pv__jump">
          <span className="pv__label">Jump to a sheet</span>
          <div className="pv__grid">
            {SCENES.map((s, i) => (
              <button
                type="button"
                key={s.sheet}
                title={s.title}
                className={i === sceneIndex ? 'is-on' : ''}
                onClick={tap(() => goto(i, 0))}
              >
                {s.sheet.slice(2)}
              </button>
            ))}
          </div>
        </div>

        <p className={`pv__link ${linked ? 'is-linked' : ''}`}>
          {linked
            ? '● Linked to the audience window'
            : '○ Not linked yet. Open the deck in the other window first. If it still will not link, press N on the sheet instead.'}
        </p>
      </aside>
    </div>
  )
}
