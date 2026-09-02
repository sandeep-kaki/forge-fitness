import { describe, expect, it } from 'vitest'
import { exerciseLibrary } from './exerciseLibrary'

describe('curated exercise library', () => {
  it('gives every movement the safety and instruction metadata the detail screen needs', () => {
    for (const exercise of exerciseLibrary) {
      expect(exercise.setupInstructions.length).toBeGreaterThan(1)
      expect(exercise.instructions.length).toBeGreaterThan(1)
      expect(exercise.safetyNotes.length).toBeGreaterThan(0)
      expect(exercise.substitutions.length).toBeGreaterThan(0)
    }
  })

  it('only stores explicit YouTube URLs for curated demonstrations', () => {
    for (const video of exerciseLibrary.flatMap((exercise) => exercise.videos)) {
      expect(video.platform).toBe('youtube')
      expect(video.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/)
      expect(video.verified).toBe(true)
    }
  })
})
