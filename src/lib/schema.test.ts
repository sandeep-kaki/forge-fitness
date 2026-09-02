import { describe, expect, it } from 'vitest'
import { createSeedAppData } from '../data/seed'
import { isValidLocalAppData } from './schema'

describe('local data schema', () => {
  it('accepts the complete local profile bundle', () => {
    expect(isValidLocalAppData(createSeedAppData())).toBe(true)
  })

  it('rejects incomplete safety acknowledgement data', () => {
    const data = createSeedAppData()
    expect(isValidLocalAppData({ ...data, safety: { ...data.safety, understandsEmergencyStop: false } })).toBe(false)
  })
})
