import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'

/** A tap is a press that did not travel. Anything further is a swipe. */
const TAP_SLOP = 10
/** A swipe has to be a deliberate horizontal throw, not a nudge. */
const SWIPE = 50
/** Left third goes back; the remaining two thirds go forward. */
const BACK_ZONE = 1 / 3

type Nav = { next: () => void; prev: () => void }

/**
 * Tap, click and swipe, so the deck works without a keyboard.
 *
 * One pointerdown/pointerup pair covers touch, pen and mouse — iPhone, iPad
 * and a laptop with no clicker all land here. Only the gesture decides what
 * happens: a press that stayed within ten pixels is a tap and the side of
 * the screen chooses direction; a horizontal throw of fifty pixels or more
 * is a swipe; a vertical drag is neither, so scrolling a long notes panel
 * never advances a sheet by accident.
 */
export function usePointerNav({ next, prev }: Nav) {
  const down = useRef<{ id: number; x: number; y: number } | null>(null)

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    // Primary button only: a right-click or a middle-click is not a press.
    if (e.pointerType === 'mouse' && e.button !== 0) return
    down.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const start = down.current
      down.current = null
      if (!start || start.id !== e.pointerId) return

      // Anything that can be operated keeps its own press. `video[controls]`
      // rather than `video`: the reel on S-07 is full-bleed and silent
      // chrome, so a tap on it has to advance the sheet like any other — it
      // only grows controls under reduced motion, and then they win.
      if (
        e.target instanceof Element &&
        e.target.closest('a,button,video[controls],[data-no-advance]')
      )
        return

      const dx = e.clientX - start.x
      const dy = e.clientY - start.y

      if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next()
        else prev()
        return
      }

      if (Math.hypot(dx, dy) > TAP_SLOP) return

      const w = e.currentTarget.clientWidth || window.innerWidth
      if (e.clientX - e.currentTarget.getBoundingClientRect().left < w * BACK_ZONE) prev()
      else next()
    },
    [next, prev],
  )

  const onPointerCancel = useCallback(() => {
    down.current = null
  }, [])

  return { onPointerDown, onPointerUp, onPointerCancel }
}
