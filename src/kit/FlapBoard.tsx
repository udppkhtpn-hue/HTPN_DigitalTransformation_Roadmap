import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import './flapboard.css'

export interface FlapColumn {
  /** Tiles in the column; text is padded or cut to fit. */
  width: number
  align?: 'left' | 'right'
}

export interface FlapCell {
  text: string
  /** A class for the column's tiles on this row, for colour. */
  tone?: string
}

interface Props {
  columns: FlapColumn[]
  /** One entry per row, one cell per column. Fewer rows than `rows` are blank. */
  data: FlapCell[][]
  rows: number
  /** Seconds before the first tile moves. */
  delay?: number
  className?: string
}

const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&-./()'
const STEP_MS = 46
const ROW_MS = 70
const COL_MS = 9

const fit = (s: string, n: number, align: 'left' | 'right' = 'left') => {
  const t = s.toUpperCase().slice(0, n)
  return align === 'right' ? t.padStart(n) : t.padEnd(n)
}

interface Tile {
  el: HTMLSpanElement
  cur: string
  target: string
  /** Colour class it takes on when it lands, not before. */
  tone: string
  left: number
  next: number
}

/**
 * A departures board: one tile per character, every tile its own flap.
 *
 * When the text changes, each tile that differs runs through a few
 * characters of the drum before it settles, row by row and left to right,
 * so a new page ripples down the board the way it does on a station
 * concourse. Each flip is a short Web Animations scaleY on the character,
 * the flap folding about its hinge, run by the compositor. (A rotateX with
 * perspective looked the same and halved the frame rate across 1,200
 * tiles.) The characters themselves are written straight to
 * the DOM from one requestAnimationFrame loop, so React renders the board
 * once and never again while it clatters.
 */
export function FlapBoard({ columns, data, rows, delay = 0, className }: Props) {
  const reduced = useReducedMotion()
  const tiles = useRef<Tile[]>([])
  const width = columns.reduce((n, c) => n + c.width, 0)

  // The board's target text, tile by tile, and each tile's tone.
  const target = useMemo(() => {
    const chars: string[] = []
    const tones: string[] = []
    for (let r = 0; r < rows; r++) {
      columns.forEach((col, k) => {
        const cell = data[r]?.[k]
        const s = fit(cell?.text ?? '', col.width, col.align)
        for (const ch of s) {
          chars.push(ch)
          tones.push(cell?.tone ?? '')
        }
      })
    }
    return { chars, tones }
  }, [columns, data, rows])

  useEffect(() => {
    const list = tiles.current
    const now = performance.now() + delay * 1000
    list.forEach((t, i) => {
      if (!t) return
      t.target = target.chars[i]
      t.tone = target.tones[i]
      if (reduced || t.cur === t.target) t.el.parentElement!.className = `fb__t ${t.tone}`
      if (reduced) {
        t.cur = t.target
        t.el.textContent = t.target
        t.left = 0
        return
      }
      if (t.cur === t.target && t.left === 0) return
      const row = Math.floor(i / width)
      const col = i % width
      t.left = 2 + ((i * 7 + row * 3) % 4)
      t.next = now + row * ROW_MS + col * COL_MS
    })
    if (reduced) return

    let raf = 0
    const tick = (ms: number) => {
      let busy = false
      for (const t of list) {
        if (!t || t.left === 0) continue
        busy = true
        if (ms < t.next) continue
        t.left -= 1
        t.cur = t.left === 0 ? t.target : DRUM[(Math.random() * DRUM.length) | 0]
        t.el.textContent = t.cur
        if (t.left === 0) t.el.parentElement!.className = `fb__t ${t.tone}`
        t.el.animate(
          [
            { transform: 'scaleY(0.1)', opacity: 0.4 },
            { transform: 'scaleY(1)', opacity: 1 },
          ],
          { duration: STEP_MS + 10, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' },
        )
        t.next = ms + STEP_MS
      }
      if (busy) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, width, delay, reduced])

  // Rendered once; the effect above writes every character after that.
  return (
    <div className={`fb ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: rows }, (_, r) => (
        <div className="fb__row" key={r}>
          {columns.map((col, k) => (
            <span className="fb__col" key={k}>
              {Array.from({ length: col.width }, (_, j) => {
                const i = r * width + columns.slice(0, k).reduce((n, c) => n + c.width, 0) + j
                return (
                  <span className="fb__t" key={j}>
                    <span
                      className="fb__c"
                      ref={(el) => {
                        if (el && !tiles.current[i]) {
                          tiles.current[i] = { el, cur: ' ', target: ' ', tone: '', left: 0, next: 0 }
                        }
                      }}
                    >
                      {' '}
                    </span>
                  </span>
                )
              })}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
