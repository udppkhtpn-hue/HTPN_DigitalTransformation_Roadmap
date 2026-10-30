import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { WidthType } from '../kit/WidthType.tsx'
import { QR } from '../kit/QR.tsx'
import blueprint from '../assets/blueprint-htpn.webp'
import type { SceneProps } from './index.ts'
import './s12.css'

const c = sceneContent('lesson-and-close')

const [head, tail] = c.before.split(c.strike)

/**
 * The lesson, then the close.
 *
 * "culture" is struck through by hand rather than recoloured or faded — the
 * correction has to look like something a person did to their own sentence,
 * because that is what the line is about.
 */
export function S12LessonAndClose({ step }: SceneProps) {
  const reduced = useReducedMotion()
  const struck = step >= 1
  const closing = step >= 2

  return (
    <div className="sc s12">
      <AnimatePresence mode="wait">
        {!closing ? (
          <motion.div
            className="s12__lesson"
            key="lesson"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="s12__before">
              {head}
              <span className="s12__strike-wrap">
                {c.strike}
                {struck && (
                  <svg
                    className="s12__strike"
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M 3 13 C 46 7, 92 15, 138 9 S 186 12, 197 8"
                      fill="none"
                      stroke="var(--alert)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
                      animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                  </svg>
                )}
              </span>
              {tail}
            </p>

            {struck && (
              <p className="s12__after">
                <WidthType
                  from={{ wdth: 62, wght: 650 }}
                  to={{ wdth: 112, wght: 650 }}
                  duration={0.85}
                  delay={0.45}
                >
                  {c.after}
                </WidthType>
              </p>
            )}

            {struck && (
              <motion.ul
                className="s12__lines"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                {c.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="s12__close"
            key="close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img className="s12__bg" src={blueprint} alt="" aria-hidden="true" />

            <div className="s12__close-text">
              {c.closing.map((line, i) => (
                <motion.span
                  className="s12__closing-line"
                  key={line}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.22 }}
                >
                  {line}
                </motion.span>
              ))}
              <motion.span
                className="s12__thanks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                {c.thanks}
              </motion.span>
            </div>

            <div className="s12__codes">
              {c.codes.map((q, i) => (
                <QR
                  key={q.label}
                  code={i === 0 ? 'showcase' : 'innovathon'}
                  size={186}
                  delay={1.2 + i * 0.15}
                  caption={`${q.label}\n${q.url.replace(/^https:\/\//, '').replace(/\/$/, '')}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
