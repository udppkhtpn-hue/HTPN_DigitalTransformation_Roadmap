import { useEffect, useRef } from 'react'
import { SCRIPT } from '../content/script.ts'
import type { Scene } from '../content/scenes.ts'
import './scriptpanel.css'

interface Props {
  scene: Scene
  step: number
  /** 'all' lists the whole sheet; 'near' the current press and the next. */
  show: 'all' | 'near'
  onPress?: (step: number) => void
}

/**
 * The spoken script for one sheet, press by press.
 *
 * The press you are on is lit, the ones behind it are dimmed, and the list
 * follows the clicker on its own so the next paragraph is always in view.
 * Each press opens with what it brings up on the screen, in mono, so the
 * click and the words can be matched at a glance.
 */
export function ScriptPanel({ scene, step, show, onPress }: Props) {
  const script = SCRIPT[scene.sheet]
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current?.querySelector<HTMLElement>('[data-active="true"]')
    if (!el || !box.current) return
    const top = el.offsetTop - box.current.offsetTop - 12
    box.current.scrollTo({ top, behavior: 'smooth' })
  }, [scene.sheet, step])

  if (!script) return <p className="script__fallback">{scene.notes}</p>

  const blocks = show === 'all' ? script.blocks : script.blocks.filter((b) => b.step >= step && b.step <= step + 1)

  return (
    <div className="script" ref={box}>
      {script.act && step === 0 && (
        <p className="script__act">
          <b>{script.act.title}.</b> {script.act.note}
        </p>
      )}
      {blocks.map((b) => {
        const state = b.step === step ? 'now' : b.step < step ? 'done' : 'next'
        return (
          <section
            key={b.step}
            className={`script__block script__block--${state}`}
            data-active={b.step === step}
            onClick={onPress ? () => onPress(b.step) : undefined}
          >
            <p className="script__cue">
              {script.blocks.length > 1 ? `Press ${b.step + 1} · ` : ''}
              {b.cue}
            </p>
            {b.paras.map((p, i) => (
              <p className="script__para" key={i}>
                {p}
              </p>
            ))}
          </section>
        )
      })}
    </div>
  )
}
