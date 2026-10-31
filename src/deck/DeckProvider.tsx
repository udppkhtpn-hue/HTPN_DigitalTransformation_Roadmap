import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SCENES, type Scene } from '../content/scenes.ts'
import { toggleFullscreen } from './fullscreen.ts'

interface Cursor {
  sceneIndex: number
  step: number
}

interface Deck extends Cursor {
  scene: Scene
  total: number
  next: () => void
  prev: () => void
  goto: (sceneIndex: number, step?: number) => void
  blackout: boolean
  notesOpen: boolean
  toggleNotes: () => void
  toggleBlackout: () => void
  fullscreen: () => void
  elapsed: number
  running: boolean
  reset: () => void
}

const DeckContext = createContext<Deck | null>(null)

export function useDeck(): Deck {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeck must be used inside <DeckProvider>')
  return ctx
}

const STORE_KEY = 'htpn-deck-cursor'

function readInitial(): Cursor {
  // The hash wins — it survives a reload and can be typed during a rehearsal.
  const m = /^#\/s\/(\d+)(?:\/(\d+))?/.exec(window.location.hash)
  if (m) {
    const si = clampScene(Number(m[1]) - 1)
    return { sceneIndex: si, step: clampStep(si, Number(m[2] ?? 0)) }
  }
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    if (raw) {
      const c = JSON.parse(raw) as Cursor
      const si = clampScene(c.sceneIndex)
      return { sceneIndex: si, step: clampStep(si, c.step) }
    }
  } catch {
    /* private window, blocked storage — start from the top */
  }
  return { sceneIndex: 0, step: 0 }
}

const clampScene = (i: number) =>
  Number.isFinite(i) ? Math.min(Math.max(i, 0), SCENES.length - 1) : 0

const clampStep = (sceneIndex: number, step: number) =>
  Number.isFinite(step)
    ? Math.min(Math.max(step, 0), SCENES[sceneIndex].steps - 1)
    : 0

export function DeckProvider({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState<Cursor>(readInitial)
  const [blackout, setBlackout] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const gotoBuffer = useRef('')

  const scene = SCENES[cursor.sceneIndex]

  // ── movement ──────────────────────────────────────────────────────────
  // Every scene renders purely from `step`, so forward and back are the same
  // operation and Motion resolves the delta. Going backwards mid-talk, when
  // someone asks a question, is as valid as going forwards.

  const next = useCallback(() => {
    setRunning(true)
    setCursor((c) => {
      const s = SCENES[c.sceneIndex]
      if (c.step < s.steps - 1) return { ...c, step: c.step + 1 }
      if (c.sceneIndex < SCENES.length - 1)
        return { sceneIndex: c.sceneIndex + 1, step: 0 }
      return c
    })
  }, [])

  const prev = useCallback(() => {
    setCursor((c) => {
      if (c.step > 0) return { ...c, step: c.step - 1 }
      if (c.sceneIndex > 0) {
        const i = c.sceneIndex - 1
        return { sceneIndex: i, step: SCENES[i].steps - 1 }
      }
      return c
    })
  }, [])

  const goto = useCallback((sceneIndex: number, step = 0) => {
    const si = clampScene(sceneIndex)
    setCursor({ sceneIndex: si, step: clampStep(si, step) })
  }, [])

  const toggleNotes = useCallback(() => setNotesOpen((v) => !v), [])
  const toggleBlackout = useCallback(() => setBlackout((v) => !v), [])
  const fullscreen = useCallback(() => toggleFullscreen(), [])

  const reset = useCallback(() => {
    setCursor({ sceneIndex: 0, step: 0 })
    setElapsed(0)
    setRunning(false)
  }, [])

  // ── clicker ───────────────────────────────────────────────────────────
  // Presenter remotes are inconsistent about which keys they send, so bind
  // generously. Space is swallowed so it can never scroll the page.

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key

      if (/^[0-9]$/.test(k)) {
        gotoBuffer.current += k
        return
      }
      if (k === 'Enter' && gotoBuffer.current) {
        goto(Number(gotoBuffer.current) - 1, 0)
        gotoBuffer.current = ''
        e.preventDefault()
        return
      }
      gotoBuffer.current = ''

      switch (k) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'Home':
          e.preventDefault()
          goto(0, 0)
          break
        case 'End':
          e.preventDefault()
          goto(SCENES.length - 1, SCENES[SCENES.length - 1].steps - 1)
          break
        case '.':
        case 'b':
        case 'B':
          e.preventDefault()
          setBlackout((v) => !v)
          break
        case '[':
        case ']': {
          // Trim the bed live: the right level depends on the room's PA,
          // which you only find out once you are standing in it.
          e.preventDefault()
          const d = k === ']' ? 0.05 : -0.05
          document.querySelectorAll('video').forEach((v) => {
            v.volume = Math.min(1, Math.max(0, Math.round((v.volume + d) * 100) / 100))
          })
          break
        }
        case 'm':
        case 'M':
          e.preventDefault()
          document
            .querySelectorAll('video')
            .forEach((v) => {
              v.muted = !v.muted
            })
          break
        case 'n':
        case 'N':
          e.preventDefault()
          setNotesOpen((v) => !v)
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          reset()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goto, reset])

  // ── persistence ───────────────────────────────────────────────────────
  // A reload or a crash at minute four lands back on the exact beat.
  // replaceState so the clicker never builds up history to go "back" through.

  useEffect(() => {
    const hash = `#/s/${cursor.sceneIndex + 1}/${cursor.step}`
    if (window.location.hash !== hash)
      window.history.replaceState(null, '', hash)
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(cursor))
    } catch {
      /* ignore */
    }
  }, [cursor])

  // Typing a sheet into the address bar jumps there, which is how you get
  // around in rehearsal without clicking through twenty-three steps.
  useEffect(() => {
    const onHash = () => {
      const m = /^#\/s\/(\d+)(?:\/(\d+))?/.exec(window.location.hash)
      if (!m) return
      const si = clampScene(Number(m[1]) - 1)
      const st = clampStep(si, Number(m[2] ?? 0))
      setCursor((c) =>
        c.sceneIndex === si && c.step === st ? c : { sceneIndex: si, step: st },
      )
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // ── timer ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [running])

  // ── keep the laptop awake ─────────────────────────────────────────────

  useEffect(() => {
    if (!running) return
    let lock: WakeLockSentinel | null = null
    const request = async () => {
      try {
        lock = await navigator.wakeLock?.request('screen')
      } catch {
        /* unsupported or denied — not fatal */
      }
    }
    void request()
    const onVisible = () => {
      if (document.visibilityState === 'visible') void request()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      void lock?.release().catch(() => {})
    }
  }, [running])

  const value = useMemo<Deck>(
    () => ({
      ...cursor,
      scene,
      total: SCENES.length,
      next,
      prev,
      goto,
      blackout,
      notesOpen,
      toggleNotes,
      toggleBlackout,
      fullscreen,
      elapsed,
      running,
      reset,
    }),
    [
      cursor,
      scene,
      next,
      prev,
      goto,
      blackout,
      notesOpen,
      toggleNotes,
      toggleBlackout,
      fullscreen,
      elapsed,
      running,
      reset,
    ],
  )

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
}
