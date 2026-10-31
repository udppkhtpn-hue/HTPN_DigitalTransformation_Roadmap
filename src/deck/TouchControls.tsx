import { useEffect, useState } from 'react'
import { useDeck } from './DeckProvider.tsx'
import { supportsFullscreen } from './fullscreen.ts'
import './touchcontrols.css'

/** How long the strip stays legible after the last touch. */
const IDLE_MS = 3000

/**
 * The four things a clicker does, for a presenter holding a phone.
 *
 * Shown only where there is no keyboard — `(pointer: coarse)` in CSS, so
 * the projector never sees it. It sits in the bottom-left corner, outside
 * the title block, and fades to 15% three seconds after the last touch:
 * present enough to find in the dark, quiet enough to ignore.
 *
 * `data-no-advance` keeps the tap-zone handler off these buttons.
 */
export function TouchControls() {
  const { next, prev, toggleNotes, fullscreen } = useDeck()
  const [awake, setAwake] = useState(true)

  useEffect(() => {
    let id = window.setTimeout(() => setAwake(false), IDLE_MS)
    const poke = () => {
      setAwake(true)
      window.clearTimeout(id)
      id = window.setTimeout(() => setAwake(false), IDLE_MS)
    }
    window.addEventListener('pointerdown', poke)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('pointerdown', poke)
    }
  }, [])

  return (
    <div
      className={`tctl${awake ? '' : ' tctl--idle'}`}
      data-no-advance=""
      role="group"
      aria-label="Deck controls"
    >
      <button className="tctl__b" onClick={prev} aria-label="Previous step">
        ‹
      </button>
      <button className="tctl__b" onClick={next} aria-label="Next step">
        ›
      </button>
      <button className="tctl__b tctl__b--word" onClick={toggleNotes}>
        Notes
      </button>
      {supportsFullscreen() && (
        <button className="tctl__b tctl__b--word" onClick={fullscreen}>
          Full screen
        </button>
      )}
    </div>
  )
}
