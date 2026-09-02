import { describe, expect, it } from 'vitest'
import { canProceed } from './Onboarding'

const draft = { step: 0, name: '', goal: 'muscle_gain' as const, days: [1], duration: 45 as const, time: '09:00', experience: 'beginner' as const, equipment: [], medical: false, emergency: false }

describe('onboarding validation', () => {
  it('requires a name only on the welcome step', () => { expect(canProceed(draft)).toBe(false); expect(canProceed({ ...draft, name: 'Alex' })).toBe(true) })
  it('requires at least one training day', () => { expect(canProceed({ ...draft, step: 2, days: [] })).toBe(false); expect(canProceed({ ...draft, step: 2, days: [1] })).toBe(true) })
  it.each(['beginner', 'intermediate', 'advanced'] as const)('allows %s experience to continue', (experience) => { expect(canProceed({ ...draft, step: 6, experience })).toBe(true) })
  it('requires both safety acknowledgements only on the final step', () => { expect(canProceed({ ...draft, step: 7 })).toBe(false); expect(canProceed({ ...draft, step: 7, medical: true, emergency: true })).toBe(true) })
})
