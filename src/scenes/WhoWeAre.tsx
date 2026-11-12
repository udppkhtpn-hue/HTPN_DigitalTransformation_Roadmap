import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { DrawPath } from '../kit/DrawPath.tsx'
import type { TeamMember } from '../content/scenes.ts'
import type { SceneProps } from './index.ts'
import azhar from '../assets/team-azhar.webp'
import fairis from '../assets/team-fairis.webp'
import naim from '../assets/team-naim.webp'
import syafiz from '../assets/team-syafiz.webp'
import megat from '../assets/team-megat.webp'
import kenny from '../assets/team-kenny.webp'
import './whoweare.css'

const c = sceneContent('who-we-are')

const PHOTO: Record<TeamMember['photo'], string> = { azhar, fairis, naim, syafiz, megat, kenny }

const CARD_W = 233
const CARD_GAP = 24
const CARD_Y = 340
const CARD_H = 390
const X0 = 200

/**
 * Who is in the room behind "we".
 *
 * Press 1 is the team: six cards drawn on the sheet, each a duotone
 * portrait, a name and a role, with the line that says why this team can do
 * it. Press 2 takes the cards away and sets out what the team studied first,
 * since the next sheet's claim is that leaders learn first and this is the
 * evidence for it: seven programmes, completed ones in cyan, ongoing in
 * amber.
 */
export function WhoWeAre({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const t = reduced ? 0 : 1
  const team = step === 0

  return (
    <div className="sc ww">
      <AnimatePresence mode="wait">
        {team ? (
          <motion.div
            key="team"
            className="ww__page"
            initial={false}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <motion.h1
              className="ww__head"
              initial={{ opacity: 0, y: 14 * t }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 * t, ease: [0.16, 1, 0.3, 1] }}
            >
              {c.heading}
            </motion.h1>
            <motion.p
              className="ww__since"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 * t }}
            >
              <b>{c.established}</b> — {c.since}
            </motion.p>

            <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
              {c.team.map((_, i) => {
                const x = X0 + i * (CARD_W + CARD_GAP)
                return (
                  <DrawPath
                    key={i}
                    d={`M ${x} ${CARD_Y} h ${CARD_W} v ${CARD_H} h ${-CARD_W} z`}
                    delay={(0.5 + i * 0.1) * t}
                    duration={0.7}
                    opacity={0.45}
                  />
                )
              })}
            </svg>

            {c.team.map((m, i) => (
              <motion.div
                className="ww__card"
                key={m.name}
                style={{ left: X0 + i * (CARD_W + CARD_GAP), top: CARD_Y, height: CARD_H }}
                initial={{ opacity: 0, y: 12 * t }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (0.8 + i * 0.1) * t, ease: [0.16, 1, 0.3, 1] }}
              >
                <img className="ww__photo" src={PHOTO[m.photo]} alt="" width={150} height={150} />
                <span className="ww__name">{m.name}</span>
                <span className="ww__role">{m.role}</span>
              </motion.div>
            ))}

            <motion.div
              className="ww__closer"
              initial={{ opacity: 0, y: 12 * t }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 * t, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="ww__closer-lead">
                <b>{c.closer.lead}</b>
                {c.closer.rest}
              </p>
              <p className="ww__closer-line">{c.closer.line}</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="credentials"
            className="ww__page"
            initial={false}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <motion.p
              className="ww__eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * t }}
            >
              {c.eyebrow}
            </motion.p>
            <motion.h1
              className="ww__head ww__head--small"
              initial={{ opacity: 0, y: 12 * t }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 * t, ease: [0.16, 1, 0.3, 1] }}
            >
              {c.credentialsHeading}
            </motion.h1>

            <ul className="ww__rows">
              {c.credentials.map((r, i) => (
                <motion.li
                  className="ww__row"
                  key={r.text}
                  initial={{ opacity: 0, x: -14 * t }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: (0.4 + i * 0.16) * t, ease: [0.16, 1, 0.3, 1] }}
                >
                  <svg className="ww__book" viewBox="0 0 40 40" aria-hidden="true">
                    <path d="M20 9 C15 6 9 6 5 8 V31 C9 29 15 29 20 32 C25 29 31 29 35 31 V8 C31 6 25 6 20 9 Z M20 9 V32" />
                  </svg>
                  <span className="ww__text">{r.text}</span>
                  <span className="ww__who">{r.who}</span>
                  <span className={`ww__status ww__status--${r.status.toLowerCase()}`}>{r.status}</span>
                </motion.li>
              ))}
            </ul>

            <motion.p
              className="ww__cred-closer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: (0.4 + c.credentials.length * 0.16 + 0.2) * t }}
            >
              <b>{c.credentialsCloser.lead}</b>
              {c.credentialsCloser.rest}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
