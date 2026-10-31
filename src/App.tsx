import { MotionConfig } from 'motion/react'
import { DeckProvider } from './deck/DeckProvider.tsx'
import { Boot } from './deck/Boot.tsx'
import { Stage } from './deck/Stage.tsx'
import { Presenter } from './deck/Presenter.tsx'
import { TouchControls } from './deck/TouchControls.tsx'
import { RotateHint } from './deck/RotateHint.tsx'
import { PresenterView } from './deck/PresenterView.tsx'

const PRESENTER = new URLSearchParams(window.location.search).has('presenter')

export function App() {
  if (PRESENTER) {
    return (
      <MotionConfig reducedMotion="user">
        <DeckProvider>
          <PresenterView />
        </DeckProvider>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="deck-root">
        <Boot>
          <DeckProvider>
            <Stage />
            <Presenter />
            <TouchControls />
            <RotateHint />
          </DeckProvider>
        </Boot>
      </div>
    </MotionConfig>
  )
}
