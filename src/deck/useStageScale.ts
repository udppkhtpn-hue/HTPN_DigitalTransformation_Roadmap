import { useEffect, useState, type RefObject } from 'react'

const W = 1920
const H = 1080

/**
 * Scale the 1920×1080 stage to fit whatever the projector negotiates.
 *
 * Everything inside the stage is a plain pixel at design size — no vmin
 * arithmetic, no responsive thinking, no media queries. One GPU-composited
 * transform does all of it, so a projector that comes up 1280×720 or an odd
 * 1600×900 just works.
 *
 * Measured from the letterbox element rather than `window.innerHeight`,
 * because on iOS those two disagree: `innerHeight` counts the strip under
 * Safari's toolbar, and scaling to it crops the bottom of the sheet. The
 * letterbox is sized in `dvh`, so its own box is the honest number. A
 * ResizeObserver catches every way it can change — rotation, the toolbar
 * sliding away, entering full screen — and the window and visualViewport
 * listeners cover the one browser whose observer fires late.
 */
export function useStageScale(ref: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(() =>
    typeof window === 'undefined'
      ? 1
      : Math.min(window.innerWidth / W, window.innerHeight / H),
  )

  useEffect(() => {
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = ref.current
        const w = el?.clientWidth || window.innerWidth
        const h = el?.clientHeight || window.innerHeight
        setScale(Math.min(w / W, h / H))
      })
    }

    measure()

    const ro =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    if (ro && ref.current) ro.observe(ref.current)

    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    window.visualViewport?.addEventListener('resize', measure)
    // Fullscreen changes the viewport without always firing resize first.
    document.addEventListener('fullscreenchange', measure)
    document.addEventListener('webkitfullscreenchange', measure)

    return () => {
      cancelAnimationFrame(frame)
      ro?.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      window.visualViewport?.removeEventListener('resize', measure)
      document.removeEventListener('fullscreenchange', measure)
      document.removeEventListener('webkitfullscreenchange', measure)
    }
  }, [ref])

  return scale
}
