import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Leaders, TeamMember } from '../content/scenes.ts'
import azhar from '../assets/team-azhar.webp'
import fairis from '../assets/team-fairis.webp'
import naim from '../assets/team-naim.webp'
import syafiz from '../assets/team-syafiz.webp'
import megat from '../assets/team-megat.webp'
import kenny from '../assets/team-kenny.webp'
import './leaderskinetic.css'

const PHOTO: Record<TeamMember['photo'], string> = { azhar, fairis, naim, syafiz, megat, kenny }

/** "Dr Naim • Dr Fairis" → the portraits of the people named. */
const faces = (who: string) =>
  who.split('•').map((n) => {
    const key = (Object.keys(PHOTO) as TeamMember['photo'][]).find((k) =>
      n.toLowerCase().includes(k),
    )
    return { name: n.trim(), src: key ? PHOTO[key] : undefined }
  })

type Card =
  | { kind: 'intro'; hold: number }
  | { kind: 'person'; hold: number; m: TeamMember; i: number }
  | { kind: 'say'; hold: number; lead: string; rest: string; tone: 'line' | 'signal' }
  | { kind: 'cred'; hold: number; c: Leaders['credentials'][number]; i: number }

const EASE = [0.16, 1, 0.3, 1] as const

/** A line that arrives word by word: the kinetic part of the type. */
function Words({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          className="lk__word"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: delay + i * 0.045, ease: EASE }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * The team, and what they studied first, as one running sequence.
 *
 * It replaces a table that could only be read in silence. One thing is on
 * the panel at a time, set large: who the office is, each of the six with a
 * portrait and role, the line about clinicians leading from within, then
 * the seven programmes one by one, each stamped Completed or Ongoing with
 * the faces of whoever took it, and the line it all adds up to. Then it
 * starts again, for as long as stage 1 is being spoken.
 */
export function LeadersKinetic({ c }: { c: Leaders }) {
  const reduced = useReducedMotion()

  const cards = useMemo<Card[]>(
    () => [
      { kind: 'intro', hold: 2.6 },
      ...c.team.map((m, i) => ({ kind: 'person' as const, hold: 1.8, m, i })),
      { kind: 'say', hold: 3.2, lead: c.closer.lead, rest: c.closer.rest, tone: 'line' },
      ...c.credentials.map((cr, i) => ({ kind: 'cred' as const, hold: 2.5, c: cr, i })),
      { kind: 'say', hold: 3.4, lead: c.credentialsCloser.lead, rest: c.credentialsCloser.rest, tone: 'signal' },
    ],
    [c],
  )

  const [at, setAt] = useState(0)
  useEffect(() => {
    const id = window.setTimeout(() => setAt((n) => (n + 1) % cards.length), cards[at].hold * 1000)
    return () => window.clearTimeout(id)
  }, [at, cards])

  const card = cards[at]
  const label =
    card.kind === 'person'
      ? `The team · ${card.i + 1} / ${c.team.length}`
      : card.kind === 'cred'
        ? `${c.credentialsHeading} · ${card.i + 1} / ${c.credentials.length}`
        : card.kind === 'intro'
          ? 'Who we are'
          : card.tone === 'line'
            ? 'From within'
            : c.credentialsHeading

  return (
    <div className="lk" role="region" aria-label={c.heading} aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={label}
          className="lk__label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={at}
          className={`lk__card lk__card--${card.kind}`}
          initial={{ opacity: 0, x: reduced ? 0 : 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduced ? 0 : -48, transition: { duration: 0.28, ease: 'easeIn' } }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {card.kind === 'intro' && (
            <>
              <Words text={c.heading} className="lk__intro-head" />
              <motion.p
                className="lk__intro-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <b>{c.established}</b> — {c.since}
              </motion.p>
            </>
          )}

          {card.kind === 'person' && (
            <>
              <motion.img
                className="lk__face"
                src={PHOTO[card.m.photo]}
                alt=""
                width={210}
                height={210}
                initial={{ scale: reduced ? 1 : 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              <div className="lk__who">
                <Words text={card.m.name} delay={0.12} className="lk__name" />
                <motion.span
                  className="lk__role"
                  initial={{ opacity: 0, x: reduced ? 0 : -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  {card.m.role}
                </motion.span>
              </div>
            </>
          )}

          {card.kind === 'say' && (
            <p className={`lk__say lk__say--${card.tone}`}>
              <Words text={card.lead} className="lk__say-lead" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + card.lead.split(' ').length * 0.045 }}
              >
                {card.rest}
              </motion.span>
            </p>
          )}

          {card.kind === 'cred' && (
            <>
              <Words text={card.c.text} className="lk__cred" />
              <div className="lk__by">
                {faces(card.c.who).map((f, k) => (
                  <motion.span
                    key={f.name}
                    className="lk__by-one"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.5 + k * 0.12 }}
                  >
                    {f.src && <img src={f.src} alt="" width={58} height={58} />}
                    {f.name}
                  </motion.span>
                ))}
              </div>
              <motion.span
                className={`lk__stamp lk__stamp--${card.c.status.toLowerCase()}`}
                initial={{ opacity: 0, scale: reduced ? 1 : 1.8, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                transition={{ duration: 0.32, delay: 0.75, ease: [0.3, 1.4, 0.5, 1] }}
              >
                {card.c.status}
              </motion.span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* one tick per card, so the room can see the run is finite */}
      <div className="lk__ticks" aria-hidden="true">
        {cards.map((_, i) => (
          <i key={i} className={i === at ? 'is-on' : i < at ? 'is-done' : ''} />
        ))}
      </div>
    </div>
  )
}
