import { motion } from 'motion/react'
import './titleblock.css'

interface Props {
  sheet: string
  total: number
}

/**
 * The drawing sheet's title block, bottom-right, on every scene.
 *
 * The sheet's name used to sit here too, at 38px; it now stands at the
 * top-left of the sheet (Stage.tsx), large enough to read from the back, and
 * the block keeps the programme and the sheet number on one row.
 *
 * This is the deck's only persistent chrome and it replaces a progress bar:
 * the sheet number tells you where you are the way a real print does. Its
 * border redraws on each scene change, which is the one place the title
 * block moves at all.
 */
export function TitleBlock({ sheet, total }: Props) {
  return (
    <div className="tblock">
      <svg className="tblock__frame" viewBox="0 0 600 102" aria-hidden="true">
        {/* Redrawn on every scene change — `key` restarts the draw. */}
        <motion.rect
          key={sheet}
          x="0.5"
          y="0.5"
          width="599"
          height="101"
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <line
          x1="392"
          y1="0"
          x2="392"
          y2="102"
          stroke="var(--line)"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      <div className="tblock__org">HTPN · Built From Within</div>

      <div className="tblock__sheet">
        <span className="tblock__sheet-no">{sheet}</span>
        <span className="tblock__sheet-of">/ {total}</span>
      </div>
    </div>
  )
}
