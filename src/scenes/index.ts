import type { ComponentType } from 'react'
import type { SceneId } from '../content/scenes.ts'

import { S01ColdOpen } from './S01ColdOpen.tsx'
import { S02ThreeForces } from './S02ThreeForces.tsx'
import { S03AheadOfMandate } from './S03AheadOfMandate.tsx'
import { S04HowWeLedIt } from './S04HowWeLedIt.tsx'
import { S05Results } from './S05Results.tsx'
import { WhereTaught } from './WhereTaught.tsx'
import { S06Portfolio } from './S06Portfolio.tsx'
import { S07Innovathon } from './S07Innovathon.tsx'
import { S08TheGap } from './S08TheGap.tsx'
import { S09Roadmap } from './S09Roadmap.tsx'
import { S10CommandCentre } from './S10CommandCentre.tsx'
import { S11PredictAndScale } from './S11PredictAndScale.tsx'
import { S12LessonAndClose } from './S12LessonAndClose.tsx'

export interface SceneProps {
  step: number
}

/**
 * Every scene is statically imported. Nothing is lazy — a chunk fetching
 * mid-talk on venue Wi-Fi is not a risk worth taking, and the offline build
 * is a single bundle regardless.
 */
export const SCENE_COMPONENTS: Record<SceneId, ComponentType<SceneProps>> = {
  'cold-open': S01ColdOpen,
  'three-forces': S02ThreeForces,
  'ahead-of-mandate': S03AheadOfMandate,
  'how-we-led-it': S04HowWeLedIt,
  results: S05Results,
  'where-weve-taught': WhereTaught,
  portfolio: S06Portfolio,
  innovathon: S07Innovathon,
  'the-gap': S08TheGap,
  roadmap: S09Roadmap,
  'command-centre': S10CommandCentre,
  'predict-and-scale': S11PredictAndScale,
  'lesson-and-close': S12LessonAndClose,
}
