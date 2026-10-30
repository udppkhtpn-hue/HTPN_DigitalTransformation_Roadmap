import { MotionConfig } from 'motion/react'
import { DeckProvider } from './deck/DeckProvider.tsx'
import { Boot } from './deck/Boot.tsx'
import { Stage } from './deck/Stage.tsx'
import { Presenter } from './deck/Presenter.tsx'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="deck-root">
        <Boot>
          <DeckProvider>
            <Stage />
            <Presenter />
          </DeckProvider>
        </Boot>
      </div>
    </MotionConfig>
  )
}
