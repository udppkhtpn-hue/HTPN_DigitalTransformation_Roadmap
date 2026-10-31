import { motion } from 'motion/react'
import './titleblock.css'

interface Props {
  sheet: string
  title: string
  total: number
}

/**
 * The drawing sheet's title block, bottom-right, on every scene.
 *
 * This is the deck's only persistent chrome and it replaces a progress bar:
 * the sheet number tells you where you are the way a real print does. Its
 * border redraws on each scene change, which is the one place the title
 * block moves at all.
 */
export function TitleBlock({ sheet, title, total }: Props) {
  return (
    <div className="tblock">
      <svg className="tblock__frame" viewBox="0 0 600 154" aria-hidden="true">
        {/* Redrawn on every scene change — `key` restarts the draw. */}
        <motion.rect
          key={sheet}
          x="0.5"
          y="0.5"
          width="599"
          height="153"
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <line
          x1="0"
          y1="52"
          x2="600"
          y2="52"
          stroke="var(--line)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="392"
          y1="52"
          x2="392"
          y2="154"
          stroke="var(--line)"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      <div className="tblock__org">HTPN · Built From Within</div>

      <div className="tblock__title" title={title}>
        {title}
      </div>

      <div className="tblock__sheet">
        <span className="tblock__sheet-no">{sheet}</span>
        <span className="tblock__sheet-of">/ {total}</span>
      </div>
    </div>
  )
}
