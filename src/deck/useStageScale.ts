import { useEffect, useState } from 'react'

const W = 1920
const H = 1080

/**
 * Scale the 1920×1080 stage to fit whatever the projector negotiates.
 *
 * Everything inside the stage is a plain pixel at design size — no vmin
 * arithmetic, no responsive thinking, no media queries. One GPU-composited
 * transform does all of it, so a projector that comes up 1280×720 or an odd
 * 1600×900 just works.
 */
export function useStageScale(): number {
  const [scale, setScale] = useState(() =>
    typeof window === 'undefined'
      ? 1
      : Math.min(window.innerWidth / W, window.innerHeight / H),
  )

  useEffect(() => {
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() =>
        setScale(Math.min(window.innerWidth / W, window.innerHeight / H)),
      )
    }
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    // Fullscreen changes the viewport without always firing resize first.
    document.addEventListener('fullscreenchange', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      document.removeEventListener('fullscreenchange', measure)
    }
  }, [])

  return scale
}
