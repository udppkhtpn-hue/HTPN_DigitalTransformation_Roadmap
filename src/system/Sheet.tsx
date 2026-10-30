import grain from '../assets/grain.png'
import './sheet.css'

/**
 * The static drawing sheet behind every scene. Rendered once at the root,
 * outside AnimatePresence, so changing scene never re-rasterises it.
 */
export function Sheet() {
  return (
    <div className="sheet" aria-hidden="true">
      <div className="sheet__grid sheet__grid--minor" />
      <div className="sheet__grid sheet__grid--major" />
      <div
        className="sheet__grain"
        style={{ ['--grain-url' as string]: `url(${grain})` }}
      />
      <div className="sheet__vignette" />
      <div className="sheet__border" />
    </div>
  )
}
