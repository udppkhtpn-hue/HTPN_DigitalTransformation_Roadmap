import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { sceneContent } from './content.ts'
import { LEADERS } from '../content/photos.ts'
import syllabus from '../assets/syllabus.webp'
import padlet from '../assets/padlet.webp'
import kotter from '../assets/kotter.webp'
import { QR } from '../kit/QR.tsx'
import { LeadersKinetic } from './LeadersKinetic.tsx'
import { DrawPath } from '../kit/DrawPath.tsx'
import { PhotoReel } from '../kit/PhotoReel.tsx'
import { SplitFlap } from '../kit/SplitFlap.tsx'
import type { SceneProps } from './index.ts'
import './s04.css'

const c = sceneContent('how-we-led-it')

const BOX_W = 372
const GAP = 36
const X0 = 200
const BOX_Y = 200
const BOX_H = 340
// The reel's box is set in s04.css; these two place its leader and frames.
const REEL_Y = 618
const REEL_H = 232
const FLIP = 4

/**
 * Four connected blocks, numbered because this genuinely is a sequence —
 * each stage depends on the one before it — and so they arrive one press at
 * a time, as the speaker reaches them. All four are pencilled in from the
 * start, so the room can see how many are coming.
 *
 * The sheet opens on Kotter's model alone, as drawn, so the room sees the
 * whole framework first; the first press takes it away and the four moves
 * that came out of it begin. Everything below counts from that press:
 * `step` is 0 on stage 1, and -1 while the model is up.
 *
 * Stage 1 brings its evidence with it: the team and what they studied,
 * running one card at a time over the still-empty boxes 2 to 4, and the
 * photographs from those weeks,
 * drifting under the row with a leader back to the box they belong to. They
 * stay while the other stages land, and make way for the split-flap on the
 * last press, which is the scene's moment.
 */
