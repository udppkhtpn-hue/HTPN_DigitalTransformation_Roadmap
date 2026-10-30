import { SCENES, type Scene, type SceneId } from '../content/scenes.ts'

/** The content shape belonging to one scene id. */
type ContentOf<K extends SceneId> = Extract<Scene, { id: K }>['content']

/**
 * Typed lookup, so a scene component sees exactly its own content shape.
 *
 * The explicit return type matters: without it the generic `Extract` is
 * resolved against the whole union and every field looks missing.
 */
export function sceneContent<K extends SceneId>(id: K): ContentOf<K> {
  const scene = SCENES.find((s) => s.id === id)
  if (!scene) throw new Error(`No scene with id "${id}"`)
  return scene.content as ContentOf<K>
}
