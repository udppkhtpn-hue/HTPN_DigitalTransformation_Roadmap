import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './boot.css'

/**
 * Every image, so none of them decodes for the first time on stage.
 *
 * No `?url` here: that gives the asset a different module id from the plain
 * `import blueprint from '...'` the scenes use, so the offline build inlined
 * every image twice and the single file came out a megabyte heavier.
 */
const ASSETS = Object.values(
  import.meta.glob('../assets/*.{webp,png}', { eager: true, import: 'default' }),
) as string[]

/**
 * Nothing paints until the fonts are loaded and every image has decoded.
 *
 * A typeface swapping mid-sentence on a projector is the classic way this
 * goes wrong, and it always happens on the first slide in front of the
 * biggest audience. The wait is dressed as the title block drawing itself,
 * so it reads as part of the show.
 */
export function Boot({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const images = ASSETS.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => img.decode().then(() => resolve(), () => resolve())
          img.onerror = () => resolve()
          img.src = src
        }),
    )

    // Never hang on a font or image that will not arrive.
    const guard = new Promise<void>((r) => setTimeout(r, 6000))

    void Promise.race([
      Promise.all([document.fonts.ready, ...images]),
      guard,
    ]).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <svg className="boot__mark" viewBox="0 0 240 80" aria-hidden="true">
              <motion.rect
                x="0.5"
                y="0.5"
                width="239"
                height="79"
                fill="none"
                stroke="var(--line)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
            <span className="boot__label">HTPN · Built From Within</span>
          </motion.div>
        )}
      </AnimatePresence>
      {ready && children}
    </>
  )
}