export function S04HowWeLedIt({ step: press }: SceneProps) {
  const step = press - 1
  const model = press === 0
  const leaders = step === 0
  const reduced = useReducedMotion()
  const flipped = step >= FLIP
  const reel = step < FLIP
  const t = reduced ? 0 : 1

  return (
    <div className="sc s04">
      <AnimatePresence>
        {model && (
          <motion.img
            key="kotter"
            className="s04__model"
            src={kotter}
            alt="Kotter's 8-Step Change Model: create a sense of urgency, build a guiding coalition, form a strategic vision, enlist a volunteer army, enable action by removing barriers, generate easy wins, increase the pace, institute change"
            width={1400}
            height={754}
            initial={{ opacity: 0, y: 16 * t }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, delay: 0.25 * t, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {/* pencilled outlines of what is still to come */}
        {!model && c.stages.map((_, i) => {
          const x = X0 + i * (BOX_W + GAP)
          // While stage 1 is spoken the team sequence sits over boxes 2 to 4.
          if (leaders && i > 0) return null
          return (
            <rect
              key={i}
              className="s04__pencil"
              x={x}
              y={BOX_Y}
              width={BOX_W}
              height={BOX_H}
            />
          )
        })}
        {c.stages.map((_, i) => {
          if (step < i) return null
          const x = X0 + i * (BOX_W + GAP)
          return (
            <g key={i}>
              <DrawPath
                d={`M ${x} ${BOX_Y} h ${BOX_W} v ${BOX_H} h ${-BOX_W} z`}
                duration={0.7}
                opacity={0.55}
              />
              {i > 0 && (
                <DrawPath
                  d={`M ${x - GAP} ${BOX_Y + BOX_H / 2} L ${x} ${BOX_Y + BOX_H / 2}`}
                  duration={0.3}
                  opacity={0.7}
                />
              )}
            </g>
          )
        })}
      </svg>

      {!model && c.stages.map((s, i) => (
        <div
          className={`s04__stage ${step < i ? 's04__stage--pending' : ''}`}
          key={s.name}
          style={{ left: X0 + i * (BOX_W + GAP), top: BOX_Y, height: BOX_H }}
        >
          <span className="s04__n">{i + 1}</span>
          {step >= i && (
            <>
              <motion.span
                className="s04__name"
                initial={{ opacity: 0, y: 10 * t }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 * t }}
              >
                {s.name}
              </motion.span>
              <motion.span
                className="s04__detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.45 * t }}
              >
                {s.detail}
              </motion.span>
            </>
          )}
        </div>
      ))}

      {!model && (
        <motion.p
          className="s04__framework"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 * t }}
        >
          {c.framework}
        </motion.p>
      )}

      {/* stage 1's photographs, with a leader back up to its box */}
      <motion.div
        className="s04__evidence"
        initial={false}
        animate={{ opacity: reel && !model ? 1 : 0, y: reel ? 0 : 24 * t }}
        transition={{ duration: 0.45 }}
      >
        <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
          <DrawPath
            d={`M ${X0 + BOX_W / 2} ${BOX_Y + BOX_H} L ${X0 + BOX_W / 2} ${REEL_Y}`}
            delay={0.5 * t}
            duration={0.35}
            opacity={0.7}
          />
        </svg>
        <motion.p
          className="s04__dates"
          style={{ left: X0 + BOX_W / 2 + 18, top: BOX_Y + BOX_H + 14 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.75 * t }}
        >
          {c.photos}
        </motion.p>
        <PhotoReel
          photos={LEADERS}
          size={REEL_H}
          label={`Photographs, ${c.photos}`}
          className={`s04__reel${step >= 2 ? ' s04__reel--short' : ''}`}
          delay={0.8}
        />
      </motion.div>

      {/* stage 1's people: who the office is and what they studied first */}
      <AnimatePresence>
        {leaders && (
          <motion.div
            key="leaders"
            className="s04__leaders"
            initial={{ opacity: 0, x: 24 * t }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, delay: 0.45 * t, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
              <DrawPath
                d={`M ${X0 + BOX_W} ${BOX_Y + BOX_H / 2} L ${X0 + BOX_W + GAP} ${BOX_Y + BOX_H / 2}`}
                duration={0.3}
                opacity={0.7}
              />
            </svg>
            <LeadersKinetic c={c.leaders} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* stage 3's evidence: the workshop Padlet, and a code to open it */}
      <AnimatePresence>
        {step === 2 || step === 3 ? (
          <motion.div
            className="s04__padlet"
            key="padlet"
            initial={{ opacity: 0, y: 20 * t }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.55, delay: step === 2 ? 0.3 * t : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg className="sc__svg" viewBox="0 0 1920 1080" aria-hidden="true">
              <DrawPath
                d={`M ${X0 + 2 * (BOX_W + GAP) + BOX_W / 2} ${BOX_Y + BOX_H} L ${X0 + 2 * (BOX_W + GAP) + BOX_W / 2} ${REEL_Y}`}
                duration={0.35}
                opacity={0.7}
              />
            </svg>
            <img
              className="s04__padlet-shot"
              src={padlet}
              alt="The workshop Padlet: slide decks from the programme, one card per module"
              width={540}
              height={197}
            />
            <QR code="padlet" size={216} className="s04__padlet-qr" caption={c.padlet} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* the two-day syllabus, pinned up for the one press it is talked about */}
      <AnimatePresence>
        {step === 1 && (
          <motion.figure
            className="s04__syllabus"
            initial={{ opacity: 0, y: 24 * t, rotate: 0.5 }}
            animate={{ opacity: 1, y: 0, rotate: 1.2 }}
            exit={{ opacity: 0, y: 12 * t, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, delay: 0.35 * t, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={syllabus}
              alt="Tentative two-day syllabus: AI literacy, NotebookLM, productivity prompting, vibe coding and group quick-win projects"
              width={490}
              height={722}
            />
            <i className="s04__syllabus-clip" />
          </motion.figure>
        )}
      </AnimatePresence>

      <motion.div
        className="s04__flip"
        initial={false}
        animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 16 * t }}
        transition={{ duration: 0.5, delay: flipped ? 0.3 * t : 0 }}
      >
        <SplitFlap
          from={c.flip.from}
          to={c.flip.to}
          flipped={flipped}
          delay={1.6 * t}
          className="s04__flip-text"
        />
        <motion.p
          className="s04__flip-caption"
          initial={false}
          animate={{ opacity: flipped ? 1 : 0 }}
          transition={{ duration: 0.5, delay: flipped ? 2.35 * t : 0 }}
        >
          {c.flip.caption}
        </motion.p>
      </motion.div>
    </div>
  )
}
