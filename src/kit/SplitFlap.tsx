import { motion, useReducedMotion } from 'motion/react'
import './splitflap.css'

interface Props {
  from: string
  to: string
  flipped: boolean
  /** Seconds to hold the "from" face before turning. */
  delay?: number
  className?: string
}

/**
 * Shared prefix up to a word boundary; everything after it flips.
 *
 * Trimming a shared *suffix* as well ("sourced") is tempting and looks
 * tighter in theory, but it leaves the flipping cell sized to the longer
 * word, so after the turn there is a hole between the short word and the
 * static remainder. Flipping the whole word avoids that entirely.
 */
function split(a: string, b: string) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  const boundary = a.lastIndexOf(' ', i) + 1
  return {
    head: a.slice(0, boundary),
    fromMid: a.slice(boundary),
    toMid: b.slice(boundary),
  }
}

/**
 * The one moment on S-04: "85% outsourced" becomes "85% insourced".
 *
 * Only the word that changes flips. Diffing character by character looked
 * obvious but is wrong here — the two strings are different lengths, so
 * almost every position differs and the result is noise rather than a
 * legible change. Flipping the differing span as one block says exactly
 * what moved.
 *
 * Both faces sit in the same grid cell so the block is as wide as the wider
 * word and nothing reflows mid-flip.
 */
export function SplitFlap({ from, to, flipped, delay = 0, className }: Props) {
  const reduced = useReducedMotion()
  const { head, fromMid, toMid } = split(from, to)

  if (reduced) {
    return <span className={className}>{flipped ? to : from}</span>
  }

  return (
    <span className={`flap ${className ?? ''}`} aria-label={flipped ? to : from}>
      {head && <span>{head}</span>}
      <span className="flap__cell">
        <motion.span
          className="flap__inner"
          animate={{ rotateX: flipped ? -180 : 0 }}
          transition={{ duration: 0.62, delay: flipped ? delay : 0, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="flap__face flap__face--front">{fromMid}</span>
          <span className="flap__face flap__face--back">{toMid}</span>
        </motion.span>
      </span>
    </span>
  )
}
